(function () {
  const STORAGE_KEY = "ai-native-business-demo-v9";

  const dictionaries = {
    projectStatuses: [
      ["created", "项目创建"], ["proposal", "方案制作"], ["client_confirmed", "客户确认"],
      ["contract_signed", "合同签署"], ["creator_execution", "达人执行"], ["content_review", "内容审核"], ["published", "发布"],
      ["client_accepted", "客户验收"], ["settlement", "结算"], ["completed", "完成"]
    ],
    creatorStatuses: [["candidate", "候选"], ["pending_review", "待确认"], ["active", "正式"], ["inactive", "停用"]],
    collaborationStatuses: [
      ["candidate", "候选"], ["contacted", "已联系"], ["quoting", "报价中"], ["negotiating", "谈判中"],
      ["confirmed", "已确认"], ["producing", "制作中"], ["ready_to_publish", "待发布"], ["published", "已发布"],
      ["pending_settlement", "待结算"], ["settled", "已结算"]
    ],
    proposalStatuses: [["draft", "草稿"], ["internal_review", "内部审核"], ["client_review", "客户审核"], ["revision", "修改中"], ["approved", "已确认"]]
  };

  const seedState = {
    schemaVersion: 7,
    users: [
      { id: "user-jessica", name: "Jessica", role: "owner", roleLabel: "老板视角" },
      { id: "user-amy", name: "Amy", role: "project_team", roleLabel: "项目团队视角" }
    ],
    currentUserId: "user-jessica",
    permissions: {
      owner: ["all_projects", "all_partners", "company_finance", "business_analytics", "company_cash", "settings"],
      project_team: ["assigned_projects", "related_partners", "project_finance", "project_analytics", "settings"]
    },
    settings: {
      notifications: { businessExceptions: true, confirmationRequests: true, projectProgress: false },
      aiGovernance: [
        { subject: "金额与结算变化", policy: "必须人工确认", risk: "高" },
        { subject: "客户 / 达人主档新建", policy: "需要人工确认", risk: "高" },
        { subject: "普通项目备注", policy: "允许自动记录", risk: "低" },
        { subject: "低风险字段补全", policy: "允许自动更新", risk: "低" }
      ],
      businessRules: { taxRate: 0.06, overheadRule: "按项目活跃天数分摊" }
    },
    customers: [
      { id: "cust-a", name: "客户 A", status: "合作中", averageCollectionDays: 32 },
      { id: "cust-b", name: "客户 B", status: "合作中", averageCollectionDays: 45 },
      { id: "cust-c", name: "客户 C", status: "潜在风险", averageCollectionDays: 39 },
      { id: "cust-d", name: "客户 D", status: "待回款", averageCollectionDays: 61 }
    ],
    projects: [
      { id: "proj-a", name: "十月新品内容推广", customerId: "cust-a", status: "creator_execution", owner: "Jessica", team: ["Amy", "David"], executionBudget: 120000, originalBudget: 120000, currentApprovedBudget: 120000, contractValue: 180000, taxAmount: 10189, netRevenue: 169811, collectionStatus: "未到期", risk: false, startDate: "2026-09-12", endDate: "2026-11-15" },
      { id: "proj-b", name: "城市探店计划", customerId: "cust-b", status: "contract_signed", owner: "Amy", team: ["Coco"], executionBudget: 90000, originalBudget: 90000, currentApprovedBudget: 95000, contractValue: 145000, taxAmount: 8208, netRevenue: 136792, collectionStatus: "未到期", risk: false, startDate: "2026-09-20", endDate: "2026-11-30" },
      { id: "proj-c", name: "秋季品牌内容项目", customerId: "cust-c", status: "proposal", owner: "David", team: ["Jessica"], executionBudget: 100000, originalBudget: 100000, currentApprovedBudget: 100000, contractValue: 158000, taxAmount: 8943, netRevenue: 149057, collectionStatus: "未到期", risk: true, startDate: "2026-09-28", endDate: "2026-12-10" },
      { id: "proj-d", name: "年度内容合作", customerId: "cust-d", status: "settlement", owner: "Coco", team: ["David"], executionBudget: 155000, originalBudget: 155000, currentApprovedBudget: 195000, contractValue: 228000, taxAmount: 12906, netRevenue: 215094, collectionStatus: "逾期", risk: true, startDate: "2026-05-03", endDate: "2026-09-12" }
    ],
    proposals: [
      { proposalId: "proposal-a", projectId: "proj-a", currentVersion: 3, status: "approved", createdBy: "Jessica", updatedAt: "2026-09-25T16:20:00+08:00" },
      { proposalId: "proposal-b", projectId: "proj-b", currentVersion: 2, status: "approved", createdBy: "Amy", updatedAt: "2026-09-28T11:10:00+08:00" },
      { proposalId: "proposal-c", projectId: "proj-c", currentVersion: 2, status: "client_review", createdBy: "David", updatedAt: "2026-10-01T14:00:00+08:00" }
    ],
    proposalVersions: [
      { proposalId: "proposal-a", version: 1, createdBy: "Jessica", createdAt: "2026-09-15T10:00:00+08:00", summary: "新品种草方向初稿", content: "确定核心人群、内容支柱及首批达人范围。", changes: "建立内容策略框架", internalComments: "Amy：补充通勤场景。", managerFeedback: "控制首轮预算，先验证内容方向。", clientFeedback: "希望增强产品差异点。", attachments: ["策略初稿.pdf"] },
      { proposalId: "proposal-a", version: 2, createdBy: "Amy", createdAt: "2026-09-20T18:30:00+08:00", summary: "补充通勤场景与达人组合", content: "加入早晚通勤使用场景，调整达人层级组合。", changes: "增加 2 个场景，替换 1 位候选达人", internalComments: "David：成本区间合理。", managerFeedback: "明确每类达人交付物。", clientFeedback: "认可方向，希望增加小红书比重。", attachments: ["策略方案-V2.pdf", "达人候选表.xlsx"] },
      { proposalId: "proposal-a", version: 3, createdBy: "Jessica", createdAt: "2026-09-25T16:20:00+08:00", summary: "客户确认执行版", content: "确认小红书为主阵地，达人组合、交付物与发布时间表已锁定。", contentSections: [{ title: "01 项目背景", body: "客户 A 将在十月推出新品，需要在上市窗口集中建立产品认知，并以真实使用场景解释核心差异。项目覆盖内容策划、达人执行、发布与效果复盘。" }, { title: "02 项目目标", body: "在新品上市首月形成稳定的内容声量；让目标消费者理解主要使用价值；沉淀后续可以复用的高表现内容方向。" }, { title: "03 目标人群", body: "核心人群为 25–35 岁城市女性，关注高效通勤、日常护理与生活品质，主要通过小红书和短视频平台获取购买决策信息。" }, { title: "04 核心策略", body: "以真实体验代替单纯产品陈列，通过通勤、周末与旅行三个场景建立记忆点。不同达人围绕统一信息框架保留个人表达。" }, { title: "05 平台策略", body: "小红书承担搜索与决策内容，抖音承担场景化触达。发布节奏以一周集中释放为主，并保留二次剪辑素材。" }, { title: "06 达人策略", body: "Mia Notes 负责生活方式图文，LunaDaily 负责短视频叙事。选择依据包括内容方向、互动质量、历史合作效率和结算可执行性。" }, { title: "07 内容方向", body: "内容围绕新品第一印象、连续使用体验和具体场景对比展开。每篇内容必须包含明确体验细节与产品差异点。" }, { title: "08 执行排期", body: "十月上旬完成脚本与素材确认，10 月 15 日起依次发布，随后完成数据回收、客户验收和结算。" }, { title: "09 预算框架", body: "执行预算为 ¥145,000。达人费、平台费和制作供应商费用分别形成独立结算义务，公司承担费用与公共费用按统一规则进入利润计算。" }], changes: "提高小红书内容占比并锁定执行排期", internalComments: "团队确认可执行。", managerFeedback: "同意进入达人执行。", clientFeedback: "确认 V3。", attachments: ["执行方案-V3.pdf"] },
      { proposalId: "proposal-b", version: 1, createdBy: "Amy", createdAt: "2026-09-22T09:30:00+08:00", summary: "探店路线与内容形式", content: "规划三条城市路线及短视频内容形式。", changes: "初版", internalComments: "Coco：补充周末路线。", managerFeedback: "关注单店转化。", clientFeedback: "增加两家门店。", attachments: [] },
      { proposalId: "proposal-b", version: 2, createdBy: "Amy", createdAt: "2026-09-28T11:10:00+08:00", summary: "门店范围确认版", content: "五家门店与达人组合已确认。", contentSections: [{ title: "项目目标", body: "围绕五家门店建立可连续观看的城市探店内容，兼顾门店客流与品牌整体认知。" }, { title: "执行策略", body: "按区域规划拍摄路线，统一必拍信息并保留达人现场体验表达；发布后按门店回收表现数据。" }, { title: "排期与预算", body: "十月完成拍摄与首轮发布。当前批准预算为 ¥95,000，新增预算用于两家门店的拍摄资源。" }], changes: "增加两家门店", internalComments: "排期可行。", managerFeedback: "确认。", clientFeedback: "确认执行。", attachments: ["门店清单.xlsx"] },
      { proposalId: "proposal-c", version: 1, createdBy: "David", createdAt: "2026-09-29T14:00:00+08:00", summary: "秋季内容主题初稿", content: "围绕秋季生活方式建立三类内容主题。", changes: "初版", internalComments: "Jessica：需要更强的品牌记忆点。", managerFeedback: "增加核心视觉规范。", clientFeedback: "希望收窄受众。", attachments: [] },
      { proposalId: "proposal-c", version: 2, createdBy: "David", createdAt: "2026-10-01T14:00:00+08:00", summary: "聚焦核心人群的修订版", content: "聚焦 25–35 岁城市女性，统一视觉与信息层级。", contentSections: [{ title: "项目方向", body: "以秋季生活方式为主题，聚焦 25–35 岁城市女性，并统一视觉识别与内容信息顺序。" }, { title: "内容结构", body: "围绕换季需求、日常使用与生活场景建立三类内容，当前等待客户对受众范围与视觉规范的反馈。" }], changes: "收窄受众并补充视觉规范", internalComments: "内部审核通过。", managerFeedback: "可提交客户。", clientFeedback: "审核中。", attachments: ["秋季方案-V2.pdf"] }
    ],
    creators: [
      { id: "creator-mia", displayName: "Mia Notes", status: "active", contentTags: ["生活方式", "美妆"], notes: "生活方式内容稳定，沟通效率高。" },
      { id: "creator-luna", displayName: "LunaDaily", status: "active", contentTags: ["城市生活", "短视频"], notes: "短视频叙事能力强。" },
      { id: "creator-nono", displayName: "Nono", status: "pending_review", contentTags: ["护肤", "生活方式"], notes: "待完成首轮数据核验。" },
      { id: "creator-city", displayName: "CityWalker", status: "candidate", contentTags: ["城市生活", "探店"], notes: "城市生活方向候选。" },
      { id: "creator-old", displayName: "Daily Archive", status: "inactive", contentTags: ["生活记录"], notes: "暂不合作。" }
    ],
    creatorAccounts: [
      { id: "acct-mia-xhs", creatorId: "creator-mia", platform: "小红书", accountName: "Mia Notes", profileUrl: "https://example.com/mia-xhs", followers: 186000, engagementRate: 0.072, status: "active" },
      { id: "acct-mia-wb", creatorId: "creator-mia", platform: "微博", accountName: "Mia的日常笔记", profileUrl: "https://example.com/mia-wb", followers: 92000, engagementRate: 0.039, status: "active" },
      { id: "acct-luna-dy", creatorId: "creator-luna", platform: "抖音", accountName: "LunaDaily", profileUrl: "https://example.com/luna-dy", followers: 328000, engagementRate: 0.058, status: "active" },
      { id: "acct-luna-bili", creatorId: "creator-luna", platform: "B站", accountName: "Luna的一天", profileUrl: "https://example.com/luna-bili", followers: 74000, engagementRate: 0.081, status: "active" },
      { id: "acct-nono-xhs", creatorId: "creator-nono", platform: "小红书", accountName: "Nono", profileUrl: "https://example.com/nono-xhs", followers: 56000, engagementRate: 0.064, status: "pending_review" },
      { id: "acct-city-wx", creatorId: "creator-city", platform: "微信公众号", accountName: "CityWalker", profileUrl: "https://example.com/city-wx", followers: 41000, engagementRate: 0.047, status: "candidate" },
      { id: "acct-old-wb", creatorId: "creator-old", platform: "微博", accountName: "Daily Archive", profileUrl: "https://example.com/archive-wb", followers: 26000, engagementRate: 0.018, status: "inactive" }
    ],
    platforms: [
      { id: "platform-xhs", name: "小红书", status: "active" },
      { id: "platform-douyin", name: "抖音", status: "active" },
      { id: "platform-bilibili", name: "B站", status: "active" },
      { id: "platform-weibo", name: "微博", status: "active" },
      { id: "platform-wechat", name: "微信公众号", status: "active" }
    ],
    settlementEntities: [
      { id: "entity-mcn-a", name: "MCN A", type: "MCN", invoiceCapability: "可开具增值税专用发票", notes: "Mia Notes 常用结算主体" },
      { id: "entity-mcn-b", name: "MCN B", type: "MCN", invoiceCapability: "可开具增值税普通发票", notes: "LunaDaily 常用结算主体" },
      { id: "entity-company-a", name: "结算公司 A", type: "服务公司", invoiceCapability: "可开具增值税专用发票", notes: "按项目确认" },
      { id: "entity-company-b", name: "结算公司 B", type: "服务公司", invoiceCapability: "暂不开票", notes: "需人工复核" },
      { id: "entity-platform-xhs", name: "行吟信息科技（上海）有限公司", type: "平台", invoiceCapability: "按平台规则开票", notes: "演示平台结算主体" },
      { id: "entity-platform-douyin", name: "北京抖音科技有限公司", type: "平台", invoiceCapability: "按平台规则开票", notes: "演示平台结算主体" }
    ],
    platformAccounts: [
      { id: "platform-account-xhs", platformId: "platform-xhs", accountName: "XHS-****-2681", status: "active", balance: 28600, lastTopUpAt: "2026-09-26", serviceFeeMethod: "5%", settlementEntityId: "entity-platform-xhs" },
      { id: "platform-account-douyin", platformId: "platform-douyin", accountName: "DY-****-4130", status: "active", balance: 41300, lastTopUpAt: "2026-09-29", serviceFeeMethod: "6%", settlementEntityId: "entity-platform-douyin" }
    ],
    vendors: [{ id: "vendor-a", name: "制作供应商 A", type: "内容制作", settlementEntityId: "entity-company-a" }, { id: "vendor-b", name: "投放供应商 B", type: "媒体投放", settlementEntityId: "entity-company-b" }],
    contracts: [
      { id: "contract-a-customer", projectId: "proj-a", counterpartyType: "customer", counterpartyId: "cust-a", contractNumber: "CT-2026-A001", contractType: "customer_contract", title: "十月新品内容推广客户合同", status: "active", signedDate: "2026-09-18", effectiveDate: "2026-09-18", totalAmount: 180000, taxIncluded: true, taxRate: 0.06, paymentTerms: "30% 签约，40% 发布，30% 验收", invoicingTerms: "按收款节点开具销售发票", documentIds: ["doc-contract-a"] },
      { id: "contract-a-mia", projectId: "proj-a", counterpartyType: "creator_mcn", counterpartyId: "entity-mcn-a", contractNumber: "CA-2026-A-MIA", contractType: "creator_agreement", title: "Mia Notes 合作协议", status: "active", signedDate: "2026-09-29", effectiveDate: "2026-09-29", totalAmount: 8500, taxIncluded: true, taxRate: 0.06, paymentTerms: "内容发布后 15 日内付款", invoicingTerms: "付款前取得进项发票", documentIds: ["doc-mcn-a"] },
      { id: "contract-a-luna", projectId: "proj-a", counterpartyType: "creator_mcn", counterpartyId: "entity-mcn-b", contractNumber: "CA-2026-A-LUNA", contractType: "creator_agreement", title: "LunaDaily 合作协议", status: "active", signedDate: "2026-09-24", effectiveDate: "2026-09-24", totalAmount: 65000, taxIncluded: true, taxRate: 0.06, paymentTerms: "内容发布后 15 日内付款", invoicingTerms: "付款前取得进项发票", documentIds: ["doc-mcn-b"] },
      { id: "contract-b-customer", projectId: "proj-b", counterpartyType: "customer", counterpartyId: "cust-b", contractNumber: "CT-2026-B001", contractType: "customer_contract", title: "城市探店计划客户合同", status: "active", signedDate: "2026-09-29", effectiveDate: "2026-09-29", totalAmount: 145000, taxIncluded: true, taxRate: 0.06, paymentTerms: "按阶段结算", invoicingTerms: "按实际结算节点开票", documentIds: [] },
      { id: "contract-d-customer", projectId: "proj-d", counterpartyType: "customer", counterpartyId: "cust-d", contractNumber: "CT-2026-D001", contractType: "customer_contract", title: "年度内容合作客户合同", status: "completed", signedDate: "2026-05-08", effectiveDate: "2026-05-08", totalAmount: 228000, taxIncluded: true, taxRate: 0.06, paymentTerms: "验收后付款", invoicingTerms: "验收后开票", documentIds: ["doc-contract-d"] },
      { id: "contract-d-city", projectId: "proj-d", counterpartyType: "creator_mcn", counterpartyId: "entity-company-a", contractNumber: "CA-2026-D-CITY", contractType: "creator_agreement", title: "CityWalker 内容合作协议", status: "completed", signedDate: "2026-08-18", effectiveDate: "2026-08-18", totalAmount: 72000, taxIncluded: true, taxRate: 0.06, paymentTerms: "发布后付款", invoicingTerms: "付款前取得进项发票", documentIds: [] },
      { id: "contract-platform-xhs", projectId: null, counterpartyType: "platform", counterpartyId: "platform-xhs", contractNumber: "PF-XHS-2026", contractType: "platform_agreement", title: "小红书公司级平台框架协议", status: "active", signedDate: "2026-01-05", effectiveDate: "2026-01-05", totalAmount: 0, taxIncluded: true, taxRate: 0.06, paymentTerms: "按平台账单结算", invoicingTerms: "按平台规则", documentIds: ["doc-platform"] },
      { id: "contract-platform-douyin", projectId: null, counterpartyType: "platform", counterpartyId: "platform-douyin", contractNumber: "PF-DY-2026", contractType: "platform_agreement", title: "抖音公司级平台框架协议", status: "active", signedDate: "2026-01-05", effectiveDate: "2026-01-05", totalAmount: 0, taxIncluded: true, taxRate: 0.06, paymentTerms: "按平台账单结算", invoicingTerms: "按平台规则", documentIds: ["doc-platform"] },
      { id: "contract-vendor-a", projectId: null, counterpartyType: "supplier", counterpartyId: "vendor-a", contractNumber: "VF-A-2026", contractType: "supplier_agreement", title: "制作供应商 A 框架协议", status: "active", signedDate: "2026-01-10", effectiveDate: "2026-01-10", totalAmount: 0, taxIncluded: true, taxRate: 0.06, paymentTerms: "按项目验收结算", invoicingTerms: "付款前取得进项发票", documentIds: [] },
      { id: "contract-vendor-b", projectId: null, counterpartyType: "supplier", counterpartyId: "vendor-b", contractNumber: "VF-B-2026", contractType: "supplier_agreement", title: "投放供应商 B 框架协议", status: "active", signedDate: "2026-01-12", effectiveDate: "2026-01-12", totalAmount: 0, taxIncluded: true, taxRate: 0.06, paymentTerms: "按项目结算", invoicingTerms: "付款前取得进项发票", documentIds: [] }
    ],
    contractMilestones: [
      { id: "milestone-a-30", contractId: "contract-a-customer", projectId: "proj-a", direction: "receivable", label: "30% 合同签署款", triggerType: "contract_signed", triggerRefId: "contract-a-customer", percentage: 0.3, amount: 54000, expectedDate: "2026-09-25", status: "completed", receivableId: "ar-a-30", payableId: null },
      { id: "milestone-a-40", contractId: "contract-a-customer", projectId: "proj-a", direction: "receivable", label: "40% 内容发布款", triggerType: "published", triggerRefId: "content-a1", percentage: 0.4, amount: 72000, expectedDate: "2026-10-25", status: "not_triggered", receivableId: "ar-a-40", payableId: null },
      { id: "milestone-a-30-final", contractId: "contract-a-customer", projectId: "proj-a", direction: "receivable", label: "30% 客户验收尾款", triggerType: "acceptance", triggerRefId: "acceptance-a", percentage: 0.3, amount: 54000, expectedDate: "2026-11-20", status: "not_triggered", receivableId: "ar-a-30-final", payableId: null }
    ],
    budgetVersions: [
      { id: "budget-a-v1", projectId: "proj-a", version: 1, amount: 120000, reason: "原始执行预算", status: "approved", proposedBy: "Jessica", approvedBy: "Jessica", createdAt: "2026-09-12T09:00:00+08:00", effectiveAt: "2026-09-12T09:00:00+08:00" },
      { id: "budget-b-v1", projectId: "proj-b", version: 1, amount: 90000, reason: "原始执行预算", status: "approved", proposedBy: "Amy", approvedBy: "Jessica", createdAt: "2026-09-20T09:00:00+08:00", effectiveAt: "2026-09-20T09:00:00+08:00" },
      { id: "budget-b-v2", projectId: "proj-b", version: 2, amount: 95000, reason: "增加两家门店的拍摄资源", status: "approved", proposedBy: "Amy", approvedBy: "Jessica", createdAt: "2026-09-28T16:00:00+08:00", effectiveAt: "2026-09-29T00:00:00+08:00" },
      { id: "budget-c-v1", projectId: "proj-c", version: 1, amount: 100000, reason: "原始执行预算", status: "approved", proposedBy: "David", approvedBy: "Jessica", createdAt: "2026-09-28T09:00:00+08:00", effectiveAt: "2026-09-28T09:00:00+08:00" },
      { id: "budget-d-v1", projectId: "proj-d", version: 1, amount: 155000, reason: "原始执行预算", status: "approved", proposedBy: "Coco", approvedBy: "Jessica", createdAt: "2026-05-03T09:00:00+08:00", effectiveAt: "2026-05-03T09:00:00+08:00" },
      { id: "budget-d-v2", projectId: "proj-d", version: 2, amount: 195000, reason: "执行范围调整，经批准增加预算", status: "approved", proposedBy: "Coco", approvedBy: "Jessica", createdAt: "2026-08-20T10:00:00+08:00", effectiveAt: "2026-08-20T10:00:00+08:00" }
    ],
    collaborations: [
      { id: "collab-mia-a", projectId: "proj-a", creatorId: "creator-mia", creatorAccountId: "acct-mia-xhs", settlementEntityId: "entity-mcn-a", contentType: "图文", status: "negotiating", quotedAmount: 9500, confirmedAmount: 8500, plannedPublishDate: "2026-10-15", travelTreatment: "待确认", quoteHistory: [{ at: "2026-09-22", amount: 10000 }, { at: "2026-09-28", amount: 9500 }, { at: "2026-10-01", amount: 8500 }], communicationIds: ["comm-mia-a"] },
      { id: "collab-luna-a", projectId: "proj-a", creatorId: "creator-luna", creatorAccountId: "acct-luna-dy", settlementEntityId: "entity-mcn-b", contentType: "短视频", status: "producing", quotedAmount: 68000, confirmedAmount: 65000, plannedPublishDate: "2026-10-18", travelTreatment: "已包含", quoteHistory: [{ at: "2026-09-20", amount: 68000 }, { at: "2026-09-24", amount: 65000 }], communicationIds: ["comm-luna-a"] },
      { id: "collab-luna-b", projectId: "proj-b", creatorId: "creator-luna", creatorAccountId: "acct-luna-bili", settlementEntityId: "entity-company-a", contentType: "中视频", status: "negotiating", quotedAmount: 53000, confirmedAmount: 0, plannedPublishDate: "2026-10-22", travelTreatment: "待确认", quoteHistory: [{ at: "2026-09-26", amount: 53000 }], communicationIds: [] },
      { id: "collab-nono-c", projectId: "proj-c", creatorId: "creator-nono", creatorAccountId: "acct-nono-xhs", settlementEntityId: "entity-company-b", contentType: "图文", status: "candidate", quotedAmount: 18000, confirmedAmount: 0, plannedPublishDate: "2026-11-03", travelTreatment: "待确认", quoteHistory: [{ at: "2026-10-01", amount: 18000 }], communicationIds: ["comm-nono-c"] },
      { id: "collab-city-d", projectId: "proj-d", creatorId: "creator-city", creatorAccountId: "acct-city-wx", settlementEntityId: "entity-company-a", contentType: "公众号文章", status: "settled", quotedAmount: 75000, confirmedAmount: 72000, plannedPublishDate: "2026-09-12", travelTreatment: "已包含", quoteHistory: [{ at: "2026-08-12", amount: 75000 }, { at: "2026-08-18", amount: 72000 }], communicationIds: [] }
    ],
    contents: [
      { contentId: "content-a1", projectId: "proj-a", creatorId: "creator-luna", creatorAccountId: "acct-luna-dy", platform: "抖音", contentType: "短视频", publishDate: "2026-10-18", contentUrl: "https://example.com/content-a1", status: "制作中" },
      { contentId: "content-d1", projectId: "proj-d", creatorId: "creator-city", creatorAccountId: "acct-city-wx", platform: "微信公众号", contentType: "公众号文章", publishDate: "2026-09-12", contentUrl: "https://example.com/content-d1", status: "已发布" }
    ],
    performanceSnapshots: [
      { contentId: "content-d1", capturedAt: "2026-09-30T10:00:00+08:00", views: 76000, likes: 5200, comments: 286, saves: 1900, shares: 720 }
    ],
    revenues: [
      { id: "revenue-a", projectId: "proj-a", contractId: "contract-a-customer", contractValue: 180000, taxAmount: 10189, netRevenue: 169811, status: "contracted", recognizedAmount: 0, recognizedAt: null, recognitionBasis: "client_acceptance" },
      { id: "revenue-b", projectId: "proj-b", contractId: "contract-b-customer", contractValue: 145000, taxAmount: 8208, netRevenue: 136792, status: "contracted", recognizedAmount: 0, recognizedAt: null, recognitionBasis: "client_acceptance" },
      { id: "revenue-c", projectId: "proj-c", contractId: null, contractValue: 158000, taxAmount: 8943, netRevenue: 149057, status: "forecast", recognizedAmount: 0, recognizedAt: null, recognitionBasis: "client_acceptance" },
      { id: "revenue-d", projectId: "proj-d", contractId: "contract-d-customer", contractValue: 228000, taxAmount: 12906, netRevenue: 215094, status: "recognized", recognizedAmount: 215094, recognizedAt: "2026-09-14T10:00:00+08:00", recognitionBasis: "client_acceptance" }
    ],
    acceptances: [
      { id: "acceptance-a", projectId: "proj-a", status: "pending", scope: "项目全部约定内容", contentIds: ["content-a1"], acceptedAt: null, acceptedBy: null, source: "客户确认", documentIds: [], notes: "等待内容发布与客户验收。" },
      { id: "acceptance-d", projectId: "proj-d", status: "accepted", scope: "年度合作全部交付", contentIds: ["content-d1"], acceptedAt: "2026-09-14T10:00:00+08:00", acceptedBy: "客户 D 项目联系人", source: "客户验收确认", documentIds: ["doc-acceptance-d"], notes: "业务验收完成，等待逾期应收处理。" }
    ],
    costs: [
      { id: "cost-a2", projectId: "proj-a", category: "company_borne", businessObject: "项目差旅与样品", substance: "公司承担费用", vendorId: null, platform: "—", settlementEntityId: null, amount: 10500 },
      { id: "cost-b2", projectId: "proj-b", category: "company_borne", businessObject: "场地与交通费用", substance: "公司承担费用", vendorId: null, platform: "—", settlementEntityId: null, amount: 10000 },
      { id: "cost-c2", projectId: "proj-c", category: "company_borne", businessObject: "样品与视觉费用", substance: "公司承担费用", vendorId: null, platform: "—", settlementEntityId: null, amount: 4000 },
      { id: "cost-d2", projectId: "proj-d", category: "company_borne", businessObject: "公司投放", substance: "公司承担费用", vendorId: "vendor-b", platform: "微信公众号", settlementEntityId: "entity-company-b", amount: 14000 }
    ],
    settlementLines: [
      { id: "sl-a-ar-30", projectId: "proj-a", direction: "receivable", businessObjectType: "contract_milestone", businessObjectId: "milestone-a-30", collaborationId: null, creatorId: null, platformId: null, lineType: "client_receivable", costBucket: "revenue", counterpartyType: "customer", counterpartyId: "cust-a", settlementEntityId: null, contractId: "contract-a-customer", contractMilestoneId: "milestone-a-30", amount: 54000, invoiceId: "invoice-a-sale-30", receivableId: "ar-a-30", payableId: null, cashTransactionIds: ["cash-a-receipt"], invoiceRequired: true, status: "completed" },
      { id: "sl-a-ar-40", projectId: "proj-a", direction: "receivable", businessObjectType: "contract_milestone", businessObjectId: "milestone-a-40", collaborationId: null, creatorId: null, platformId: null, lineType: "client_receivable", costBucket: "revenue", counterpartyType: "customer", counterpartyId: "cust-a", settlementEntityId: null, contractId: "contract-a-customer", contractMilestoneId: "milestone-a-40", amount: 72000, invoiceId: null, receivableId: "ar-a-40", payableId: null, cashTransactionIds: [], invoiceRequired: true, status: "not_triggered" },
      { id: "sl-a-ar-final", projectId: "proj-a", direction: "receivable", businessObjectType: "contract_milestone", businessObjectId: "milestone-a-30-final", collaborationId: null, creatorId: null, platformId: null, lineType: "client_receivable", costBucket: "revenue", counterpartyType: "customer", counterpartyId: "cust-a", settlementEntityId: null, contractId: "contract-a-customer", contractMilestoneId: "milestone-a-30-final", amount: 54000, invoiceId: null, receivableId: "ar-a-30-final", payableId: null, cashTransactionIds: [], invoiceRequired: true, status: "not_triggered" },
      { id: "sl-a-mia-creator", projectId: "proj-a", direction: "payable", businessObjectType: "collaboration", businessObjectId: "collab-mia-a", collaborationId: "collab-mia-a", creatorId: "creator-mia", platformId: "platform-xhs", lineType: "creator_fee", costBucket: "external_execution", counterpartyType: "settlement_entity", counterpartyId: "entity-mcn-a", settlementEntityId: "entity-mcn-a", contractId: "contract-a-mia", contractMilestoneId: null, amount: 8500, invoiceId: "invoice-a-mia", receivableId: null, payableId: "ap-a-mia", cashTransactionIds: [], invoiceRequired: true, status: "committed" },
      { id: "sl-a-mia-platform", projectId: "proj-a", direction: "payable", businessObjectType: "collaboration", businessObjectId: "collab-mia-a", collaborationId: "collab-mia-a", creatorId: "creator-mia", platformId: "platform-xhs", lineType: "platform_fee", costBucket: "external_execution", counterpartyType: "platform", counterpartyId: "platform-xhs", settlementEntityId: "entity-platform-xhs", contractId: "contract-platform-xhs", contractMilestoneId: null, amount: 1200, invoiceId: "invoice-a-xhs", receivableId: null, payableId: "ap-a-xhs", cashTransactionIds: [], invoiceRequired: true, status: "committed" },
      { id: "sl-a-luna-creator", projectId: "proj-a", direction: "payable", businessObjectType: "collaboration", businessObjectId: "collab-luna-a", collaborationId: "collab-luna-a", creatorId: "creator-luna", platformId: "platform-douyin", lineType: "creator_fee", costBucket: "external_execution", counterpartyType: "settlement_entity", counterpartyId: "entity-mcn-b", settlementEntityId: "entity-mcn-b", contractId: "contract-a-luna", contractMilestoneId: null, amount: 32000, invoiceId: "invoice-a-luna", receivableId: null, payableId: "ap-a-luna", cashTransactionIds: [], invoiceRequired: true, status: "due" },
      { id: "sl-a-luna-platform", projectId: "proj-a", direction: "payable", businessObjectType: "collaboration", businessObjectId: "collab-luna-a", collaborationId: "collab-luna-a", creatorId: "creator-luna", platformId: "platform-douyin", lineType: "platform_fee", costBucket: "external_execution", counterpartyType: "platform", counterpartyId: "platform-douyin", settlementEntityId: "entity-platform-douyin", contractId: "contract-platform-douyin", contractMilestoneId: null, amount: 3200, invoiceId: "invoice-a-douyin", receivableId: null, payableId: "ap-a-douyin", cashTransactionIds: [], invoiceRequired: true, status: "committed" },
      { id: "sl-a-vendor", projectId: "proj-a", direction: "payable", businessObjectType: "vendor_service", businessObjectId: "vendor-a-service-a", collaborationId: null, creatorId: null, platformId: "platform-douyin", lineType: "vendor_fee", costBucket: "external_execution", counterpartyType: "supplier", counterpartyId: "vendor-a", settlementEntityId: "entity-company-a", contractId: "contract-vendor-a", contractMilestoneId: null, amount: 12000, invoiceId: "invoice-a-vendor", receivableId: null, payableId: "ap-a-vendor", cashTransactionIds: ["cash-1"], invoiceRequired: true, status: "due" },
      { id: "sl-b-ar", projectId: "proj-b", direction: "receivable", businessObjectType: "contract_milestone", businessObjectId: "b-stage-1", collaborationId: null, creatorId: null, platformId: null, lineType: "client_receivable", costBucket: "revenue", counterpartyType: "customer", counterpartyId: "cust-b", settlementEntityId: null, contractId: "contract-b-customer", contractMilestoneId: null, amount: 70000, invoiceId: null, receivableId: "ar-b", payableId: null, cashTransactionIds: ["cash-2"], invoiceRequired: true, status: "due" },
      { id: "sl-b-reimbursement", projectId: "proj-b", direction: "payable", businessObjectType: "reimbursement", businessObjectId: "request-reimbursement-amy", collaborationId: null, creatorId: null, platformId: null, lineType: "reimbursement", costBucket: "company_borne", counterpartyType: "employee", counterpartyId: "user-amy", settlementEntityId: null, contractId: null, contractMilestoneId: null, amount: 2514, invoiceId: null, receivableId: null, payableId: null, cashTransactionIds: [], invoiceRequired: false, status: "draft" },
      { id: "sl-d-ar", projectId: "proj-d", direction: "receivable", businessObjectType: "contract_milestone", businessObjectId: "d-acceptance", collaborationId: null, creatorId: null, platformId: null, lineType: "client_receivable", costBucket: "revenue", counterpartyType: "customer", counterpartyId: "cust-d", settlementEntityId: null, contractId: "contract-d-customer", contractMilestoneId: null, amount: 228000, invoiceId: "invoice-d-sale", receivableId: "ar-d", payableId: null, cashTransactionIds: [], invoiceRequired: true, status: "overdue" },
      { id: "sl-d-city-creator", projectId: "proj-d", direction: "payable", businessObjectType: "collaboration", businessObjectId: "collab-city-d", collaborationId: "collab-city-d", creatorId: "creator-city", platformId: "platform-wechat", lineType: "creator_fee", costBucket: "external_execution", counterpartyType: "settlement_entity", counterpartyId: "entity-company-a", settlementEntityId: "entity-company-a", contractId: "contract-d-city", contractMilestoneId: null, amount: 40000, invoiceId: "invoice-d-purchase", receivableId: null, payableId: "ap-d-city", cashTransactionIds: [], invoiceRequired: true, status: "paid" },
      { id: "sl-d-vendor", projectId: "proj-d", direction: "payable", businessObjectType: "vendor_service", businessObjectId: "vendor-b-service-d", collaborationId: null, creatorId: null, platformId: "platform-wechat", lineType: "vendor_fee", costBucket: "external_execution", counterpartyType: "supplier", counterpartyId: "vendor-b", settlementEntityId: "entity-company-b", contractId: "contract-vendor-b", contractMilestoneId: null, amount: 76000, invoiceId: "invoice-d-vendor", receivableId: null, payableId: "ap-d-vendor", cashTransactionIds: [], invoiceRequired: true, status: "paid" }
    ],
    receivables: [
      { id: "ar-a-30", projectId: "proj-a", amount: 54000, expectedDate: "2026-09-25", actualAmount: 54000, actualDate: "2026-09-25", status: "已收款", agingBucket: "Current", settlementLineId: "sl-a-ar-30", contractMilestoneId: "milestone-a-30", contractId: "contract-a-customer", documentIds: ["doc-receipt-a"] },
      { id: "ar-a-40", projectId: "proj-a", amount: 72000, expectedDate: "2026-10-25", actualAmount: 0, actualDate: null, status: "未到期", agingBucket: "Current", settlementLineId: "sl-a-ar-40", contractMilestoneId: "milestone-a-40", contractId: "contract-a-customer", documentIds: [] },
      { id: "ar-a-30-final", projectId: "proj-a", amount: 54000, expectedDate: "2026-11-20", actualAmount: 0, actualDate: null, status: "未到期", agingBucket: "Current", settlementLineId: "sl-a-ar-final", contractMilestoneId: "milestone-a-30-final", contractId: "contract-a-customer", documentIds: [] },
      { id: "ar-b", projectId: "proj-b", amount: 70000, expectedDate: "2026-10-25", actualAmount: 0, actualDate: null, status: "未到期", agingBucket: "Current", settlementLineId: "sl-b-ar", contractMilestoneId: null, contractId: "contract-b-customer", documentIds: [] },
      { id: "ar-d", projectId: "proj-d", amount: 228000, expectedDate: "2026-09-28", actualAmount: 0, actualDate: null, status: "逾期", agingBucket: "30 Days", settlementLineId: "sl-d-ar", contractMilestoneId: null, contractId: "contract-d-customer", documentIds: [] }
    ],
    payables: [
      { id: "ap-a-mia", projectId: "proj-a", collaborationId: "collab-mia-a", businessObject: "Mia Notes 达人费用", amount: 8500, expectedDate: "2026-10-30", actualDate: null, status: "未到期", settlementLineId: "sl-a-mia-creator", contractMilestoneId: null, contractId: "contract-a-mia", documentIds: [] },
      { id: "ap-a-xhs", projectId: "proj-a", collaborationId: "collab-mia-a", businessObject: "小红书平台服务费", amount: 1200, expectedDate: "2026-10-28", actualDate: null, status: "未到期", settlementLineId: "sl-a-mia-platform", contractMilestoneId: null, contractId: "contract-platform-xhs", documentIds: [] },
      { id: "ap-a-luna", projectId: "proj-a", collaborationId: "collab-luna-a", businessObject: "LunaDaily 达人费用", amount: 32000, expectedDate: "2026-10-05", actualDate: null, status: "即将到期", settlementLineId: "sl-a-luna-creator", contractMilestoneId: null, contractId: "contract-a-luna", documentIds: [] },
      { id: "ap-a-douyin", projectId: "proj-a", collaborationId: "collab-luna-a", businessObject: "抖音平台服务费", amount: 3200, expectedDate: "2026-10-28", actualDate: null, status: "未到期", settlementLineId: "sl-a-luna-platform", contractMilestoneId: null, contractId: "contract-platform-douyin", documentIds: [] },
      { id: "ap-a-vendor", projectId: "proj-a", collaborationId: null, businessObject: "制作供应商服务", amount: 12000, expectedDate: "2026-10-08", actualDate: null, status: "即将到期", settlementLineId: "sl-a-vendor", contractMilestoneId: null, contractId: "contract-vendor-a", documentIds: [] },
      { id: "ap-d-city", projectId: "proj-d", collaborationId: "collab-city-d", businessObject: "CityWalker 达人费用", amount: 40000, expectedDate: "2026-09-20", actualDate: "2026-09-20", status: "已付款", settlementLineId: "sl-d-city-creator", contractMilestoneId: null, contractId: "contract-d-city", documentIds: [] },
      { id: "ap-d-vendor", projectId: "proj-d", collaborationId: null, businessObject: "年度制作服务", amount: 76000, expectedDate: "2026-09-22", actualDate: "2026-09-22", status: "已付款", settlementLineId: "sl-d-vendor", contractMilestoneId: null, contractId: "contract-vendor-b", documentIds: [] }
    ],
    invoices: [
      { id: "invoice-a-sale-30", projectId: "proj-a", direction: "sales", amount: 54000, status: "已开具", invoiceNumber: "INV-A-202609-001", invoiceDate: "2026-09-20", settlementLineId: "sl-a-ar-30", contractId: "contract-a-customer", documentIds: ["doc-invoice-a"] },
      { id: "invoice-a-mia", projectId: "proj-a", direction: "purchase", amount: 8500, status: "未收到", invoiceDate: null, collaborationId: "collab-mia-a", settlementLineId: "sl-a-mia-creator", contractId: "contract-a-mia", documentIds: [] },
      { id: "invoice-a-xhs", projectId: "proj-a", direction: "purchase", amount: 1200, status: "未收到", invoiceDate: null, collaborationId: "collab-mia-a", settlementLineId: "sl-a-mia-platform", contractId: "contract-platform-xhs", documentIds: [] },
      { id: "invoice-a-luna", projectId: "proj-a", direction: "purchase", amount: 32000, status: "未收到", invoiceDate: null, collaborationId: "collab-luna-a", settlementLineId: "sl-a-luna-creator", contractId: "contract-a-luna", documentIds: [] },
      { id: "invoice-a-douyin", projectId: "proj-a", direction: "purchase", amount: 3200, status: "未收到", invoiceDate: null, collaborationId: "collab-luna-a", settlementLineId: "sl-a-luna-platform", contractId: "contract-platform-douyin", documentIds: [] },
      { id: "invoice-a-vendor", projectId: "proj-a", direction: "purchase", amount: 12000, status: "已收到", invoiceNumber: "PI-A-202609-006", invoiceDate: "2026-09-30", settlementLineId: "sl-a-vendor", contractId: "contract-vendor-a", documentIds: [] },
      { id: "invoice-d-sale", projectId: "proj-d", direction: "sales", amount: 228000, status: "已开具", invoiceNumber: "INV-D-202609-018", invoiceDate: "2026-09-15", settlementLineId: "sl-d-ar", contractId: "contract-d-customer", documentIds: [] },
      { id: "invoice-d-purchase", projectId: "proj-d", direction: "purchase", amount: 40000, status: "已收到", invoiceNumber: "PI-D-202609-021", invoiceDate: "2026-09-18", collaborationId: "collab-city-d", settlementLineId: "sl-d-city-creator", contractId: "contract-d-city", documentIds: [] },
      { id: "invoice-d-vendor", projectId: "proj-d", direction: "purchase", amount: 76000, status: "已收到", invoiceNumber: "PI-D-202609-022", invoiceDate: "2026-09-19", settlementLineId: "sl-d-vendor", contractId: "contract-vendor-b", documentIds: [] }
    ],
    cashTransactions: [
      { id: "cash-1", amount: -12000, date: "2026-10-01", counterparty: "制作供应商 A", status: "未匹配", projectId: "proj-a", matchedSettlementLineIds: [], documentIds: ["doc-statement"] },
      { id: "cash-2", amount: 48000, date: "2026-10-01", counterparty: "客户 B", status: "未匹配", projectId: "proj-b", matchedSettlementLineIds: [], documentIds: ["doc-statement"] },
      { id: "cash-a-receipt", amount: 54000, date: "2026-09-25", counterparty: "客户 A", status: "已匹配", projectId: "proj-a", matchedSettlementLineIds: ["sl-a-ar-30"], documentIds: ["doc-receipt-a"] }
    ],
    documents: [
      { id: "doc-contract-a", fileName: "客户合同盖章版.pdf", fileType: "application/pdf", documentType: "contract", uploadedBy: "Jessica", uploadedAt: "2026-09-18T15:00:00+08:00", projectId: "proj-a", status: "有效", source: "人工上传（模拟）", links: [{ objectType: "project", objectId: "proj-a" }, { objectType: "contract", objectId: "contract-a-customer" }] },
      { id: "doc-contract-d", fileName: "客户年度合同盖章版.pdf", fileType: "application/pdf", documentType: "contract", uploadedBy: "Coco", uploadedAt: "2026-05-08T16:00:00+08:00", projectId: "proj-d", status: "有效", source: "人工上传（模拟）", links: [{ objectType: "project", objectId: "proj-d" }, { objectType: "contract", objectId: "contract-d-customer" }] },
      { id: "doc-mcn-a", fileName: "MCN A 合作协议.pdf", fileType: "application/pdf", documentType: "contract", uploadedBy: "Amy", uploadedAt: "2026-09-29T12:00:00+08:00", projectId: "proj-a", status: "有效", source: "人工上传（模拟）", links: [{ objectType: "contract", objectId: "contract-a-mia" }, { objectType: "settlementLine", objectId: "sl-a-mia-creator" }] },
      { id: "doc-mcn-b", fileName: "MCN B 合作协议.pdf", fileType: "application/pdf", documentType: "contract", uploadedBy: "Amy", uploadedAt: "2026-09-24T14:00:00+08:00", projectId: "proj-a", status: "有效", source: "人工上传（模拟）", links: [{ objectType: "contract", objectId: "contract-a-luna" }, { objectType: "settlementLine", objectId: "sl-a-luna-creator" }] },
      { id: "doc-platform", fileName: "平台服务协议.pdf", fileType: "application/pdf", documentType: "contract", uploadedBy: "Jessica", uploadedAt: "2026-01-05T10:00:00+08:00", projectId: null, status: "有效", source: "人工上传（模拟）", links: [{ objectType: "contract", objectId: "contract-platform-xhs" }, { objectType: "contract", objectId: "contract-platform-douyin" }] },
      { id: "doc-acceptance-d", fileName: "客户验收确认.pdf", fileType: "application/pdf", documentType: "acceptance", uploadedBy: "Coco", uploadedAt: "2026-09-14T10:15:00+08:00", projectId: "proj-d", status: "有效", source: "邮件确认（模拟）", links: [{ objectType: "project", objectId: "proj-d" }, { objectType: "acceptance", objectId: "acceptance-d" }, { objectType: "businessEvent", objectId: "event-acceptance-d" }] },
      { id: "doc-invoice-a", fileName: "发票示例.pdf", fileType: "application/pdf", documentType: "invoice", uploadedBy: "Jessica", uploadedAt: "2026-09-20T11:00:00+08:00", projectId: "proj-a", status: "有效", source: "开票记录（模拟）", links: [{ objectType: "invoice", objectId: "invoice-a-sale-30" }, { objectType: "settlementLine", objectId: "sl-a-ar-30" }] },
      { id: "doc-chat-mia", fileName: "微信确认截图.png", fileType: "image/png", documentType: "screenshot", uploadedBy: "Amy", uploadedAt: "2026-10-01T09:15:00+08:00", projectId: "proj-a", status: "待核对", source: "微信（模拟）", links: [{ objectType: "communication", objectId: "comm-mia-a" }, { objectType: "collaboration", objectId: "collab-mia-a" }] },
      { id: "doc-receipt-a", fileName: "客户A回款凭证.pdf", fileType: "application/pdf", documentType: "receipt", uploadedBy: "Jessica", uploadedAt: "2026-09-25T15:30:00+08:00", projectId: "proj-a", status: "有效", source: "银行流水（模拟）", links: [{ objectType: "receivable", objectId: "ar-a-30" }, { objectType: "cashTransaction", objectId: "cash-a-receipt" }, { objectType: "settlementLine", objectId: "sl-a-ar-30" }] },
      { id: "doc-statement", fileName: "银行流水示例.pdf", fileType: "application/pdf", documentType: "statement", uploadedBy: "Jessica", uploadedAt: "2026-10-01T09:00:00+08:00", projectId: null, status: "待匹配", source: "银行导入（模拟）", links: [{ objectType: "cashTransaction", objectId: "cash-1" }, { objectType: "cashTransaction", objectId: "cash-2" }] },
      { id: "doc-reimbursement", fileName: "差旅票据示例.pdf", fileType: "application/pdf", documentType: "receipt", uploadedBy: "Amy", uploadedAt: "2026-10-01T14:10:00+08:00", projectId: "proj-b", status: "待审批", source: "员工提交（模拟）", links: [{ objectType: "businessRequest", objectId: "request-reimbursement-amy" }, { objectType: "settlementLine", objectId: "sl-b-reimbursement" }] }
    ],
    tasks: [
      { id: "task-collect-d", type: "collection", title: "跟进客户 D 逾期回款", assigneeUserId: "user-jessica", projectId: "proj-d", relatedObjectType: "receivable", relatedObjectId: "ar-d", sourceType: "business_rule", sourceId: "ar-d", dueDate: "2026-10-02", priority: "high", status: "todo", createdByAgent: true, createdAt: "2026-09-29T09:00:00+08:00", completedAt: null },
      { id: "task-confirm-mia", type: "confirmation", title: "确认 Mia Notes 商务更新", assigneeUserId: "user-jessica", projectId: "proj-a", relatedObjectType: "communication", relatedObjectId: "comm-mia-a", sourceType: "communication", sourceId: "comm-mia-a", dueDate: "2026-10-02", priority: "high", status: "todo", createdByAgent: true, createdAt: "2026-10-01T09:20:00+08:00", completedAt: null },
      { id: "task-vendor-risk-a", type: "risk", title: "确认制作供应商 A 延期影响", assigneeUserId: "user-amy", projectId: "proj-a", relatedObjectType: "communication", relatedObjectId: "comm-vendor-a", sourceType: "communication", sourceId: "comm-vendor-a", dueDate: "2026-10-03", priority: "high", status: "todo", createdByAgent: true, createdAt: "2026-10-01T16:00:00+08:00", completedAt: null }
    ],
    businessRequests: [
      { id: "request-reimbursement-amy", type: "expense_reimbursement", applicantUserId: "user-amy", projectId: "proj-b", description: "城市探店计划现场交通与物料费用", amount: 2514, status: "draft", currentApproverUserId: "user-jessica", documentIds: ["doc-reimbursement"], relatedSettlementLineIds: ["sl-b-reimbursement"], lineItems: [{ description: "现场交通与物料", amount: 2514, costCategory: "company_borne", creatorId: null, collaborationId: null, documentIds: ["doc-reimbursement"] }], createdAt: "2026-10-01T14:10:00+08:00", updatedAt: "2026-10-01T14:10:00+08:00" }
    ],
    overheadAllocations: [{ id: "overhead-a", projectId: "proj-a", rule: "按项目活跃天数分摊", amount: 9000 }, { id: "overhead-b", projectId: "proj-b", rule: "按项目活跃天数分摊", amount: 7200 }, { id: "overhead-c", projectId: "proj-c", rule: "按项目活跃天数分摊", amount: 6800 }, { id: "overhead-d", projectId: "proj-d", rule: "按项目活跃天数分摊", amount: 12000 }],
    rebates: [{ id: "rebate-a", projectId: "proj-a", amount: 5000, status: "预计" }, { id: "rebate-b", projectId: "proj-b", amount: 3500, status: "预计" }, { id: "rebate-c", projectId: "proj-c", amount: 4200, status: "预计" }, { id: "rebate-d", projectId: "proj-d", amount: 6000, status: "已确认" }],
    communications: [
      { id: "comm-mia-a", projectId: "proj-a", collaborationId: "collab-mia-a", counterpartyType: "creator", counterpartyId: "creator-mia", conversationType: "commercial_terms", interpretationEligibility: "agreement_confirmed", channel: "微信（模拟）", unread: true, analyzed: false, ignored: false, messages: [
        { sender: "Mia Notes", text: "9000 吧，8500 真的做不了" }, { sender: "Jessica", text: "9000 包含差旅吗？" },
        { sender: "Mia Notes", text: "差旅另外实报实销吧" }, { sender: "Jessica", text: "那 10 月 15 号发布，一篇内容，可以吗？" }, { sender: "Mia Notes", text: "可以。" }
      ] },
      { id: "comm-luna-a", projectId: "proj-a", collaborationId: "collab-luna-a", counterpartyType: "creator", counterpartyId: "creator-luna", conversationType: "execution_feedback", interpretationEligibility: "progress_only", channel: "微信（模拟）", unread: true, analyzed: false, ignored: false, messages: [
        { sender: "LunaDaily", text: "第一版剪辑已经出来，客户提到的产品特写我今晚补上。" }, { sender: "Amy", text: "收到，请明天下午前给到复审版。" }
      ] },
      { id: "comm-nono-c", projectId: "proj-c", collaborationId: "collab-nono-c", counterpartyType: "creator", counterpartyId: "creator-nono", conversationType: "quotation", interpretationEligibility: "not_an_agreement", channel: "微信（模拟）", unread: true, analyzed: false, ignored: false, messages: [
        { sender: "Nono", text: "这次图文我这边报价 18000，档期暂时可以留。" }
      ] },
      { id: "comm-vendor-a", projectId: "proj-a", collaborationId: null, counterpartyType: "supplier", counterpartyId: "vendor-a", conversationType: "delivery_risk", interpretationEligibility: "task_candidate", channel: "微信（模拟）", unread: true, analyzed: false, ignored: false, messages: [
        { sender: "制作供应商 A", text: "设备调度有变化，成片交付可能从 10 月 12 日延到 10 月 14 日。" }, { sender: "Amy", text: "请今天确认是否会影响达人发布时间。" }
      ] }
    ],
    businessEvents: [
      { id: "event-proposal-v3", type: "PROPOSAL_APPROVED", projectId: "proj-a", title: "客户确认方案 V3", oldValue: "客户审核", newValue: "已确认", source: "方案", detectedByAgent: false, confirmedByUser: true, timestamp: "2026-09-25T16:20:00+08:00", relatedObjects: [{ type: "project", id: "proj-a" }, { type: "proposal", id: "proposal-a" }], evidenceDocumentIds: [] },
      { id: "event-content-d", type: "CONTENT_PUBLISHED", projectId: "proj-d", title: "CityWalker 内容已发布", oldValue: "待发布", newValue: "已发布", source: "内容与数据", detectedByAgent: false, confirmedByUser: true, timestamp: "2026-09-12T12:00:00+08:00", relatedObjects: [{ type: "content", id: "content-d1" }, { type: "collaboration", id: "collab-city-d" }], evidenceDocumentIds: [] },
      { id: "event-acceptance-d", type: "CLIENT_ACCEPTANCE_COMPLETED", projectId: "proj-d", title: "客户完成项目验收", oldValue: "待验收", newValue: "已验收", source: "客户验收确认", detectedByAgent: false, confirmedByUser: true, timestamp: "2026-09-14T10:00:00+08:00", relatedObjects: [{ type: "acceptance", id: "acceptance-d" }, { type: "contract", id: "contract-d-customer" }], evidenceDocumentIds: ["doc-acceptance-d"] },
      { id: "event-invoice-d", type: "SALES_INVOICE_ISSUED", projectId: "proj-d", title: "销售发票已开具", oldValue: "未开具", newValue: "已开具", source: "财务运营", detectedByAgent: false, confirmedByUser: true, timestamp: "2026-09-15T09:30:00+08:00", relatedObjects: [{ type: "invoice", id: "invoice-d-sale" }, { type: "settlementLine", id: "sl-d-ar" }], evidenceDocumentIds: [] }
    ],
    proposedUpdates: {},
    profitChanges: {},
    agentActivities: [
      { id: "activity-1", timestamp: "2026-10-01T09:20:00+08:00", action: "分析 4 个业务会话", source: "沟通中心", result: "识别到商务变化、执行反馈、报价边界与交付风险", humanConfirmed: false },
      { id: "activity-2", timestamp: "2026-09-25T16:20:00+08:00", action: "记录方案确认", source: "方案 V3", result: "项目阶段进入达人执行", humanConfirmed: true }
    ],
    cashForecasts: [
      { month: "2026-10", opening: 824000, inflow: 118000, outflow: 96000 },
      { month: "2026-11", opening: 846000, inflow: 325000, outflow: 188000 },
      { month: "2026-12", opening: 983000, inflow: 210000, outflow: 142000 }
    ],
    currentCash: 824000
  };

  // Keep the mock portfolio within a realistic marketing-services margin range.
  const setSeedAmount = (collection, id, amount) => { const record = seedState[collection].find(item => item.id === id); if (record) record.amount = amount; };
  [
    ["sl-a-luna-creator", 65000], ["sl-a-luna-platform", 6500], ["sl-a-vendor", 48000],
    ["sl-d-city-creator", 72000], ["sl-d-vendor", 105000]
  ].forEach(([id, amount]) => setSeedAmount("settlementLines", id, amount));
  [
    ["ap-a-luna", 65000], ["ap-a-douyin", 6500], ["ap-a-vendor", 48000],
    ["ap-d-city", 72000], ["ap-d-vendor", 105000]
  ].forEach(([id, amount]) => setSeedAmount("payables", id, amount));
  [
    ["invoice-a-luna", 65000], ["invoice-a-douyin", 6500], ["invoice-a-vendor", 48000],
    ["invoice-d-purchase", 72000], ["invoice-d-vendor", 105000]
  ].forEach(([id, amount]) => setSeedAmount("invoices", id, amount));
  [["overhead-a",14000],["overhead-b",33000],["overhead-c",31000],["overhead-d",16000]].forEach(([id, amount]) => setSeedAmount("overheadAllocations", id, amount));
  [["rebate-a",3500],["rebate-b",1500],["rebate-c",4200],["rebate-d",7000]].forEach(([id, amount]) => setSeedAmount("rebates", id, amount));
  const projectASeed = seedState.projects.find(item => item.id === "proj-a");
  Object.assign(projectASeed, { executionBudget: 145000, originalBudget: 145000, currentApprovedBudget: 145000 });
  setSeedAmount("budgetVersions", "budget-a-v1", 145000);

  const clone = value => JSON.parse(JSON.stringify(value));
  let state;
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || clone(seedState); } catch (_) { state = clone(seedState); }
  let idSequence = 0;
  const uniqueId = prefix => `${prefix}-${Date.now()}-${++idSequence}`;

  const label = (dictionary, key) => (dictionaries[dictionary].find(item => item[0] === key) || [key, key])[1];
  const findById = (collection, id, key = "id") => state[collection].find(item => item[key] === id);
  const projectCollaborations = projectId => state.collaborations.filter(item => item.projectId === projectId);
  const projectCosts = (projectId, category) => state.costs.filter(item => item.projectId === projectId && (!category || item.category === category));
  const projectSettlementLines = (projectId, direction) => state.settlementLines.filter(item => item.projectId === projectId && (!direction || item.direction === direction));
  const sum = (items, field) => items.reduce((total, item) => total + Number(item[field] || 0), 0);
  const committedLineStatuses = new Set(["committed", "triggered", "due", "overdue", "invoiced", "paid", "completed"]);
  const calculateNetRevenue = project => (findById("revenues", project.id, "projectId") || project).netRevenue;
  const calculateExternalExecutionCost = project => sum(projectSettlementLines(project.id, "payable").filter(line => line.costBucket === "external_execution" && committedLineStatuses.has(line.status)), "amount");
  const calculateCompanyBorneCost = project => sum(projectCosts(project.id, "company_borne"), "amount") + sum(projectSettlementLines(project.id, "payable").filter(line => line.costBucket === "company_borne" && ["approved", "due", "paid", "completed"].includes(line.status)), "amount");
  const calculateAllocatedOverhead = project => sum(state.overheadAllocations.filter(item => item.projectId === project.id), "amount");
  const calculateRetainedRebate = project => sum(state.rebates.filter(item => item.projectId === project.id), "amount");
  const calculateProjectProfit = project => calculateNetRevenue(project) + calculateRetainedRebate(project) - calculateExternalExecutionCost(project) - calculateCompanyBorneCost(project) - calculateAllocatedOverhead(project);
  const calculateProjectMargin = project => calculateNetRevenue(project) ? calculateProjectProfit(project) / calculateNetRevenue(project) * 100 : 0;
  const calculateCommittedCost = project => calculateExternalExecutionCost(project) + calculateCompanyBorneCost(project);
  const calculateCurrentApprovedBudget = project => {
    const approved = state.budgetVersions.filter(item => item.projectId === project.id && item.status === "approved").sort((a, b) => b.version - a.version)[0];
    return approved ? approved.amount : (project.currentApprovedBudget || project.executionBudget || 0);
  };
  const calculateBudgetUsage = project => calculateCurrentApprovedBudget(project) ? calculateCommittedCost(project) / calculateCurrentApprovedBudget(project) * 100 : 0;
  const formatMoney = value => new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(value);
  const formatNumber = value => new Intl.NumberFormat("zh-CN", { notation: value >= 100000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const getCurrentUser = () => findById("users", state.currentUserId);
  const getVisibleProjects = () => {
    const user = getCurrentUser();
    return user.role === "owner" ? state.projects : state.projects.filter(project => project.owner === user.name || project.team.includes(user.name));
  };
  const getVisibleProjectIds = () => getVisibleProjects().map(project => project.id);
  function setCurrentUser(userId) { if (findById("users", userId)) { state.currentUserId = userId; save(); } return getCurrentUser(); }

  function getBusinessClosureStatus(project) {
    const customerContracts = state.contracts.filter(item => item.projectId === project.id && item.contractType === "customer_contract");
    const projectContents = state.contents.filter(item => item.projectId === project.id);
    const acceptance = state.acceptances.find(item => item.projectId === project.id);
    const contractInForce = customerContracts.length > 0 && customerContracts.every(item => ["signed", "active", "completed"].includes(item.status) && item.signedDate && item.effectiveDate);
    const deliverablesComplete = projectContents.length > 0 && projectContents.every(item => ["已发布", "已验收", "完成"].includes(item.status));
    const acceptanceComplete = Boolean(acceptance && acceptance.status === "accepted");
    return { contractInForce, contractReady: contractInForce, deliverablesComplete, acceptanceComplete, businessClosed: contractInForce && deliverablesComplete && acceptanceComplete };
  }

  function getFinancialClosureStatus(project) {
    const receivableLines = projectSettlementLines(project.id, "receivable").filter(line => line.status !== "cancelled");
    const payableLines = projectSettlementLines(project.id, "payable").filter(line => !["cancelled", "rejected", "pending_approval"].includes(line.status));
    const salesInvoicesComplete = receivableLines.filter(line => line.invoiceRequired).every(line => line.invoiceId && findById("invoices", line.invoiceId)?.status === "已开具");
    const receivablesCollected = receivableLines.every(line => { const ar = line.receivableId && findById("receivables", line.receivableId); return ar && (ar.status === "已收款" || Number(ar.actualAmount) >= Number(ar.amount)); });
    const purchaseInvoicesComplete = payableLines.filter(line => line.invoiceRequired).every(line => line.invoiceId && findById("invoices", line.invoiceId)?.status === "已收到");
    const payablesPaid = payableLines.every(line => { const ap = line.payableId && findById("payables", line.payableId); return ap && ap.status === "已付款"; });
    return { salesInvoicesComplete, receivablesCollected, purchaseInvoicesComplete, payablesPaid, financialClosed: salesInvoicesComplete && receivablesCollected && purchaseInvoicesComplete && payablesPaid };
  }

  function getProjectClosureStatus(project) {
    const business = getBusinessClosureStatus(project);
    const financial = getFinancialClosureStatus(project);
    return { ...business, ...financial, fullyClosed: business.businessClosed && financial.financialClosed };
  }

  function analyzeCommunication(id) {
    const communication = findById("communications", id);
    if (!communication) return null;
    if (communication.interpretationEligibility !== "agreement_confirmed") {
      communication.analyzed = true; communication.unread = false;
      const result = communication.interpretationEligibility === "not_an_agreement" ? "仅识别到单方面报价，未形成正式协议" : communication.interpretationEligibility === "task_candidate" ? "识别到交付风险，保留为 Task 来源" : "识别为执行进度，不修改正式商务状态";
      communication.analysisResult = result;
      state.agentActivities.unshift({ id: "activity-" + Date.now(), projectId: communication.projectId, timestamp: new Date().toISOString(), action: `分析 ${communication.messages.length} 条消息`, source: communication.channel, result, humanConfirmed: false });
      save(); return null;
    }
    const collaboration = findById("collaborations", communication.collaborationId);
    const account = findById("creatorAccounts", collaboration.creatorAccountId);
    communication.analyzed = true; communication.unread = false; communication.ignored = false;
    state.proposedUpdates[id] = {
      communicationId: id, collaborationId: collaboration.id, projectId: collaboration.projectId,
      creatorId: collaboration.creatorId, creatorAccountId: account.id, platform: account.platform,
      contentType: "图文", publishDate: "2026-10-15", currentAmount: collaboration.confirmedAmount,
      proposedAmount: 9000, travelTreatment: "差旅另行实报实销", agreementStatus: "已达成口头一致",
      source: "Communication", inputMode: "communication", status: "Awaiting Human Confirmation"
    };
    communication.analysisResult = "已识别商务价格、差旅与发布时间，并生成待确认业务更新";
    state.agentActivities.unshift({ id: "activity-" + Date.now(), projectId: collaboration.projectId, timestamp: new Date().toISOString(), action: `分析 ${communication.messages.length} 条消息`, source: "沟通", result: "生成待确认业务更新", humanConfirmed: false });
    save(); return state.proposedUpdates[id];
  }

  function interpretAgentInput(text, inputMode = "text") {
    const collaboration = findById("collaborations", "collab-mia-a");
    const account = findById("creatorAccounts", collaboration.creatorAccountId);
    const id = "agent-mia-a";
    state.proposedUpdates[id] = {
      communicationId: null, collaborationId: collaboration.id, projectId: collaboration.projectId,
      creatorId: collaboration.creatorId, creatorAccountId: account.id, platform: account.platform,
      contentType: "图文", publishDate: "2026-10-15", currentAmount: collaboration.confirmedAmount,
      proposedAmount: 9000, travelTreatment: "实报实销", agreementStatus: "已确认",
      source: inputMode === "voice" ? "小A · 用户语音" : "小A · 用户输入", inputMode, originalText: text,
      status: "Awaiting Human Confirmation"
    };
    state.agentActivities.unshift({ id: "activity-" + Date.now(), projectId: collaboration.projectId, timestamp: new Date().toISOString(), action: "理解业务变化", source: state.proposedUpdates[id].source, result: "生成 Mia Notes 合作更新", humanConfirmed: false });
    save(); return state.proposedUpdates[id];
  }

  function updateProposedUpdate(id, values) { Object.assign(state.proposedUpdates[id], values, { status: "Awaiting Human Confirmation" }); save(); }
  function cancelProposedUpdate(id) { delete state.proposedUpdates[id]; save(); }
  function ignoreProposedUpdate(id) { delete state.proposedUpdates[id]; const communication = findById("communications", id); communication.ignored = true; save(); }
  function confirmProposedUpdate(id) {
    const proposed = state.proposedUpdates[id]; if (!proposed) return null;
    const collaboration = findById("collaborations", proposed.collaborationId);
    const project = findById("projects", proposed.projectId);
    const creatorFeeLine = state.settlementLines.find(line => line.businessObjectType === "collaboration" && line.businessObjectId === collaboration.id && line.lineType === "creator_fee");
    if (!creatorFeeLine) throw new Error(`Missing creator_fee Settlement Line for ${collaboration.id}`);
    const previousProfit = calculateProjectProfit(project); const oldValue = collaboration.confirmedAmount;
    Object.assign(collaboration, { contentType: proposed.contentType, plannedPublishDate: proposed.publishDate, confirmedAmount: Number(proposed.proposedAmount), travelTreatment: proposed.travelTreatment, status: "confirmed" });
    collaboration.quoteHistory.push({ at: new Date().toISOString().slice(0, 10), amount: Number(proposed.proposedAmount) });
    creatorFeeLine.amount = Number(proposed.proposedAmount);
    const creatorAgreement = creatorFeeLine.contractId && findById("contracts", creatorFeeLine.contractId);
    if (creatorAgreement && creatorAgreement.contractType === "creator_agreement") creatorAgreement.totalAmount = creatorFeeLine.amount;
    const payable = creatorFeeLine.payableId && findById("payables", creatorFeeLine.payableId);
    const invoice = creatorFeeLine.invoiceId && findById("invoices", creatorFeeLine.invoiceId);
    if (payable) payable.amount = creatorFeeLine.amount;
    if (invoice) invoice.amount = creatorFeeLine.amount;
    const newProfit = calculateProjectProfit(project);
    const creator = findById("creators", collaboration.creatorId);
    const event = { id: "event-" + Date.now(), type: "COLLABORATION_AMOUNT_UPDATED", projectId: project.id, collaborationId: collaboration.id, title: `${creator.displayName} 合作金额更新为 ${formatMoney(collaboration.confirmedAmount)}`, oldValue, newValue: collaboration.confirmedAmount, source: proposed.source, detectedByAgent: true, confirmedByUser: true, timestamp: new Date().toISOString(), relatedObjects: [{ type: "collaboration", id: collaboration.id }, { type: "settlementLine", id: creatorFeeLine.id }, { type: "contract", id: creatorFeeLine.contractId }], evidenceDocumentIds: proposed.communicationId ? ["doc-chat-mia"] : [] };
    state.businessEvents.unshift(event);
    state.profitChanges[project.id] = { oldProfit: previousProfit, newProfit, delta: newProfit - previousProfit, eventId: event.id };
    state.agentActivities.unshift({ id: "activity-" + (Date.now() + 1), projectId: project.id, timestamp: new Date().toISOString(), action: "更新项目成本并重新计算利润", source: proposed.source, result: `${formatMoney(oldValue)} → ${formatMoney(collaboration.confirmedAmount)}`, humanConfirmed: true });
    const confirmationTask = state.tasks.find(task => task.relatedObjectId === (proposed.communicationId || "comm-mia-a") && task.type === "confirmation" && task.status === "todo");
    if (confirmationTask) { confirmationTask.status = "done"; confirmationTask.completedAt = new Date().toISOString(); }
    delete state.proposedUpdates[id]; save(); return event;
  }

  function addUploadedDocuments(fileMetas, { projectId, documentType, status, links }) {
    return (fileMetas || []).map((meta, index) => {
      const token = `${Date.now()}-${++idSequence}-${index}`;
      const document = {
        id: `doc-upload-${token}`, fileName: meta.name, fileType: meta.type || "application/octet-stream",
        fileSize: Number(meta.size || 0), documentType, uploadedBy: getCurrentUser().name,
        uploadedAt: new Date().toISOString(), projectId, status, source: "本地上传（Demo）", links: clone(links || [])
      };
      state.documents.push(document);
      return document;
    });
  }

  function submitReimbursementRequest(requestId, fileMetas = []) {
    const request = findById("businessRequests", requestId);
    if (!request || request.type !== "expense_reimbursement") return null;
    const line = request.relatedSettlementLineIds.map(id => findById("settlementLines", id)).find(Boolean);
    const documents = addUploadedDocuments(fileMetas, {
      projectId: request.projectId, documentType: "receipt", status: "待审批",
      links: [{ objectType: "businessRequest", objectId: request.id }, ...(line ? [{ objectType: "settlementLine", objectId: line.id }] : [])]
    });
    const newIds = documents.map(item => item.id);
    request.documentIds = [...new Set([...(request.documentIds || []), ...newIds])];
    request.lineItems.forEach(item => { item.documentIds = [...new Set([...(item.documentIds || []), ...newIds])]; });
    request.status = "pending_approval";
    request.updatedAt = new Date().toISOString();
    if (line) line.status = "pending_approval";
    let task = state.tasks.find(item => item.relatedObjectType === "businessRequest" && item.relatedObjectId === request.id && item.status === "todo");
    if (!task) {
      task = { id: `task-approve-${request.id}`, type: "approval", title: `审批 Amy 项目报销 ${formatMoney(request.amount)}`, assigneeUserId: request.currentApproverUserId, projectId: request.projectId, relatedObjectType: "businessRequest", relatedObjectId: request.id, sourceType: "business_request", sourceId: request.id, dueDate: "2026-10-04", priority: "high", status: "todo", createdByAgent: true, createdAt: new Date().toISOString(), completedAt: null };
      state.tasks.unshift(task);
    }
    state.businessEvents.unshift({ id: uniqueId("event-request"), type: "BUSINESS_REQUEST_SUBMITTED", projectId: request.projectId, title: `Amy 发起费用报销 ${formatMoney(request.amount)}`, oldValue: "草稿", newValue: "等待审批", source: "工作台 Agent", detectedByAgent: true, confirmedByUser: true, timestamp: new Date().toISOString(), relatedObjects: [{ type: "businessRequest", id: request.id }, ...(line ? [{ type: "settlementLine", id: line.id }] : [])], evidenceDocumentIds: request.documentIds });
    state.agentActivities.unshift({ id: uniqueId("activity"), projectId: request.projectId, timestamp: new Date().toISOString(), action: "生成费用报销申请", source: "工作台 Agent", result: "等待 Jessica 审批", humanConfirmed: true });
    save(); return request;
  }

  function approveBusinessRequest(requestId) {
    const request = findById("businessRequests", requestId);
    if (!request || request.status !== "pending_approval") return null;
    const project = findById("projects", request.projectId);
    const beforeProfit = calculateProjectProfit(project);
    const line = request.relatedSettlementLineIds.map(id => findById("settlementLines", id)).find(Boolean);
    request.status = "approved"; request.updatedAt = new Date().toISOString();
    if (line) {
      line.status = "approved";
      let payable = line.payableId && findById("payables", line.payableId);
      if (!payable) {
        payable = { id: `ap-${request.id}`, projectId: request.projectId, collaborationId: null, businessObject: request.description, amount: request.amount, expectedDate: "2026-10-10", actualDate: null, status: "未到期", settlementLineId: line.id, contractMilestoneId: null, contractId: null, documentIds: request.documentIds || [] };
        state.payables.push(payable); line.payableId = payable.id;
      }
    }
    const task = state.tasks.find(item => item.relatedObjectType === "businessRequest" && item.relatedObjectId === request.id && item.status === "todo");
    if (task) { task.status = "done"; task.completedAt = new Date().toISOString(); }
    const afterProfit = calculateProjectProfit(project);
    const event = { id: uniqueId("event-approval"), type: "BUSINESS_REQUEST_APPROVED", projectId: request.projectId, title: `Jessica 批准费用报销 ${formatMoney(request.amount)}`, oldValue: "等待审批", newValue: "已批准", source: "工作台审批", detectedByAgent: false, confirmedByUser: true, timestamp: new Date().toISOString(), relatedObjects: [{ type: "businessRequest", id: request.id }, ...(line ? [{ type: "settlementLine", id: line.id }, { type: "payable", id: line.payableId }] : [])], evidenceDocumentIds: request.documentIds || [] };
    state.businessEvents.unshift(event);
    state.profitChanges[project.id] = { oldProfit: beforeProfit, newProfit: afterProfit, delta: afterProfit - beforeProfit, eventId: event.id };
    state.agentActivities.unshift({ id: uniqueId("activity"), projectId: project.id, timestamp: new Date().toISOString(), action: "批准费用报销并更新项目利润", source: "工作台审批", result: `${formatMoney(beforeProfit)} → ${formatMoney(afterProfit)}`, humanConfirmed: true });
    save(); return request;
  }

  function returnBusinessRequest(requestId) {
    const request = findById("businessRequests", requestId);
    if (!request || request.status !== "pending_approval") return null;
    request.status = "needs_info"; request.updatedAt = new Date().toISOString();
    request.relatedSettlementLineIds.forEach(id => { const line = findById("settlementLines", id); if (line) line.status = "draft"; });
    const task = state.tasks.find(item => item.relatedObjectType === "businessRequest" && item.relatedObjectId === request.id && item.status === "todo");
    if (task) { task.status = "done"; task.completedAt = new Date().toISOString(); }
    state.businessEvents.unshift({ id: uniqueId("event-return"), type: "BUSINESS_REQUEST_RETURNED", projectId: request.projectId, title: "费用报销退回补充", oldValue: "等待审批", newValue: "需补充资料", source: "工作台审批", detectedByAgent: false, confirmedByUser: true, timestamp: new Date().toISOString(), relatedObjects: [{ type: "businessRequest", id: request.id }], evidenceDocumentIds: request.documentIds || [] });
    save(); return request;
  }

  function createProjectFromContractDraft(draft, fileMetas = []) {
    const existing = findById("projects", "proj-e");
    if (existing) return existing;
    const now = new Date().toISOString();
    const projectId = "proj-e", contractId = "contract-e-customer";
    const amount = Number(draft.contractAmount || 168000), taxRate = Number(draft.taxRate || 0.06);
    const netRevenue = Math.round(amount / (1 + taxRate)), taxAmount = amount - netRevenue;
    const budget = Number(draft.budget || 92000);
    const project = { id: projectId, name: draft.projectName || "冬季新品内容项目", customerId: draft.customerId || "cust-a", status: "contract_signed", owner: draft.owner || getCurrentUser().name, team: [], executionBudget: budget, originalBudget: budget, currentApprovedBudget: budget, contractValue: amount, taxAmount, netRevenue, collectionStatus: "未到期", risk: false, startDate: "2026-10-08", endDate: "2026-12-20" };
    state.projects.push(project);
    const documents = addUploadedDocuments(fileMetas.length ? fileMetas : [{ name: "客户新合同.pdf", type: "application/pdf", size: 0 }], { projectId, documentType: "contract", status: "有效", links: [{ objectType: "project", objectId: projectId }, { objectType: "contract", objectId: contractId }] });
    state.contracts.push({ id: contractId, projectId, counterpartyType: "customer", counterpartyId: project.customerId, contractNumber: draft.contractNumber || "CT-2026-A002", contractType: "customer_contract", title: `${project.name}客户合同`, status: "active", signedDate: "2026-10-08", effectiveDate: "2026-10-08", totalAmount: amount, taxIncluded: true, taxRate, paymentTerms: "30% 签约，40% 发布，30% 验收", invoicingTerms: "按收款节点开具销售发票", documentIds: documents.map(item => item.id) });
    state.revenues.push({ id: "revenue-e", projectId, contractId, contractValue: amount, taxAmount, netRevenue, status: "contracted", recognizedAmount: 0, recognizedAt: null, recognitionBasis: "client_acceptance" });
    state.budgetVersions.push({ id: "budget-e-v1", projectId, version: 1, amount: budget, reason: "原始执行预算", status: "approved", proposedBy: project.owner, approvedBy: project.owner, createdAt: now, effectiveAt: now });
    const amounts = [Math.round(amount * 0.3), Math.round(amount * 0.4)]; amounts.push(amount - amounts[0] - amounts[1]);
    const terms = [
      ["30% 合同签署款", "contract_signed", "2026-10-15", "triggered"],
      ["40% 内容发布款", "published", "2026-11-20", "not_triggered"],
      ["30% 客户验收尾款", "acceptance", "2026-12-20", "not_triggered"]
    ];
    terms.forEach((term, index) => {
      const suffix = ["30", "40", "final"][index], milestoneId = `milestone-e-${suffix}`, arId = `ar-e-${suffix}`, lineId = `sl-e-ar-${suffix}`;
      state.contractMilestones.push({ id: milestoneId, contractId, projectId, direction: "receivable", label: term[0], triggerType: term[1], triggerRefId: index === 0 ? contractId : null, percentage: [0.3, 0.4, 0.3][index], amount: amounts[index], expectedDate: term[2], status: term[3], receivableId: arId, payableId: null });
      state.receivables.push({ id: arId, projectId, amount: amounts[index], expectedDate: term[2], actualAmount: 0, actualDate: null, status: "未到期", agingBucket: "Current", settlementLineId: lineId, contractMilestoneId: milestoneId, contractId, documentIds: [] });
      state.settlementLines.push({ id: lineId, projectId, direction: "receivable", businessObjectType: "contract_milestone", businessObjectId: milestoneId, collaborationId: null, creatorId: null, platformId: null, lineType: "client_receivable", costBucket: "revenue", counterpartyType: "customer", counterpartyId: project.customerId, settlementEntityId: null, contractId, contractMilestoneId: milestoneId, amount: amounts[index], invoiceId: null, receivableId: arId, payableId: null, cashTransactionIds: [], invoiceRequired: true, status: term[3] });
    });
    const event = { id: uniqueId("event-project"), type: "PROJECT_CREATED_FROM_CONTRACT", projectId, title: `从合同创建项目：${project.name}`, oldValue: null, newValue: project.name, source: "工作台 Agent · Demo 模拟合同提取", detectedByAgent: true, confirmedByUser: true, timestamp: now, relatedObjects: [{ type: "project", id: projectId }, { type: "contract", id: contractId }], evidenceDocumentIds: documents.map(item => item.id) };
    state.businessEvents.unshift(event);
    documents.forEach(document => document.links.push({ objectType: "businessEvent", objectId: event.id }));
    state.agentActivities.unshift({ id: uniqueId("activity"), projectId, timestamp: now, action: "从合同创建项目", source: "工作台 Agent", result: `${project.name} · ${formatMoney(amount)}`, humanConfirmed: true });
    save(); return project;
  }

  function confirmDocumentOrganization(fileMetas, drafts) {
    const created = [];
    (drafts || []).forEach((draft, index) => {
      if (!draft.projectId) return;
      const meta = fileMetas[index] || { name: `资料-${index + 1}`, type: "application/octet-stream", size: 0 };
      const links = [{ objectType: "project", objectId: draft.projectId }];
      if (draft.invoiceId) links.push({ objectType: "invoice", objectId: draft.invoiceId });
      const document = addUploadedDocuments([meta], { projectId: draft.projectId, documentType: draft.documentType || "other", status: "有效", links })[0];
      if (draft.invoiceId) {
        const invoice = findById("invoices", draft.invoiceId);
        if (invoice) invoice.documentIds = [...new Set([...(invoice.documentIds || []), document.id])];
      }
      const event = { id: uniqueId("event-document"), type: "DOCUMENT_CONFIRMED", projectId: draft.projectId, title: `资料已确认进入系统：${document.fileName}`, oldValue: "待确认", newValue: "已关联项目", source: "小A资料整理", detectedByAgent: true, confirmedByUser: true, timestamp: new Date().toISOString(), relatedObjects: [{ type: "project", id: draft.projectId }, ...(draft.invoiceId ? [{ type: "invoice", id: draft.invoiceId }] : [])], evidenceDocumentIds: [document.id] };
      state.businessEvents.unshift(event);
      document.links.push({ objectType: "businessEvent", objectId: event.id });
      created.push(document);
    });
    if (created.length) state.agentActivities.unshift({ id: uniqueId("activity"), timestamp: new Date().toISOString(), action: `整理并确认 ${created.length} 份资料`, source: "工作台小A", result: "已关联项目并进入系统", humanConfirmed: true });
    save(); return created;
  }

  function validateDemoState() {
    const errors = [], warnings = [];
    const collectionKeys = {
      users: "id", customers: "id", projects: "id", proposals: "proposalId", creators: "id", creatorAccounts: "id",
      platforms: "id", platformAccounts: "id", settlementEntities: "id", vendors: "id", collaborations: "id", contents: "contentId",
      revenues: "id", costs: "id", contracts: "id", contractMilestones: "id", settlementLines: "id", acceptances: "id",
      receivables: "id", payables: "id", invoices: "id", cashTransactions: "id", documents: "id", tasks: "id", businessRequests: "id",
      overheadAllocations: "id", rebates: "id", communications: "id", businessEvents: "id", agentActivities: "id", budgetVersions: "id"
    };
    Object.entries(collectionKeys).forEach(([collection, key]) => {
      const seen = new Set();
      (state[collection] || []).forEach(item => { if (seen.has(item[key])) errors.push(`${collection} 存在重复 ID: ${item[key]}`); seen.add(item[key]); });
    });
    const exists = (collection, id, key = "id") => id == null || Boolean(findById(collection, id, key));
    state.contracts.forEach(contract => {
      if (!exists("projects", contract.projectId)) errors.push(`Contract ${contract.id} 引用无效 Project`);
      const counterpartyCollections = { customer: "customers", creator_mcn: "settlementEntities", supplier: "vendors", platform: "platforms" };
      const counterpartyCollection = counterpartyCollections[contract.counterpartyType];
      if (!counterpartyCollection || !exists(counterpartyCollection, contract.counterpartyId)) errors.push(`Contract ${contract.id} 引用无效 Counterparty`);
      (contract.documentIds || []).forEach(id => { if (!exists("documents", id)) errors.push(`Contract ${contract.id} 引用无效 Document`); });
      const milestones = state.contractMilestones.filter(item => item.contractId === contract.id);
      if (milestones.length && Math.abs(sum(milestones, "amount") - Number(contract.totalAmount)) > 0.01) errors.push(`Contract ${contract.id} 的 milestone 金额未加总到合同总额`);
    });
    state.contractMilestones.forEach(milestone => {
      if (!exists("contracts", milestone.contractId)) errors.push(`Milestone ${milestone.id} 引用无效 Contract`);
      if (!exists("projects", milestone.projectId)) errors.push(`Milestone ${milestone.id} 引用无效 Project`);
      if (!exists("receivables", milestone.receivableId)) errors.push(`Milestone ${milestone.id} 引用无效 AR`);
      if (!exists("payables", milestone.payableId)) errors.push(`Milestone ${milestone.id} 引用无效 AP`);
    });
    state.settlementLines.forEach(line => {
      if (!exists("projects", line.projectId)) errors.push(`Settlement Line ${line.id} 引用无效 Project`);
      if (!exists("contracts", line.contractId)) errors.push(`Settlement Line ${line.id} 引用无效 Contract`);
      if (!exists("contractMilestones", line.contractMilestoneId)) errors.push(`Settlement Line ${line.id} 引用无效 Milestone`);
      if (!exists("collaborations", line.collaborationId)) errors.push(`Settlement Line ${line.id} 引用无效 Collaboration`);
      if (!exists("invoices", line.invoiceId)) errors.push(`Settlement Line ${line.id} 引用无效 Invoice`);
      if (!exists("receivables", line.receivableId)) errors.push(`Settlement Line ${line.id} 引用无效 AR`);
      if (!exists("payables", line.payableId)) errors.push(`Settlement Line ${line.id} 引用无效 AP`);
      (line.cashTransactionIds || []).forEach(id => { if (!exists("cashTransactions", id)) errors.push(`Settlement Line ${line.id} 引用无效 Cash Transaction`); });
    });
    state.collaborations.forEach(collaboration => {
      if (!exists("projects", collaboration.projectId) || !exists("creators", collaboration.creatorId) || !exists("creatorAccounts", collaboration.creatorAccountId) || !exists("settlementEntities", collaboration.settlementEntityId)) errors.push(`Collaboration ${collaboration.id} 存在无效主档关联`);
      (collaboration.communicationIds || []).forEach(id => { if (!exists("communications", id)) errors.push(`Collaboration ${collaboration.id} 引用无效 Communication`); });
    });
    state.invoices.forEach(item => {
      if (!exists("projects", item.projectId) || !exists("contracts", item.contractId) || !exists("settlementLines", item.settlementLineId)) errors.push(`Invoice ${item.id} 存在无效业务关联`);
      (item.documentIds || []).forEach(id => { if (!exists("documents", id)) errors.push(`Invoice ${item.id} 引用无效 Document`); });
    });
    [...state.receivables, ...state.payables].forEach(item => {
      if (!exists("projects", item.projectId) || !exists("contracts", item.contractId) || !exists("contractMilestones", item.contractMilestoneId) || !exists("settlementLines", item.settlementLineId)) errors.push(`${item.id} 存在无效结算关联`);
    });
    state.cashTransactions.forEach(item => {
      (item.matchedSettlementLineIds || []).forEach(id => { if (!exists("settlementLines", id)) errors.push(`Cash Transaction ${item.id} 引用无效 Settlement Line`); });
      (item.documentIds || []).forEach(id => { if (!exists("documents", id)) errors.push(`Cash Transaction ${item.id} 引用无效 Document`); });
    });
    const documentTargets = { project: ["projects", "id"], contract: ["contracts", "id"], invoice: ["invoices", "id"], acceptance: ["acceptances", "id"], proposal: ["proposals", "proposalId"], content: ["contents", "contentId"], businessEvent: ["businessEvents", "id"], settlementLine: ["settlementLines", "id"], communication: ["communications", "id"], collaboration: ["collaborations", "id"], receivable: ["receivables", "id"], payable: ["payables", "id"], cashTransaction: ["cashTransactions", "id"], businessRequest: ["businessRequests", "id"] };
    state.documents.forEach(document => (document.links || []).forEach(link => {
      const target = documentTargets[link.objectType];
      if (!target || !exists(target[0], link.objectId, target[1])) errors.push(`Document ${document.id} 指向无效对象 ${link.objectType}:${link.objectId}`);
    }));
    state.businessEvents.forEach(event => {
      (event.evidenceDocumentIds || []).forEach(id => { if (!exists("documents", id)) errors.push(`Business Event ${event.id} 引用无效 Evidence`); });
      (event.relatedObjects || []).forEach(link => { const target = documentTargets[link.type]; if (!target || !exists(target[0], link.id, target[1])) errors.push(`Business Event ${event.id} 指向无效对象 ${link.type}:${link.id}`); });
    });
    state.projects.filter(project => project.status === "completed").forEach(project => { if (!getProjectClosureStatus(project).fullyClosed) errors.push(`Project ${project.id} 标记 completed 但未完全结项`); });
    if (state.costs.some(cost => cost.category === "external_execution")) errors.push("external_execution 同时存在于 costs，可能导致重复计成本");
    const externalKeys = new Set();
    state.settlementLines.filter(line => line.direction === "payable" && line.costBucket === "external_execution").forEach(line => {
      const key = [line.projectId, line.businessObjectType, line.businessObjectId, line.lineType, line.counterpartyId].join("|");
      if (externalKeys.has(key)) errors.push(`外部成本 Settlement Line 重复: ${key}`); externalKeys.add(key);
    });
    const miaCreatorLines = state.settlementLines.filter(line => line.businessObjectType === "collaboration" && line.businessObjectId === "collab-mia-a" && line.lineType === "creator_fee");
    const miaPlatformLines = state.settlementLines.filter(line => line.businessObjectType === "collaboration" && line.businessObjectId === "collab-mia-a" && line.lineType === "platform_fee");
    if (miaCreatorLines.length !== 1 || miaPlatformLines.length < 1) errors.push("Mia Collaboration 必须有且仅有一条 creator_fee，并保留独立 platform_fee");
    state.businessRequests.forEach(request => {
      if (!exists("users", request.applicantUserId) || !exists("users", request.currentApproverUserId) || !exists("projects", request.projectId)) errors.push(`Business Request ${request.id} 存在无效人员或项目关联`);
      if (Math.abs(sum(request.lineItems || [], "amount") - Number(request.amount)) > 0.01) errors.push(`Business Request ${request.id} 的明细金额不等于申请金额`);
      (request.documentIds || []).forEach(id => { if (!exists("documents", id)) errors.push(`Business Request ${request.id} 引用无效 Document`); });
      (request.relatedSettlementLineIds || []).forEach(id => { if (!exists("settlementLines", id)) errors.push(`Business Request ${request.id} 引用无效 Settlement Line`); });
    });
    state.projects.forEach(project => { if (calculateCurrentApprovedBudget(project) !== project.currentApprovedBudget) errors.push(`Project ${project.id} 的 currentApprovedBudget 未取最后 approved Budget Version`); });
    return { valid: errors.length === 0, errors, warnings, checkedAt: new Date().toISOString() };
  }

  function resetDemo() { state = clone(seedState); save(); }

  window.BusinessDemoData = {
    get state() { return state; }, dictionaries, label, findById, projectCollaborations, projectSettlementLines, getCurrentUser, getVisibleProjects, getVisibleProjectIds, setCurrentUser,
    calculateNetRevenue, calculateExternalExecutionCost, calculateCompanyBorneCost, calculateAllocatedOverhead,
    calculateRetainedRebate, calculateProjectProfit, calculateProjectMargin, calculateCommittedCost, calculateCurrentApprovedBudget, calculateBudgetUsage,
    getBusinessClosureStatus, getFinancialClosureStatus, getProjectClosureStatus, validateDemoState,
    formatMoney, formatNumber, analyzeCommunication, interpretAgentInput, updateProposedUpdate, cancelProposedUpdate, ignoreProposedUpdate, confirmProposedUpdate,
    submitReimbursementRequest, approveBusinessRequest, returnBusinessRequest, createProjectFromContractDraft, confirmDocumentOrganization, resetDemo, save
  };
})();
