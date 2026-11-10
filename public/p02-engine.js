/** F2H P0.2: deterministic, synthetic-only scenario engine. Never implies verified real-world facts. */
export const SCENARIO_META = Object.freeze({kind:'FICTIONAL_SCENARIO',version:'P0.2',liveAI:false,liveBuyers:false,externalActions:false});
export const DEMO_SUPPLIERS=Object.freeze([
  {id:'A',name:'华南冻干食品制造商 A',place:'中国 · 广东',moq:1500,leadDays:35,halal:'simulated-reviewed',englishPackaging:true,product:true,market:'沙特阿拉伯',evidence:'模拟证据 E-A01 · 清真材料（虚构）',evidenceDate:'2026-11-03',note:'具备OEM与英文包装样例；演示材料已做模拟审核'},
  {id:'B',name:'华东果蔬出口企业 B',place:'中国 · 浙江',moq:800,leadDays:28,halal:'unknown',englishPackaging:true,product:true,market:'沙特阿拉伯',evidence:'模拟证据 E-B02 · 认证材料待提供',evidenceDate:'暂无',note:'起订量与交期灵活，关键认证材料尚待核实'},
  {id:'C',name:'华中食品OEM工厂 C',place:'中国 · 湖北',moq:3000,leadDays:42,halal:'simulated-reviewed',englishPackaging:true,product:true,market:'沙特阿拉伯',evidence:'模拟证据 E-C03 · 清真材料（虚构）',evidenceDate:'2026-11-02',note:'适合更大批次需求；现有样例采购量不足起订量'},
  {id:'D',name:'华北果蔬加工企业 D',place:'中国 · 河北',moq:1200,leadDays:30,halal:'simulated-reviewed',englishPackaging:false,product:true,market:'沙特阿拉伯',evidence:'模拟证据 E-D04 · 包装资料待调整',evidenceDate:'2026-11-05',note:'交期适配，但当前没有符合要求的英文包装演示资料'}
]);
export const DEFAULT_CRITERIA=Object.freeze({quantity:1800,maxLeadDays:45,requireHalal:true,requireEnglish:true});
export const DEMO_MILESTONES=Object.freeze(['合作需求澄清','首次视频会议','询价与技术资料','打样与评审','合作复盘']);
export function assessSupplier(s,criteria){
  const checks=[
    {key:'product',label:'产品能力',status:s.product?'pass':'fail',detail:s.product?'冻干果蔬产品方向一致':'产品类别不符'},
    {key:'moq',label:'起订量 MOQ',status:criteria.quantity>=s.moq?'pass':'fail',detail:`演示起订量 ${s.moq.toLocaleString('zh-CN')} 箱；采购 ${criteria.quantity.toLocaleString('zh-CN')} 箱`},
    {key:'leadDays',label:'预计交期',status:s.leadDays<=criteria.maxLeadDays?'pass':'fail',detail:`样例交期 ${s.leadDays} 天；需求上限 ${criteria.maxLeadDays} 天`},
    {key:'halal',label:'清真认证材料',status:!criteria.requireHalal?'optional':s.halal==='simulated-reviewed'?'pass':s.halal==='unknown'?'unknown':'fail',detail:!criteria.requireHalal?'买方已取消此硬条件':s.halal==='simulated-reviewed'?'仅为虚构材料的模拟复核状态':'未获得可审核材料'},
    {key:'english',label:'英文包装',status:!criteria.requireEnglish?'optional':s.englishPackaging?'pass':'fail',detail:!criteria.requireEnglish?'买方已取消此硬条件':s.englishPackaging?'有英文包装演示资料':'未满足英文包装要求'}
  ];
  const fail=checks.some(c=>c.status==='fail');
  const pending=checks.some(c=>c.status==='unknown');
  const status=fail?'blocked':pending?'pending':'qualified';
  return {supplier:s,checks,status,reason:fail?'存在不满足的硬性条件':pending?'关键条件未核实，暂不能列为合格候选':'演示条件均符合，仍需真实核验',passCount:checks.filter(c=>c.status==='pass').length};
}
export function evaluateCandidates(criteria=DEFAULT_CRITERIA){return DEMO_SUPPLIERS.map(s=>assessSupplier(s,criteria)).sort((a,b)=>({qualified:0,pending:1,blocked:2})[a.status]-({qualified:0,pending:1,blocked:2})[b.status]||b.passCount-a.passCount)}
export function canReview(selected,criteria){return !!selected&&!!evaluateCandidates(criteria).find(x=>x.supplier.id===selected&&x.status==='qualified')}
export function canIntroduce({step,selected,reviewed,buyerApproved,supplierApproved,buyerRejected,supplierRejected,criteria}){return step>=3&&canReview(selected,criteria)&&reviewed&&buyerApproved&&supplierApproved&&!buyerRejected&&!supplierRejected}
export function createInitialState(){return {role:'buyer',step:0,criteria:{...DEFAULT_CRITERIA},selected:null,reviewed:false,buyerApproved:false,supplierApproved:false,buyerRejected:false,supplierRejected:false,introduced:false,path:'open',milestones:[],supplierDecision:null};}
export function resetAfterCriteriaEdit(state){state.selected=null;state.reviewed=false;state.buyerApproved=false;state.supplierApproved=false;state.buyerRejected=false;state.supplierRejected=false;state.introduced=false;state.path='open';state.milestones=[];if(state.step>1)state.step=1;}
