import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import { ADMIN_ROLES, saveAdminUsers } from '../../data/eventData';

export default function AdminUsersTab({
  adminUsersList,
  setAdminUsersList,
  newUserForm,
  setNewUserForm,
  passwordDrafts,
  setPasswordDrafts,
  handleAddAdminUser,
  handleSaveUsersList,
  handleDeleteAdminUser,
  isSaving
}) {
  return (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة حسابات المستخدمين والصلاحيات السحابية (Cloud Users & Roles)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تُحفظ الحسابات وكلمات المرور المشفرة بـ SHA-256 مباشرة في قاعدة بيانات Supabase وتعمل فوراً على جميع الأجهزة.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveUsersList}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'جارٍ الحفظ السحابي...' : 'حفظ اليوزرات سحابياً'}</span>
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
                        <label className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">
                          تعيين باسورد جديد (مشفر SHA-256)
                        </label>
                        <input
                          type="password"
                          value={passwordDrafts[idx] || ''}
                          onChange={(e) =>
                            setPasswordDrafts((prev) => ({
                              ...prev,
                              [idx]: e.target.value
                            }))
                          }
                          placeholder="•••••••• (مؤمّن)"
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
                  ))}
                </div>
              </div>
  );
}
