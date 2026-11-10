import {DEMO_SUPPLIERS,DEFAULT_CRITERIA,DEMO_MILESTONES,evaluateCandidates,canReview,canIntroduce,createInitialState,resetAfterCriteriaEdit} from './p02-engine.js';

export const p02State=createInitialState();
const escapeHTML=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const roles={
 buyer:{icon:'◎',name:'海外采购商',en:'For global buyers',lead:'精准发现中国供应链',desc:'看清产品、起订量、交期与证据状态，不再从上百条不明信息里盲目筛选。',small:'我的采购条件 → 对比候选 → 授权引荐'},
 supplier:{icon:'▣',name:'中国供应商',en:'For Chinese manufacturers',lead:'判断海外机会是否值得响应',desc:'先了解采购要求、对方意向与尚待核实的问题，再决定是否投入商务资源。',small:'查看需求 → 判断适配 → 确认合作意愿'},
 operator:{icon:'⌘',name:'生态运营方',en:'For ecosystem operators',lead:'把资源网络转成可信合作',desc:'用清晰的证据、审核规则和双方确认，降低虚假线索与重复协调成本。',small:'核验事实 → 发起推荐 → 跟踪合作'}
};
const stageNames=['明确采购需求','候选供应链匹配','证据与人工审核','双向合作意愿','商务协作与结果'];
const num=n=>n.toLocaleString('zh-CN');
const button=(text,act,cls='',attrs='')=>`<button type="button" class="p02-btn ${cls}" data-action="p02-${act}" ${attrs}>${text}</button>`;
const iconArrow='<span aria-hidden="true">↗</span>';
const statusLabel={pass:'满足',unknown:'尚未核实',fail:'不满足',optional:'非必选',qualified:'可进入演示审核',pending:'证据待补充',blocked:'硬条件不满足'};
const iconStatus={pass:'✓',unknown:'?',fail:'×',optional:'—'};
const statusText=s=>`<span class="p02-status ${s}">${statusLabel[s]}</span>`;
const currentSupplier=()=>DEMO_SUPPLIERS.find(s=>s.id===p02State.selected);
const currentEvaluation=()=>evaluateCandidates(p02State.criteria).find(x=>x.supplier.id===p02State.selected);

export function renderP02Landing(){return `
  <div class="p02-landing">
   <div class="p02-env"><span class="p02-dot"></span> F2H · P0.2 交互演示 · 全部数据虚构，不连接真实企业</div>
   <section class="p02-hero">
      <div class="p02-hero-left"><div class="p02-kicker">MAOHE / CROSS-BORDER CONNECTION INTELLIGENCE</div>
       <h1>让全球采购需求，<br/><em>找到真正合适的中国供应链。</em></h1>
       <p>从海外采购意向出发，AI模拟分析供应条件、证据与合作风险。不是给出一份供应商名单，而是让每次跨境连接都有依据、有边界、有下一步。</p>
       <div class="p02-hero-actions">${button('体验完整撮合故事 &nbsp; ↗','launch','primary')}${button('查看现有商机雷达','goto-radar','light')}</div>
       <div class="p02-hero-foot">从需求到合作的五步体验 · 约 3–5 分钟 · 无需登录</div>
      </div>
      <div class="p02-hero-graphic" aria-hidden="true"><div class="p02-orbit p02-orbit-one"></div><div class="p02-orbit p02-orbit-two"></div>
        <div class="p02-graph-node p02-graph-buyer"><small>GLOBAL BUYER</small><b>海外采购需求</b><span>明确的规格与约束</span></div>
        <div class="p02-graph-core"><b>F2H</b><span>可信匹配</span><div class="p02-core-ring"></div></div>
        <div class="p02-graph-node p02-graph-supplier"><small>CHINA SUPPLY</small><b>中国制造能力</b><span>证据 · 交期 · MOQ</span></div>
        <div class="p02-graph-line p02-line-one"></div><div class="p02-graph-line p02-line-two"></div>
      </div>
   </section>
   <div class="p02-overline">CHOOSE YOUR PERSPECTIVE / 从谁的视角体验？</div>
   <div class="p02-role-grid">${Object.entries(roles).map(([key,r],i)=>`<button type="button" class="p02-role-card" data-action="p02-choose-role" data-role="${key}"><span class="p02-role-n">0${i+1}</span><span class="p02-role-icon">${r.icon}</span><span class="p02-role-cn">${r.name}</span><small>${r.en}</small><strong>${r.lead}</strong><span class="p02-role-desc">${r.desc}</span><span class="p02-role-link">进入角色体验 <span>→</span></span></button>`).join('')}</div>
   <div class="p02-bottom-grid"><section class="p02-panel p02-story-intro"><div class="p02-overline">THE STORY WE WILL PROVE</div><h2>一条沙特食品采购需求，如何走向可信合作？</h2><p>用一份虚构的沙特冻干果蔬采购需求，对照四家虚构中国供应商，现场调整认证、交期和起订量，观察候选如何变化。</p><div class="p02-story-chip"><span>01 采购条件</span><span>02 供方对比</span><span>03 证据</span><span>04 双向确认</span><span>05 商务下一步</span></div></section>
   <section class="p02-panel p02-why"><div class="p02-overline">WHY THIS MATTERS</div><h2>不只找到谁，更要知道为什么合作。</h2><div class="p02-why-line"><span>✓</span> 硬条件不满足时，推荐会被阻断</div><div class="p02-why-line"><span>✓</span> 未核验条件不会包装为已认证</div><div class="p02-why-line"><span>✓</span> 双方未同意前，不会发生引荐</div></section></div>
  </div>`}

