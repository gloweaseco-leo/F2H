import test from 'node:test';import assert from 'node:assert/strict';
import { needs, suppliers, demoMeta } from '../public/data.js';
import {scoreSupplier,recommendSuppliers,cannotDisclose,canPromoteHypothesis} from '../public/matching.js';
test('fixtures clearly state fictional non-live data',()=>{assert.equal(demoMeta.source,'FICTIONAL_DEMO');assert.equal(demoMeta.liveAI,false);assert.equal(demoMeta.externalActions,false);});
test('hard industry mismatch blocks candidate',()=>{const match=scoreSupplier(needs[0],suppliers[1]);assert.equal(match.eligible,false);assert.ok(match.hardReject.length);});
test('market fit improves score with explainable reasons',()=>{const match=scoreSupplier(needs[3],suppliers[3]);assert.equal(match.eligible,true);assert.ok(match.reasons.some(r=>r.includes('目标市场')));});
test('recommendations contain only eligible suppliers',()=>{for(const n of needs)for(const m of recommendSuppliers(n,suppliers))assert.equal(m.supplier.category,n.category);});
test('no disclosure until BOTH approvals and intro stage',()=>{assert.equal(cannotDisclose(2,{buyer:true,supplier:true}),true);assert.equal(cannotDisclose(4,{buyer:true,supplier:false}),true);assert.equal(cannotDisclose(4,{buyer:true,supplier:true}),false);});
test('a generated hypothesis never promotes itself',()=>{assert.equal(canPromoteHypothesis({operatorReviewed:false,sourceVerified:true,blockingUnknowns:[]}),false);assert.equal(canPromoteHypothesis({operatorReviewed:true,sourceVerified:false,blockingUnknowns:[]}),false);assert.equal(canPromoteHypothesis({operatorReviewed:true,sourceVerified:true,blockingUnknowns:['unknown certification']}),false);assert.equal(canPromoteHypothesis({operatorReviewed:true,sourceVerified:true,blockingUnknowns:[]}),true);});
