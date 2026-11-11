import test from 'node:test';
import assert from 'node:assert/strict';
import {ROLE_INFO,NAV_BY_ROLE,resolveJourneyStep,activeMobileTab} from '../public/p03-mobile-config.js';

test('three roles have five distinct contextual tabs',()=>{
 assert.deepEqual(Object.keys(ROLE_INFO),['buyer','supplier','operator']);
 for(const [role,nav] of Object.entries(NAV_BY_ROLE)){
  assert.equal(nav.length,5,role);
  assert.equal(new Set(nav.map(x=>x.key)).size,5);
  assert.equal(nav.at(-1).key,'more');
 }
 assert.notDeepEqual(NAV_BY_ROLE.buyer.map(x=>x.label),NAV_BY_ROLE.supplier.map(x=>x.label));
 assert.notDeepEqual(NAV_BY_ROLE.operator.map(x=>x.label),NAV_BY_ROLE.supplier.map(x=>x.label));
});
test('a bottom tab cannot skip forward beyond current step',()=>{
 for(let i=0;i<5;i++)for(let target=0;target<5;target++){
  assert.equal(resolveJourneyStep(i,target),Math.min(i,target));
 }
 assert.equal(resolveJourneyStep(2,-1),2);
 assert.equal(resolveJourneyStep(3,999),3);
});
test('buyer bottom tab reflects the stage of the same journey',()=>{
 assert.equal(activeMobileTab('buyer','overview',0),'home');
 assert.equal(activeMobileTab('buyer','journey',0),'demand');
 assert.equal(activeMobileTab('buyer','journey',1),'supply');
 assert.equal(activeMobileTab('buyer','journey',2),'supply');
 assert.equal(activeMobileTab('buyer','journey',3),'cooperation');
});
test('supplier and operator tabs distinguish their business perspectives',()=>{
 assert.equal(activeMobileTab('supplier','radar',0),'radar');
 assert.equal(activeMobileTab('supplier','suppliers',0),'capability');
 assert.equal(activeMobileTab('supplier','journey',3),'cooperation');
 assert.equal(activeMobileTab('operator','operations',0),'overview');
 assert.equal(activeMobileTab('operator','journey',1),'matching');
 assert.equal(activeMobileTab('operator','journey',2),'review');
 assert.equal(activeMobileTab('operator','journey',4),'collaboration');
});