function criteriaPanel(){const c=p02State.criteria;const readOnly=p02State.role!=='buyer';return `<div class="p02-content-head"><div><div class="p02-overline">STEP 01 · BUYER INTENT</div><h2>一条跨境需求，首先需要被准确理解。</h2><p>这是一条虚构的沙特食品采购情景。修改条件后，下一步的供应商判断会同步变化。只有海外买方视角可以修改。</p></div><span class="p02-flag">🇸🇦 沙特阿拉伯</span></div>
 <div class="p02-scenario-summary"><div class="p02-scenario-image" aria-hidden="true"><span>冻干果蔬</span><b>OEM</b></div><div><span class="p02-mini">SIMULATED REQUEST · MH-P02-SA</span><h3>低糖冻干果蔬零食 · 海外渠道采购</h3><p>产品方向：冻干水果/蔬菜零食；目标：寻找中国具有OEM能力的供货商；采购意向为演示假设，未经任何真实买方确认。</p><div class="p02-spec-tags"><span>食品消费品</span><span>出口中国制造</span><span>OEM / Private Label</span></div></div></div>
 <div class="p02-criteria-grid"><label class="p02-field"><span>首批采购量（箱）</span><select id="p02-quantity" aria-label="首批采购量" ${readOnly?'disabled':''}>${[1200,1800,3500].map(v=>`<option value="${v}" ${c.quantity===v?'selected':''}>${num(v)} 箱</option>`).join('')}</select><small>影响最低起订量匹配</small></label>
 <label class="p02-field"><span>要求最大交期</span><select id="p02-lead" aria-label="最大交期" ${readOnly?'disabled':''}>${[25,30,45].map(v=>`<option value="${v}" ${c.maxLeadDays===v?'selected':''}>${v} 天</option>`).join('')}</select><small>以虚构供方交期为参照</small></label>
 <label class="p02-switch"><input type="checkbox" id="p02-halal" ${c.requireHalal?'checked':''} ${readOnly?'disabled':''}/><span class="p02-check-visual"></span><span><b>清真认证材料为必备条件</b><small>未核验材料不能视为合格</small></span></label>
 <label class="p02-switch"><input type="checkbox" id="p02-english" ${c.requireEnglish?'checked':''} ${readOnly?'disabled':''}/><span class="p02-check-visual"></span><span><b>必须支持英文包装资料</b><small>缺少材料则不满足当前条件</small></span></label></div>
 <div class="p02-alert soft"><b>真实采购仍需验证：</b>买方身份、采购授权、产品细项、支付条款、进口合规与认证真实性均未验证。这里仅演示条件识别与匹配逻辑。</div>`}

