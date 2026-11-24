import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  CheckCircle2,
  Settings,
  Handshake,
  Calendar,
  Bot,
  HeartHandshake,
  CreditCard,
  LayoutDashboard,
  BookOpen,
  Image as ImageIcon,
  HelpCircle,
  Menu,
  Home,
  Cloud,
  CloudOff,
  LogOut,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Mail,
  Megaphone
} from 'lucide-react';
import {
  EventDB,
  setActiveAdminRpcSecret,
  savePersistedAdminSession,
  loadPersistedAdminSession,
  clearPersistedAdminSession
} from '../lib/supabase';
import {
  EVENT_DETAILS,
  getActiveCohorts,
  getActiveProjects,
  saveSiteCMSOverrides,
  resetSiteCMSOverrides,
  hydrateSiteCMSFromCloud,
  ADMIN_ROLES,
  getAdminUsers,
  saveAdminUsers,
  authenticateAdminUser,
  hashPasswordSHA256
} from '../data/eventData';
import {
  getActiveMentorsList,
  saveActiveMentorsList,
  resetActiveMentorsList
} from './MentorsHonorSection';
import {
  openTicketPrintWindow,
  openCandidateCardPrintWindow,
  openMembershipIdCardPrintWindow,
  openBatchMembershipIdCardsPrintWindow
} from '../utils/printEngine';
import AdminOverviewTab from './admin/AdminOverviewTab';
import IdCardsTab from './admin/IdCardsTab';
import InvitationStudio from './InvitationStudio';
import CampaignStudio from './CampaignStudio';
import CmsGeneralTab from './admin/CmsGeneralTab';
import CmsStoryTracksTab from './admin/CmsStoryTracksTab';
import CmsPartnersTab from './admin/CmsPartnersTab';
import CmsAgendaTab from './admin/CmsAgendaTab';
import CmsGraduatesTab from './admin/CmsGraduatesTab';
import CmsProjectsMentorsTab from './admin/CmsProjectsMentorsTab';
import CmsGalleryTab from './admin/CmsGalleryTab';
import CmsFaqSafetyTab from './admin/CmsFaqSafetyTab';
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

