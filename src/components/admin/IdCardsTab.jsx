import React from 'react';
import { Printer, Upload, Trash2 } from 'lucide-react';

const ISSUED_IDS_STORAGE_KEY = 'abdaa_issued_id_cards_v1';

export default function IdCardsTab({
  idCardForm,
  setIdCardForm,
  handleIssueAndPrintIdCard,
  selectedCohortIdx,
  setSelectedCohortIdx,
  cohortsList,
  handleBatchPrintCohortIds,
  handleBatchPrintMentorsIds,
  quickMemberSelect,
  setQuickMemberSelect,
  mentorsList,
  batch2List,
  handleImageFileUpload,
  issuedIdCards,
  setIssuedIdCards
}) {
  return (
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

                {/* Batch Print Bar: Print Entire Cohort (17 IDs) or All 20 Mentors in One Click */}
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="block text-xs sm:text-sm font-black text-slate-900 dark:text-white font-alexandria">
                      🖨️ الطباعة الجماعية السريعة للهويات (دفعة كاملة بملف طباعة واحد للقص والكبس الحراري):
                    </strong>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300">
                      تُطبع كل هوية بالوجهين متقابلين مع رمز تحقق QR رسمي يعمل على كاميرا أي هاتف.
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedCohortIdx}
                      onChange={(e) => setSelectedCohortIdx(Number(e.target.value))}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-600 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      {cohortsList.map((c, idx) => (
                        <option key={c.code || c.id || idx} value={idx}>
                          {c.name} ({(c.graduates || c.students || []).length} خريجاً)
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleBatchPrintCohortIds(selectedCohortIdx)}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة هويات الكروب المحدد</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBatchPrintMentorsIds}
                      className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة هويات الـ 20 مدرباً</span>
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
                            const gradArr = c?.graduates || c?.students || [];
                            const st = gradArr[Number(idx2)];
                            const stName = typeof st === 'object' ? st.name : st;
                            if (stName) {
                              const serial = String(Number(idx1) * 17 + Number(idx2) + 1).padStart(4, '0');
                              const memId = (typeof st === 'object' && st.initiativeCode) ? `ABD-ID-${st.initiativeCode}` : `ABD-ID-2026-${serial}`;
                              setIdCardForm((prev) => ({
                                ...prev,
                                fullName: stName,
                                membershipId: memId,
                                roleTitle: 'عضو خريج معتمد — مبادرة 1001 طفل رقمي',
                                track: (typeof st === 'object' && st.track) || c.track || 'البرمجة والذكاء الاصطناعي والروبوتات',
                                ageStage: (typeof st === 'object' && st.ageGroup) || c.ageStage || c.ageRange || 'الأعمار 7 – 14 سنة',
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
                            (c.graduates || c.students || []).map((st, sIdx) => {
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
  );
}
