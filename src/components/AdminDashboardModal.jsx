import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Ticket,
  GraduationCap,
  Award,
  Users,
  Download,
  Upload,
  MessageCircle,
  RefreshCw,
  Search,
  Printer,
  CheckCircle2,
  Settings,
  Handshake,
  Calendar,
  Bot,
  Trash2,
  Plus,
  Save,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  HeartHandshake,
  CreditCard
} from 'lucide-react';
import QRCode from 'qrcode';
import { EventDB, setActiveAdminRpcSecret } from '../lib/supabase';
import {
  EVENT_DETAILS,
  getActiveCohorts,
  getActiveProjects,
  saveSiteCMSOverrides,
  resetSiteCMSOverrides,
  getAdminPin,
  setAdminPin,
  ADMIN_ROLES,
  getAdminUsers,
  saveAdminUsers,
  authenticateAdminUser,
  hashPasswordSHA256
} from '../data/eventData';
import { getActiveMentorsList, saveActiveMentorsList } from './MentorsHonorSection';
import {
  openTicketPrintWindow,
  openCandidateCardPrintWindow,
  openMembershipIdCardPrintWindow,
  openBatchMembershipIdCardsPrintWindow
} from '../utils/printEngine';
import IdCardsTab from './admin/IdCardsTab';
import CmsGeneralTab from './admin/CmsGeneralTab';
import CmsPartnersTab from './admin/CmsPartnersTab';
import CmsAgendaTab from './admin/CmsAgendaTab';
import CmsGraduatesTab from './admin/CmsGraduatesTab';
import CmsProjectsMentorsTab from './admin/CmsProjectsMentorsTab';
import OperationsDataTabs from './admin/OperationsDataTabs';
import AdminUsersTab from './admin/AdminUsersTab';
import { generateOfficialQrDataUrl } from '../utils/qrVerify';

const ISSUED_IDS_STORAGE_KEY = 'abdaa_issued_id_cards_v1';

