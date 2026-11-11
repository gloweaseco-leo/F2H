/** Mobile-only navigation and conspicuous prototype identity switcher. */
import {p02State} from './p02.js';
import {ROLE_INFO,NAV_BY_ROLE,resolveJourneyStep,activeMobileTab} from './p03-mobile-config.js';

const isPhone=window.matchMedia('(max-width:690px)');
const bar=document.getElementById('p03-role-banner');
const bottom=document.getElementById('p03-bottom-nav');
const backdrop=document.getElementById('p03-overlay');
const sheet=document.getElementById('p03-sheet');
const CONTENT={
  buyer:{overview:'从一条模拟采购需求出发，体验筛选、对比和可信引荐。',demands:'在真实采购前，先确认需求条件与采购授权。',radar:'查看潜在供应机会时，要同时看硬约束和证据缺口。',suppliers:'供应商名录仅供模拟展示；深入比较请进入五步撮合故事。'},
  supplier:{overview:'供应方可先浏览海外商机，再判断自己能否供货。',radar:'海外机会全部为模拟样本，实际响应之前必须确认采购真实性。',suppliers:'这里展示供应能力样本；正式产品应由资源方控制资料与授权。',demands:'先理解采购规格、交期、MOQ及待验证条件，再决定是否响应。'},
  operator:{operations:'关注待核验机会、符合条件的候选及双方确认进度。',radar:'运营角色要复核硬性条件和资料来源，而不是只看匹配分数。',suppliers:'可组织供应商资料核验，但资料所有权始终属于供方。',trust:'记录证据缺口、人工判断和双方授权，拒绝越级引荐。'}
};
const glyphs={
 house:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
 'clipboard-list':'<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 11h6M9 15h6"/>',
 factory:'<path d="M3 21V10l6 4v-4l6 4V6h6v15z"/><path d="M7 18h2m3 0h2m3 0h2"/>',
 handshake:'<path d="m2 9 5-5 5 2 2-1 4 2 4 4-5 5-4-2-4 2-7-5"/><path d="m8 11 5-5m0 8 3 3m-6-1 3 3"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 radar:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 4"/><circle cx="12" cy="12" r="2"/>',
 'shield-check':'<path d="m12 2 9 4v6c0 5-3.4 8.7-9 10-5.6-1.3-9-5-9-10V6z"/><path d="m8 12 2.5 2.5L16 9"/>',
 'scan-search':'<path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5"/><circle cx="11" cy="11" r="4"/><path d="m14 14 4 4"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5zm-9 10 9 5 9-5m-18 5 9 5 9-5"/>'
};
const svg=name=>`<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[name]||glyphs.layers}</svg>`;
let activeSheet=null;
let previousFocus=null;
let oldOverflow='';
let rendering=false;
const role=()=>ROLE_INFO[p02State.role]?p02State.role:'buyer';
const page=()=>location.hash.slice(1)||'overview';
function notify(text){const t=document.getElementById('toast');if(!t)return;t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}
function navigateTo(destination){
  const newHash='#'+destination;
  if(location.hash===newHash){window.dispatchEvent(new Event('hashchange'));}
  else{location.hash=newHash;}
  window.scrollTo({top:0,behavior:'instant'});
}
function renderHeader(){
  const info=ROLE_INFO[role()];
  bar.innerHTML=`<button type="button" class="p03-role-trigger" data-p03="roles" aria-label="当前正在体验：${info.name}。请切换你的身份"><span class="p03-role-leading">${svg(info.icon)}</span><span class="p03-role-text"><span class="p03-role-eyebrow"><i class="p03-role-signal" aria-hidden="true"></i> 当前正在体验</span><strong class="p03-role-prompt">请切换你的身份</strong><span class="p03-role-current">当前身份：<b>${info.name}</b><span class="p03-demo-tag">演示</span></span></span><span class="p03-role-change" aria-hidden="true"><span class="p03-role-chevron">⌄</span></span></button>`;
}
function renderBottom(){
  const roleKey=role();const current=activeMobileTab(roleKey,page(),p02State.step);
  bottom.innerHTML=`<div class="p03-bottom-inner">${NAV_BY_ROLE[roleKey].map(item=>`<button type="button" class="p03-bottom-item ${current===item.key?'active':''}" data-p03="tab" data-tab="${item.key}" ${current===item.key?'aria-current="page"':''} aria-label="${item.label}">${svg(item.icon)}<span>${item.label}</span></button>`).join('')}</div>`;
}
function renderPageGuide(){
  const main=document.getElementById('view'); if(!main)return;
  const old=main.querySelector(':scope > .p03-context-card');
  if(!isPhone.matches || page()==='journey'){old?.remove();return;}
  const info=ROLE_INFO[role()];
  const note=CONTENT[role()]?.[page()] || info.description;
  const title=page()==='overview'||page()==='operations'?info.title:`${info.name} · ${info.tagline}`;
  const contextKey=role()+':'+page();
  if(old?.dataset.contextKey===contextKey)return;
  const html=`<div class="p03-context-card" data-context-key="${contextKey}" aria-label="当前角色的业务提示"><div><span class="p03-context-tag">${info.name}视角 · 模拟体验</span><strong>${title}</strong><p>${note}</p></div><button type="button" data-p03="guide" aria-label="进入五步撮合故事">体验撮合流程 ↗</button></div>`;
  if(old) old.outerHTML=html;
  else main.insertAdjacentHTML('afterbegin',html);
}
function sync(){
  if(rendering)return; rendering=true;
  try{
    if(!isPhone.matches){const old=document.querySelector('#view > .p03-context-card');old?.remove();closeSheet(false);return;}
    renderHeader();renderBottom();renderPageGuide();
  }finally{rendering=false;}
}
function renderSheet(which){
  if(which==='roles'){
    sheet.innerHTML=`<div class="p03-sheet-grip" aria-hidden="true"></div><div class="p03-sheet-heading"><div><span>体验身份 · 仅影响原型展示</span><h2 id="p03-sheet-title">请选择你要体验的角色</h2></div><button type="button" class="p03-sheet-close" data-p03="close" aria-label="关闭角色选择">×</button></div><p class="p03-sheet-intro">你可以随时切换视角，观察同一条模拟采购故事中各方能看见、能操作的内容。</p><div class="p03-roles">${Object.entries(ROLE_INFO).map(([key,info])=>`<button type="button" class="p03-role-option ${role()===key?'selected':''}" data-p03="select-role" data-role="${key}" aria-pressed="${role()===key}"><span class="p03-option-icon">${svg(info.icon)}</span><span><strong>${info.name}</strong><small>${info.tagline}</small><em>${info.hint}</em></span><span class="p03-option-mark">${role()===key?'✓':'→'}</span></button>`).join('')}</div><p class="p03-sheet-fine">全部为虚构数据。切换角色不是账号登录，不代表真实权限验证。</p>`;
  }else{
    const more=[['journey','完整撮合体验'],['radar','AI 商机雷达'],['demands','海外采购需求'],['suppliers','中国供应链'],['trust','信任与核验'],['collaboration','商务协作看板'],['operations','生态经营']];
    sheet.innerHTML=`<div class="p03-sheet-grip" aria-hidden="true"></div><div class="p03-sheet-heading"><div><span>${ROLE_INFO[role()].name} · 手机更多入口</span><h2 id="p03-sheet-title">更多业务视图</h2></div><button type="button" class="p03-sheet-close" data-p03="close" aria-label="关闭更多菜单">×</button></div><div class="p03-extra-list">${more.map(([key,label])=>`<button type="button" data-p03="page" data-page="${key}"><span>${label}</span><span aria-hidden="true">›</span></button>`).join('')}</div><button type="button" class="p03-switch-extra" data-p03="roles">${svg('globe')} 切换演示角色</button><p class="p03-sheet-fine">当前为P0.3手机交互原型；不连接真实账号、采购商、企业数据或消息发送。</p>`;
  }
}
function openSheet(which){if(!isPhone.matches)return;if(!activeSheet){previousFocus=document.activeElement;oldOverflow=document.body.style.overflow;}activeSheet=which;renderSheet(which);backdrop.hidden=false;sheet.hidden=false;document.body.style.overflow='hidden';sheet.querySelector('.p03-sheet-close')?.focus();}
function closeSheet(restore=true){if(!activeSheet)return;activeSheet=null;sheet.hidden=true;backdrop.hidden=true;document.body.style.overflow=oldOverflow;if(restore)previousFocus?.focus?.();}
function handleTab(key){
  const cfg=NAV_BY_ROLE[role()].find(t=>t.key===key);if(!cfg)return;
  if(key==='more'){openSheet('more');return;}
  if(cfg.page==='journey'&&Number.isInteger(cfg.step)){
    const current=p02State.step;
    p02State.step=resolveJourneyStep(current,cfg.step);
    if(cfg.step>current)notify('请先完成当前模拟步骤，不能跳过核验或双方授权。');
  }
  navigateTo(cfg.page);
}
function switchRole(next){
  if(!ROLE_INFO[next])return;
  closeSheet(false);p02State.role=next;
  navigateTo(next==='operator'?'operations':'overview');
  sync();notify('已切换至'+ROLE_INFO[next].name+'体验视角；没有登录真实账户。');
}
document.addEventListener('click',event=>{
 const hit=event.target.closest('[data-p03]'); if(!hit||!isPhone.matches)return;
 const kind=hit.dataset.p03;
 if(kind==='roles')openSheet('roles');
 else if(kind==='close')closeSheet();
 else if(kind==='tab')handleTab(hit.dataset.tab);
 else if(kind==='select-role')switchRole(hit.dataset.role);
 else if(kind==='page'){const target=hit.dataset.page;closeSheet(false);navigateTo(target);}
 else if(kind==='guide')handleTab(role()==='operator'?'matching':role()==='buyer'?'demand':'cooperation');
});
backdrop.addEventListener('click',()=>closeSheet());
document.addEventListener('keydown',event=>{
 if(!activeSheet)return;
 if(event.key==='Escape'){event.preventDefault();closeSheet();return;}
 if(event.key==='Tab'){
   const focusables=[...sheet.querySelectorAll('button:not([disabled])')];if(!focusables.length)return;
   const first=focusables[0],last=focusables.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});
const view=document.getElementById('view');
new MutationObserver(sync).observe(view,{childList:true});
isPhone.addEventListener('change',sync);
window.addEventListener('hashchange',()=>requestAnimationFrame(sync));
// Existing P0.2 role buttons update shared role state and rerender #view; observer syncs header and bottom navigation.
sync();
