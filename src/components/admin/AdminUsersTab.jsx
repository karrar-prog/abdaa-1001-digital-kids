import React, { useState } from 'react';
import {
  Save,
  Trash2,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Copy,
  Check,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Lock
} from 'lucide-react';
import { ADMIN_ROLES, ADMIN_TABS_CATALOG, getEffectiveAllowedTabs, saveAdminUsers } from '../../data/eventData';

const TAB_GROUPS = [
  'نظرة عامة',
  'العمليات الميدانية والبيانات',
  'إدارة محتوى الموقع (CMS)'
];

const ALL_ASSIGNABLE_TABS = ADMIN_TABS_CATALOG.filter((t) => !t.superAdminOnly).map((t) => t.id);

function generateStrongPassword(prefix = 'Abdaa') {
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  const symbols = ['@', '#', '!'];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  return `${prefix}${sym}${digits}`;
}

export default function AdminUsersTab({
  currentUser,
  adminUsersList,
  setAdminUsersList,
  newUserForm,
  setNewUserForm,
  passwordDrafts,
  setPasswordDrafts,
  handleAddAdminUser,
  handleSaveUsersList,
  handleDeleteAdminUser,
  handleChangeMyPassword,
  isSaving
}) {
  const [myNewPassword, setMyNewPassword] = useState('');
  const [showMyPass, setShowMyPass] = useState(false);
  const [copiedMyPass, setCopiedMyPass] = useState(false);

  const [showNewUserPass, setShowNewUserPass] = useState(true);
  const [showNewUserPerms, setShowNewUserPerms] = useState(true);
  const [visibleRowPasswords, setVisibleRowPasswords] = useState({});
  const [expandedUserPerms, setExpandedUserPerms] = useState({});

  const copyText = async (text, onCopied) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      onCopied?.(true);
      setTimeout(() => onCopied?.(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleNewUserRoleChange = (roleId) => {
    const roleDef = ADMIN_ROLES.find((r) => r.id === roleId) || ADMIN_ROLES[1];
    const presetTabs =
      roleId === 'super_admin'
        ? [...ALL_ASSIGNABLE_TABS]
        : (roleDef.allowedTabs || ['overview']).filter((id) => id !== 'users');
    setNewUserForm({
      ...newUserForm,
      role: roleId,
      customTabs: presetTabs,
      readOnly: roleId === 'super_admin' ? false : Boolean(roleDef.readOnly)
    });
  };

  const toggleNewUserTab = (tabId) => {
    if (newUserForm.role === 'super_admin') return;
    const current = Array.isArray(newUserForm.customTabs) ? newUserForm.customTabs : [];
    const next = current.includes(tabId)
      ? current.filter((t) => t !== tabId)
      : [...current, tabId];
    setNewUserForm({
      ...newUserForm,
      customTabs: next
    });
  };

  const toggleExistingUserTab = (idx, tabId) => {
    const user = adminUsersList[idx];
    if (!user || user.role === 'super_admin') return;
    const current = getEffectiveAllowedTabs(user).filter((id) => id !== 'users');
    const next = current.includes(tabId)
      ? current.filter((t) => t !== tabId)
      : [...current, tabId];
    const copy = [...adminUsersList];
    copy[idx] = {
      ...copy[idx],
      customTabs: next.length > 0 ? next : ['overview']
    };
    setAdminUsersList(copy);
  };

  const setExistingUserTabsBulk = (idx, tabsArr) => {
    const user = adminUsersList[idx];
    if (!user || user.role === 'super_admin') return;
    const copy = [...adminUsersList];
    copy[idx] = {
      ...copy[idx],
      customTabs: tabsArr
    };
    setAdminUsersList(copy);
  };

  const submitMyPassword = async () => {
    const clean = myNewPassword.trim();
    if (clean.length < 4) return;
    if (handleChangeMyPassword) {
      const ok = await handleChangeMyPassword(clean);
      if (ok) {
        setMyNewPassword('');
      }
    }
  };

  const renderTabsChecklist = ({
    selectedTabs,
    isSuperAdmin,
    onToggle,
    onSelectAll,
    onClearAll
  }) => {
    if (isSuperAdmin) {
      return (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
          <span>حساب السوبر أدمن يملك صلاحية كاملة لجميع الأقسام الـ 19 بما فيها إدارة المستخدمين والصلاحيات.</span>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-black text-slate-600 dark:text-slate-300">
            الأقسام المسموح للمستخدم رؤيتها ({selectedTabs.length} / {ALL_ASSIGNABLE_TABS.length})
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-black hover:bg-sky-200 dark:hover:bg-sky-900 transition cursor-pointer"
            >
              تحديد الكل
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
            >
              الإحصائيات فقط
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TAB_GROUPS.map((groupName) => {
            const items = ADMIN_TABS_CATALOG.filter((t) => t.group === groupName && !t.superAdminOnly);
            return (
              <div
                key={groupName}
                className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="text-[11px] font-black text-sky-700 dark:text-sky-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  {groupName}
                </div>
                <div className="space-y-1.5">
                  {items.map((tab) => {
                    const checked = selectedTabs.includes(tab.id);
                    return (
                      <label
                        key={tab.id}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                          checked
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(tab.id)}
                          className="w-3.5 h-3.5 rounded accent-sky-600 cursor-pointer"
                        />
                        <span className="truncate">{tab.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>ملاحظة أمان: قسم «اليوزرات والصلاحيات» محمي ومغلق تلقائياً ولا يُفتح إلا لحساب السوبر أدمن فقط.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-slate-900 via-sky-950 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-amber-400/30 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black mb-1">
              <span>صلاحية حصرية للسوبر أدمن • {currentUser?.username || 'karrar'}</span>
            </div>
            <h4 className="font-alexandria font-black text-sm sm:text-base text-white">
              إدارة المستخدمين والصلاحيات المخصصة (Super Admin Control)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              يمكنك إنشاء حسابات جديدة، تعيين أو تغيير كلمات المرور، وتخصيص الأقسام المسموحة لكل مستخدم بدقة مع الحفظ السحابي الفوري في Supabase.
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveUsersList}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ السحابي...' : 'حفظ جميع التعديلات سحابياً'}</span>
        </button>
      </div>

      {/* Quick Card: Change My Own Super Admin Password */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h5 className="font-alexandria font-black text-xs sm:text-sm text-slate-900 dark:text-white">
              تغيير كلمة مرور حسابي (السوبر أدمن: <span className="font-mono text-emerald-700 dark:text-emerald-300">{currentUser?.username || 'karrar'}</span>)
            </h5>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            يُحدّث جلستك النشطة وقاعدة Supabase مباشرة دون الحاجة لإعادة الدخول
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <input
              type={showMyPass ? 'text' : 'password'}
              value={myNewPassword}
              onChange={(e) => setMyNewPassword(e.target.value)}
              placeholder="اكتب كلمة المرور الجديدة الخاصة بك (4 أحرف فأكثر)"
              className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-mono font-black text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowMyPass((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              title="إظهار / إخفاء"
            >
              {showMyPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              const gen = generateStrongPassword('Karrar');
              setMyNewPassword(gen);
              setShowMyPass(true);
            }}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>توليد كلمة قوية</span>
          </button>

          {myNewPassword && (
            <button
              type="button"
              onClick={() => copyText(myNewPassword, setCopiedMyPass)}
              className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-sky-700 dark:text-sky-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedMyPass ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMyPass ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          )}

          <button
            type="button"
            disabled={isSaving || myNewPassword.trim().length < 4}
            onClick={submitMyPassword}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>تحديث كلمة مروري فوراً</span>
          </button>
        </div>
      </div>

      {/* Add New User Box with Granular Permissions */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h5 className="font-alexandria font-black text-xs sm:text-sm text-slate-900 dark:text-white">
              إنشاء حساب مستخدم جديد وتحديد صلاحياته
            </h5>
          </div>
          <button
            type="button"
            onClick={() => setShowNewUserPerms((v) => !v)}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-600 text-[11px] font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>تخصيص الأقسام ({(newUserForm.customTabs || []).length})</span>
            {showNewUserPerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            value={newUserForm.fullName}
            onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
            placeholder="الاسم الكامل / اللجنة"
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
          <input
            type="text"
            value={newUserForm.username}
            onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
            placeholder="اسم المستخدم (مثلاً: ahmed)"
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
          />
          <div className="relative flex items-center gap-1">
            <input
              type={showNewUserPass ? 'text' : 'password'}
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              placeholder="كلمة المرور"
              className="w-full px-3 py-2.5 pl-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setNewUserForm({ ...newUserForm, password: generateStrongPassword('Abdaa') })}
              className="absolute left-8 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-600 cursor-pointer"
              title="توليد كلمة مرور عشوائية"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowNewUserPass((v) => !v)}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="إظهار / إخفاء"
            >
              {showNewUserPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <select
            value={newUserForm.role}
            onChange={(e) => handleNewUserRoleChange(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          >
            {ADMIN_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleAddAdminUser}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-black text-xs transition cursor-pointer shadow-sm"
          >
            + إنشاء يوزر وحفظه سحابياً
          </button>
        </div>

        {/* Read-only toggle for new user */}
        {newUserForm.role !== 'super_admin' && (
          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(newUserForm.readOnly)}
              onChange={(e) => setNewUserForm({ ...newUserForm, readOnly: e.target.checked })}
              className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
            />
            <span>تقييد الحساب بوضع «المشاهدة والطباعة فقط» (قراءة فقط بدون تعديل أو حذف)</span>
          </label>
        )}

        {/* Per-tab granular permission picker for new user */}
        {showNewUserPerms && (
          <div className="pt-2 border-t border-amber-200/80 dark:border-slate-700">
            {renderTabsChecklist({
              selectedTabs: Array.isArray(newUserForm.customTabs) ? newUserForm.customTabs : [],
              isSuperAdmin: newUserForm.role === 'super_admin',
              onToggle: toggleNewUserTab,
              onSelectAll: () => setNewUserForm({ ...newUserForm, customTabs: [...ALL_ASSIGNABLE_TABS] }),
              onClearAll: () => setNewUserForm({ ...newUserForm, customTabs: ['overview'] })
            })}
          </div>
        )}
      </div>

      {/* Existing Users List */}
      <div className="space-y-3">
        {adminUsersList.map((u, idx) => {
          const isMe =
            (currentUser?.id && u.id === currentUser.id) ||
            (currentUser?.username && u.username?.toLowerCase() === currentUser.username.toLowerCase());
          const isSuper = u.role === 'super_admin';
          const effectiveTabs = getEffectiveAllowedTabs(u);
          const isPermsOpen = Boolean(expandedUserPerms[u.id || idx]);
          const isPassVisible = Boolean(visibleRowPasswords[idx]);
          const isReadOnlyUser = !isSuper && (Boolean(u.readOnly) || u.role === 'viewer_print');

          return (
            <div
              key={u.id || idx}
              className={`p-4 rounded-2xl border transition space-y-3 ${
                isSuper
                  ? 'bg-gradient-to-l from-amber-50/80 to-sky-50/60 dark:from-amber-950/20 dark:to-slate-800/90 border-amber-300 dark:border-amber-700/60'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <label className="block text-[10px] text-slate-400 font-bold">
                      الاسم الكامل / المسمى
                    </label>
                    {isMe && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black">
                        حسابك
                      </span>
                    )}
                    {isSuper && (
                      <span className="px-1.5 py-0.5 rounded-md bg-sky-600 text-white text-[9px] font-black">
                        سوبر أدمن
                      </span>
                    )}
                  </div>
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
                  <label className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">
                    تعيين باسورد جديد (مشفر)
                  </label>
                  <div className="relative">
                    <input
                      type={isPassVisible ? 'text' : 'password'}
                      value={passwordDrafts[idx] || ''}
                      onChange={(e) =>
                        setPasswordDrafts((prev) => ({
                          ...prev,
                          [idx]: e.target.value
                        }))
                      }
                      placeholder="•••••••• (مؤمّن)"
                      className="w-full px-3 py-1.5 pl-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-black text-amber-600"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleRowPasswords((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="إظهار / إخفاء"
                    >
                      {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] text-slate-400 font-bold mb-0.5">
                    الدور الأساسي (Role)
                  </label>
                  <select
                    value={u.role}
                    onChange={(e) => {
                      const roleObj =
                        ADMIN_ROLES.find((r) => r.id === e.target.value) || ADMIN_ROLES[1];
                      const copy = [...adminUsersList];
                      copy[idx] = {
                        ...copy[idx],
                        role: roleObj.id,
                        roleLabel: roleObj.label,
                        customTabs:
                          roleObj.id === 'custom'
                            ? effectiveTabs.filter((id) => id !== 'users')
                            : null,
                        readOnly: roleObj.id === 'super_admin' ? false : Boolean(roleObj.readOnly)
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

                <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedUserPerms((prev) => ({
                        ...prev,
                        [u.id || idx]: !prev[u.id || idx]
                      }))
                    }
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 transition cursor-pointer ${
                      isPermsOpen
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900'
                    }`}
                    title="تخصيص الأقسام المسموحة لهذا الحساب"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{effectiveTabs.length} قسم</span>
                  </button>

                  {adminUsersList.length > 1 && !isMe && (
                    <button
                      type="button"
                      onClick={() => {
                        if (handleDeleteAdminUser) {
                          handleDeleteAdminUser(idx);
                        } else {
                          const copy = adminUsersList.filter((_, i) => i !== idx);
                          setAdminUsersList(copy);
                          saveAdminUsers(copy);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                      title="حذف المستخدم"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {Array.isArray(u.customTabs) && u.customTabs.length > 0 && !isSuper && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black">
                    صلاحيات أقسام مخصصة ({u.customTabs.length})
                  </span>
                )}
                {isReadOnlyUser && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black">
                    مشاهدة وطباعة فقط 👁️
                  </span>
                )}
              </div>

              {/* Expandable Granular Permissions Editor */}
              {isPermsOpen && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  {!isSuper && (
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isReadOnlyUser}
                        onChange={(e) => {
                          const copy = [...adminUsersList];
                          copy[idx] = { ...copy[idx], readOnly: e.target.checked };
                          setAdminUsersList(copy);
                        }}
                        className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                      />
                      <span>تقييد هذا الحساب بوضع «المشاهدة والطباعة فقط» (قراءة فقط بدون تعديل أو حذف)</span>
                    </label>
                  )}

                  {renderTabsChecklist({
                    selectedTabs: effectiveTabs.filter((id) => id !== 'users'),
                    isSuperAdmin: isSuper,
                    onToggle: (tabId) => toggleExistingUserTab(idx, tabId),
                    onSelectAll: () => setExistingUserTabsBulk(idx, [...ALL_ASSIGNABLE_TABS]),
                    onClearAll: () => setExistingUserTabsBulk(idx, ['overview'])
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