function matchList(){const x=evaluateCandidates(p02State.criteria),counts={qualified:x.filter(a=>a.status==='qualified').length,pending:x.filter(a=>a.status==='pending').length,blocked:x.filter(a=>a.status==='blocked').length};return `<div class="p02-content-head"><div><div class="p02-overline">STEP 02 · EXPLAINABLE MATCHING</div><h2>不是“匹配度 90 分”，而是条件逐项对照。</h2><p>按采购约束将每家候选划为合格演示候选、待补证据或硬条件不满足。改变采购要求可以验证排序逻辑。</p></div>${button('调整采购条件','edit','quiet')}</div>
 <div class="p02-result-sum"><span><b>${counts.qualified}</b> 演示条件合格</span><span><b>${counts.pending}</b> 需要补证据</span><span><b>${counts.blocked}</b> 不符合硬条件</span></div>
 <div class="p02-supplier-list">${x.map((a,i)=>`<article class="p02-supplier-choice ${a.status} ${p02State.selected===a.supplier.id?'selected':''}"><div class="p02-choice-head"><div><span class="p02-mini">候选 ${String(i+1).padStart(2,'0')} · ${escapeHTML(a.supplier.place)}</span><h3>${escapeHTML(a.supplier.name)}</h3></div><span class="p02-status ${a.status}">${statusLabel[a.status]}</span></div>
 <div class="p02-checks">${a.checks.map(c=>`<span class="p02-check-item ${c.status}" title="${escapeHTML(c.detail)}"><b>${iconStatus[c.status]}</b> ${escapeHTML(c.label)}<small>${escapeHTML(c.detail)}</small></span>`).join('')}</div>
 <div class="p02-choice-foot"><p>${escapeHTML(a.reason)}</p>${a.status==='qualified'?button(p02State.selected===a.supplier.id?'已选择 ✓':'选择此候选','select','small '+(p02State.selected===a.supplier.id?'subtle':'primary'),`data-supplier="${a.supplier.id}" ${p02State.selected===a.supplier.id||p02State.role==='supplier'?'disabled':''}`):'<span class="p02-block-note">当前不能进入正式推荐流程</span>'}</div></article>`).join('')}</div>`}

function evidenceReview(){const s=currentSupplier(),a=currentEvaluation();if(!s||!a)return `<div class="p02-panel"><h2>尚未选择符合条件的候选</h2><p>请返回上一阶段选择一家具备演示适配性的供应商。</p>${button('返回候选列表','back','primary')}</div>`;return `<div class="p02-content-head"><div><div class="p02-overline">STEP 03 · TRUST & REVIEW</div><h2>推荐之前，先明确哪些事实被确认。</h2><p>这一步由生态运营角色模拟复核资料。演示中的“已审核”仅意味着对虚构材料的状态模拟，不代表任何真实企业资质通过。</p></div><span class="p02-status ${a.status}">${statusLabel[a.status]}</span></div>
 <div class="p02-evidence-box"><div class="p02-evidence-top"><div class="p02-evidence-icon">▤</div><div><span class="p02-mini">DEMO EVIDENCE DOSSIER</span><h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.place)} · ${escapeHTML(s.evidence)}</p></div></div>
 <div class="p02-evidence-list">${a.checks.map((c,i)=>`<div class="p02-evidence-row"><div><b>${escapeHTML(c.label)}</b><small>${escapeHTML(c.detail)}</small></div>${statusText(c.status)}</div>`).join('')}</div>
 <div class="p02-alert"><b>来源与有效性：</b>${escapeHTML(s.evidence)}。证据日期：${escapeHTML(s.evidenceDate)}。所有证明材料均为模拟占位，**不构成现实世界中的核验结论**。</div></div>
 <div class="p02-review-action"><div><strong>${p02State.reviewed?'模拟复核步骤已完成':'等待演示运营人员复核'}</strong><p>${p02State.reviewed?'可以进入双方意愿征求。未发送邮件、消息或邀请。':'点击操作仅修改本地模拟状态，不产生对外审核意见。'}</p></div>${p02State.reviewed?'<span class="p02-status qualified">已完成本地模拟复核</span>':button(p02State.role==='operator'?'模拟运营审核通过':'请切换生态运营方审核','review','primary',p02State.role==='operator'?'':'disabled')}</div>`}