function getStoredIssuedIdCards() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ISSUED_IDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('karrar');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [passwordDrafts, setPasswordDrafts] = useState({});
  const [activeTab, setActiveTab] = useState('cms_general');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');
  const [adminUsersList, setAdminUsersList] = useState(() => getAdminUsers());
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'reception'
  });

  // Operations Data
  const [tickets, setTickets] = useState([]);
  const [batch2List, setBatch2List] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [sponsorsReq, setSponsorsReq] = useState([]);
  const [prideMessages, setPrideMessages] = useState([]);

  // CMS State
  const [generalForm, setGeneralForm] = useState(() => ({
    title: EVENT_DETAILS.title,
    subtitle: EVENT_DETAILS.subtitle,
    organization: EVENT_DETAILS.organization,
    slogan: EVENT_DETAILS.slogan,
    dateText: EVENT_DETAILS.dateText,
    eventDateISO: EVENT_DETAILS.eventDateISO,
    time: EVENT_DETAILS.time,
    venue: EVENT_DETAILS.venue,
    capacity: EVENT_DETAILS.capacity,
    leadName: EVENT_DETAILS.contact?.leadName || '',
    phone: EVENT_DETAILS.contact?.phone || '',
    email: EVENT_DETAILS.contact?.email || '',
    adminPin: getAdminPin()
  }));

  const [statsList, setStatsList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.stats || []))
  );
  const [strategicPartners, setStrategicPartners] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.strategicPartners || []))
  );
  const [sponsorsList, setSponsorsList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.partners || []))
  );
  const [agendaList, setAgendaList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.agenda || []))
  );
  const [cohortsList, setCohortsList] = useState(() =>
    JSON.parse(JSON.stringify(getActiveCohorts()))
  );
  const [selectedCohortIdx, setSelectedCohortIdx] = useState(0);
  const [newStudentName, setNewStudentName] = useState('');

  const [projectsList, setProjectsList] = useState(() =>
    JSON.parse(JSON.stringify(getActiveProjects()))
  );
  const [mentorsList, setMentorsList] = useState(() =>
    JSON.parse(JSON.stringify(getActiveMentorsList()))
  );
  const [subTabProjMentor, setSubTabProjMentor] = useState('projects');

  // New Sponsor Form
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    role: 'راعٍ داعم للاحتفالية',
    logo: '',
    featured: false,
    highlight: false
  });

  // New Agenda Item Form
  const [newAgenda, setNewAgenda] = useState({
    time: '',
    title: '',
    description: '',
    highlight: false
  });

  // Official Membership ID Card Service State
  const [issuedIdCards, setIssuedIdCards] = useState(() => getStoredIssuedIdCards());
  const [idCardForm, setIdCardForm] = useState({
    fullName: 'علي حيدر محمد النجفي',
    membershipId: 'ABD-ID-2026-0101',
    roleTitle: 'عضو خريج معتمد — مبادرة 1001 طفل رقمي',
    track: 'البرمجة الخوارزمية والذكاء الاصطناعي والروبوتات',
    ageStage: 'الأعمار 7 – 14 سنة',
    bloodType: 'O+',
    phone: '07810746655',
    cityOrSchool: 'النجف الأشرف',
    issueDate: '2026/11/01',
    expiryDate: '2027/11/01',
    badgeColor: '#0284c7',
    photoDataUrl: ''
  });
  const [quickMemberSelect, setQuickMemberSelect] = useState('');

  const showToast = (msg) => {
    setSaveNotice(msg);
    setTimeout(() => setSaveNotice(''), 3500);
  };

  const syncCMSStateFromEventDetails = () => {
    setGeneralForm({
      title: EVENT_DETAILS.title,
      subtitle: EVENT_DETAILS.subtitle,
      organization: EVENT_DETAILS.organization,
      slogan: EVENT_DETAILS.slogan,
      dateText: EVENT_DETAILS.dateText,
      eventDateISO: EVENT_DETAILS.eventDateISO,
      time: EVENT_DETAILS.time,
      venue: EVENT_DETAILS.venue,
      capacity: EVENT_DETAILS.capacity,
      leadName: EVENT_DETAILS.contact?.leadName || '',
      phone: EVENT_DETAILS.contact?.phone || '',
      email: EVENT_DETAILS.contact?.email || '',
      adminPin: getAdminPin()
    });
    setStatsList(JSON.parse(JSON.stringify(EVENT_DETAILS.stats || [])));
    setStrategicPartners(JSON.parse(JSON.stringify(EVENT_DETAILS.strategicPartners || [])));
    setSponsorsList(JSON.parse(JSON.stringify(EVENT_DETAILS.partners || [])));
    setAgendaList(JSON.parse(JSON.stringify(EVENT_DETAILS.agenda || [])));
    setCohortsList(JSON.parse(JSON.stringify(getActiveCohorts())));
    setProjectsList(JSON.parse(JSON.stringify(getActiveProjects())));
    setMentorsList(JSON.parse(JSON.stringify(getActiveMentorsList())));
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [t, b2, evMap, vol, sp, pw] = await Promise.all([
        EventDB.getAllTickets(),
        EventDB.getAllBatch2Students(),
        EventDB.getAllProjectEvaluations(),
        EventDB.getAllVolunteers(),
        EventDB.getAllSponsors(),
        EventDB.getPrideMessages()
      ]);
      setTickets(t || []);
      setBatch2List(b2 || []);
      // Flatten evaluations map or array
      if (Array.isArray(evMap)) {
        setEvaluations(evMap);
      } else if (evMap && typeof evMap === 'object') {
        const flat = Object.entries(evMap).flatMap(([projId, arr]) =>
          (Array.isArray(arr) ? arr : []).map((item) => ({
            project_code: `PRJ-${projId}`,
            project_title: item.projectTitle || `مشروع #${projId}`,
            age_group: item.ageGroup || '7–14 سنة',
            judge_name: item.judgeName || 'محكم علمي',
            judge_role: item.judgeTitle || 'لجنة التحكيم',
            total_score: item.totalScore || 0,
            notes: item.notes || ''
          }))
        );
        setEvaluations(flat);
      }
      setVolunteers(vol || []);
      setSponsorsReq(sp || []);
      setPrideMessages(pw || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isUnlocked) {
      loadAllData();
      syncCMSStateFromEventDetails();
    }
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (lockoutUntil > now) {
      const secs = Math.ceil((lockoutUntil - now) / 1000);
      setPinError(`تم قفل المحاولات مؤقتاً للحماية. يرجى الانتظار ${secs} ثانية.`);
      return;
    }
    try {
      const matchedUser = await authenticateAdminUser(usernameInput, pin);
      if (matchedUser) {
        setActiveAdminRpcSecret(pin);
        setCurrentUser(matchedUser);
        setIsUnlocked(true);
        setPinError('');
        setFailedAttempts(0);
        setPin('');
        const roleDef = ADMIN_ROLES.find((r) => r.id === matchedUser.role) || ADMIN_ROLES[0];
        if (roleDef.allowedTabs && !roleDef.allowedTabs.includes(activeTab)) {
          setActiveTab(roleDef.allowedTabs[0]);
        }
      } else {
        const nextCount = failedAttempts + 1;
        setFailedAttempts(nextCount);
        if (nextCount >= 5) {
          setLockoutUntil(Date.now() + 30000);
          setFailedAttempts(0);
          setPinError('تم إدخال كلمة مرور خاطئة 5 مرات. تم تفعيل الحظر المؤقت لمدة 30 ثانية.');
        } else {
          setPinError('اسم المستخدم أو كلمة المرور غير صحيحة.');
        }
      }
    } catch (err) {
      setPinError(err?.message || 'تعذر التحقق من بيانات الدخول.');
    }
  };

  const handleAddAdminUser = async () => {
    if (!newUserForm.username.trim() || !newUserForm.password.trim() || !newUserForm.fullName.trim()) {
      return;
    }
    const roleObj = ADMIN_ROLES.find((r) => r.id === newUserForm.role) || ADMIN_ROLES[1];
    const passwordHash = await hashPasswordSHA256(newUserForm.password.trim());
    const updated = [
      ...adminUsersList,
      {
        id: `usr-${Date.now()}`,
        username: newUserForm.username.trim().toLowerCase(),
        passwordHash,
        fullName: newUserForm.fullName.trim(),
        role: roleObj.id,
        roleLabel: roleObj.label
      }
    ];
    setAdminUsersList(updated);
    saveAdminUsers(updated);
    setNewUserForm({ username: '', password: '', fullName: '', role: 'reception' });
    showToast('تمت إضافة المستخدم الجديد وتشفير كلمة مروره بـ SHA-256!');
  };

  const handleSaveUsersList = async () => {
    const updated = await Promise.all(
      adminUsersList.map(async (u, idx) => {
        const draft = String(passwordDrafts[idx] || '').trim();
        if (draft) {
          const passwordHash = await hashPasswordSHA256(draft);
          return { ...u, passwordHash };
        }
        return u;
      })
    );
    setAdminUsersList(updated);
    setPasswordDrafts({});
    saveAdminUsers(updated);
    showToast('تم حفظ وتشفير قائمة اليوزرات والصلاحيات بنجاح!');
  };

  // Helper to convert uploaded image file into compressed DataURL
  const handleImageFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 480;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/png', 0.92));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Save Handlers for CMS Tabs
  const handleSaveGeneralAndStats = () => {
    setAdminPin(generalForm.adminPin || '1001');
    saveSiteCMSOverrides({
      title: generalForm.title,
      subtitle: generalForm.subtitle,
      organization: generalForm.organization,
      slogan: generalForm.slogan,
      dateText: generalForm.dateText,
      eventDateISO: generalForm.eventDateISO,
      time: generalForm.time,
      venue: generalForm.venue,
      capacity: generalForm.capacity,
      contact: {
        ...EVENT_DETAILS.contact,
        leadName: generalForm.leadName,
        phone: generalForm.phone,
        email: generalForm.email
      },
      stats: statsList
    });
    showToast('تم حفظ الإعدادات العامة والإحصائيات وتحديث الموقع فوراً!');
  };

  const handleSavePartnersAndSponsors = () => {
    saveSiteCMSOverrides({
      strategicPartners,
      partners: sponsorsList
    });
    showToast('تم حفظ الشركاء والرعاة وتحديث عرضهم في الموقع فوراً!');
  };

  const handleAddSponsor = () => {
    if (!newSponsor.name.trim()) return;
    const updated = [
      ...sponsorsList,
      {
        name: newSponsor.name.trim(),
        role: newSponsor.role.trim() || 'راعٍ داعم للاحتفالية',
        logo: newSponsor.logo || '/brand/abdaa-logo.png',
        featured: Boolean(newSponsor.featured),
        highlight: Boolean(newSponsor.highlight)
      }
    ];
    setSponsorsList(updated);
    saveSiteCMSOverrides({ partners: updated });
    setNewSponsor({
      name: '',
      role: 'راعٍ داعم للاحتفالية',
      logo: '',
      featured: false,
      highlight: false
    });
    showToast('تمت إضافة الراعي الجديد وحفظه مباشرةً!');
  };

  const moveItem = (list, setList, index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const copy = [...list];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setList(copy);
  };

  const handleSaveAgenda = () => {
    saveSiteCMSOverrides({ agenda: agendaList });
    showToast('تم حفظ المنهاج الزمني للاحتفالية فوراً!');
  };

  const handleAddAgendaItem = () => {
    if (!newAgenda.time.trim() || !newAgenda.title.trim()) return;
    const updated = [...agendaList, { ...newAgenda }];
    setAgendaList(updated);
    saveSiteCMSOverrides({ agenda: updated });
    setNewAgenda({ time: '', title: '', description: '', highlight: false });
    showToast('تمت إضافة فقرة المنهاج الزمني بنجاح!');
  };

  const handleSaveCohorts = () => {
    saveSiteCMSOverrides({ cohorts: cohortsList });
    showToast('تم حفظ بيانات الخريجين والمجموعات وتحديث البطاقات والشهادات فوراً!');
  };

  const handleAddGraduateToCohort = () => {
    if (!newStudentName.trim()) return;
    const copy = JSON.parse(JSON.stringify(cohortsList));
    const targetCohort = copy[selectedCohortIdx];
    if (!targetCohort) return;
    if (!Array.isArray(targetCohort.graduates)) {
      targetCohort.graduates = Array.isArray(targetCohort.students) ? targetCohort.students : [];
    }
    const nextNum = targetCohort.graduates.length + 1 + selectedCohortIdx * 17;
    const serial = String(nextNum).padStart(3, '0');
    targetCohort.graduates.push({
      id: `DK-2026-${serial}`,
      initiativeCode: `1001-IQ-${serial}`,
      name: newStudentName.trim(),
      ageGroup: targetCohort.ageStage || '7 – 14 سنة',
      track: targetCohort.track || 'البرمجة والذكاء الاصطناعي',
      project: 'مشروع تخرج الدفعة الأولى 2026',
      grade: 'امتياز'
    });
    setCohortsList(copy);
    saveSiteCMSOverrides({ cohorts: copy });
    setNewStudentName('');
    showToast('تمت إضافة الخريج إلى المجموعة وحفظ التعديل!');
  };

  const handleSaveProjectsAndMentors = () => {
    saveSiteCMSOverrides({ allProjects: projectsList });
    saveActiveMentorsList(mentorsList);
    showToast('تم حفظ بيانات المشاريع الـ 40 والمدربين الـ 20 فوراً!');
  };

  const handleResetAllCMS = () => {
    if (!window.confirm('هل أنت متأكد من استعادة كافة البيانات النصية والشعارات إلى الوضع الافتراضي الأصلي؟')) {
      return;
    }
    resetSiteCMSOverrides();
    localStorage.removeItem('abdaa_cms_mentors_v1');
    syncCMSStateFromEventDetails();
    showToast('تمت استعادة الإعدادات الأصلية للموقع بنجاح!');
  };

  const handleExportFullBackupJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      cms: {
        title: generalForm.title,
        subtitle: generalForm.subtitle,
        organization: generalForm.organization,
        slogan: generalForm.slogan,
        dateText: generalForm.dateText,
        eventDateISO: generalForm.eventDateISO,
        time: generalForm.time,
        venue: generalForm.venue,
        capacity: generalForm.capacity,
        contact: {
          leadName: generalForm.leadName,
          phone: generalForm.phone,
          email: generalForm.email
        },
        stats: statsList,
        strategicPartners,
        partners: sponsorsList,
        agenda: agendaList,
        cohorts: cohortsList,
        allProjects: projectsList
      },
      mentors: mentorsList,
      tickets,
      batch2List
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abdaa-1001-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFullBackupJSON = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم ملف النسخة الاحتياطية يتجاوز الحد الآمن المسموح (5MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Invalid JSON root');
        }
        if (parsed.cms && typeof parsed.cms === 'object' && !Array.isArray(parsed.cms)) {
          saveSiteCMSOverrides(parsed.cms);
        }
        if (Array.isArray(parsed.mentors)) {
          saveActiveMentorsList(parsed.mentors);
        }
        syncCMSStateFromEventDetails();
        showToast('تم استيراد النسخة الاحتياطية وتحديث الموقع بالكامل!');
      } catch {
        alert('ملف النسخة الاحتياطية غير صالح.');
      }
    };
    reader.readAsText(file);
  };

  const formatWhatsAppPhone = (phone) => {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.startsWith('07')) return `964${digits.slice(1)}`;
    if (digits.startsWith('964')) return digits;
    return digits;
  };

  const handleWhatsAppTicket = (t) => {
    const intlPhone = formatWhatsAppPhone(t.phone_number || t.phone);
    const msg = `مرحباً بكم من إدارة نادي أبدع للمهارات الذكية\nنؤكد حجز مقعدكم الرسمي في احتفالية تخرج الدفعة الأولى لمبادرة «1001» طفل رقمي على مسرح قصر الثقافة.\nرقم التذكرة: ${t.booking_code}\nالملاحظات/المقعد: ${t.notes || 'القاعة الرئيسية'}\nنسعد بحضوركم الساعة 2:00 ظهراً للاطلاع على معرض الـ 40 مشروعاً.`;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppBatch2 = (c) => {
    const intlPhone = formatWhatsAppPhone(c.parent_phone);
    const msg = `مرحباً بولي أمر المبتكر الصغير (${c.child_name})\nتم استلام طلب ترشيح طفلكم بنجاح ضمن الدفعة الثانية لمبادرة «1001» طفل رقمي في نادي أبدع للمهارات الذكية.\nرقم الترشيح: ${c.candidate_code}\nالمرحلة: ${c.age_stage}\nالمسار: ${c.preferred_track}\nسيتم التواصل معكم لتحديد موعد المقابلة العلمية والورش التدريبية المجانية.`;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const sanitizeCsvCell = (cell) => {
    const raw = String(cell ?? '');
    // منع حقن المعادلات في إكسل (CSV Formula Injection)
    const safeFormula = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safeFormula.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    let rows = [];
    let filename = `abdaa-1001-${activeTab}.csv`;

    if (activeTab === 'tickets') {
      rows = [
        ['رقم التذكرة', 'الاسم الكامل', 'الهاتف', 'الصفة', 'التفاصيل/المقعد', 'عدد المرافقين', 'حالة الحضور'],
        ...tickets.map((t) => [
          t.booking_code,
          t.attendee_name,
          t.phone_number || t.phone || '',
          t.guest_type,
          t.notes || '',
          t.companions_count || 1,
          t.is_attended ? 'حاضر' : 'مسجل'
        ])
      ];
    } else if (activeTab === 'batch2') {
      rows = [
        ['رقم الترشيح', 'اسم الطفل', 'العمر', 'المرحلة العمرية', 'المسار المفضل', 'المدرسة', 'ولي الأمر', 'الهاتف'],
        ...batch2List.map((c) => [
          c.candidate_code,
          c.child_name,
          c.age || c.child_age || '',
          c.age_stage,
          c.preferred_track,
          c.school_name,
          c.parent_name,
          c.parent_phone
        ])
      ];
    } else if (activeTab === 'volunteers') {
      rows = [
        ['كود المتطوع', 'الاسم الثلاثي', 'رقم الهاتف', 'اللجنة المختارة', 'الصفة الدراسية/المهنية', 'العمر', 'قياس السترة', 'التفرغ', 'الملاحظات'],
        ...volunteers.map((v) => [
          v.volunteer_code || 'ABD-VOL',
          v.full_name || '',
          v.phone || '',
          v.committee || v.field_of_interest || '',
          v.academic_status || '',
          v.age || '',
          v.tshirt_size || '',
          v.availability || '',
          v.notes || ''
        ])
      ];
    } else if (activeTab === 'evaluations') {
      rows = [
        ['كود المشروع', 'اسم المشروع', 'الفئة العمرية', 'اسم المحكم', 'الصفة', 'الدرجة النهائية', 'الملاحظات'],
        ...evaluations.map((ev) => [
          ev.project_code,
          ev.project_title,
          ev.age_group,
          ev.judge_name,
          ev.judge_role,
          ev.total_score,
          ev.notes || ''
        ])
      ];
    } else {
      rows = [
        ['النوع', 'الاسم / الجهة', 'التفاصيل', 'الهاتف'],
        ...volunteers.map((v) => ['متطوع', v.full_name, v.field_of_interest || v.committee || '', v.phone]),
        ...sponsorsReq.map((s) => ['شريك راعٍ', s.organization_name, s.sponsorship_tier, s.phone])
      ];
    }

    const csvContent = '\uFEFF' + rows.map((r) => r.map(sanitizeCsvCell).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReprintTicket = async (t) => {
    try {
      const qrDataUrl = await generateOfficialQrDataUrl({
        type: 'ticket',
        code: t.booking_code,
        name: t.attendee_name,
        role: t.guest_type,
        track: t.seat_label || t.notes || 'القاعة الرئيسية'
      });
      openTicketPrintWindow({
        bookingCode: t.booking_code,
        attendeeName: t.attendee_name,
        phone: t.phone_number || t.phone,
        guestType: t.guest_type,
        blockName: t.block_name || 'القاعة الرئيسية',
        seatLabel: t.seat_label || t.notes || 'مقعد عام',
        companionsCount: t.companions_count || 1,
        qrDataUrl
      });
    } catch {
      // ignore
    }
  };

  const handleReprintBatch2 = async (c) => {
    try {
      const qrDataUrl = await generateOfficialQrDataUrl({
        type: 'b2',
        code: c.candidate_code,
        name: c.child_name,
        role: c.age_stage || 'منتسب الدفعة الثانية',
        track: c.preferred_track
      });
      openCandidateCardPrintWindow({
        candidateCode: c.candidate_code,
        childName: c.child_name,
        childAge: c.age || c.child_age,
        ageStage: c.age_stage,
        preferredTrack: c.preferred_track,
        schoolName: c.school_name,
        parentName: c.parent_name,
        parentPhone: c.parent_phone,
        priorityCategory: c.priority_category || 'مرشح عام',
        qrDataUrl
      });
    } catch {
      // ignore
    }
  };

  const handleIssueAndPrintIdCard = async (cardData = idCardForm, saveToArchive = true) => {
    try {
      const qrDataUrl = await generateOfficialQrDataUrl({
        type: 'id',
        code: cardData.membershipId,
        name: cardData.fullName,
        role: cardData.roleTitle,
        track: cardData.track,
        extra: `صلاحية لغاية ${cardData.expiryDate || '2027/11/01'}`
      });
      if (saveToArchive && typeof window !== 'undefined') {
        const entry = {
          ...cardData,
          id: `idcard-${Date.now()}`,
          issuedAt: new Date().toLocaleDateString('ar-IQ')
        };
        const updated = [
          entry,
          ...issuedIdCards.filter((item) => item.membershipId !== cardData.membershipId)
        ];
        setIssuedIdCards(updated);
        localStorage.setItem(ISSUED_IDS_STORAGE_KEY, JSON.stringify(updated));
        showToast(`تم إصدار وحفظ هوية الانتماء الرسمية للعضو (${cardData.fullName})!`);
      }
      openMembershipIdCardPrintWindow({
        ...cardData,
        qrDataUrl
      });
    } catch {
      // ignore
    }
  };

  const handleBatchPrintCohortIds = async (cohortIdx = selectedCohortIdx) => {
    const cohort = cohortsList[cohortIdx];
    const gradArr = cohort?.graduates || cohort?.students || [];
    if (!cohort || !Array.isArray(gradArr) || gradArr.length === 0) return;

    showToast(`جارٍ توليد رموز التحقق QR لـ (${gradArr.length}) هوية في ${cohort.name}...`);
    const members = await Promise.all(
      gradArr.map(async (st, sIdx) => {
        const stName = typeof st === 'object' ? st.name : st;
        const serial = String(cohortIdx * 17 + sIdx + 1).padStart(4, '0');
        const membershipId = (typeof st === 'object' && st.initiativeCode) ? `ABD-ID-${st.initiativeCode}` : `ABD-ID-2026-${serial}`;
        const roleTitle = 'عضو خريج معتمد — مبادرة 1001 طفل رقمي';
        const track = (typeof st === 'object' && st.track) || cohort.track || 'البرمجة والذكاء الاصطناعي والروبوتات';
        const qrDataUrl = await generateOfficialQrDataUrl({
          type: 'id',
          code: membershipId,
          name: stName,
          role: roleTitle,
          track,
          extra: cohort.name
        });
        return {
          fullName: stName,
          membershipId,
          roleTitle,
          track,
          ageStage: (typeof st === 'object' && st.ageGroup) || cohort.ageStage || cohort.ageRange || 'الأعمار 7 – 14 سنة',
          cityOrSchool: `${cohort.name} — النجف الأشرف`,
          issueDate: '2026/11/01',
          expiryDate: '2027/11/01',
          phone: '07810746655',
          bloodType: 'O+',
          badgeColor: '#0284c7',
          qrDataUrl
        };
      })
    );

    openBatchMembershipIdCardsPrintWindow(members, `${cohort.name} — ${cohort.track || ''}`);
  };

  const handleBatchPrintMentorsIds = async () => {
    if (!Array.isArray(mentorsList) || mentorsList.length === 0) return;
    showToast(`جارٍ تجهيز (${mentorsList.length}) هوية رسمية للكادر التدريبي والمشرفين...`);
    const members = await Promise.all(
      mentorsList.map(async (m, mIdx) => {
        const membershipId = `ABD-MNT-2026-${String(mIdx + 1).padStart(3, '0')}`;
        const roleTitle = m.role || 'مدرب ومشرف علمي معتمد';
        const track = m.specialty || 'التدريب البرمجي والذكاء الاصطناعي';
        const qrDataUrl = await generateOfficialQrDataUrl({
          type: 'mentor',
          code: membershipId,
          name: m.name,
          role: roleTitle,
          track,
          extra: 'الهيئة التدريبية — نادي أبدع'
        });
        return {
          fullName: m.name,
          membershipId,
          roleTitle,
          track,
          ageStage: 'الهيئة التدريبية والعلمية',
          cityOrSchool: 'نادي أبدع للمهارات الذكية',
          issueDate: '2026/11/01',
          expiryDate: '2027/11/01',
          phone: '07810746655',
          bloodType: 'O+',
          badgeColor: '#0f766e',
          qrDataUrl
        };
      })
    );

    openBatchMembershipIdCardsPrintWindow(members, 'الهيئة التدريبية والإشراف العلمي (20 مدرباً)');
  };

  const handlePrefillIdCardAndOpen = (prefillData) => {
    setIdCardForm((prev) => ({
      ...prev,
      ...prefillData
    }));
    setActiveTab('id_cards');
    showToast(`تم تجهيز بيانات (${prefillData.fullName}) لإصدار هوية الانتماء الرسمية!`);
  };

  const q = searchQuery.trim().toLowerCase();
  const currentCohort = cohortsList[selectedCohortIdx] || cohortsList[0];

  const ALL_TABS = [
    { id: 'id_cards', label: `هويات العضوية والانتماء 🪪`, icon: CreditCard },
    { id: 'volunteers', label: `سجل المتطوعين (${volunteers.length})`, icon: HeartHandshake },
    { id: 'tickets', label: `حجوزات التذاكر (${tickets.length})`, icon: Ticket },
    { id: 'batch2', label: `أطفال الدفعة 2 (${batch2List.length})`, icon: Users },
    { id: 'cms_general', label: 'إعدادات الموقع والإحصائيات', icon: Settings },
    { id: 'cms_partners', label: `الشركاء والرعاة (${sponsorsList.length})`, icon: Handshake },
    { id: 'cms_agenda', label: `المنهاج الزمني (${agendaList.length})`, icon: Calendar },
    { id: 'cms_graduates', label: `الخريجون (170)`, icon: GraduationCap },
    { id: 'cms_projects_mentors', label: `المشاريع (40) والمدربون (20)`, icon: Bot },
    { id: 'evaluations', label: `تقييمات التحكيم (${evaluations.length})`, icon: Award },
    { id: 'community', label: `جدار الفخر وطلبات الرعاية`, icon: HeartHandshake },
    { id: 'users', label: `اليوزرات والصلاحيات (${adminUsersList.length})`, icon: ShieldCheck }
  ];

  const activeRoleObj =
    ADMIN_ROLES.find((r) => r.id === currentUser?.role) || ADMIN_ROLES[0];
  const TABS = ALL_TABS.filter((t) => activeRoleObj.allowedTabs.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="relative bg-gradient-to-l from-slate-900 via-sky-950 to-indigo-950 p-4 sm:p-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 block">
                نادي أبدع للمهارات الذكية × شركة المصدر لتكنولوجيا المعلومات
              </span>
              <h3 className="text-base sm:text-xl font-black font-alexandria">
                لوحة التحكم الشاملة لإدارة الموقع والعمليات (Full CMS & Admin)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <>
                {currentUser && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs">
                    <span className="font-black text-amber-300">{currentUser.fullName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 font-bold">
                      {currentUser.roleLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAdminRpcSecret('');
                        setIsUnlocked(false);
                        setCurrentUser(null);
                        setPin('');
                      }}
                      className="text-[10px] text-rose-300 hover:text-rose-200 underline mr-1 cursor-pointer"
                    >
                      خروج
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleExportFullBackupJSON}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-sky-200 transition cursor-pointer"
                  title="تصدير نسخة احتياطية كاملة للموقع"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>نسخة احتياطية JSON</span>
                </button>
                <label className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 transition cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>استيراد JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => handleImportFullBackupJSON(e.target.files?.[0])}
                  />
                </label>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {saveNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs sm:text-sm font-black flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveNotice}</span>
          </div>
        )}

        {!isUnlocked ? (
          /* Multi-User Login Gate */
          <form onSubmit={handleLogin} className="p-6 sm:p-8 max-w-lg mx-auto text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center mx-auto text-sky-600 dark:text-sky-400">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white font-alexandria">
                تسجيل دخول الإدارة واللجان التنظيمية
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                أدخل اسم المستخدم وكلمة المرور حسب صلاحيتك (مدير عام، استقبال، إعلام، أو تحكيم)
              </p>
            </div>

            <div className="space-y-3 text-right">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    اسم المستخدم (Username)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setUsernameInput('karrar')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black transition cursor-pointer ${
                        usernameInput === 'karrar' || usernameInput === 'كرار'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      كرار (karrar)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsernameInput('firas')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black transition cursor-pointer ${
                        usernameInput === 'firas' || usernameInput === 'فراس'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      فراس (firas)
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="karrar / firas / كرار / فراس"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-mono text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور / رمز الدخول (Password)
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-mono text-lg font-black tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>
            </div>

            {pinError && <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{pinError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg transition cursor-pointer"
            >
              تسجيل الدخول للوحة التحكم
            </button>
          </form>
        ) : (
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'id_cards' && (
              <IdCardsTab
                idCardForm={idCardForm}
                setIdCardForm={setIdCardForm}
                handleIssueAndPrintIdCard={handleIssueAndPrintIdCard}
                selectedCohortIdx={selectedCohortIdx}
                setSelectedCohortIdx={setSelectedCohortIdx}
                cohortsList={cohortsList}
                handleBatchPrintCohortIds={handleBatchPrintCohortIds}
                handleBatchPrintMentorsIds={handleBatchPrintMentorsIds}
                quickMemberSelect={quickMemberSelect}
                setQuickMemberSelect={setQuickMemberSelect}
                mentorsList={mentorsList}
                batch2List={batch2List}
                handleImageFileUpload={handleImageFileUpload}
                issuedIdCards={issuedIdCards}
                setIssuedIdCards={setIssuedIdCards}
              />
            )}

            {activeTab === 'cms_general' && (
              <CmsGeneralTab
                generalForm={generalForm}
                setGeneralForm={setGeneralForm}
                statsList={statsList}
                setStatsList={setStatsList}
                handleSaveGeneralAndStats={handleSaveGeneralAndStats}
                handleResetAllCMS={handleResetAllCMS}
              />
            )}

            {activeTab === 'cms_partners' && (
              <CmsPartnersTab
                strategicPartners={strategicPartners}
                setStrategicPartners={setStrategicPartners}
                sponsorsList={sponsorsList}
                setSponsorsList={setSponsorsList}
                newSponsor={newSponsor}
                setNewSponsor={setNewSponsor}
                handleSavePartnersAndSponsors={handleSavePartnersAndSponsors}
                handleAddSponsor={handleAddSponsor}
                handleImageFileUpload={handleImageFileUpload}
                moveItem={moveItem}
              />
            )}

            {activeTab === 'cms_agenda' && (
              <CmsAgendaTab
                agendaList={agendaList}
                setAgendaList={setAgendaList}
                newAgenda={newAgenda}
                setNewAgenda={setNewAgenda}
                handleSaveAgenda={handleSaveAgenda}
                handleAddAgendaItem={handleAddAgendaItem}
                moveItem={moveItem}
              />
            )}

            {activeTab === 'cms_graduates' && (
              <CmsGraduatesTab
                cohortsList={cohortsList}
                setCohortsList={setCohortsList}
                selectedCohortIdx={selectedCohortIdx}
                setSelectedCohortIdx={setSelectedCohortIdx}
                currentCohort={currentCohort}
                newStudentName={newStudentName}
                setNewStudentName={setNewStudentName}
                handleAddGraduateToCohort={handleAddGraduateToCohort}
                handleSaveCohorts={handleSaveCohorts}
                handleBatchPrintCohortIds={handleBatchPrintCohortIds}
                handlePrefillIdCardAndOpen={handlePrefillIdCardAndOpen}
              />
            )}

            {activeTab === 'cms_projects_mentors' && (
              <CmsProjectsMentorsTab
                subTabProjMentor={subTabProjMentor}
                setSubTabProjMentor={setSubTabProjMentor}
                projectsList={projectsList}
                setProjectsList={setProjectsList}
                mentorsList={mentorsList}
                setMentorsList={setMentorsList}
                handleSaveProjectsAndMentors={handleSaveProjectsAndMentors}
                handleBatchPrintMentorsIds={handleBatchPrintMentorsIds}
                handlePrefillIdCardAndOpen={handlePrefillIdCardAndOpen}
              />
            )}

            {['volunteers', 'tickets', 'batch2', 'evaluations', 'community'].includes(activeTab) && (
              <OperationsDataTabs
                activeTab={activeTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loading={loading}
                loadAllData={loadAllData}
                handleExportCSV={handleExportCSV}
                tickets={tickets}
                setTickets={setTickets}
                handleWhatsAppTicket={handleWhatsAppTicket}
                handleReprintTicket={handleReprintTicket}
                batch2List={batch2List}
                setBatch2List={setBatch2List}
                handleWhatsAppBatch2={handleWhatsAppBatch2}
                handleReprintBatch2={handleReprintBatch2}
                handlePrefillIdCardAndOpen={handlePrefillIdCardAndOpen}
                evaluations={evaluations}
                prideMessages={prideMessages}
                setPrideMessages={setPrideMessages}
                volunteers={volunteers}
                setVolunteers={setVolunteers}
                sponsorsReq={sponsorsReq}
                setSponsorsReq={setSponsorsReq}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsersTab
                adminUsersList={adminUsersList}
                setAdminUsersList={setAdminUsersList}
                newUserForm={newUserForm}
                setNewUserForm={setNewUserForm}
                passwordDrafts={passwordDrafts}
                setPasswordDrafts={setPasswordDrafts}
                handleAddAdminUser={handleAddAdminUser}
                handleSaveUsersList={handleSaveUsersList}
              />
            )}

          </div>
        )}
      </div>
    </div>
  );
}

