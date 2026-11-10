/** Transparent synthetic matching rules for prototype: NOT an actual trained AI. */
export const MARKET_LABELS = ['沙特阿拉伯','荷兰','肯尼亚','阿联酋','德国'];
export function scoreSupplier(need, supplier) {
  const reasons=[];
  let score=0;
  const hardReject=[];
  if (need.category && supplier.category !== need.category) hardReject.push('产业类别不符');
  else {score+=42; reasons.push('产业类别一致');}
  if (supplier.markets.includes(need.region)) {score+=28;reasons.push('申报覆盖目标市场');}
  else {score-=12; reasons.push('目标市场经验未知');}
  const overlap=need.tags.filter(tag=>supplier.tags.includes(tag));
  score += Math.min(overlap.length*10,20);
  if(overlap.length) reasons.push(`匹配标签：${overlap.join('、')}`);
  if(supplier.verified === '部分资料待核验') score+=5;
  else reasons.push('能力证明尚未核验');
  score=Math.max(0,Math.min(100,score));
  return {supplier,score,reasons,hardReject,eligible:hardReject.length===0};
}
export function recommendSuppliers(need,suppliers,limit=3){
  return suppliers.map(s=>scoreSupplier(need,s)).filter(m=>m.eligible).sort((a,b)=>b.score-a.score).slice(0,limit);
}
export function cannotDisclose(stage, approvals) {
  return !(stage >= 3 && approvals?.buyer === true && approvals?.supplier === true);
}
export function canPromoteHypothesis(candidate) {
  return candidate?.operatorReviewed === true && candidate?.sourceVerified === true && candidate?.blockingUnknowns?.length === 0;
}