function consentPanel(){const s=currentSupplier();const st=p02State;const rejected=st.buyerRejected||st.supplierRejected;return `<div class="p02-content-head"><div><div class="p02-overline">STEP 04 · DOUBLE OPT-IN</div><h2>双方都愿意，合作才真正开始。</h2><p>未取得双方意愿确认，不解锁私人联系方式，也不自动建立商务群聊。</p></div><span class="p02-status ${rejected?'blocked':st.buyerApproved&&st.supplierApproved?'qualified':'pending'}">${rejected?'一方拒绝引荐':st.buyerApproved&&st.supplierApproved?'双方已同意（模拟）':'等待双方回复'}</span></div>
 <div class="p02-consent-grid">${[['buyer','海外采购方','海湾食品采购渠道 · 虚构匿名主体'],['supplier','中国供应方',s?.name||'无已选候选']].map(([key,label,person])=>`<div class="p02-consent-card"><div class="p02-consent-avatar">${key==='buyer'?'◎':'▣'}</div><span class="p02-mini">${label}</span><h3>${escapeHTML(person)}</h3><p>当前意愿：<strong>${st[key+'Rejected']?'明确拒绝（模拟）':st[key+'Approved']?'同意接洽（模拟）':'尚未回答'}</strong></p><div class="p02-consent-actions">${!st[key+'Approved']&&!st[key+'Rejected']?`${button('模拟同意','approve','small primary',`data-party="${key}" ${st.role!==key?'disabled':''}`)}${button('模拟拒绝','reject','small danger',`data-party="${key}" ${st.role!==key?'disabled':''}`)}`:''}</div></div>`).join('')}</div>
 ${rejected?`<div class="p02-alert warn"><b>撮合已停止：</b>一方拒绝后，不应继续披露或安排会议。可以重置双方意愿后再次演示，或者返回重新选择候选。${button('清除拒绝并重新演示','clear-rejection','quiet')}</div>`:`<div class="p02-alert soft"><b>最小披露：</b>向任一方只展示经许可的需求摘要和候选能力概述；本原型没有真实联系人、消息发送或数据分享功能。</div>`}
 <div class="p02-consent-gate"><span class="p02-gate-icon">${st.buyerApproved&&st.supplierApproved&&!rejected?'✓':'⌁'}</span><div><b>联系信息披露闸门</b><small>${st.buyerApproved&&st.supplierApproved&&!rejected?'满足本地双向同意模拟条件，可前进到商务协作演示':'尚未满足；无法进入引荐演示'}</small></div></div>`}

