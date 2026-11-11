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
import { EventDB } from '../lib/supabase';
import {
  EVENT_DETAILS,
  saveSiteCMSOverrides,
  resetSiteCMSOverrides,
  getAdminPin,
  setAdminPin,
  ADMIN_ROLES,
  getAdminUsers,
  saveAdminUsers,
  authenticateAdminUser
} from '../data/eventData';
import { getActiveMentorsList, saveActiveMentorsList } from './MentorsHonorSection';
import {
  openTicketPrintWindow,
  openCandidateCardPrintWindow,
  openMembershipIdCardPrintWindow
} from '../utils/printEngine';

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
    JSON.parse(JSON.stringify(EVENT_DETAILS.cohorts || []))
  );
  const [selectedCohortIdx, setSelectedCohortIdx] = useState(0);
  const [newStudentName, setNewStudentName] = useState('');

  const [projectsList, setProjectsList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.allProjects || []))
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
    setCohortsList(JSON.parse(JSON.stringify(EVENT_DETAILS.cohorts || [])));
    setProjectsList(JSON.parse(JSON.stringify(EVENT_DETAILS.allProjects || [])));
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

  const handleLogin = (e) => {
    e.preventDefault();
    const matchedUser = authenticateAdminUser(usernameInput, pin);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsUnlocked(true);
      setPinError('');
      const roleDef = ADMIN_ROLES.find((r) => r.id === matchedUser.role) || ADMIN_ROLES[0];
      if (roleDef.allowedTabs && !roleDef.allowedTabs.includes(activeTab)) {
        setActiveTab(roleDef.allowedTabs[0]);
      }
    } else {
      setPinError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  const handleAddAdminUser = () => {
    if (!newUserForm.username.trim() || !newUserForm.password.trim() || !newUserForm.fullName.trim()) {
      return;
    }
    const roleObj = ADMIN_ROLES.find((r) => r.id === newUserForm.role) || ADMIN_ROLES[1];
    const updated = [
      ...adminUsersList,
      {
        id: `usr-${Date.now()}`,
        username: newUserForm.username.trim().toLowerCase(),
        password: newUserForm.password.trim(),
        fullName: newUserForm.fullName.trim(),
        role: roleObj.id,
        roleLabel: roleObj.label
      }
    ];
    setAdminUsersList(updated);
    saveAdminUsers(updated);
    setNewUserForm({ username: '', password: '', fullName: '', role: 'reception' });
    showToast('تمت إضافة المستخدم الجديد وحفظ صلاحياته!');
  };

  const handleSaveUsersList = () => {
    saveAdminUsers(adminUsersList);
    showToast('تم حفظ قائمة اليوزرات والصلاحيات بنجاح!');
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
    if (!copy[selectedCohortIdx]) return;
    copy[selectedCohortIdx].students.push(newStudentName.trim());
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
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.cms) {
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
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleWhatsAppBatch2 = (c) => {
    const intlPhone = formatWhatsAppPhone(c.parent_phone);
    const msg = `مرحباً بولي أمر المبتكر الصغير (${c.child_name})\nتم استلام طلب ترشيح طفلكم بنجاح ضمن الدفعة الثانية لمبادرة «1001» طفل رقمي في نادي أبدع للمهارات الذكية.\nرقم الترشيح: ${c.candidate_code}\nالمرحلة: ${c.age_stage}\nالمسار: ${c.preferred_track}\nسيتم التواصل معكم لتحديد موعد المقابلة العلمية والورش التدريبية المجانية.`;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, '_blank');
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

    const csvContent =
      '\uFEFF' +
      rows.map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
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
      const qrDataUrl = await QRCode.toDataURL(`ABDAA-1001|${t.booking_code}|${t.attendee_name}`, {
        width: 240,
        margin: 1
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
      const qrDataUrl = await QRCode.toDataURL(`ABDAA-B2|${c.candidate_code}|${c.child_name}`, {
        width: 240,
        margin: 1
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
      const qrPayload = `ABDAA-ID|${cardData.membershipId}|${cardData.fullName}|${cardData.roleTitle}`;
      const qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 240,
        margin: 1
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
    { id: 'cms_general', label: 'إعدادات الموقع والإحصائيات', icon: Settings },
    { id: 'cms_partners', label: `الشركاء والرعاة (${sponsorsList.length})`, icon: Handshake },
    { id: 'cms_agenda', label: `المنهاج الزمني (${agendaList.length})`, icon: Calendar },
    { id: 'cms_graduates', label: `الخريجون والـ 10 مجموعات`, icon: GraduationCap },
    { id: 'cms_projects_mentors', label: `المشاريع (40) والمدربون (20)`, icon: Bot },
    { id: 'tickets', label: `حجوزات التذاكر (${tickets.length})`, icon: Ticket },
    { id: 'batch2', label: `الدفعة الثانية (${batch2List.length})`, icon: Users },
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

            {/* =========================================================
                TAB 0: خدمة إصدار وطباعة هويات العضوية والانتماء الرسمية (ID Cards)
               ========================================================= */}
            {activeTab === 'id_cards' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-sky-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-sky-500/30 shadow-lg">
                  <div>
                    <span className="text-[11px] font-black text-amber-300 block mb-0.5">
                      خدمة الإدارة الرسمية • نادي أبدع للمهارات الذكية × شركة المصدر
                    </span>
                    <h4 className="font-alexandria font-black text-sm sm:text-lg">
                      إصدار وطباعة بطاقة عضوية وانتماء رسمية (هوية الوجهين)
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      اختر أي خريج أو مدرب أو مرشح من القوائم، أو أدخل بيانات عضو جديد مع صورته الشخصية واطبع الهوية الرسمية (الوجه الأمامي + الخلفي).
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setIdCardForm((prev) => ({
                          ...prev,
                          membershipId: `ABD-ID-2026-${String(Math.floor(1000 + Math.random() * 9000))}`
                        }))
                      }
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition cursor-pointer"
                    >
                      توليد رقم هوية جديد
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIssueAndPrintIdCard(idCardForm, true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>إصدار وطباعة الهوية الرسمية (الوجهين)</span>
                    </button>
                  </div>
                </div>

                {/* Quick Member Selector + Form + Live Two-Sided Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Right Column: Member Data Form (5 cols) */}
                  <div className="lg:col-span-5 space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-xs font-black text-sky-700 dark:text-sky-300 mb-1.5">
                        تعبئة سريعة من قوائم الخريجين (170) أو المدربين (20) أو الدفعة الثانية:
                      </label>
                      <select
                        value={quickMemberSelect}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuickMemberSelect(val);
                          if (!val) return;
                          const [type, idx1, idx2] = val.split(':');
                          if (type === 'grad') {
                            const c = cohortsList[Number(idx1)];
                            const st = c?.students?.[Number(idx2)];
                            const stName = typeof st === 'object' ? st.name : st;
                            if (stName) {
                              const serial = String(Number(idx1) * 20 + Number(idx2) + 1).padStart(4, '0');
                              setIdCardForm((prev) => ({
                                ...prev,
                                fullName: stName,
                                membershipId: `ABD-ID-2026-${serial}`,
                                roleTitle: 'عضو خريج معتمد — مبادرة 1001 طفل رقمي',
                                track: c.track || 'البرمجة والذكاء الاصطناعي والروبوتات',
                                ageStage: c.ageRange || 'الأعمار 7 – 14 سنة',
                                cityOrSchool: `${c.name} — النجف الأشرف`,
                                badgeColor: '#0284c7'
                              }));
                            }
                          } else if (type === 'mentor') {
                            const m = mentorsList[Number(idx1)];
                            if (m) {
                              const serial = String(Number(idx1) + 1).padStart(3, '0');
                              setIdCardForm((prev) => ({
                                ...prev,
                                fullName: m.name,
                                membershipId: `ABD-MNT-2026-${serial}`,
                                roleTitle: m.role || 'مدرب ومشرف علمي معتمد',
                                track: m.specialty || 'التدريب البرمجي والذكاء الاصطناعي',
                                ageStage: 'الهيئة التدريبية والعلمية',
                                cityOrSchool: 'نادي أبدع للمهارات الذكية',
                                badgeColor: '#0f766e'
                              }));
                            }
                          } else if (type === 'b2') {
                            const b = batch2List[Number(idx1)];
                            if (b) {
                              setIdCardForm((prev) => ({
                                ...prev,
                                fullName: b.child_name,
                                membershipId: b.candidate_code || `ABD-B2-2026-${Number(idx1) + 101}`,
                                roleTitle: 'عضو منتسب — الدفعة الثانية (1001 طفل رقمي)',
                                track: b.preferred_track || 'البرمجة والذكاء الاصطناعي',
                                ageStage: b.age_stage || `${b.age || 10} سنوات`,
                                phone: b.parent_phone || prev.phone,
                                cityOrSchool: b.school_name || 'النجف الأشرف',
                                badgeColor: '#d97706'
                              }));
                            }
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        <option value="">-- اختر اسماً للتعبئة التلقائية أو اكتب يدوياً أدناه --</option>
                        <optgroup label="الخريجون الـ 170 (المجموعات العشر)">
                          {cohortsList.map((c, cIdx) =>
                            (c.students || []).map((st, sIdx) => {
                              const stName = typeof st === 'object' ? st.name : st;
                              return (
                                <option key={`g-${cIdx}-${sIdx}`} value={`grad:${cIdx}:${sIdx}`}>
                                  {stName} — ({c.name})
                                </option>
                              );
                            })
                          )}
                        </optgroup>
                        <optgroup label="الكادر التدريبي والمشرفون (20 مدرباً)">
                          {mentorsList.map((m, mIdx) => (
                            <option key={`m-${mIdx}`} value={`mentor:${mIdx}:0`}>
                              {m.name} — ({m.specialty})
                            </option>
                          ))}
                        </optgroup>
                        {batch2List.length > 0 && (
                          <optgroup label="منتسبو الدفعة الثانية المسجلون">
                            {batch2List.map((b, bIdx) => (
                              <option key={`b2-${bIdx}`} value={`b2:${bIdx}:0`}>
                                {b.child_name} — ({b.candidate_code})
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          الاسم الرباعي الكامل للعضو
                        </label>
                        <input
                          type="text"
                          value={idCardForm.fullName}
                          onChange={(e) => setIdCardForm({ ...idCardForm, fullName: e.target.value })}
                          placeholder="الاسم الكامل كما يظهر في الهوية"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          رقم هوية الانتماء (ID Number)
                        </label>
                        <input
                          type="text"
                          value={idCardForm.membershipId}
                          onChange={(e) => setIdCardForm({ ...idCardForm, membershipId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-black text-sky-600 dark:text-sky-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          لون الشريط والرتبة
                        </label>
                        <select
                          value={idCardForm.badgeColor}
                          onChange={(e) => setIdCardForm({ ...idCardForm, badgeColor: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="#0284c7">أزرق ملكي (عضو خريج / مبتكر)</option>
                          <option value="#0f766e">زمردي علمي (مدرب / مشرف علمي)</option>
                          <option value="#d97706">ذهبي (عضو متميز / دفعة ثانية)</option>
                          <option value="#4f46e5">نيلي رسمي (إدارة / لجنة تنظيمية)</option>
                          <option value="#be123c">عنابي فخري (عضوية شرفية / راعٍ)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          صفة العضوية والانتماء
                        </label>
                        <input
                          type="text"
                          value={idCardForm.roleTitle}
                          onChange={(e) => setIdCardForm({ ...idCardForm, roleTitle: e.target.value })}
                          placeholder="مثال: عضو خريج معتمد / عضو مبتكر / مدرب معتمد / عضو شرف"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          المسار العلمي / التخصص
                        </label>
                        <input
                          type="text"
                          value={idCardForm.track}
                          onChange={(e) => setIdCardForm({ ...idCardForm, track: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          الفئة العمرية / المرحلة
                        </label>
                        <input
                          type="text"
                          value={idCardForm.ageStage}
                          onChange={(e) => setIdCardForm({ ...idCardForm, ageStage: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          المدرسة / المجموعة / المحافظة
                        </label>
                        <input
                          type="text"
                          value={idCardForm.cityOrSchool}
                          onChange={(e) => setIdCardForm({ ...idCardForm, cityOrSchool: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          هاتف العضو / ولي الأمر
                        </label>
                        <input
                          type="text"
                          value={idCardForm.phone}
                          onChange={(e) => setIdCardForm({ ...idCardForm, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          فصيلة الدم
                        </label>
                        <select
                          value={idCardForm.bloodType}
                          onChange={(e) => setIdCardForm({ ...idCardForm, bloodType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        >
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          تاريخ الإصدار
                        </label>
                        <input
                          type="text"
                          value={idCardForm.issueDate}
                          onChange={(e) => setIdCardForm({ ...idCardForm, issueDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          صلاحية الهوية لغاية
                        </label>
                        <input
                          type="text"
                          value={idCardForm.expiryDate}
                          onChange={(e) => setIdCardForm({ ...idCardForm, expiryDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
                          الصورة الشخصية للعضو (اختياري — في حال عدم الرفع يظهر شعار أبدع الرسمي)
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="flex-1 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black text-center cursor-pointer transition">
                            📷 رفع صورة شخصية للعضو من الجهاز
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                  setIdCardForm((prev) => ({ ...prev, photoDataUrl: dataUrl }));
                                })
                              }
                            />
                          </label>
                          {idCardForm.photoDataUrl && (
                            <button
                              type="button"
                              onClick={() => setIdCardForm((prev) => ({ ...prev, photoDataUrl: '' }))}
                              className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                            >
                              إزالة الصورة
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Column: Live Two-Sided ID Card Preview (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col items-center">
                      <div className="w-full flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2.5">
                        <span className="font-black text-amber-400">
                          معاينة حية للهوية الرسمية قبل الطباعة (الوجه الأمامي + الوجه الخلفي)
                        </span>
                        <span className="font-mono text-[11px] text-sky-400">{idCardForm.membershipId}</span>
                      </div>

                      {/* FRONT SIDE PREVIEW */}
                      <div className="w-full max-w-[440px] rounded-2xl overflow-hidden bg-white text-slate-900 shadow-2xl border-2 border-slate-300 flex flex-col justify-between">
                        {/* Header */}
                        <div className="bg-gradient-to-l from-[#071936] via-[#0c2d63] to-[#0284c7] text-white p-3 flex items-center justify-between border-b-2 border-amber-400">
                          <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow">
                              <img
                                src="/brand/abdaa-logo.png"
                                alt="نادي أبدع"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="leading-tight">
                              <div className="font-alexandria font-black text-xs text-white">
                                نادي أبدع للمهارات الذكية
                              </div>
                              <div className="text-[10px] font-extrabold text-amber-300">
                                هوية عضوية وانتماء رسمية • مبادرة «1001» طفل رقمي
                              </div>
                              <div className="text-[8px] font-bold text-sky-200 tracking-wider">
                                ABDAA SMART SKILLS CLUB • MEMBERSHIP ID
                              </div>
                            </div>
                          </div>
                          <div className="bg-white px-2 py-1 rounded-lg shadow shrink-0">
                            <img
                              src="/brand/masdar-logo-full-clean.png"
                              alt="شركة المصدر"
                              className="h-7 w-auto object-contain"
                            />
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-3.5 grid grid-cols-12 gap-3 items-center bg-gradient-to-b from-white to-slate-50">
                          <div className="col-span-4 flex flex-col items-center gap-1.5">
                            <div
                              className="w-24 h-28 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm"
                              style={{ border: `2px solid ${idCardForm.badgeColor}` }}
                            >
                              <img
                                src={idCardForm.photoDataUrl || '/brand/abdaa-logo.png'}
                                alt={idCardForm.fullName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-full text-center bg-slate-900 text-amber-400 font-mono text-[10px] font-black py-1 px-1.5 rounded-md">
                              {idCardForm.membershipId}
                            </div>
                          </div>

                          <div className="col-span-8 space-y-2 text-right">
                            <div>
                              <div
                                className="inline-flex items-center justify-between w-full px-2.5 py-1 rounded-md text-white text-[10px] font-black mb-1"
                                style={{ backgroundColor: idCardForm.badgeColor }}
                              >
                                <span className="truncate">{idCardForm.roleTitle}</span>
                                <span className="text-amber-200 shrink-0 mr-1">★ معتمد</span>
                              </div>
                              <div className="font-alexandria font-black text-sm text-slate-900 border-r-4 border-amber-500 pr-2">
                                {idCardForm.fullName}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                              <div className="col-span-2 bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                                <span className="text-[9px] text-slate-500 font-bold block">
                                  المسار العلمي / التخصص
                                </span>
                                <span className="font-black text-slate-900 truncate block">
                                  {idCardForm.track}
                                </span>
                              </div>
                              <div className="bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                                <span className="text-[9px] text-slate-500 font-bold block">الفئة / المرحلة</span>
                                <span className="font-black text-slate-900 truncate block">
                                  {idCardForm.ageStage}
                                </span>
                              </div>
                              <div className="bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                                <span className="text-[9px] text-slate-500 font-bold block">المدرسة / المحافظة</span>
                                <span className="font-black text-slate-900 truncate block">
                                  {idCardForm.cityOrSchool}
                                </span>
                              </div>
                              <div className="bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                                <span className="text-[9px] text-slate-500 font-bold block">تاريخ الإصدار</span>
                                <span className="font-mono font-black text-slate-900">
                                  {idCardForm.issueDate}
                                </span>
                              </div>
                              <div className="bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                                <span className="text-[9px] text-slate-500 font-bold block">صلاحية الهوية</span>
                                <span className="font-mono font-black text-sky-700">
                                  {idCardForm.expiryDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-950 text-white px-3 py-1.5 text-[9px] font-bold flex items-center justify-between border-t border-amber-400">
                          <span>النجف الأشرف — الحاضنة العلمية للبرمجة والذكاء الاصطناعي</span>
                          <span className="text-amber-400 font-mono">{idCardForm.membershipId}</span>
                        </div>
                      </div>

                      {/* BACK SIDE PREVIEW */}
                      <div className="w-full max-w-[440px] rounded-2xl overflow-hidden bg-white text-slate-900 shadow-2xl border-2 border-slate-300 flex flex-col justify-between">
                        <div className="bg-slate-950 text-slate-400 px-3 py-1.5 mt-2 font-mono text-[9px] flex items-center justify-between">
                          <span>ABDAA SMART SKILLS CLUB • AL-NAJAF AL-ASHRAF</span>
                          <span className="text-amber-400">1001 DIGITAL KIDS</span>
                        </div>

                        <div className="p-3.5 space-y-2.5 text-right">
                          <div className="bg-slate-100 border border-slate-200 border-r-4 border-r-sky-600 rounded-lg p-2.5 text-[10px] leading-relaxed text-slate-700 font-bold">
                            <div className="font-black text-slate-900 mb-0.5">
                              تعليمات واعتماد هوية الانتماء الرسمية (الوجه الخلفي):
                            </div>
                            1. تُعد هذه البطاقة وثيقة رسمية تثبت انتماء حاملها إلى <strong>نادي أبدع للمهارات الذكية</strong> ومبادرة «1001» طفل رقمي.<br />
                            2. تخول حاملها دخول المختبرات العلمية والورش التدريبية والمعارض التكنولوجية المعتمدة.
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 bg-sky-50 border border-sky-200 rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold text-sky-950">
                            <span>
                              هاتف العضو: <strong className="font-mono">{idCardForm.phone}</strong>
                            </span>
                            <span>
                              فصيلة الدم: <strong className="text-rose-600">{idCardForm.bloodType}</strong>
                            </span>
                            <span>
                              الإدارة: <strong className="font-mono">07810746655</strong>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-dashed border-slate-300 text-center">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                              <span className="block text-[9px] font-bold text-slate-500">
                                إدارة نادي أبدع للمهارات الذكية
                              </span>
                              <strong className="block text-[11px] font-black text-slate-900 font-alexandria">
                                فراس نزار كريم
                              </strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                              <span className="block text-[9px] font-bold text-slate-500">
                                إدارة شركة المصدر لتكنولوجيا المعلومات
                              </span>
                              <strong className="block text-[11px] font-black text-slate-900 font-alexandria">
                                كرار حساني جاسم
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-950 text-white px-3 py-1.5 text-[9px] font-bold flex items-center justify-between border-t border-amber-400">
                          <span>VERIFIED DIGITAL MEMBERSHIP CARD</span>
                          <span className="text-amber-400 font-mono">MASDAR IT & ABDAA CLUB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Archive of Issued ID Cards */}
                {issuedIdCards.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-alexandria font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                        سجل الهويات الصادرة مؤخراً ({issuedIdCards.length})
                      </h5>
                      <span className="text-[11px] text-slate-500">
                        اضغط على أي هوية لإعادة طباعتها أو تعديلها فوراً
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {issuedIdCards.map((card, idx) => (
                        <div
                          key={card.id || idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="font-black text-xs text-slate-900 dark:text-white truncate">
                              {card.fullName}
                            </div>
                            <div className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">
                              {card.membershipId} • {card.issuedAt || ''}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">{card.roleTitle}</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setIdCardForm(card);
                                handleIssueAndPrintIdCard(card, false);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                              title="طباعة الهوية"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = issuedIdCards.filter((_, i) => i !== idx);
                                setIssuedIdCards(updated);
                                localStorage.setItem(ISSUED_IDS_STORAGE_KEY, JSON.stringify(updated));
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                              title="حذف من السجل"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================
                TAB 1: الإعدادات العامة للموقع والعد التنازلي والإحصائيات
               ========================================================= */}
            {activeTab === 'cms_general' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إعدادات الحفل الرئيسية والعد التنازلي وبيانات التواصل
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      أي تعديل هنا ينعكس فوراً على الواجهة الرئيسية (Hero)، العد التنازلي، والفوتر.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetAllCMS}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-extrabold flex items-center gap-1.5 hover:bg-rose-100 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة الافتراضي</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveGeneralAndStats}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ وتطبيق فوراً</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      عنوان الاحتفالية الرئيسي
                    </label>
                    <input
                      type="text"
                      value={generalForm.title}
                      onChange={(e) => setGeneralForm({ ...generalForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      اسم المبادرة الفرعي
                    </label>
                    <input
                      type="text"
                      value={generalForm.subtitle}
                      onChange={(e) => setGeneralForm({ ...generalForm, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      الشعار اللفظي (Slogan)
                    </label>
                    <input
                      type="text"
                      value={generalForm.slogan}
                      onChange={(e) => setGeneralForm({ ...generalForm, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      نص الموعد الظاهر
                    </label>
                    <input
                      type="text"
                      value={generalForm.dateText}
                      onChange={(e) => setGeneralForm({ ...generalForm, dateText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      تاريخ ووقت العد التنازلي (ISO)
                    </label>
                    <input
                      type="datetime-local"
                      value={generalForm.eventDateISO?.slice(0, 16) || '2026-11-27T15:00'}
                      onChange={(e) => setGeneralForm({ ...generalForm, eventDateISO: `${e.target.value}:00` })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      توقيت انطلاق الحفل
                    </label>
                    <input
                      type="text"
                      value={generalForm.time}
                      onChange={(e) => setGeneralForm({ ...generalForm, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      مكان الحفل (القاعة)
                    </label>
                    <input
                      type="text"
                      value={generalForm.venue}
                      onChange={(e) => setGeneralForm({ ...generalForm, venue: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      سعة القاعة
                    </label>
                    <input
                      type="text"
                      value={generalForm.capacity}
                      onChange={(e) => setGeneralForm({ ...generalForm, capacity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      رمز الدخول السري للوحة التحكم (PIN)
                    </label>
                    <input
                      type="text"
                      value={generalForm.adminPin}
                      onChange={(e) => setGeneralForm({ ...generalForm, adminPin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      اسم مسؤول التواصل / إدارة النادي
                    </label>
                    <input
                      type="text"
                      value={generalForm.leadName}
                      onChange={(e) => setGeneralForm({ ...generalForm, leadName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      رقم الهاتف الرسمي
                    </label>
                    <input
                      type="text"
                      value={generalForm.phone}
                      onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      البريد الإلكتروني الرسمي
                    </label>
                    <input
                      type="text"
                      value={generalForm.email}
                      onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Statistics Cards Editor */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-alexandria font-black text-sm text-slate-900 dark:text-white mb-3">
                    إدارة أرقام وبطاقات الإحصائيات الخمس (StatsBar)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {statsList.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <input
                          type="text"
                          value={st.number}
                          onChange={(e) => {
                            const copy = [...statsList];
                            copy[idx] = { ...copy[idx], number: e.target.value };
                            setStatsList(copy);
                          }}
                          placeholder="الرقم (مثال: 170)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-black text-sky-600 text-center font-alexandria"
                        />
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => {
                            const copy = [...statsList];
                            copy[idx] = { ...copy[idx], label: e.target.value };
                            setStatsList(copy);
                          }}
                          placeholder="العنوان"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={st.desc}
                          onChange={(e) => {
                            const copy = [...statsList];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            setStatsList(copy);
                          }}
                          placeholder="الوصف الفرعي"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 2: إدارة الشركاء الرئيسيين والرعاة والداعمين
               ========================================================= */}
            {activeTab === 'cms_partners' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة الشركاء الرئيسيين (نادي أبدع ومصدر) وقائمة الرعاة والداعمين
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      يمكنك تعديل النصوص، رفع شعار جديد مباشرةً من جهازك، تحديد رعاة الصف الأول المميز، أو تغيير الترتيب.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSavePartnersAndSponsors}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ الشركاء والرعاة فوراً</span>
                  </button>
                </div>

                {/* Strategic Partners Editor */}
                <div className="space-y-3">
                  <h5 className="text-xs sm:text-sm font-black text-sky-700 dark:text-sky-300 font-alexandria">
                    1. الشركاء الرئيسيون للمبادرة (Partners)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strategicPartners.map((sp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 space-y-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={sp.logo}
                            alt={sp.name}
                            className="w-16 h-16 rounded-xl bg-white p-2 object-contain border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={sp.name}
                              onChange={(e) => {
                                const copy = [...strategicPartners];
                                copy[idx] = { ...copy[idx], name: e.target.value };
                                setStrategicPartners(copy);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                              placeholder="اسم الشريك"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={sp.role}
                                onChange={(e) => {
                                  const copy = [...strategicPartners];
                                  copy[idx] = { ...copy[idx], role: e.target.value };
                                  setStrategicPartners(copy);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-300"
                                placeholder="الصفة"
                              />
                              <input
                                type="text"
                                value={sp.badge}
                                onChange={(e) => {
                                  const copy = [...strategicPartners];
                                  copy[idx] = { ...copy[idx], badge: e.target.value };
                                  setStrategicPartners(copy);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-amber-600"
                                placeholder="الشارة"
                              />
                            </div>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          value={sp.desc}
                          onChange={(e) => {
                            const copy = [...strategicPartners];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            setStrategicPartners(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                          placeholder="وصف الشريك"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sp.logo}
                            onChange={(e) => {
                              const copy = [...strategicPartners];
                              copy[idx] = { ...copy[idx], logo: e.target.value };
                              setStrategicPartners(copy);
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-500"
                            placeholder="رابط الشعار"
                          />
                          <label className="px-3 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-bold cursor-pointer hover:bg-sky-200 transition">
                            رفع شعار
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                  const copy = [...strategicPartners];
                                  copy[idx] = { ...copy[idx], logo: dataUrl };
                                  setStrategicPartners(copy);
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Sponsor Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 space-y-3">
                  <h5 className="text-xs font-black text-amber-900 dark:text-amber-300 font-alexandria flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>إضافة راعٍ أو داعم جديد</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <input
                      type="text"
                      value={newSponsor.name}
                      onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                      placeholder="اسم الجهة أو الشركة الراعية"
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={newSponsor.role}
                      onChange={(e) => setNewSponsor({ ...newSponsor, role: e.target.value })}
                      placeholder="الصفة (مثال: راعٍ رئيسي وداعم)"
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-sky-700 dark:text-sky-300 cursor-pointer text-center">
                        {newSponsor.logo ? 'تم اختيار الشعار ✓' : 'رفع صورة الشعار 📁'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (dataUrl) =>
                              setNewSponsor({ ...newSponsor, logo: dataUrl })
                            )
                          }
                        />
                      </label>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newSponsor.featured}
                          onChange={(e) =>
                            setNewSponsor({
                              ...newSponsor,
                              featured: e.target.checked,
                              highlight: e.target.checked
                            })
                          }
                        />
                        <span>صف أول مميز</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSponsor}
                      className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
                    >
                      + إضافة الراعي الآن
                    </button>
                  </div>
                </div>

                {/* Sponsors List Editor */}
                <div className="space-y-2.5">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-alexandria">
                    2. قائمة الرعاة والداعمين الحاليين ({sponsorsList.length} راعٍ)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sponsorsList.map((sp, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center gap-3 ${
                          sp.featured
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl bg-white p-1.5 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                          {sp.logo ? (
                            <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-slate-400">بدون شعار</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <input
                            type="text"
                            value={sp.name}
                            onChange={(e) => {
                              const copy = [...sponsorsList];
                              copy[idx] = { ...copy[idx], name: e.target.value };
                              setSponsorsList(copy);
                            }}
                            className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={sp.role}
                              onChange={(e) => {
                                const copy = [...sponsorsList];
                                copy[idx] = { ...copy[idx], role: e.target.value };
                                setSponsorsList(copy);
                              }}
                              className="flex-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                            />
                            <label className="flex items-center gap-1 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(sp.featured)}
                                onChange={(e) => {
                                  const copy = [...sponsorsList];
                                  copy[idx] = {
                                    ...copy[idx],
                                    featured: e.target.checked,
                                    highlight: e.target.checked ? true : copy[idx].highlight
                                  };
                                  setSponsorsList(copy);
                                }}
                              />
                              <span>صف أول كبار الرعاة</span>
                            </label>
                            <label className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold cursor-pointer">
                              تغيير الشعار
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                    const copy = [...sponsorsList];
                                    copy[idx] = { ...copy[idx], logo: dataUrl };
                                    setSponsorsList(copy);
                                  })
                                }
                              />
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveItem(sponsorsList, setSponsorsList, idx, -1)}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                            title="تحريك للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(sponsorsList, setSponsorsList, idx, 1)}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                            title="تحريك للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = sponsorsList.filter((_, i) => i !== idx);
                              setSponsorsList(copy);
                            }}
                            className="p-1 rounded bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-300 transition cursor-pointer"
                            title="حذف الراعي"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 3: إدارة المنهاج الزمني للاحتفالية
               ========================================================= */}
            {activeTab === 'cms_agenda' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة فقرات المنهاج الزمني للاحتفالية (Agenda)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      عدّل أوقات الفقرات أو عناوينها أو أضف فقرة جديدة للحفل.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveAgenda}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ المنهاج الزمني فوراً</span>
                  </button>
                </div>

                {/* Add Agenda Item */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newAgenda.time}
                    onChange={(e) => setNewAgenda({ ...newAgenda, time: e.target.value })}
                    placeholder="الوقت (مثال: 3:20 م)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newAgenda.title}
                    onChange={(e) => setNewAgenda({ ...newAgenda, title: e.target.value })}
                    placeholder="عنوان الفقرة"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newAgenda.description}
                    onChange={(e) => setNewAgenda({ ...newAgenda, description: e.target.value })}
                    placeholder="وصف الفقرة"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddAgendaItem}
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    + إضافة فقرة جديدة
                  </button>
                </div>

                <div className="space-y-2.5">
                  {agendaList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-3"
                    >
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const copy = [...agendaList];
                          copy[idx] = { ...copy[idx], time: e.target.value };
                          setAgendaList(copy);
                        }}
                        className="w-full sm:w-28 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-sky-600 text-center"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...agendaList];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          setAgendaList(copy);
                        }}
                        className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const copy = [...agendaList];
                          copy[idx] = { ...copy[idx], description: e.target.value };
                          setAgendaList(copy);
                        }}
                        className="flex-1 w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem(agendaList, setAgendaList, idx, -1)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(agendaList, setAgendaList, idx, 1)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAgendaList(agendaList.filter((_, i) => i !== idx))}
                          className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 4: إدارة الخريجين الـ 170 والمجموعات الـ 10
               ========================================================= */}
            {activeTab === 'cms_graduates' && currentCohort && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة قوائم الخريجين والمجموعات العشر (170 خريجاً)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تعديل اسم أي خريج أو إضافة خريج جديد يحدث فوراً في بطاقات التخرج والشهادات الثلاث وشاشة المسرح.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveCohorts}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ بيانات الخريجين فوراً</span>
                  </button>
                </div>

                {/* Cohort Selector Pills */}
                <div className="flex flex-wrap gap-2">
                  {cohortsList.map((c, idx) => (
                    <button
                      key={c.id || idx}
                      type="button"
                      onClick={() => setSelectedCohortIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        selectedCohortIdx === idx
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {c.name} ({c.students?.length || 0})
                    </button>
                  ))}
                </div>

                {/* Selected Cohort Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">اسم المجموعة</label>
                    <input
                      type="text"
                      value={currentCohort.title}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], title: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">المسار العلمي</label>
                    <input
                      type="text"
                      value={currentCohort.track}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], track: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">المدرب المشرف</label>
                    <input
                      type="text"
                      value={currentCohort.mentor}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], mentor: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">الفئة العمرية</label>
                    <input
                      type="text"
                      value={currentCohort.ageRange}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], ageRange: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Add Graduate to Selected Cohort */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder={`إضافة اسم خريج جديد إلى ${currentCohort.name}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGraduateToCohort}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black transition cursor-pointer"
                  >
                    + إضافة خريج
                  </button>
                </div>

                {/* Students Grid for Selected Cohort */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {(currentCohort.students || []).map((st, sIdx) => {
                    const stName = typeof st === 'object' ? st.name : st;
                    return (
                      <div
                        key={sIdx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                      >
                        <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-black flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={stName}
                          onChange={(e) => {
                            const copy = JSON.parse(JSON.stringify(cohortsList));
                            copy[selectedCohortIdx].students[sIdx] = e.target.value;
                            setCohortsList(copy);
                          }}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const serial = String(selectedCohortIdx * 20 + sIdx + 1).padStart(4, '0');
                            handlePrefillIdCardAndOpen({
                              fullName: stName,
                              membershipId: `ABD-ID-2026-${serial}`,
                              roleTitle: 'عضو خريج معتمد — مبادرة 1001 طفل رقمي',
                              track: currentCohort.track || 'البرمجة والذكاء الاصطناعي والروبوتات',
                              ageStage: currentCohort.ageRange || 'الأعمار 7 – 14 سنة',
                              cityOrSchool: `${currentCohort.name} — النجف الأشرف`,
                              badgeColor: '#0284c7'
                            });
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-[10px] font-black transition cursor-pointer shrink-0"
                          title="إصدار هوية انتماء رسمية لهذا الخريج"
                        >
                          🪪 هوية
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = JSON.parse(JSON.stringify(cohortsList));
                            copy[selectedCohortIdx].students = copy[selectedCohortIdx].students.filter(
                              (_, i) => i !== sIdx
                            );
                            setCohortsList(copy);
                          }}
                          className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                          title="حذف الاسم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 5: إدارة المشاريع الـ 40 والمدربين الـ 20
               ========================================================= */}
            {activeTab === 'cms_projects_mentors' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubTabProjMentor('projects')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        subTabProjMentor === 'projects'
                          ? 'bg-sky-600 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      مشاريع المعرض ({projectsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTabProjMentor('mentors')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        subTabProjMentor === 'mentors'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      المدربون والمشرفون ({mentorsList.length})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProjectsAndMentors}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات فوراً</span>
                  </button>
                </div>

                {subTabProjMentor === 'projects' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {projectsList.map((proj, idx) => (
                      <div
                        key={proj.id || idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold">
                            {proj.code}
                          </span>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[idx] = { ...copy[idx], title: e.target.value };
                              setProjectsList(copy);
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={proj.students}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[idx] = { ...copy[idx], students: e.target.value };
                              setProjectsList(copy);
                            }}
                            placeholder="الفريق / الطلاب"
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                          />
                          <input
                            type="text"
                            value={proj.prototype}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[idx] = { ...copy[idx], prototype: e.target.value };
                              setProjectsList(copy);
                            }}
                            placeholder="نوع النموذج"
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-amber-700 dark:text-amber-300"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={proj.desc}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            setProjectsList(copy);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {mentorsList.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
                            {m.id}
                          </span>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => {
                              const copy = [...mentorsList];
                              copy[idx] = { ...copy[idx], name: e.target.value };
                              setMentorsList(copy);
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={m.role}
                            onChange={(e) => {
                              const copy = [...mentorsList];
                              copy[idx] = { ...copy[idx], role: e.target.value };
                              setMentorsList(copy);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-300"
                          />
                          <input
                            type="text"
                            value={m.hours}
                            onChange={(e) => {
                              const copy = [...mentorsList];
                              copy[idx] = { ...copy[idx], hours: e.target.value };
                              setMentorsList(copy);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                          />
                        </div>
                        <input
                          type="text"
                          value={m.specialty}
                          onChange={(e) => {
                            const copy = [...mentorsList];
                            copy[idx] = { ...copy[idx], specialty: e.target.value };
                            setMentorsList(copy);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================
                OPERATIONS TABS: Search & CSV Export Bar
               ========================================================= */}
            {['tickets', 'batch2', 'evaluations', 'community'].includes(activeTab) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم، رقم الهاتف، أو الكود..."
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadAllData}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>تحديث</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير Excel (CSV)</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: TICKETS */}
            {activeTab === 'tickets' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                    <tr>
                      <th className="p-3">رقم التذكرة</th>
                      <th className="p-3">اسم الحاجز</th>
                      <th className="p-3">الصفة</th>
                      <th className="p-3">المقعد / الملاحظات</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {tickets
                      .filter(
                        (t) =>
                          !q ||
                          String(t.attendee_name || '').toLowerCase().includes(q) ||
                          String(t.booking_code || '').toLowerCase().includes(q) ||
                          String(t.phone_number || t.phone || '').includes(q)
                      )
                      .map((t, i) => (
                        <tr key={t.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-black text-sky-600 dark:text-sky-400">
                            {t.booking_code}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{t.attendee_name}</td>
                          <td className="p-3 text-slate-500">{t.guest_type}</td>
                          <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                            {t.seat_label || t.notes || 'عام'}
                          </td>
                          <td className="p-3 font-mono">{t.phone_number || t.phone}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = await EventDB.toggleTicketAttendance(t.id || t.booking_code);
                                setTickets(updated);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                                t.is_attended
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {t.is_attended ? 'حاضر ✓' : 'مسجل (اضغط للتحضير)'}
                            </button>
                          </td>
                          <td className="p-3 flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleWhatsAppTicket(t)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReprintTicket(t)}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = await EventDB.deleteTicket(t.id || t.booking_code);
                                setTickets(updated);
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                              title="حذف الحجز"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 7: BATCH 2 */}
            {activeTab === 'batch2' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                    <tr>
                      <th className="p-3">رقم الترشيح</th>
                      <th className="p-3">اسم الطفل</th>
                      <th className="p-3">العمر / المرحلة</th>
                      <th className="p-3">المسار المطلوب</th>
                      <th className="p-3">ولي الأمر والهاتف</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {batch2List
                      .filter(
                        (c) =>
                          !q ||
                          String(c.child_name || '').toLowerCase().includes(q) ||
                          String(c.candidate_code || '').toLowerCase().includes(q) ||
                          String(c.parent_phone || '').includes(q)
                      )
                      .map((c, i) => (
                        <tr key={c.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-black text-amber-600 dark:text-amber-400">
                            {c.candidate_code}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{c.child_name}</td>
                          <td className="p-3 text-slate-500">
                            {c.age || c.child_age} سنة • {c.age_stage}
                          </td>
                          <td className="p-3 font-bold text-sky-600 dark:text-sky-400">{c.preferred_track}</td>
                          <td className="p-3">
                            <span className="font-bold block">{c.parent_name}</span>
                            <span className="font-mono text-slate-400">{c.parent_phone}</span>
                          </td>
                          <td className="p-3 flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleWhatsAppBatch2(c)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReprintBatch2(c)}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>بطاقة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePrefillIdCardAndOpen({
                                  fullName: c.child_name,
                                  membershipId: c.candidate_code || `ABD-B2-2026-${i + 101}`,
                                  roleTitle: 'عضو منتسب — الدفعة الثانية (1001 طفل رقمي)',
                                  track: c.preferred_track || 'البرمجة والذكاء الاصطناعي',
                                  ageStage: c.age_stage || `${c.age || 10} سنوات`,
                                  phone: c.parent_phone || '07810746655',
                                  cityOrSchool: c.school_name || 'النجف الأشرف',
                                  badgeColor: '#d97706'
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 font-black flex items-center gap-1 transition cursor-pointer"
                              title="إصدار هوية انتماء رسمية"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>هوية</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = await EventDB.deleteBatch2Student(c.id || c.candidate_code);
                                setBatch2List(updated);
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 8: EVALUATIONS */}
            {activeTab === 'evaluations' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                    <tr>
                      <th className="p-3">المشروع</th>
                      <th className="p-3">الفئة العمرية</th>
                      <th className="p-3">المحكّم</th>
                      <th className="p-3">الدرجة (من 100)</th>
                      <th className="p-3">الملاحظات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {evaluations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          لا توجد تقييمات مسجلة حتى الآن.
                        </td>
                      </tr>
                    ) : (
                      evaluations.map((ev, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            <span className="font-mono text-sky-600 ml-1">{ev.project_code}</span>
                            {ev.project_title}
                          </td>
                          <td className="p-3 text-slate-500">{ev.age_group}</td>
                          <td className="p-3 font-bold">
                            {ev.judge_name} <span className="text-slate-400">({ev.judge_role})</span>
                          </td>
                          <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            {ev.total_score} / 100
                          </td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">{ev.notes || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 9: COMMUNITY (Wall of Pride + Volunteers & Sponsor Requests) */}
            {activeTab === 'community' && (
              <div className="space-y-6">
                {/* Pride Wall Messages */}
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-alexandria mb-3">
                    رسائل جدار الفخر والتهاني ({prideMessages.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prideMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-black text-slate-900 dark:text-white">
                              {msg.senderName}
                            </strong>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                              {msg.relation}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{msg.message}</p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const updated = await EventDB.deletePrideMessage(msg.id);
                            setPrideMessages(updated);
                          }}
                          className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer shrink-0"
                          title="حذف الرسالة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volunteers & Sponsors Requests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-black text-sky-600 dark:text-sky-400 mb-3">
                      طلبات التطوع في اللجان ({volunteers.length})
                    </h4>
                    <div className="space-y-2">
                      {volunteers.map((v, i) => (
                        <div
                          key={v.id || i}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="block text-slate-900 dark:text-white">{v.full_name}</strong>
                            <span className="text-slate-500">
                              {v.field_of_interest || v.committee} • {v.phone}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = await EventDB.deleteVolunteer(v.id);
                              setVolunteers(updated);
                            }}
                            className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 mb-3">
                      طلبات الرعاية الواردة ({sponsorsReq.length})
                    </h4>
                    <div className="space-y-2">
                      {sponsorsReq.map((s, i) => (
                        <div
                          key={s.id || i}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="block text-slate-900 dark:text-white">
                              {s.organization_name}
                            </strong>
                            <span className="text-slate-500">
                              {s.sponsorship_tier} • {s.phone}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = await EventDB.deleteSponsor(s.id);
                              setSponsorsReq(updated);
                            }}
                            className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 10: إدارة اليوزرات والصلاحيات (Users & RBAC)
               ========================================================= */}
            {activeTab === 'users' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة حسابات المستخدمين والصلاحيات (Users & Roles)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      أنشئ حسابات مخصصة لأعضاء اللجان (الاستقبال، الإعلام، التحكيم، أو مدير عام) مع تحديد صلاحية كل مستخدم.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveUsersList}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ اليوزرات والصلاحيات</span>
                  </button>
                </div>

                {/* Add New User Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input
                    type="text"
                    value={newUserForm.fullName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                    placeholder="الاسم الكامل / اللجنة"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="اسم المستخدم (Username)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="كلمة المرور (Password)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {ADMIN_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAdminUser}
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    + إضافة يوزر جديد
                  </button>
                </div>

                {/* Users List Table */}
                <div className="space-y-2.5">
                  {adminUsersList.map((u, idx) => (
                    <div
                      key={u.id || idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] text-slate-400 font-bold mb-0.5">
                          الاسم الكامل / المسمى
                        </label>
                        <input
                          type="text"
                          value={u.fullName}
                          onChange={(e) => {
                            const copy = [...adminUsersList];
                            copy[idx] = { ...copy[idx], fullName: e.target.value };
                            setAdminUsersList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-400 font-bold mb-0.5">
                          اسم المستخدم (User)
                        </label>
                        <input
                          type="text"
                          value={u.username}
                          onChange={(e) => {
                            const copy = [...adminUsersList];
                            copy[idx] = { ...copy[idx], username: e.target.value };
                            setAdminUsersList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-black text-sky-600 dark:text-sky-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-400 font-bold mb-0.5">
                          كلمة المرور (Pass)
                        </label>
                        <input
                          type="text"
                          value={u.password}
                          onChange={(e) => {
                            const copy = [...adminUsersList];
                            copy[idx] = { ...copy[idx], password: e.target.value };
                            setAdminUsersList(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-black text-amber-600"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-slate-400 font-bold mb-0.5">
                          الصلاحية (Role)
                        </label>
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const roleObj =
                              ADMIN_ROLES.find((r) => r.id === e.target.value) || ADMIN_ROLES[0];
                            const copy = [...adminUsersList];
                            copy[idx] = {
                              ...copy[idx],
                              role: roleObj.id,
                              roleLabel: roleObj.label
                            };
                            setAdminUsersList(copy);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          {ADMIN_ROLES.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-4">
                        {adminUsersList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = adminUsersList.filter((_, i) => i !== idx);
                              setAdminUsersList(copy);
                              saveAdminUsers(copy);
                            }}
                            className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                            title="حذف المستخدم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
