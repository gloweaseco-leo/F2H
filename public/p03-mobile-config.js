/** P0.3 mobile-only role experience: display navigation, not authentication. */
export const ROLE_INFO = Object.freeze({
  buyer: {name:'海外采购方',title:'我的采购工作台',tagline:'我想找到适配、可信的中国供应商',description:'调整采购条件，对照候选能力与证据，再决定是否同意对接。',hint:'采购条件由买方调整；只有双方分别同意才能进入引荐演示。',icon:'globe'},
  supplier: {name:'中国供应商',title:'我的海外商机',tagline:'我想找到值得响应的海外采购机会',description:'查看采购要求和自己的供货能力，在合作故事中只表达供方自己的意愿。',hint:'供应方不能代表买方修改采购要求或同意引荐。',icon:'factory'},
  operator: {name:'平台运营方',title:'我的生态运营工作台',tagline:'我想把供需资源转化为可信合作',description:'查看商机匹配、核对证据，再协调双方意愿及商务跟进。',hint:'运营方可以演示资料核验，但不能替买卖双方同意。',icon:'layers'}
});
export const NAV_BY_ROLE = Object.freeze({
  buyer: [
    {key:'home',label:'首页',icon:'house',page:'overview'},
    {key:'demand',label:'我的采购',icon:'clipboard-list',page:'journey',step:0},
    {key:'supply',label:'找供应商',icon:'factory',page:'journey',step:1},
    {key:'cooperation',label:'合作',icon:'handshake',page:'journey',step:3},
    {key:'more',label:'更多',icon:'menu'}
  ],
  supplier: [
    {key:'home',label:'首页',icon:'house',page:'overview'},
    {key:'radar',label:'海外商机',icon:'radar',page:'radar'},
    {key:'capability',label:'供货能力',icon:'factory',page:'suppliers'},
    {key:'cooperation',label:'合作',icon:'handshake',page:'journey',step:3},
    {key:'more',label:'更多',icon:'menu'}
  ],
  operator: [
    {key:'overview',label:'总览',icon:'house',page:'operations'},
    {key:'review',label:'待审核',icon:'shield-check',page:'journey',step:2},
    {key:'matching',label:'智能撮合',icon:'scan-search',page:'journey',step:1},
    {key:'collaboration',label:'协作管理',icon:'handshake',page:'journey',step:4},
    {key:'more',label:'更多',icon:'menu'}
  ]
});
/** Never skip the original P0.2 evidence or bilateral-consent gates. */
export function resolveJourneyStep(current, requested) {
  if (!Number.isInteger(requested) || requested < 0 || requested > 4) return current;
  return requested <= current ? requested : current;
}
export function activeMobileTab(role,page,step){
  if(page==='journey'){
    if(role==='buyer') return step===0?'demand':step<=2?'supply':'cooperation';
    if(role==='supplier') return 'cooperation';
    return step===2?'review':step>=3?'collaboration':'matching';
  }
  if(role==='operator')return page==='operations'?'overview':null;
  if(page==='overview')return 'home';
  if(role==='supplier')return page==='radar'?'radar':page==='suppliers'?'capability':null;
  return null;
}