function collaborationPanel(){const st=p02State,s=currentSupplier();const path=st.path;return `<div class="p02-content-head"><div><div class="p02-overline">STEP 05 · COLLABORATION, NOT JUST A CONTACT</div><h2>引荐不是终点。关键是下一步怎么走。</h2><p>双方已在本地原型中完成模拟同意；这里演示商务推进与受阻两种路径，均不代表真实交易。</p></div><span class="p02-status qualified">双向同意模拟完成</span></div>
 <div class="p02-intro-card"><div><span class="p02-mini">DEMO COLLABORATION · MH-P02-SA</span><h3>沙特食品采购渠道 ↔ ${escapeHTML(s?.name||'中国供应商')}</h3><p>对接目标：确认冻干果蔬OEM产品规格、报价范围、样品安排与下一步责任人。</p></div><div class="p02-intro-seal">双向确认<br/><b>LOCAL ONLY</b></div></div>
 <div class="p02-path-choice"><button type="button" data-action="p02-path" data-path="advance" class="p02-path ${path==='advance'?'active':''}"><b>↗ 成功推进路径</b><small>会议 → 报价 → 打样 → 反馈</small></button><button type="button" data-action="p02-path" data-path="blocked" class="p02-path ${path==='blocked'?'active':''}"><b>⊘ 合作受阻路径</b><small>条件变化 → 暂停 → 重新匹配</small></button></div>
 ${path==='advance'?`<div class="p02-milestones"><div class="p02-milestone-head"><h3>合作事项模拟看板</h3><span>${st.milestones.length}/${DEMO_MILESTONES.length} 个演示节点</span></div>${DEMO_MILESTONES.map((m,i)=>`<div class="p02-milestone ${st.milestones.includes(i)?'done':''}"><span>${st.milestones.includes(i)?'✓':String(i+1).padStart(2,'0')}</span><div><b>${m}</b><small>${st.milestones.includes(i)?'本地模拟已完成':'尚未模拟完成 · 无真实动作'}</small></div>${st.milestones.includes(i)?'<span class="p02-done">已记录</span>':i===st.milestones.length?button(st.role==='operator'?'模拟完成':'运营角色执行','milestone','small',`data-index="${i}" ${st.role==='operator'?'':'disabled'}`):'<span class="p02-lock">等待上一节点</span>'}</div>`).join('')}</div>`:path==='blocked'?`<div class="p02-blocked-case"><div class="p02-blocked-symbol">!</div><h3>模拟商务受阻：付款条件无法达成共识</h3><p>买方提出更长账期，而供应方只接受较短账期。平台应记录分歧、暂停推进，不得将“已引荐”误写为“签约”。</p><div class="p02-response-grid"><div><b>建议动作 A</b><span>重新澄清预付款及信用条件</span></div><div><b>建议动作 B</b><span>回到候选供应链，寻找条件更合适的资源</span></div></div>${button('回到候选供应商','reselect','quiet')}</div>`:`<div class="p02-alert soft"><b>选择一种模拟路径：</b>体验从商务会谈到样品评审的推进逻辑，或查看一次真实合作可能遇到的障碍应该如何处理。</div>`}
 <div class="p02-alert soft"><b>业务边界：</b>所有节点均为虚构演示。平台不代签合同、代收货款，也不提供真实信用或物流担保。</div>`}