export default function AdminDashboardModal({
  isOpen,
  onClose,
  standalone = true,
  darkMode = false,
  onToggleDarkMode,
  onLaunchFieldTool
}) {
  const [initialSession] = useState(() => loadPersistedAdminSession());
  const [isUnlocked, setIsUnlocked] = useState(() => Boolean(initialSession?.user));
  const [currentUser, setCurrentUser] = useState(() => initialSession?.user || null);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [usernameInput, setUsernameInput] = useState(() => initialSession?.user?.username || 'firas');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [passwordDrafts, setPasswordDrafts] = useState({});
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && initialSession?.user) {
      const saved = sessionStorage.getItem('abdaa_admin_last_tab');
      const roleDef = ADMIN_ROLES.find((r) => r.id === initialSession.user.role) || ADMIN_ROLES[0];
      if (saved && roleDef.allowedTabs?.includes(saved)) return saved;
      return roleDef.allowedTabs?.[0] || 'overview';
    }
    return 'overview';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cloudConnected, setCloudConnected] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState('');
  const [saveNotice, setSaveNotice] = useState({ msg: '', tone: 'emerald' });
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
    forumTitle: EVENT_DETAILS.forumTitle || '',
    organization: EVENT_DETAILS.organization,
    slogan: EVENT_DETAILS.slogan,
    targetAgeRange: EVENT_DETAILS.targetAgeRange || '',
    dateText: EVENT_DETAILS.dateText,
    eventDateISO: EVENT_DETAILS.eventDateISO,
    time: EVENT_DETAILS.time,
    venue: EVENT_DETAILS.venue,
    capacity: EVENT_DETAILS.capacity,
    leadName: EVENT_DETAILS.contact?.leadName || '',
    phone: EVENT_DETAILS.contact?.phone || '',
    email: EVENT_DETAILS.contact?.email || ''
  }));

  const [statsList, setStatsList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.stats || []))
  );
  const [storyForm, setStoryForm] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.story || {}))
  );
  const [ageStagesList, setAgeStagesList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.ageStages || []))
  );
  const [tracksList, setTracksList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.tracks || []))
  );
  const [marqueeForm, setMarqueeForm] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.marqueeSection || {}))
  );
  const [galleryList, setGalleryList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.galleryItems || []))
  );
  const [safetyPillars, setSafetyPillars] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.safetyPillars || []))
  );
  const [faqsList, setFaqsList] = useState(() =>
    JSON.parse(JSON.stringify(EVENT_DETAILS.parentFaqs || []))
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
    speaker: '',
    phaseId: 'opening',
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
    ageStage: 'الأعمار 6 – 14 سنة',
    bloodType: 'O+',
    phone: '07810746655',
    cityOrSchool: 'النجف الأشرف',
    issueDate: '2026/11/01',
    expiryDate: '2027/11/01',
    badgeColor: '#0284c7',
    photoDataUrl: ''
  });
  const [quickMemberSelect, setQuickMemberSelect] = useState('');

  const showToast = useCallback((msg, tone = 'emerald') => {
    setSaveNotice({ msg, tone });
    setTimeout(() => setSaveNotice({ msg: '', tone: 'emerald' }), 4000);
  }, []);

  const syncCMSStateFromEventDetails = useCallback(() => {
    setGeneralForm({
      title: EVENT_DETAILS.title,
      subtitle: EVENT_DETAILS.subtitle,
      forumTitle: EVENT_DETAILS.forumTitle || '',
      organization: EVENT_DETAILS.organization,
      slogan: EVENT_DETAILS.slogan,
      targetAgeRange: EVENT_DETAILS.targetAgeRange || '',
      dateText: EVENT_DETAILS.dateText,
      eventDateISO: EVENT_DETAILS.eventDateISO,
      time: EVENT_DETAILS.time,
      venue: EVENT_DETAILS.venue,
      capacity: EVENT_DETAILS.capacity,
      leadName: EVENT_DETAILS.contact?.leadName || '',
      phone: EVENT_DETAILS.contact?.phone || '',
      email: EVENT_DETAILS.contact?.email || ''
    });
    setStatsList(JSON.parse(JSON.stringify(EVENT_DETAILS.stats || [])));
    setStoryForm(JSON.parse(JSON.stringify(EVENT_DETAILS.story || {})));
    setAgeStagesList(JSON.parse(JSON.stringify(EVENT_DETAILS.ageStages || [])));
    setTracksList(JSON.parse(JSON.stringify(EVENT_DETAILS.tracks || [])));
    setMarqueeForm(JSON.parse(JSON.stringify(EVENT_DETAILS.marqueeSection || {})));
    setGalleryList(JSON.parse(JSON.stringify(EVENT_DETAILS.galleryItems || [])));
    setSafetyPillars(JSON.parse(JSON.stringify(EVENT_DETAILS.safetyPillars || [])));
    setFaqsList(JSON.parse(JSON.stringify(EVENT_DETAILS.parentFaqs || [])));
    setStrategicPartners(JSON.parse(JSON.stringify(EVENT_DETAILS.strategicPartners || [])));
    setSponsorsList(JSON.parse(JSON.stringify(EVENT_DETAILS.partners || [])));
    setAgendaList(JSON.parse(JSON.stringify(EVENT_DETAILS.agenda || [])));
    setCohortsList(JSON.parse(JSON.stringify(getActiveCohorts())));
    setProjectsList(JSON.parse(JSON.stringify(getActiveProjects())));
    setMentorsList(JSON.parse(JSON.stringify(getActiveMentorsList())));
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await EventDB.loadFullAdminWorkspace();
      setCloudConnected(Boolean(snap.cloudConnected));
      setLastSyncedAt(new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }));
      setTickets(snap.tickets || []);
      setBatch2List(snap.batch2 || []);
      setEvaluations(snap.evaluations || []);
      setVolunteers(snap.volunteers || []);
      setSponsorsReq(snap.sponsors || []);
      setPrideMessages(snap.pride || []);
      setIssuedIdCards(snap.idCards || []);

      if (Array.isArray(snap.users) && snap.users.length > 0) {
        setAdminUsersList(snap.users);
      }

      if (snap.cms && typeof snap.cms === 'object') {
        if (snap.cms.main && typeof snap.cms.main === 'object' && Object.keys(snap.cms.main).length > 0) {
          hydrateSiteCMSFromCloud(snap.cms.main);
        }
        const cloudMentors = Array.isArray(snap.cms.mentors)
          ? snap.cms.mentors
          : Array.isArray(snap.cms.mentors?.items)
          ? snap.cms.mentors.items
          : null;
        if (cloudMentors && cloudMentors.length > 0) {
          saveActiveMentorsList(cloudMentors);
        }
      }
      syncCMSStateFromEventDetails();
    } finally {
      setLoading(false);
    }
  }, [syncCMSStateFromEventDetails]);

  useEffect(() => {
    if (isOpen && isUnlocked) {
      loadAllData();
    }
  }, [isOpen, isUnlocked, loadAllData]);

  useEffect(() => {
    if (isUnlocked && activeTab && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('abdaa_admin_last_tab', activeTab);
      } catch {
        // ignore
      }
    }
  }, [isUnlocked, activeTab]);

  if (!isOpen) return null;

  const activeRoleObj =
    ADMIN_ROLES.find((r) => r.id === currentUser?.role) || ADMIN_ROLES[0];
  const isReadOnly =
    currentUser?.role === 'viewer_print' || Boolean(activeRoleObj?.readOnly);

  const blockIfReadOnly = () => {
    if (!isReadOnly) return false;
    showToast('هذا الحساب مخصص للمشاهدة والطباعة فقط ولا يملك صلاحية التعديل أو الحذف.', 'amber');
    return true;
  };

  // Unified Cloud + Local CMS Save Helper
  const saveCmsAndSyncCloud = async (partialOverrides, successMsg) => {
    if (blockIfReadOnly()) return;
    setIsSaving(true);
    try {
      const merged = saveSiteCMSOverrides(partialOverrides);
      const cloudRes = await EventDB.saveCloudCMS(
        'main',
        merged || partialOverrides,
        currentUser?.fullName || currentUser?.username || 'admin'
      );
      if (cloudRes.ok) {
        setCloudConnected(true);
        setLastSyncedAt(new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }));
        showToast(`${successMsg} (تم النشر سحابياً في Supabase لجميع الزوار ✓)`, 'emerald');
      } else {
        showToast(`${successMsg} (حُفظ محلياً — تحقق من الاتصال السحابي)`, 'amber');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (lockoutUntil > now) {
      const secs = Math.ceil((lockoutUntil - now) / 1000);
      setPinError(`تم قفل المحاولات مؤقتاً للحماية. يرجى الانتظار ${secs} ثانية.`);
      return;
    }
    setLoginBusy(true);
    try {
      const matchedUser = await authenticateAdminUser(usernameInput, pin);
      if (matchedUser) {
        setActiveAdminRpcSecret(pin);
        savePersistedAdminSession(matchedUser, pin, rememberDevice);
        setCurrentUser(matchedUser);
        setIsUnlocked(true);
        setPinError('');
        setFailedAttempts(0);
        setPin('');
        const roleDef = ADMIN_ROLES.find((r) => r.id === matchedUser.role) || ADMIN_ROLES[0];
        const nextTab = roleDef.allowedTabs?.[0] || 'overview';
        setActiveTab(nextTab);
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
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = () => {
    clearPersistedAdminSession();
    setActiveAdminRpcSecret('');
    setIsUnlocked(false);
    setCurrentUser(null);
    setPin('');
    setMobileSidebarOpen(false);
  };

  const handleAddAdminUser = async () => {
    if (blockIfReadOnly()) return;
    if (!newUserForm.username.trim() || !newUserForm.password.trim() || !newUserForm.fullName.trim()) {
      showToast('يرجى ملء الاسم الكامل واسم المستخدم وكلمة المرور.', 'amber');
      return;
    }
    setIsSaving(true);
    try {
      const roleObj = ADMIN_ROLES.find((r) => r.id === newUserForm.role) || ADMIN_ROLES[1];
      const passwordHash = await hashPasswordSHA256(newUserForm.password.trim());
      const updated = [
        ...adminUsersList,
        {
          id: `usr-${Date.now()}`,
          username: newUserForm.username.trim().toLowerCase(),
          aliases: [],
          passwordHash,
          fullName: newUserForm.fullName.trim(),
          role: roleObj.id,
          roleLabel: roleObj.label
        }
      ];
      const res = await EventDB.saveAdminUsersCloud(updated);
      if (res.ok) {
        setAdminUsersList(res.users);
        saveAdminUsers(updated);
        setNewUserForm({ username: '', password: '', fullName: '', role: 'reception' });
        showToast('تمت إضافة المستخدم وتشفير كلمة مروره وحفظه سحابياً في Supabase ✓');
      } else {
        setAdminUsersList(updated);
        saveAdminUsers(updated);
        setNewUserForm({ username: '', password: '', fullName: '', role: 'reception' });
        showToast(`حُفظ المستخدم محلياً (${res.error || 'تعذر الاتصال السحابي'})`, 'amber');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUsersList = async () => {
    if (blockIfReadOnly()) return;
    const superCount = adminUsersList.filter((u) => u.role === 'super_admin').length;
    if (superCount < 1) {
      showToast('يجب الإبقاء على حساب «مدير عام» واحد على الأقل!', 'amber');
      return;
    }
    setIsSaving(true);
    try {
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
      const res = await EventDB.saveAdminUsersCloud(updated);
      if (res.ok) {
        setAdminUsersList(res.users);
        setPasswordDrafts({});
        saveAdminUsers(updated);
        showToast('تم حفظ وتشفير قائمة الحسابات والصلاحيات سحابياً في Supabase ✓');
      } else {
        setAdminUsersList(updated);
        setPasswordDrafts({});
        saveAdminUsers(updated);
        showToast(`تم الحفظ محلياً (${res.error || 'تعذر المزامنة السحابية'})`, 'amber');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdminUser = async (idxToRemove) => {
    if (blockIfReadOnly()) return;
    const remaining = adminUsersList.filter((_, i) => i !== idxToRemove);
    if (remaining.filter((u) => u.role === 'super_admin').length < 1) {
      showToast('لا يمكن حذف آخر مدير عام في النظام!', 'amber');
      return;
    }
    setIsSaving(true);
    try {
      const res = await EventDB.saveAdminUsersCloud(remaining);
      if (res.ok) {
        setAdminUsersList(res.users);
        saveAdminUsers(remaining);
        showToast('تم حذف الحساب من قاعدة البيانات السحابية ✓');
      } else {
        setAdminUsersList(remaining);
        saveAdminUsers(remaining);
        showToast('تم حذف الحساب محلياً.', 'amber');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to convert uploaded image file into compressed DataURL
  const handleImageFileUpload = (file, callback, maxDim = 480) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
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
        const mime = maxDim > 600 ? 'image/jpeg' : 'image/png';
        callback(canvas.toDataURL(mime, 0.85));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Save Handlers for CMS Tabs (All Cloud-Synced!)
  const handleSaveGeneralAndStats = () => {
    saveCmsAndSyncCloud(
      {
        title: generalForm.title,
        subtitle: generalForm.subtitle,
        forumTitle: generalForm.forumTitle,
        organization: generalForm.organization,
        slogan: generalForm.slogan,
        targetAgeRange: generalForm.targetAgeRange,
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
      },
      'تم حفظ الإعدادات العامة والإحصائيات'
    );
  };

  const handleSaveStoryAndTracks = () => {
    saveCmsAndSyncCloud(
      {
        story: storyForm,
        ageStages: ageStagesList,
        tracks: tracksList
      },
      'تم حفظ قصة النادي والمراحل العمرية والمسارات'
    );
  };

  const handleSaveGallery = (nextGallery = galleryList, nextMarquee = marqueeForm) => {
    const itemsToSave = Array.isArray(nextGallery) ? nextGallery : galleryList;
    const marqueeToSave = nextMarquee && typeof nextMarquee === 'object' ? nextMarquee : marqueeForm;
    saveCmsAndSyncCloud(
      { galleryItems: itemsToSave, marqueeSection: marqueeToSave },
      'تم حفظ الشريط المتحرك ومعرض الصور'
    );
  };

  const handleSaveFaqAndSafety = () => {
    saveCmsAndSyncCloud(
      {
        safetyPillars,
        parentFaqs: faqsList,
        faq: faqsList
      },
      'تم حفظ ميثاق الأمان والأسئلة الشائعة'
    );
  };

  const handleSavePartnersAndSponsors = () => {
    saveCmsAndSyncCloud(
      {
        strategicPartners,
        partners: sponsorsList
      },
      'تم حفظ الشركاء والرعاة'
    );
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
    setNewSponsor({
      name: '',
      role: 'راعٍ داعم للاحتفالية',
      logo: '',
      featured: false,
      highlight: false
    });
    saveCmsAndSyncCloud({ partners: updated }, 'تمت إضافة الراعي الجديد');
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
    saveCmsAndSyncCloud({ agenda: agendaList }, 'تم حفظ المنهاج الزمني للاحتفالية');
  };

  const handleAddAgendaItem = () => {
    if (!newAgenda.time.trim() || !newAgenda.title.trim()) return;
    const updated = [
      ...agendaList,
      {
        id: `ag-${Date.now()}`,
        phaseId: newAgenda.phaseId || 'opening',
        time: newAgenda.time.trim(),
        duration: '5 دقائق',
        durationMinutes: 5,
        title: newAgenda.title.trim(),
        speaker: newAgenda.speaker?.trim() || 'عريف الحفل',
        description: newAgenda.description.trim() || newAgenda.title.trim(),
        highlight: Boolean(newAgenda.highlight),
        iconType: 'star'
      }
    ];
    setAgendaList(updated);
    setNewAgenda({ time: '', title: '', speaker: '', phaseId: 'opening', description: '', highlight: false });
    saveCmsAndSyncCloud({ agenda: updated }, 'تمت إضافة فقرة المنهاج الزمني');
  };

  const handleSaveCohorts = () => {
    saveCmsAndSyncCloud({ cohorts: cohortsList }, 'تم حفظ بيانات الخريجين والمجموعات');
  };

  const handleAddGraduateToCohort = () => {
    if (blockIfReadOnly()) return;
    if (!newStudentName.trim()) return;
    const copy = JSON.parse(JSON.stringify(cohortsList));
    const targetCohort = copy[selectedCohortIdx];
    if (!targetCohort) return;
    if (!Array.isArray(targetCohort.graduates)) {
      targetCohort.graduates = Array.isArray(targetCohort.students) ? targetCohort.students : [];
    }
    const nextNum =
      copy.reduce((sum, ch) => sum + ((ch.graduates || ch.students || []).length), 0) + 1;
    const serial = String(nextNum).padStart(3, '0');
    targetCohort.graduates.push({
      id: `DK-2026-${serial}`,
      initiativeCode: `1001-IQ-${serial}`,
      name: newStudentName.trim(),
      ageGroup: targetCohort.ageStage || '6 – 14 سنة',
      track: targetCohort.track || 'البرمجة والذكاء الاصطناعي',
      project: 'مشروع تخرج الدفعة الأولى 2026',
      grade: 'امتياز'
    });
    setCohortsList(copy);
    setNewStudentName('');
    saveCmsAndSyncCloud({ cohorts: copy }, 'تمت إضافة الخريج إلى المجموعة');
  };

  const handleSaveProjectsAndMentors = async () => {
    if (blockIfReadOnly()) return;
    setIsSaving(true);
    try {
      const merged = saveSiteCMSOverrides({ allProjects: projectsList });
      saveActiveMentorsList(mentorsList);
      const [cmsRes, mentorsRes] = await Promise.all([
        EventDB.saveCloudCMS('main', merged, currentUser?.fullName || 'admin'),
        EventDB.saveCloudCMS('mentors', mentorsList, currentUser?.fullName || 'admin')
      ]);
      if (cmsRes.ok && mentorsRes.ok) {
        setCloudConnected(true);
        setLastSyncedAt(new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }));
        showToast(
          `تم حفظ ونشر المشاريع (${projectsList.length}) والكادر (${mentorsList.length}) سحابياً في Supabase ✓`
        );
      } else {
        showToast('تم الحفظ محلياً (تحقق من الاتصال السحابي).', 'amber');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAllCMS = async () => {
    if (blockIfReadOnly()) return;
    if (
      !window.confirm(
        'هل أنت متأكد من استعادة كافة بيانات المحتوى (بما في ذلك السحابة في Supabase) إلى الوضع الافتراضي الأصلي؟'
      )
    ) {
      return;
    }
    setIsSaving(true);
    try {
      resetSiteCMSOverrides();
      resetActiveMentorsList();
      await EventDB.resetCloudCMS();
      syncCMSStateFromEventDetails();
      showToast('تمت استعادة الإعدادات الأصلية للموقع محلياً وسحابياً بنجاح ✓');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportFullBackupJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      cms: {
        title: generalForm.title,
        subtitle: generalForm.subtitle,
        forumTitle: generalForm.forumTitle,
        organization: generalForm.organization,
        slogan: generalForm.slogan,
        targetAgeRange: generalForm.targetAgeRange,
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
        story: storyForm,
        ageStages: ageStagesList,
        tracks: tracksList,
        marqueeSection: marqueeForm,
        galleryItems: galleryList,
        safetyPillars,
        parentFaqs: faqsList,
        strategicPartners,
        partners: sponsorsList,
        agenda: agendaList,
        cohorts: cohortsList,
        allProjects: projectsList
      },
      mentors: mentorsList,
      tickets,
      batch2List,
      volunteers,
      evaluations
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
    if (blockIfReadOnly()) return;
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('حجم ملف النسخة الاحتياطية يتجاوز الحد الآمن المسموح (8MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Invalid JSON root');
        }
        setIsSaving(true);
        if (parsed.cms && typeof parsed.cms === 'object' && !Array.isArray(parsed.cms)) {
          const merged = saveSiteCMSOverrides(parsed.cms);
          await EventDB.saveCloudCMS('main', merged, currentUser?.fullName || 'backup-import');
        }
        if (Array.isArray(parsed.mentors)) {
          saveActiveMentorsList(parsed.mentors);
          await EventDB.saveCloudCMS('mentors', parsed.mentors, currentUser?.fullName || 'backup-import');
        }
        syncCMSStateFromEventDetails();
        showToast('تم استيراد النسخة الاحتياطية ونشرها سحابياً على الموقع بالكامل ✓');
      } catch {
        alert('ملف النسخة الاحتياطية غير صالح.');
      } finally {
        setIsSaving(false);
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
    const safeFormula = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safeFormula.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    let rows = [];
    const filename = `abdaa-1001-${activeTab}.csv`;

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
      if (saveToArchive && !isReadOnly && typeof window !== 'undefined') {
        const res = await EventDB.upsertIssuedIdCard(cardData);
        if (Array.isArray(res.list)) {
          setIssuedIdCards(res.list);
        }
        showToast(
          res.source === 'supabase'
            ? `تم إصدار وحفظ الهوية الرسمية (${cardData.fullName}) سحابياً في Supabase ✓`
            : `تم إصدار وحفظ الهوية (${cardData.fullName}) محلياً!`
        );
      } else if (isReadOnly) {
        showToast(`تم تجهيز الهوية الرسمية (${cardData.fullName}) للطباعة المباشرة 🖨️`);
      }
      openMembershipIdCardPrintWindow({
        ...cardData,
        qrDataUrl
      });
    } catch {
      // ignore
    }
  };

  const handleDeleteIssuedIdCard = async (card) => {
    if (blockIfReadOnly()) return;
    const updated = await EventDB.deleteIssuedIdCard(card.id, card.membershipId);
    setIssuedIdCards(updated);
    showToast('تم حذف الهوية من الأرشيف السحابي ✓');
  };

  const handleBatchPrintCohortIds = async (cohortIdx = selectedCohortIdx) => {
    const cohort = cohortsList[cohortIdx];
    const gradArr = cohort?.graduates || cohort?.students || [];
    if (!cohort || !Array.isArray(gradArr) || gradArr.length === 0) return;

    showToast(`جارٍ توليد رموز التحقق QR لـ (${gradArr.length}) هوية في ${cohort.name}...`);
    const priorCount = cohortsList
      .slice(0, cohortIdx)
      .reduce((sum, ch) => sum + ((ch.graduates || ch.students || []).length), 0);
    const members = await Promise.all(
      gradArr.map(async (st, sIdx) => {
        const stName = typeof st === 'object' ? st.name : st;
        const serial = String(priorCount + sIdx + 1).padStart(4, '0');
        const membershipId =
          typeof st === 'object' && st.initiativeCode
            ? `ABD-ID-${st.initiativeCode}`
            : `ABD-ID-2026-${serial}`;
        const roleTitle = 'عضو خريج معتمد — مبادرة 1001 طفل رقمي';
        const track =
          (typeof st === 'object' && st.track) ||
          cohort.track ||
          'البرمجة والذكاء الاصطناعي والروبوتات';
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
          ageStage:
            (typeof st === 'object' && st.ageGroup) ||
            cohort.ageStage ||
            cohort.ageRange ||
            'الأعمار 6 – 14 سنة',
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
    showToast(`جارٍ تجهيز (${mentorsList.length}) هوية رسمية للكادر التدريبي والمؤسسين...`);
    const members = await Promise.all(
      mentorsList.map(async (m, mIdx) => {
        const membershipId = `ABD-MNT-2026-${String(mIdx + 1).padStart(3, '0')}`;
        const roleTitle = m.role || 'مدرب ومشرف علمي معتمد';
        const track = m.organization || m.specialty || 'التدريب البرمجي والذكاء الاصطناعي';
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
          ageStage: m.category || 'الهيئة التدريبية والعلمية',
          cityOrSchool: m.organization || 'نادي أبدع للمهارات الذكية',
          issueDate: '2026/11/01',
          expiryDate: '2027/11/01',
          phone: '07810746655',
          bloodType: 'O+',
          badgeColor: String(roleTitle).includes('مؤسس') ? '#d97706' : '#0f766e',
          qrDataUrl
        };
      })
    );

    openBatchMembershipIdCardsPrintWindow(members, `الهيئة التدريبية والمؤسسون (${mentorsList.length})`);
  };

  const handlePrefillIdCardAndOpen = (prefillData) => {
    setIdCardForm((prev) => ({
      ...prev,
      ...prefillData
    }));
    setActiveTab('id_cards');
    showToast(`تم تجهيز بيانات (${prefillData.fullName}) لإصدار هوية الانتماء الرسمية!`);
  };

  const currentCohort = cohortsList[selectedCohortIdx] || cohortsList[0];
  const totalGraduatesCount = cohortsList.reduce(
    (sum, c) => sum + ((c.graduates || c.students || []).length),
    0
  );

  const NAV_GROUPS = [
    {
      title: 'نظرة عامة',
      items: [
        { id: 'overview', label: 'الإحصائيات والملخص العام', icon: LayoutDashboard }
      ]
    },
    {
      title: 'العمليات الميدانية والبيانات',
      items: [
        { id: 'tickets', label: 'حجوزات التذاكر', icon: Ticket, count: tickets.length },
        { id: 'volunteers', label: 'سجل المتطوعين', icon: HeartHandshake, count: volunteers.length },
        { id: 'batch2', label: 'أطفال الدفعة 2', icon: Users, count: batch2List.length },
        { id: 'evaluations', label: 'تقييمات التحكيم', icon: Award, count: evaluations.length },
        { id: 'community', label: 'جدار الفخر والرعاية', icon: HeartHandshake, count: prideMessages.length + sponsorsReq.length },
        { id: 'id_cards', label: 'هويات العضوية 🪪', icon: CreditCard, count: issuedIdCards.length },
        { id: 'invitations', label: 'الدعوات الرسمية ✉️', icon: Mail },
        { id: 'campaign', label: 'الحملة الإعلانية 📱', icon: Megaphone, count: 18 }
      ]
    },
    {
      title: 'إدارة محتوى الموقع (Cloud CMS)',
      items: [
        { id: 'cms_general', label: 'الإعدادات والإحصائيات', icon: Settings },
        { id: 'cms_story_tracks', label: 'القصة والمسارات والمراحل', icon: BookOpen },
        { id: 'cms_partners', label: 'الشركاء والرعاة', icon: Handshake, count: sponsorsList.length },
        { id: 'cms_agenda', label: 'المنهاج الزمني', icon: Calendar, count: agendaList.length },
        { id: 'cms_graduates', label: 'الخريجون والمجموعات', icon: GraduationCap, count: totalGraduatesCount },
        { id: 'cms_projects_mentors', label: 'المشاريع والمدربون', icon: Bot, count: projectsList.length + mentorsList.length },
        { id: 'cms_gallery', label: 'معرض الصور والشريط', icon: ImageIcon, count: galleryList.length },
        { id: 'cms_faq_safety', label: 'ميثاق الأمان والأسئلة', icon: HelpCircle, count: faqsList.length }
      ]
    },
    {
      title: 'الأمان والنظام',
      items: [
        { id: 'users', label: 'اليوزرات والصلاحيات', icon: ShieldCheck, count: adminUsersList.length }
      ]
    }
  ];

  const allowedTabs = activeRoleObj.allowedTabs || [];

  const filteredGroups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((it) => allowedTabs.includes(it.id))
  })).filter((g) => g.items.length > 0);

  const flatVisibleTabs = filteredGroups.flatMap((g) => g.items);
  const currentTabMeta = flatVisibleTabs.find((t) => t.id === activeTab) || flatVisibleTabs[0];
  const CurrentTabIcon = currentTabMeta?.icon || LayoutDashboard;

  const wrapperClass = standalone
    ? 'min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-tajawal'
    : 'fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-tajawal overflow-hidden';

  // ========================================================
  // 1. STANDALONE LOGIN SCREEN (LOCKED STATE)
  // ========================================================
  if (!isUnlocked) {
    return (
      <div className={`${wrapperClass} items-center justify-center p-4 relative overflow-y-auto`}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-500/20 blur-[110px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-[110px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
          <div className="bg-gradient-to-l from-slate-900 via-sky-950 to-indigo-950 p-6 text-white border-b border-amber-400/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-amber-300 block">
                  نادي أبدع × شركة المصدر • Cloud Admin
                </span>
                <h2 className="text-lg font-black font-alexandria text-white">
                  لوحة التحكم السحابية الشاملة
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>للموقع</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5 text-right">
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center mx-auto text-sky-600 dark:text-sky-400">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-alexandria">
                تسجيل دخول الإدارة واللجان التنظيمية
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تحقق سحابي مشفر بـ SHA-256 عبر Supabase • أدخل بيانات حسابك للمتابعة
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    اسم المستخدم (Username)
                  </label>
                  <div className="flex flex-wrap items-center gap-1">
                    {[
                      { id: 'firas', label: 'الأستاذ فراس' },
                      { id: 'aliaa', label: 'الدكتورة علياء' },
                      { id: 'karrar', label: 'كرار' },
                      { id: 'manar', label: 'منار' },
                      { id: 'zahraa', label: 'زهراء (طباعة)' },
                      { id: 'reception', label: 'استقبال' },
                      { id: 'media', label: 'إعلام' },
                      { id: 'judge', label: 'تحكيم' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setUsernameInput(preset.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          usernameInput === preset.id
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="karrar / firas / reception / media / judge"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-mono text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  كلمة المرور (Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full px-4 py-3 pl-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-mono text-base font-black tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    aria-label="إظهار أو إخفاء كلمة المرور"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 text-center">
                {pinError}
              </div>
            )}

            <label className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>حفظ تسجيل الدخول على هذا الجهاز (تبقى مسجّلاً حتى تضغط تسجيل الخروج)</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loginBusy}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60 text-white font-black text-sm shadow-lg transition cursor-pointer"
            >
              {loginBusy ? 'جارٍ التحقق السحابي...' : 'دخول لوحة التحكم السحابية'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. FULL STANDALONE ADMIN DASHBOARD SHELL (UNLOCKED)
  // ========================================================
  const SidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-white border-l border-slate-800">
      {/* Sidebar Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0 text-right">
            <div className="font-alexandria font-black text-sm text-white truncate">إدارة أبدع 1001</div>
            <div className="flex items-center gap-1 text-[10px] font-bold">
              {cloudConnected ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Cloud className="w-3 h-3" /> متصل سحابياً
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <CloudOff className="w-3 h-3" /> وضع محلي
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg bg-white/10 text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Logged-in User Profile Card */}
      {currentUser && (
        <div className="p-3 mx-3 mt-3 rounded-2xl bg-white/5 border border-white/10 text-right shrink-0">
          <div className="text-xs font-black text-amber-300 truncate">{currentUser.fullName}</div>
          <div className="text-[10px] text-sky-300 font-bold truncate mt-0.5">{currentUser.roleLabel}</div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full py-1.5 px-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[11px] font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}

      {/* Grouped Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {filteredGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-l from-sky-600 to-indigo-600 text-white shadow-md font-black'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Back-to-Site Action */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Home className="w-4 h-4 text-amber-300" />
          <span>العودة للموقع العام</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={wrapperClass} dir="rtl">
      <div className="flex flex-1 min-h-screen relative">
        {/* Desktop Persistent Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen">
          {SidebarContent}
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="w-72 max-w-[85vw] h-full shadow-2xl">{SidebarContent}</div>
            <div
              className="flex-1 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Sticky Utility Bar */}
          <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                aria-label="فتح القائمة"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                <CurrentTabIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {currentTabMeta?.label || 'لوحة التحكم'}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  نادي أبدع × شركة المصدر — لوحة الإدارة السحابية الشاملة
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isReadOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-black">
                  <Eye className="w-3.5 h-3.5" />
                  <span>مشاهدة وطباعة فقط</span>
                </span>
              )}

              <button
                type="button"
                onClick={loadAllData}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="مزامنة وتحديث جميع البيانات من السحابة"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">مزامنة</span>
              </button>

              <button
                type="button"
                onClick={handleExportFullBackupJSON}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 text-xs font-bold text-sky-700 dark:text-sky-300 transition cursor-pointer"
                title="تصدير نسخة احتياطية كاملة للموقع"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير JSON</span>
              </button>

              {!isReadOnly && (
                <label className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300 transition cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>استيراد JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => handleImportFullBackupJSON(e.target.files?.[0])}
                  />
                </label>
              )}

              {onToggleDarkMode && (
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="تبديل المظهر الليلي والنهاري"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
                title="تسجيل الخروج وإنهاء الجلسة المحفوظة"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل خروج</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>الموقع</span>
              </button>
            </div>
          </header>

          {/* Toast Notification Bar */}
          {saveNotice.msg && (
            <div
              className={`${
                saveNotice.tone === 'amber' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
              } px-4 py-2.5 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shrink-0`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveNotice.msg}</span>
            </div>
          )}

          {/* Main Tab Content Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
            <div className={activeTab === 'overview' ? '' : 'rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm'}>
              {activeTab === 'overview' && (
                <AdminOverviewTab
                  cloudConnected={cloudConnected}
                  lastSyncedAt={lastSyncedAt}
                  tickets={tickets}
                  batch2List={batch2List}
                  volunteers={volunteers}
                  sponsorsReq={sponsorsReq}
                  evaluations={evaluations}
                  prideMessages={prideMessages}
                  issuedIdCards={issuedIdCards}
                  cohortsList={cohortsList}
                  projectsList={projectsList}
                  mentorsList={mentorsList}
                  allowedTabs={allowedTabs}
                  onSelectTab={setActiveTab}
                  onLaunchFieldTool={onLaunchFieldTool}
                  readOnly={isReadOnly}
                />
              )}

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
                  handleDeleteIssuedIdCard={handleDeleteIssuedIdCard}
                  readOnly={isReadOnly}
                />
              )}

              {activeTab === 'invitations' && <InvitationStudio embedded={true} />}

              {activeTab === 'campaign' && <CampaignStudio embedded={true} />}

              {activeTab === 'cms_general' && (
                <CmsGeneralTab
                  generalForm={generalForm}
                  setGeneralForm={setGeneralForm}
                  statsList={statsList}
                  setStatsList={setStatsList}
                  handleSaveGeneralAndStats={handleSaveGeneralAndStats}
                  handleResetAllCMS={handleResetAllCMS}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'cms_story_tracks' && (
                <CmsStoryTracksTab
                  storyForm={storyForm}
                  setStoryForm={setStoryForm}
                  ageStagesList={ageStagesList}
                  setAgeStagesList={setAgeStagesList}
                  tracksList={tracksList}
                  setTracksList={setTracksList}
                  handleSaveStoryAndTracks={handleSaveStoryAndTracks}
                  isSaving={isSaving}
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
                  isSaving={isSaving}
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
                  isSaving={isSaving}
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
                  isSaving={isSaving}
                  readOnly={isReadOnly}
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
                  isSaving={isSaving}
                  readOnly={isReadOnly}
                />
              )}

              {activeTab === 'cms_gallery' && (
                <CmsGalleryTab
                  marqueeForm={marqueeForm}
                  setMarqueeForm={setMarqueeForm}
                  galleryList={galleryList}
                  setGalleryList={setGalleryList}
                  handleSaveGallery={handleSaveGallery}
                  handleImageFileUpload={handleImageFileUpload}
                  moveItem={moveItem}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'cms_faq_safety' && (
                <CmsFaqSafetyTab
                  safetyPillars={safetyPillars}
                  setSafetyPillars={setSafetyPillars}
                  faqsList={faqsList}
                  setFaqsList={setFaqsList}
                  handleSaveFaqAndSafety={handleSaveFaqAndSafety}
                  moveItem={moveItem}
                  isSaving={isSaving}
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
                  setEvaluations={setEvaluations}
                  prideMessages={prideMessages}
                  setPrideMessages={setPrideMessages}
                  volunteers={volunteers}
                  setVolunteers={setVolunteers}
                  sponsorsReq={sponsorsReq}
                  setSponsorsReq={setSponsorsReq}
                  readOnly={isReadOnly}
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
                  handleDeleteAdminUser={handleDeleteAdminUser}
                  isSaving={isSaving}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
