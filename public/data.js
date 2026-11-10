/** Entirely fictional prototype records. No actual buyer, vendor, deal or validation implied. */
export const demoMeta = Object.freeze({source: 'FICTIONAL_DEMO', version: '0.1', liveAI: false, externalActions: false});
export const needs = [
  {id:'MH-26001',title:'中东连锁渠道｜低糖果蔬零食年度寻源',subtitle:'食品与消费品 · 海外渠道采购',region:'沙特阿拉伯',regionCode:'SA',category:'食品加工',volume:'首批 2×20ft 试单意向',deadline:'2026-12-18',buyer:'海湾区域渠道商 · 演示匿名主体',requirements:['出口食品生产资质','目标市场标签与进口合规评估','可提供OEM/ODM','MOQ ≤ 2,000箱'], tags:['清真渠道','OEM','冻干果蔬'],confidence:84,status:'待人工复核',stage:1, signal:'模拟采购需求',source:'演示录入',sourceDate:'2026-11-08',owner:'海外需求运营', supplierIds:['SUP-001','SUP-005'], unknown:['采购方签约主体尚未核实','目标市场进口要求待专业确认'], narrative:'候选产品及代工能力与需求存在互补关系，但采购真实性与进口准入尚未独立核验。',next:'确认买方采购授权，再联系供应商核验产品与交期。'},
  {id:'MH-26002',title:'荷兰环保渠道｜可降解食品包装合作',subtitle:'包装材料 · 经销渠道合作',region:'荷兰',regionCode:'NL',category:'绿色包装',volume:'年度框架采购 · 规格待确认',deadline:'2027-01-12',buyer:'欧洲包装分销伙伴 · 演示匿名主体',requirements:['可提供材料检测报告','可支持英文规格书','具备出口经验','食品接触适用性证明'], tags:['可降解','食品接触','欧洲渠道'],confidence:79,status:'可发起意愿确认',stage:2,signal:'模拟渠道扩张信号',source:'演示录入',sourceDate:'2026-11-07',owner:'生态运营一组',supplierIds:['SUP-002'],unknown:['材料实际符合性待核验','渠道采购意愿未确认'],narrative:'包装品类与渠道覆盖有初步关联，推荐先确认材料标准与合作意愿。',next:'以匿名商机卡向双方征求意愿，获得同意后再安排资料交换。'},
  {id:'MH-26003',title:'肯尼亚农业项目｜水处理组件供应组合',subtitle:'农业设施 · 技术部件采购',region:'肯尼亚',regionCode:'KE',category:'农业科技',volume:'示范项目采购 · 数量待确认',deadline:'2026-12-30',buyer:'东非农业设施集成商 · 演示匿名主体',requirements:['耐腐蚀材料','可提交技术参数','支持海外安装指导','明确备件计划'],tags:['水处理','农用设施','东非'],confidence:71,status:'待补充证据',stage:0,signal:'模拟项目机会',source:'演示录入',sourceDate:'2026-11-09',owner:'产业协作运营',supplierIds:['SUP-003'],unknown:['缺少正式采购规格','售后与海外安装能力待核查'],narrative:'产品能力初步相近，但技术规格缺失，尚不足以认定为合格候选。',next:'先补齐项目规格、流量与材质要求，暂不向供应方推送。'},
  {id:'MH-26004',title:'阿联酋工业分销｜小型变频水泵寻源',subtitle:'工业装备 · 海外分销',region:'阿联酋',regionCode:'AE',category:'工业设备',volume:'预计首单 300–500 台',deadline:'2026-12-24',buyer:'海湾工业渠道 · 演示匿名主体',requirements:['50Hz电气规格','英文安装手册','持续备件供应','OEM包装'],tags:['工业水泵','渠道分销','OEM'],confidence:91,status:'可发起意愿确认',stage:2,signal:'模拟采购清单',source:'演示录入',sourceDate:'2026-11-06',owner:'海外需求运营',supplierIds:['SUP-004'],unknown:['最终采购付款条件未商定','买方主体需复核'],narrative:'技术类别、出口经验和服务市场条件高度一致，建议在完成主体核验后安排定向引荐。',next:'通过分级披露卡收集双方同意，再组织首次产品技术会谈。'},
  {id:'MH-26005',title:'德国零部件渠道｜精密金属件供应替代',subtitle:'汽车及精密制造 · 备选供货商',region:'德国',regionCode:'DE',category:'精密制造',volume:'中小批量多SKU',deadline:'2027-02-05',buyer:'欧洲工业品渠道 · 演示匿名主体',requirements:['IATF 16949或等效要求待明确','稳定批次追溯','具备PPAP经验','英文技术沟通'],tags:['精密加工','供应链替代','PPAP'],confidence:67,status:'待补充证据',stage:0,signal:'模拟供货调整信号',source:'演示录入',sourceDate:'2026-11-05',owner:'产业协作运营',supplierIds:['SUP-006'],unknown:['必要行业认证口径待确认','材料图纸未取得授权'],narrative:'存在产能方向匹配，但关键资质与工程图纸仍不明确。',next:'澄清买方必须条件及保密范围，暂不推送。'}
];
export const suppliers=[
  {id:'SUP-001',name:'华南果蔬深加工制造商 A',region:'广东 · 中国',category:'食品加工',tags:['OEM','冻干果蔬','出口经验'],evidence:'产品规格书 · 演示资料',verified:'资料待核验',capabilities:['冻干零食','OEM贴牌','英文规格书'],markets:['沙特阿拉伯','阿联酋'],moq:'1,500箱起'},
  {id:'SUP-002',name:'华东环保包装制造商 B',region:'浙江 · 中国',category:'绿色包装',tags:['可降解','食品包装','英文资料'],evidence:'材料检测报告 · 演示资料',verified:'部分资料待核验',capabilities:['食品包装','模切加工','定制印刷'],markets:['荷兰','德国'],moq:'按规格确认'},
  {id:'SUP-003',name:'华南农业水处理厂商 C',region:'广东 · 中国',category:'农业科技',tags:['水处理','过滤组件','工程配套'],evidence:'产品目录 · 演示资料',verified:'资料待核验',capabilities:['农业过滤','水处理组件','工程选型'],markets:['肯尼亚'],moq:'项目制'},
  {id:'SUP-004',name:'长三角工业泵制造商 D',region:'江苏 · 中国',category:'工业设备',tags:['水泵','变频','OEM'],evidence:'产品参数表 · 演示资料',verified:'部分资料待核验',capabilities:['离心泵','变频泵','OEM包装'],markets:['阿联酋','沙特阿拉伯'],moq:'200台起'},
  {id:'SUP-005',name:'华中食品OEM工厂 E',region:'湖北 · 中国',category:'食品加工',tags:['OEM','果蔬加工','规模量产'],evidence:'产品目录 · 演示资料',verified:'资料待核验',capabilities:['食品OEM','果蔬加工','批量供货'],markets:['沙特阿拉伯'],moq:'3,000箱起'},
  {id:'SUP-006',name:'华东精密机械制造商 F',region:'安徽 · 中国',category:'精密制造',tags:['金属加工','PPAP','批次追溯'],evidence:'能力介绍 · 演示资料',verified:'资料待核验',capabilities:['精密加工','汽车零部件','PPAP文档'],markets:['德国'],moq:'根据图纸报价'}
];
export const events=[
 {time:'09:42',title:'发现跨境合作假设',detail:'AI演示规则识别了供需潜在互补关系',type:'ai'},
 {time:'10:18',title:'待人工核验',detail:'沙特食品采购商机需要确认授权与进口条件',type:'review'},
 {time:'昨天',title:'供应链资料更新',detail:'工业泵制造商补充了英文技术规格',type:'resource'},
 {time:'11月07日',title:'合作意愿待确认',detail:'荷兰包装合作双方信息尚未授权披露',type:'consent'}
];
export const categories=['全部行业','食品加工','绿色包装','农业科技','工业设备','精密制造'];
export const stages=['证据不足','人工复核','意愿确认','已引荐','商务推进','已形成成果'];