function roleContext(){const r=roles[p02State.role];return `<div class="p02-context"><div class="p02-context-icon">${r.icon}</div><div><span class="p02-mini">${r.en.toUpperCase()}</span><b>${r.name} · ${r.lead}</b><small>${r.small}</small></div><div class="p02-role-switch">${Object.entries(roles).map(([key,v])=>`<button type="button" class="${p02State.role===key?'on':''}" data-action="p02-role" data-role="${key}">${v.name}</button>`).join('')}</div></div>`}
function roleGuide(){const st=p02State;const notes={buyer:['你的角色：明确产品规格、MOQ、交期与必要认证，避免模糊询盘。','你的角色：根据可解释条件选择一个可以进入审核的供货候选。','你的角色：查看证据状态并等待生态运营方完成模拟复核。','你的角色：仅可决定买方是否同意进一步接洽，不能代表供应方同意。','你的角色：查看双方合作进展，评价候选资料是否满足采购需要。'],supplier:['你的角色：查看经许可的采购摘要，不能替海外买方修改采购条件。','你的角色：了解自己的供货能力是否适配，无法代表采购方选择供应商。','你的角色：查看材料差距，实际资质仍须由企业提供并接受适当核验。','你的角色：仅可决定供应方是否同意接洽，不能替买方同意。','你的角色：关注询价、技术资料及样品环节，避免模糊商务承诺。'],operator:['你的角色：核对需求是否有责任人、有效窗口和真实采购授权。','你的角色：复核硬性条件与证据缺口，而不是只看匹配分数。','你的角色：模拟完成证据审核；真实业务中需留审计与专业人员责任。','你的角色：协调双方分别确认意愿，运营人员不能替双方点击同意。','你的角色：维护商务里程碑与受阻原因，不把合作意向写成订单。']};return `<div class="p02-role-guide"><span class="p02-role-guide-tag">${roles[st.role].name}视角</span><span>${notes[st.role][st.step]}</span></div>`;}
function rightPanel(){const st=p02State,c=st.criteria,x=evaluateCandidates(c),chosen=currentSupplier();return `<aside class="p02-aside" aria-label="演示状态说明"><div class="p02-aside-card"><div class="p02-overline">LIVE DEMO SNAPSHOT</div><h3>当前采购条件</h3><dl><div><dt>目标市场</dt><dd>沙特阿拉伯</dd></div><div><dt>产品</dt><dd>冻干果蔬 OEM</dd></div><div><dt>起订需求</dt><dd>${num(c.quantity)} 箱</dd></div><div><dt>最大交期</dt><dd>${c.maxLeadDays} 天</dd></div><div><dt>清真材料</dt><dd>${c.requireHalal?'必需':'非必需'}</dd></div><div><dt>英文包装</dt><dd>${c.requireEnglish?'必需':'非必需'}</dd></div></dl><div class="p02-aside-rule"></div><div class="p02-aside-stat"><b>${x.filter(y=>y.status==='qualified').length}</b><span>符合模拟硬条件的候选</span></div><div class="p02-aside-selected"><small>当前所选</small><strong>${chosen?escapeHTML(chosen.name):'尚未选择'}</strong></div></div><div class="p02-aside-help"><b>演示边界</b><p>样本采购需求、供应商、证据、双方回复及商务结果全部为虚构；计算由本地规则完成，无真实 AI API 或外部触达。</p>${button('重置全部演示','reset','quiet')}</div></aside>`}
export function renderP02Journey(){const st=p02State;const screen=[criteriaPanel,matchList,evidenceReview,consentPanel,collaborationPanel][st.step];let allowContinue=st.step===0||st.step===1&&canReview(st.selected,st.criteria)||st.step===2&&st.reviewed||st.step===3&&canIntroduce({...st,step:3});const forwardLabels=['查看AI候选 →','进入证据审核 →','进入双向意愿 →','开始合作演示 →'];return `<div class="p02-workspace"><div class="p02-env"><span class="p02-dot"></span> 原型 P0.2 · 全部企业及采购场景均为虚构 · 不对外联系</div>${roleContext()}${roleGuide()}
 <div class="p02-workspace-heading"><div><div class="p02-overline">GUIDED BUSINESS JOURNEY / 受控演示</div><h1>一条海外采购需求，五步走向可信合作。</h1><p>跟随同一条虚构的沙特采购案例，体验条件调整、证据判断、双向同意与实际商务流程设计。</p></div><span class="p02-progress-indicator">${String(st.step+1).padStart(2,'0')} <small>/ 05</small></span></div>
 <div class="p02-progress-strip" role="list" aria-label="演示流程">${stageNames.map((name,i)=>`<button type="button" class="p02-step ${i===st.step?'active':i<st.step?'done':'future'}" data-action="p02-step" data-index="${i}" ${i>st.step?'disabled':''} aria-current="${i===st.step?'step':'false'}"><span>${i<st.step?'✓':String(i+1).padStart(2,'0')}</span><b>${name}</b></button>`).join('')}</div>
 <div class="p02-workspace-grid"><section class="p02-main p02-panel">${screen()}
 <div class="p02-screen-foot">${button('← 上一步','back','quiet',st.step===0?'disabled':'')}
 <div class="p02-foot-right"><span>${st.step===1&&!st.selected?'请选择一个符合条件的候选':st.step===2&&!st.reviewed?'先完成模拟人工复核':st.step===3&&!allowContinue?'需要双方同意才可继续':''}</span>${st.step<4?button(forwardLabels[st.step],'next','primary',allowContinue?'':'disabled'):button('重新体验','reset','quiet')}</div></div></section>${rightPanel()}</div></div>`}

export function handleP02Action(trigger,{navigate,render,toast}){const kind=trigger.dataset.action; if(!kind?.startsWith('p02-'))return false;
 const st=p02State;const message=s=>toast?.(s);const go=()=>render();
 switch(kind){
 case 'p02-choose-role': st.role=trigger.dataset.role in roles?trigger.dataset.role:'buyer';st.step=0;navigate('journey');break;
 case 'p02-launch':st.step=0;navigate('journey');break;
 case 'p02-goto-radar':navigate('radar');break;
 case 'p02-role':st.role=trigger.dataset.role in roles?trigger.dataset.role:st.role;go();break;
 case 'p02-edit':st.step=0;go();break;
 case 'p02-step':{const i=Number(trigger.dataset.index);if(i>=0&&i<=st.step){st.step=i;go();}break;}
 case 'p02-back':if(st.step>0){st.step--;go();}break;
 case 'p02-next':{
   if(st.step===0){st.step=1;go();break;}
   if(st.step===1&&!canReview(st.selected,st.criteria)){message('请先选择符合全部硬条件的候选供应商');break;}
   if(st.step===2&&!st.reviewed){message('必须先完成演示证据审核');break;}
   if(st.step===3&&!canIntroduce({...st,step:3})){message('双方未全部同意或存在拒绝，禁止引荐');break;}
   if(st.step===3)st.introduced=true;
   st.step=Math.min(4,st.step+1);go();break;
 }
 case 'p02-select':{
   const id=trigger.dataset.supplier;if(st.role==='supplier'){message('供应商不能替买方选择合作对象');break;}if(!canReview(id,st.criteria)){message('该候选存在硬条件或证据障碍，暂不可选');break;}
   if(st.selected!==id){st.selected=id;st.reviewed=false;st.buyerApproved=false;st.supplierApproved=false;st.buyerRejected=false;st.supplierRejected=false;st.introduced=false;st.milestones=[];st.path='open';}go();break;}
 case 'p02-review':if(st.step===2&&st.role==='operator'&&canReview(st.selected,st.criteria)){st.reviewed=true;go();}break;
 case 'p02-approve':{if(st.step!==3||!st.reviewed)break;const party=trigger.dataset.party;if(st.role!==party){message('当前角色不能替另一方表示同意');break;}if(!['buyer','supplier'].includes(party)||st[party+'Rejected'])break;st[party+'Approved']=true;go();break;}
 case 'p02-reject':{if(st.step!==3||!st.reviewed)break;const party=trigger.dataset.party;if(st.role!==party){message('当前角色不能替另一方表示同意');break;}if(!['buyer','supplier'].includes(party))break;st[party+'Rejected']=true;st[party+'Approved']=false;go();break;}
 case 'p02-clear-rejection':if(st.step===3){st.buyerRejected=false;st.supplierRejected=false;st.buyerApproved=false;st.supplierApproved=false;go();}break;
 case 'p02-path':if(st.step===4&&st.introduced&&['advance','blocked'].includes(trigger.dataset.path)){st.path=trigger.dataset.path;go();}break;
 case 'p02-milestone':{const i=Number(trigger.dataset.index);if(st.role==='operator'&&st.step===4&&st.introduced&&st.path==='advance'&&i===st.milestones.length&&i<DEMO_MILESTONES.length){st.milestones.push(i);go();}break;}
 case 'p02-reselect':st.step=1;st.selected=null;st.reviewed=false;st.buyerApproved=false;st.supplierApproved=false;st.introduced=false;st.path='open';st.milestones=[];go();break;
 case 'p02-reset':Object.assign(st,createInitialState());go();message('已重置本地模拟案例；不涉及真实客户数据');break;
 default:break;
 }return true;}
export function handleP02Change(target,render){const st=p02State,c=st.criteria;if(st.role!=='buyer')return false;let changed=false;
 if(target.id==='p02-quantity'){c.quantity=Number(target.value);changed=true;}
 else if(target.id==='p02-lead'){c.maxLeadDays=Number(target.value);changed=true;}
 else if(target.id==='p02-halal'){c.requireHalal=target.checked;changed=true;}
 else if(target.id==='p02-english'){c.requireEnglish=target.checked;changed=true;}
 if(changed&&st.role==='buyer'){resetAfterCriteriaEdit(st);render();}else if(changed){render();}return changed;}
