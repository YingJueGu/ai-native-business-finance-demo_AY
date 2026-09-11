(function () {
  "use strict";

  const STORAGE_KEY = "ai-native-business-demo-locale";
  const exact = {
    "高": "High",
    "低": "Low",
    "未来 7 天": "Next 7 Days",
    "未来 30 天流入": "Next 30-Day Inflow",
    "未来 30 天流出": "Next 30-Day Outflow",
    "当前用户、通知、AI 确认策略和基础经营规则。": "Current user, notifications, AI confirmation policies, and basic business rules.",
    "逾期、超预算和结算异常": "Overdue items, budget overruns, and settlement exceptions",
    "金额与业务事实确认提醒": "Confirmation alerts for amounts and business facts",
    "低风险项目动态": "Low-risk project updates",
    "小A 不拥有无限权限。高风险事实必须由人确认后才写入正式业务状态。": "Xiao A does not have unlimited authority. High-risk facts require human confirmation before entering official business records.",
    "金额与结算变化": "Amount and settlement changes",
    "必须人工确认": "Human confirmation required",
    "客户 / 达人主档新建": "New client / creator records",
    "需要人工确认": "Human confirmation required",
    "普通项目备注": "Routine project notes",
    "允许自动记录": "Automatic recording allowed",
    "低风险字段补全": "Low-risk field completion",
    "允许自动更新": "Automatic updates allowed",
    "不含税收入 + 公司保留返佣 − 各项成本": "Net revenue + retained rebate − all costs",
    "当前没有已确认的利润变动。": "There are no confirmed profit changes.",
    "AI Native 业财经营系统": "AI-Native Business & Finance Operating System",
    "老板工作台": "Owner Workspace",
    "未来 3 个月期末现金": "Three-Month Closing Cash",
    "应收、应付、发票、资金匹配与异常处理": "AR, AP, invoices, cash matching, and exception handling.",
    "统一业务状态形成项目、客户、现金和经营视角。": "A shared business state powers project, client, cash, and performance views.",
    "预算": "Budget",
    "更新": "Updated",
    "客户确认执行版": "Client-Approved Execution Plan",
    "补充通勤场景与达人组合": "Added Commuting Scenarios and Creator Mix",
    "新品种草方向初稿": "Initial New Product Seeding Direction",
    "项目背景": "Project Background",
    "目标与人群": "Objectives & Audience",
    "核心策略": "Core Strategy",
    "达人与内容方向": "Creators & Content Direction",
    "执行排期与预算": "Execution Schedule & Budget",
    "客户 A 将在十月推出新品，需要在上市窗口集中建立产品认知，并以真实使用场景解释核心差异。项目覆盖内容策划、达人执行、发布与效果复盘。": "Client A will launch a new product in October. The project will build concentrated awareness during the launch window and explain key differentiators through real-life use cases. It covers content planning, creator execution, publishing, and performance review.",
    "在新品上市首月形成稳定的内容声量；让目标消费者理解主要使用价值；沉淀后续可以复用的高表现内容方向。 核心人群为 25–35 岁城市女性，关注高效通勤、日常护理与生活品质，主要通过小红书和短视频平台获取购买决策信息。": "Build consistent content visibility during the first month of launch, help target consumers understand the product's core value, and identify reusable high-performing content directions. The audience is urban women aged 25–35 who value efficient commuting, everyday care, and quality of life, and who primarily use Xiaohongshu and short-video platforms for purchase decisions.",
    "以真实体验代替单纯产品陈列，通过通勤、周末与旅行三个场景建立记忆点。不同达人围绕统一信息框架保留个人表达。 小红书承担搜索与决策内容，抖音承担场景化触达。发布节奏以一周集中释放为主，并保留二次剪辑素材。": "Use authentic experience instead of simple product display, building recall through commuting, weekend, and travel scenarios. Each creator keeps an individual voice within a shared message framework. Xiaohongshu supports search and consideration, while Douyin drives scenario-based reach. Publishing is concentrated within one week, with footage retained for later edits.",
    "Mia Notes 负责生活方式图文，LunaDaily 负责短视频叙事。选择依据包括内容方向、互动质量、历史合作效率和结算可执行性。 内容围绕新品第一印象、连续使用体验和具体场景对比展开。每篇内容必须包含明确体验细节与产品差异点。": "Mia Notes leads lifestyle photo posts, while LunaDaily leads short-form video storytelling. Selection considers content fit, engagement quality, prior collaboration efficiency, and settlement feasibility. Content covers first impressions, continued-use experience, and scenario comparisons. Every piece must include concrete experience details and clear product differentiation.",
    "十月上旬完成脚本与素材确认，10 月 15 日起依次发布，随后完成数据回收、客户验收和结算。 执行预算为 ¥145,000。达人费、平台费和制作供应商费用分别形成独立结算义务，公司承担费用与公共费用按统一规则进入利润计算。": "Confirm scripts and assets in early October, begin publishing on October 15, then complete performance collection, client acceptance, and settlement. The execution budget is ¥145,000. Creator fees, platform fees, and production vendor fees are tracked as separate settlement obligations; company-borne costs and overhead enter the shared profit calculation.",
    "提高小红书内容占比并锁定执行排期": "Increased Xiaohongshu content share and locked the execution schedule",
    "团队确认可执行。": "The team confirmed the plan is executable.",
    "同意进入达人执行。": "Approved to proceed to creator execution.",
    "确认 V3。": "V3 confirmed.",
    "处理任务并快速了解经营状态。": "Handle your tasks and review operating status at a glance.",
    "公司经营状态、现金和需要处理的异常。": "Company operations, cash outlook, and items requiring attention.",
    "只显示你负责或参与的项目与相关业务事项。": "Only projects and business items you own or participate in are shown.",
    "从方案、达人执行到结算的完整项目工作区。": "A complete project workspace from proposal and creator execution through settlement.",
    "客户、达人、平台与供应商的业务主档。": "Business records for clients, creators, platforms, and vendors.",
    "消息先形成 Agent 解释，只有明确确认才更新正式业务状态。": "Xiao A first organizes the conversation. Business records change only after explicit confirmation.",
    "小A会整理沟通中的业务信息；涉及正式业务状态变化时，由人确认后写入系统。": "Xiao A organizes business information from conversations. Changes to official records require human confirmation.",
    "应收、应付、发票、资金匹配与异常处理。": "AR, AP, invoices, cash matching, and exception handling.",
    "项目盈利、客户盈利、现金流与经营状态。": "Project and customer profitability, cash flow, and operating status.",
    "告诉我发生了什么，或者把资料交给我。": "Tell me what happened, or give me the documents to process.",
    "我会先整理出建议结果；涉及正式业务数据变化时，由你确认后写入系统。": "I will organize a proposed result first. Changes to official business data are saved only after you confirm.",
    "输入业务情况，或配合票据、合同文件说明希望我处理什么…": "Describe the business situation, or attach receipts or contracts and tell me what to do…",
    "说给我听，或者输入你想让我处理的事情…": "Speak or type what you would like me to handle…",
    "搜索项目、客户、达人、发票、业务记录…": "Search projects, clients, creators, invoices, or business records…",
    "当前浏览器暂不支持语音识别，请使用文字输入。": "Voice recognition is not supported in this browser. Please type instead.",
    "未获得麦克风权限，请使用文字输入。": "Microphone access was not granted. Please type instead.",
    "语音识别暂时中断，请重试或使用文字输入。": "Voice recognition was interrupted. Try again or type instead.",
    "语音识别暂时无法启动，请使用文字输入。": "Voice recognition could not start. Please type instead.",
    "请先说出或输入需要处理的事情": "Please speak or type what you would like handled.",
    "请先输入说明或添加文件": "Please enter instructions or add a file.",
    "也可以拖拽文件到这里": "You can also drag files here",
    "从这里开始": "Start here",
    "新建项目": "Create Project",
    "发起申请": "Start a Request",
    "整理资料": "Organize Documents",
    "＋ 图片 / 文件": "+ Images / Files",
    "停止并使用语音": "Stop and Use Voice",
    "语音输入": "Voice Input",
    "交给小A": "Send to Xiao A",
    "最近资料": "Recent Documents",
    "与当前项目和申请关联的资料": "Documents linked to current projects and requests",
    "查看全部": "View All",
    "查看": "View",
    "查看明细": "View Details",
    "查看项目": "View Projects",
    "我的任务": "My Tasks",
    "我的项目": "My Projects",
    "项目概览": "Project Overview",
    "老板经营信息": "Business Overview",
    "暂无待办": "No pending tasks",
    "当前没有待办事项": "No pending tasks",
    "没有符合条件的已办事项": "No matching completed items",
    "小A整理结果": "Xiao A Summary",
    "我理解到以下业务变化": "I identified the following business changes",
    "待确认业务更新": "Business Update Pending Confirmation",
    "确认前不会修改达人合作或任何财务数据。": "Creator collaboration and financial data will not change before confirmation.",
    "这是演示识别，只读取文件信息和预设规则，不会读取真实票据内容。": "This is a simulated extraction based on file metadata and preset rules. No real receipt content is read.",
    "确认前不会创建项目、合同、应收或其他正式记录。": "No project, contract, AR item, or other official record will be created before confirmation.",
    "当前只是整理建议，确认后才会创建资料记录并关联项目。": "This is only a proposed organization. Document records and project links are created after confirmation.",
    "确认资料如何进入系统": "Confirm How Documents Enter the System",
    "资料已确认进入系统": "Documents have been added to the system",
    "可以直接修改每份资料的关联项目": "You can change the linked project for each document.",
    "请先为每份资料确认关联项目": "Please confirm a project for each document.",
    "演示识别结果": "Simulated Extraction",
    "待确认申请": "Request Pending Confirmation",
    "待确认项目与合同": "Project and Contract Pending Confirmation",
    "费用报销": "Expense Reimbursement",
    "现场交通与物料": "On-site Transport and Materials",
    "确认发起": "Confirm and Submit",
    "确认创建": "Confirm and Create",
    "确认进系统": "Confirm and Add",
    "费用报销已发起，当前状态为等待 Jessica 审批。": "The reimbursement request has been submitted and is awaiting Jessica's approval.",
    "报销申请已发起，等待 Jessica 审批": "Reimbursement request submitted and awaiting Jessica's approval.",
    "项目、合同和收款节点已创建": "Project, contract, and collection milestones created.",
    "已批准，项目成本与利润已同步": "Approved. Project cost and profit have been updated.",
    "已退回补充资料": "Returned for additional information.",
    "业务状态已更新": "Business records updated",
    "达人合作、项目成本、预算使用率、项目利润和业务记录已同步。": "Creator collaboration, project cost, budget utilization, profit, and business records have been updated.",
    "小A 已在人工确认后更新业务状态": "Xiao A updated the business records after human confirmation.",
    "小A 已生成待确认业务更新，正式业务数据尚未变化": "Xiao A created a business update for confirmation. Official business data has not changed.",
    "待确认业务更新已保存，仍等待人工确认": "The proposed update was saved and still awaits human confirmation.",
    "建议已忽略，正式业务数据没有变化": "The suggestion was ignored. Official business data did not change.",
    "已确认：合作、结算、项目利润和业务记录已同步": "Confirmed. Collaboration, settlement, project profit, and business records are synchronized.",
    "演示数据已重置到 Jessica 老板视角": "Demo data reset to Jessica's Owner View.",
    "该项目尚未建立方案对象。": "No proposal has been created for this project.",
    "当前项目尚无已建立的内容记录。": "No content records exist for this project.",
    "当前没有可见会话。": "No conversations are available.",
    "这里是当前项目的一次性 Collaboration，不是长期达人主档。": "These are project-specific creator collaborations, separate from the long-term creator profile.",
    "展示当前项目中的单次达人合作。": "Project-specific creator collaborations.",
    "每一行对应一笔独立结算，分别追踪合同、发票和付款。": "Each row is a separate settlement item with its own contract, invoice, and payment status.",
    "收入、开票与回款分别追踪。": "Revenue, invoicing, and collections are tracked separately.",
    "业务对象与支付、进项发票状态保持关联。": "Business objects remain linked to payment and supplier invoice status.",
    "业务验收完成，等待逾期应收处理。": "Business acceptance is complete; overdue AR remains outstanding.",
    "已满足相关结算 / 收入确认条件": "Related settlement and revenue recognition conditions are met",
    "相关尾款条件已满足": "Final payment conditions are met",
    "相关尾款尚未触发": "Final payment has not been triggered",
    "演示环境只保存文件信息，不保存真实文件内容。": "The demo stores file metadata only, not actual file contents.",
    "本轮仅提供入口，不会改变预算、成本或项目利润。": "This demo entry does not change budget, cost, or project profit.",
    "无独立合同文件 / 按平台规则": "No separate contract file / governed by platform rules",
    "我知道你正在处理当前项目的达人合作。": "I know you are working on this project's creator collaboration.",
    "我可以帮你处理当前范围的回款、付款、发票和流水事项。": "I can help with collections, payments, invoices, and bank transactions in the current scope.",
    "你可以直接问我利润、现金或经营变化的原因。": "Ask me directly about profit, cash, or the reasons behind operating changes.",
    "告诉我发生了什么，或者你想让我帮你做什么。": "Tell me what happened or what you would like me to do.",
    "风从很远的地方来，也会经过今天。": "A distant breeze still finds its way through today.",
    "今天适合把窗开一会儿。": "Today is a good day to leave the window open for a while.",
    "黄昏只是天色慢了一点。": "Dusk is simply the sky slowing down.",
    "有些路，不赶时间才看得见风景。": "Some roads reveal their view only when you are not in a hurry.",
    "雨停以后，城市会亮一点。": "After the rain, the city feels a little brighter.",
    "树影摇动时，午后也有了形状。": "Moving shadows give the afternoon a shape.",
    "9000 吧，8500 真的做不了": "Let's make it 9,000. I really can't do 8,500.",
    "9000 包含差旅吗？": "Does 9,000 include travel expenses?",
    "差旅另外实报实销吧": "Let's reimburse travel expenses separately at cost.",
    "那 10 月 15 号发布，一篇内容，可以吗？": "Then one post published on October 15. Does that work?",
    "可以。": "Yes, that works.",
    "第一版剪辑已经出来，客户提到的产品特写我今晚补上。": "The first cut is ready. I'll add the product close-ups requested by the client tonight.",
    "收到，请明天下午前给到复审版。": "Got it. Please send the revised cut by tomorrow afternoon.",
    "这次图文我这边报价 18000，档期暂时可以留。": "My quote for this photo post is 18,000, and I can hold the slot for now.",
    "设备调度有变化，成片交付可能从 10 月 12 日延到 10 月 14 日。": "Equipment scheduling changed, so final delivery may move from October 12 to October 14.",
    "请今天确认是否会影响达人发布时间。": "Please confirm today whether this affects the creator's publishing date.",
    "识别为执行进度，不修改正式商务状态": "Identified as execution progress; official commercial terms remain unchanged",
    "仅识别到单方面报价，未形成正式协议": "Only a unilateral quote was identified; no agreement has been reached",
    "识别到交付风险，保留为 Task 来源": "Delivery risk identified and retained as a task source",
    "已识别商务价格、差旅与发布时间，并生成待确认业务更新": "Commercial price, travel treatment, and publish date identified; an update awaits confirmation",
    "执行范围调整，经批准增加预算": "Budget increased after approval due to a change in execution scope",
    "按项目活跃天数分摊": "Allocated by active project days",
    "30% 签约，40% 发布，30% 验收": "30% on signing, 40% on publishing, 30% on acceptance",
    "按收款节点开具销售发票": "Sales invoices issued by collection milestone",
    "付款前取得进项发票": "Supplier invoice required before payment",
    "按项目验收结算": "Settlement upon project acceptance",
    "按平台账单结算": "Settlement based on platform statement",
    "按平台规则开票": "Invoiced under platform rules",
    "按阶段结算": "Settled by milestone",
    "按项目确认": "Confirmed by project",
    "按项目结算": "Settled by project",
    "内容发布后 15 日内付款": "Payment within 15 days after publishing",
    "验收后付款": "Payment after acceptance",
    "验收后开票": "Invoice after acceptance",
    "发布后付款": "Payment after publishing",
    "暂不开票": "No invoice required yet",
    "客户已验收": "Client Accepted",
    "项目结算款": "Project Settlement Payment",
    "供应商服务": "Vendor Service",
    "已整理": "Organized",
    "差旅另行实报实销": "Travel reimbursed separately at cost",
    "已达成口头一致": "Verbal agreement reached",
    "尚未验收": "Pending Client Acceptance",
    "部分验收": "Partially Accepted",
    "已验收": "Accepted",
    "当前为原始预算": "Current budget is the original budget",
    "暂无预算变更": "No budget changes",
    "微信（模拟）": "WeChat (Simulated)",
    "人工上传（模拟）": "Manual Upload (Simulated)",
    "本地上传（Demo）": "Local Upload (Demo)",
    "邮件确认（模拟）": "Email Confirmation (Simulated)",
    "银行导入（模拟）": "Bank Import (Simulated)",
    "开票记录（模拟）": "Invoice Record (Simulated)",
    "员工提交（模拟）": "Employee Submission (Simulated)",
    "小A · 用户语音": "Xiao A · User Voice",
    "小A · 用户输入": "Xiao A · User Input",
    "工作台小A": "Workspace Xiao A",
    "工作台 Agent": "Workspace Agent",
    "演示平台结算主体": "Demo Platform Settlement Entity",
    "行吟信息科技（上海）有限公司": "Xingyin Information Technology (Shanghai) Co., Ltd.",
    "北京抖音科技有限公司": "Beijing Douyin Technology Co., Ltd.",
    "公司小红书业务账户": "Xiaohongshu Business Account",
    "公司抖音业务账户": "Douyin Business Account",
    "可开具增值税专用发票": "VAT special invoice available",
    "可开具增值税普通发票": "Standard VAT invoice available"
    ,"生活方式内容稳定，沟通效率高。": "Consistent lifestyle content and efficient communication."
    ,"Mia的日常笔记": "Mia's Daily Notes"
  };

  const terms = {
    "AI Native": "AI-Native", "业财经营系统": "Business & Finance Operating System",
    "项目数": "Project Count", "利润": "Profit", "预计期末现金": "Expected Closing Cash", "月份": "Month", "账龄": "Aging", "预算异常": "Budget Exceptions", "缺失发票": "Missing Invoices", "执行反馈": "Execution Feedback", "报价沟通": "Quote Discussion", "交付风险": "Delivery Risk",
    "未匹配流水": "Unmatched Transactions", "缺失进项发票": "Missing Supplier Invoices", "未开销售发票": "Unissued Sales Invoices", "未匹配银行流水": "Unmatched Bank Transactions", "逾期应收": "Overdue AR", "即将到期应付": "AP Due Soon", "资金匹配": "cash matching", "净额": "Net Amount",
    "当前项目利润为": "Current project profit is", "最近下降": "Recent decrease", "原因是": "because", "合作金额增加": "collaboration value increased", "当前没有已确认的利润变动。": "There are no confirmed profit changes.", "未来三个月现金可覆盖预计支出": "Expected cash can cover projected outflows for the next three months", "我的项目资金事项": "My Project Finance Items", "当前范围有": "The current scope has", "项回款、付款、发票或流水事项需要跟进。": " collection, payment, invoice, or bank transaction items to follow up.", "最近合作表现": "Recent Collaboration Performance", "共有": "There are", "次相关合作": " related collaborations", "已有内容表现记录。": "Content performance data is available.", "当前项目内容尚未发布。": "The current project's content has not been published.", "当前项目风险": "Current Project Risks", "个可见项目标记为风险": " visible projects are marked at risk", "另有": "There are also", "项财务事项需要跟进。": " finance items to follow up.",
    "项目管理": "Projects", "沟通中心": "Communications", "合作管理": "Partners", "财务运营": "Finance Operations", "经营分析": "Business Performance", "工作台": "Workspace", "设置": "Settings", "已切换到": "Switched to",
    "老板视角": "Owner View", "项目团队视角": "Project Team View", "项目团队": "Project Team", "老板": "Owner",
    "小A": "Xiao A", "智能业务助手": "AI Business Assistant", "语言切换": "Language switch", "主导航": "Main navigation", "切换角色": "Switch role", "打开设置": "Open settings", "关闭小A": "Close Xiao A", "打开小A智能业务助手": "Open Xiao A AI Business Assistant",
    "十月新品内容推广": "October New Product Content Campaign", "城市探店计划": "City Discovery Campaign", "秋季品牌内容项目": "Fall Brand Content Campaign", "年度内容合作": "Annual Content Partnership", "冬季新品内容项目": "Winter New Product Content Project",
    "客户 A": "Client A", "客户 B": "Client B", "客户 C": "Client C", "客户 D": "Client D",
    "制作供应商 A": "Production Vendor A", "投放供应商 B": "Media Vendor B", "结算公司 A": "Settlement Company A", "结算公司 B": "Settlement Company B",
    "小红书": "Xiaohongshu", "抖音": "Douyin", "微信公众号": "WeChat Official Account", "微博": "Weibo", "B站": "Bilibili",
    "项目创建": "Project Setup", "方案制作": "Proposal Development", "客户确认": "Client Confirmation", "合同签署": "Contract Signing", "达人执行": "Creator Execution", "内容审核": "Content Review", "发布": "Publishing", "客户验收": "Client Acceptance", "结算": "Settlement", "完成": "Completed",
    "候选": "Candidate", "已联系": "Contacted", "报价中": "Quoting", "谈判中": "Negotiating", "已确认": "Confirmed", "制作中": "In Production", "待发布": "Ready to Publish", "已发布": "Published", "待结算": "Pending Settlement", "已结算": "Settled", "正式": "Active", "停用": "Inactive", "待确认": "Pending Confirmation",
    "草稿": "Draft", "内部审核": "Internal Review", "客户审核": "Client Review", "修改中": "In Revision", "已签署": "Signed", "履行中": "Active", "已终止": "Terminated",
    "已开具": "Issued", "未开具": "Not Issued", "未开票": "Not Invoiced", "已收到": "Received", "未收到": "Not Received", "已收款": "Collected", "待收款": "Pending Collection", "待回款": "Pending Collection", "已付款": "Paid", "待付款": "Pending Payment", "逾期": "Overdue", "即将到期": "Due Soon", "未到期": "Not Due", "已匹配": "Matched", "未匹配": "Unmatched", "待匹配": "Pending Match", "待审批": "Pending Approval", "等待审批": "Awaiting Approval", "已批准": "Approved", "已拒绝": "Rejected", "需补充资料": "More Information Required", "需人工复核": "Manual Review Required", "已办": "Completed", "待办": "To Do",
    "概览": "Overview", "方案": "Proposal", "达人": "Creator", "内容与数据": "Content & Performance", "合同与结算": "Contracts & Settlement", "项目记录": "Project Records",
    "客户": "Client", "平台": "Platform", "供应商": "Vendor", "合作方": "Partner", "合作管理": "Partners", "客户名称": "Client Name", "活跃项目数": "Active Projects", "累计项目数": "Total Projects", "累计合同金额": "Lifetime Contract Value", "应收金额": "AR Balance", "最近合作项目": "Latest Project", "合作中": "Active Relationship", "潜在风险": "Potential Risk",
    "项目 / 客户": "Project / Client", "当前阶段": "Current Stage", "负责人": "Owner", "交付日期": "Delivery Date", "预算使用": "Budget Utilization", "预算使用率": "Budget Utilization", "回款状态": "Collection Status",
    "执行预算": "Execution Budget", "原始预算": "Original Budget", "当前预算": "Current Budget", "当前批准预算": "Current Approved Budget", "已用预算": "Budget Used", "剩余预算": "Remaining Budget", "查看预算变更": "View Budget Changes", "预算变更": "Budget Changes",
    "项目进度": "Project Progress", "项目生命周期": "Project Lifecycle", "关键经营信息": "Key Business Information", "项目周期": "Project Period", "财务闭环状态": "Financial Closure Status", "结项状态": "Closure Status", "业务结项": "Business Closure", "财务结项": "Financial Closure", "完全结项": "Fully Closed", "未完成": "Incomplete", "项目利润率": "Project Margin", "项目利润": "Project Profit",
    "项目盈利": "Project Profitability", "客户盈利": "Customer Profitability", "现金流预测": "Cash Flow Forecast", "应收与回款": "AR & Collections", "项目经营状态": "Project Operating Status", "本期预计收入": "Expected Revenue", "项目组合利润": "Portfolio Profit", "平均项目利润率": "Average Project Margin", "统一业务状态形成项目、客户、现金和经营视角。": "A shared business state powers project, client, cash, and performance views.", "收益": "Income",
    "不含税收入": "Net Revenue", "外部执行成本": "External Execution Cost", "公司承担费用": "Company-Borne Cost", "分摊公共费用": "Allocated Overhead", "公司保留返佣": "Retained Rebate", "利润率": "Margin",
    "当前现金": "Current Cash", "未来 30 天流入": "Next 30-Day Inflow", "未来 30 天流出": "Next 30-Day Outflow", "预计流入": "Expected Inflow", "预计流出": "Expected Outflow", "期初现金": "Opening Cash", "期末现金": "Closing Cash", "收入": "Revenue", "支出": "Outflow",
    "合同编号": "Contract Number", "合同名称": "Contract Name", "合同金额": "Contract Amount", "合同总额": "Contract Total", "结算节点": "Settlement Milestone", "本期应收": "Current Receivable", "销售发票": "Sales Invoice", "进项发票": "Supplier Invoice", "预计收款日": "Expected Collection Date", "实际收款日": "Actual Collection Date", "预计付款日": "Expected Payment Date", "实际付款日": "Actual Payment Date", "付款状态": "Payment Status", "实际收款": "Amount Collected", "协议": "Agreement",
    "客户侧": "Client Side", "成本侧": "Cost Side", "费用类型": "Cost Type", "实际结算对象": "Payee", "结算主体": "Settlement Entity", "业务关联": "Business Link", "合同 / 协议编号": "Contract / Agreement Number", "达人费用": "Creator Fee", "平台费用": "Platform Fee", "平台服务费": "Platform Fee", "供应商费用": "Vendor Fee", "供应商服务": "Vendor Service", "费用报销": "Expense Reimbursement", "客户应收": "Client Receivable", "项目结算款": "Project Settlement Payment",
    "应收": "Accounts Receivable", "应付": "Accounts Payable", "发票": "Invoice", "回款": "Collection", "付款": "Payment", "银行流水": "Bank Transactions", "异常总览": "Exception Overview", "待人工确认事项": "Items Pending Human Confirmation", "异常与待处理事项": "Exceptions & Action Items", "资金匹配": "cash matching", "缺失进项发票": "Missing Supplier Invoices", "未开销售发票": "Unissued Sales Invoices", "未匹配银行流水": "Unmatched Bank Transactions", "逾期应收": "Overdue AR", "即将到期应付": "AP Due Soon", "净额": "Net Amount",
    "项目": "Project", "状态": "Status", "金额": "Amount", "类型": "Type", "说明": "Description", "费用说明": "Expense Description", "费用类别": "Cost Category", "申请人": "Applicant", "当前审批人": "Current Approver", "审批人": "Approver", "上传资料": "Uploaded Documents", "附件": "Attachments", "内容": "Content", "内容制作": "Content Production", "媒体投放": "Media Placement",
    "合同": "Contract", "交易对方": "Counterparty", "签署 / 生效": "Signed / Effective", "付款条款": "Payment Terms", "开票条款": "Invoicing Terms", "关联资料": "Linked Documents", "资料": "Document", "全部资料": "All Documents", "文件名": "File Name", "文件类型": "File Type", "资料类型": "Document Type", "上传人": "Uploaded By", "上传时间": "Uploaded At", "公司资料": "Company Document", "来源": "Source",
    "验收状态": "Acceptance Status", "验收范围": "Acceptance Scope", "验收日期": "Acceptance Date", "验收人 / 来源": "Accepted By / Source", "备注": "Notes", "查看验收资料": "View Acceptance Document", "已验收": "Accepted", "客户已验收": "Client Accepted", "相关尾款条件已满足": "Final payment conditions are met",
    "当前方案": "Current Proposal", "当前版本": "Current Version", "当前状态": "Current Status", "更新时间": "Updated At", "创建人": "Created By", "历史版本": "Version History", "方案内容摘要": "Proposal Summary", "本次修改": "Changes in This Version", "内部意见": "Internal Comments", "员工 comments": "Internal Comments", "老板反馈": "Owner Feedback", "客户反馈": "Client Feedback", "暂无附件": "No Attachments", "项目历史": "Project History", "累计项目利润": "Lifetime Project Profit", "平均回款周期": "Average Collection Cycle", "开票日期": "Invoice Date", "开票能力": "Invoicing Capability",
    "项目达人合作": "Project Creator Collaborations", "内容形式": "Content Format", "报价": "Quote", "已确认金额": "Confirmed Amount", "计划发布时间": "Planned Publish Date", "报价历史": "Quote History", "最终确认金额": "Final Confirmed Amount", "发布时间": "Publish Date", "关联沟通": "Linked Conversation", "关联业务记录": "Linked Business Records", "返回项目达人": "Back to Project Creators",
    "达人昵称": "Creator Name", "内容方向": "Content Focus", "主要平台": "Primary Platform", "平台账号数": "Platform Accounts", "平台账号": "Platform Accounts", "粉丝量级": "Followers", "粉丝数": "Followers", "互动表现": "Engagement", "互动率": "Engagement Rate", "合作次数": "Collaborations", "累计合作": "Total Collaborations", "最近合作": "Latest Collaboration", "最近合作时间": "Latest Collaboration", "合作历史": "Collaboration History", "数据表现": "Performance", "确认合作金额": "Confirmed Collaboration Value", "账号名称": "Account Name", "长期达人档案": "Long-Term Creator Profile", "达人详情 · 跨项目长期档案": "Creator Profile · Cross-Project History", "返回达人主库": "Back to Creator Directory", "默认：正式达人": "Default: Active Creators", "全部状态": "All Statuses", "全部平台": "All Platforms", "搜索达人": "Search creators",
    "平台 / 账号": "Platform / Account", "浏览 / 播放": "Views / Plays", "点赞": "Likes", "收藏": "Saves", "评论": "Comments", "分享": "Shares", "内容链接": "Content Link", "发布状态": "Publish Status", "查看内容": "View Content", "投流": "Boost", "投流功能演示入口": "Content Boost Demo", "暂无数据": "No Data",
    "账号": "Account", "账户余额": "Account Balance", "最近充值": "Latest Top-Up", "扣点": "Fee Rate", "服务类型": "Service Type", "合作项目": "Projects", "相关结算金额": "Related Settlement Amount",
    "联系人": "Contact", "对话列表": "Conversations", "未读": "Unread", "已分析": "Analyzed", "小A整理": "Organize with Xiao A", "AI 分析": "Analyze with Xiao A", "业务更新已处理": "Business Update Processed", "正式状态只会在人工确认后变化。": "Official records change only after human confirmation.", "确认与审批不同": "Confirmation and Approval Are Different", "商务事实走确认；报销等业务动作走审批。": "Business facts require confirmation; actions such as reimbursement require approval.",
    "当前金额": "Current Amount", "建议金额": "Proposed Amount", "当前合作金额": "Current Collaboration Amount", "建议合作金额": "Proposed Collaboration Amount", "差旅": "Travel", "差旅处理": "Travel Treatment", "合作状态": "Collaboration Status", "来源：沟通记录": "Source: Conversation", "状态：等待确认": "Status: Awaiting Confirmation", "确认更新": "Confirm Update", "编辑": "Edit", "修改": "Edit", "取消": "Cancel", "忽略": "Ignore", "保存修改": "Save Changes", "等待确认": "Awaiting Confirmation",
    "我的进行中项目": "My Active Projects", "进行中项目": "Active Projects", "待催回款": "Collections to Follow Up", "待处理财务事项": "Finance Items to Handle", "重点项目": "Priority Projects", "需要关注": "Needs Attention", "回款正常": "Collection On Track", "回款逾期": "Collection Overdue", "回款 / 状态": "Collection / Status", "跟进客户 D 逾期回款": "Follow up on Client D's overdue receivable", "确认 Mia Notes 商务更新": "Confirm Mia Notes commercial update", "告诉小A你要做什么": "Tell Xiao A what you need",
    "确认": "Confirmation", "审批": "Approval", "催款": "Collection", "风险": "Risk", "申请": "Request", "我的申请": "My Requests", "我已确认": "My Confirmations", "我已审批": "My Approvals", "公司事项": "Company Item", "任务": "Task",
    "当前用户与演示角色": "Current User and Demo Role", "当前用户": "Current User", "切换": "Switch", "当前": "Current", "团队成员": "Team Members", "通知偏好": "Notification Preferences", "经营异常": "Operating Exceptions", "普通进度": "Routine Progress", "小A 工作方式": "How Xiao A Works", "业务类型": "Business Type", "处理策略": "Handling Policy", "风险等级": "Risk Level", "基础经营规则": "Basic Business Rules", "演示税率": "Demo Tax Rate", "公共费用分摊": "Overhead Allocation", "重置演示数据": "Reset Demo Data",
    "来源": "Source", "小A识别": "Identified by Xiao A", "人工确认": "Human Confirmed", "原值": "Previous Value", "新值": "New Value", "时间": "Time", "关联对象": "Related Objects", "相关资料": "Related Documents", "详情": "Details", "收起": "Collapse", "是": "Yes", "否": "No", "业务记录": "Business Record", "项目方案": "Project Proposal", "业务申请": "Business Request", "结算记录": "Settlement Record",
    "全部": "All", "进行中": "In Progress", "已完成": "Completed", "存在风险": "At Risk", "返回项目列表": "Back to Projects", "项目列表": "Projects", "返回合作方": "Back to Partners", "返回财务工作台": "Back to Finance Operations",
    "生活方式": "Lifestyle", "美妆": "Beauty", "城市生活": "Urban Lifestyle", "短视频": "Short Video", "图文": "Photo Post", "中视频": "Mid-Length Video", "护肤": "Skincare", "探店": "Venue Discovery", "公众号文章": "Official Account Article",
    "Mia Notes 达人费用": "Mia Notes Creator Fee", "LunaDaily 达人费用": "LunaDaily Creator Fee", "CityWalker 达人费用": "CityWalker Creator Fee", "小红书平台服务费": "Xiaohongshu Platform Fee", "抖音平台服务费": "Douyin Platform Fee", "制作供应商服务": "Production Vendor Service", "场地与交通费用": "Venue and Transport Costs", "样品与视觉费用": "Samples and Visual Production", "项目差旅与样品": "Project Travel and Samples", "现场交通与物料": "On-Site Transport and Materials",
    "客户合同盖章版.pdf": "Signed Client Contract.pdf", "客户年度合同盖章版.pdf": "Signed Annual Client Contract.pdf", "客户验收确认.pdf": "Client Acceptance Confirmation.pdf", "MCN A 合作协议.pdf": "MCN A Collaboration Agreement.pdf", "MCN B 合作协议.pdf": "MCN B Collaboration Agreement.pdf", "平台服务协议.pdf": "Platform Service Agreement.pdf", "微信确认截图.png": "WeChat Confirmation Screenshot.png", "发票示例.pdf": "Sample Invoice.pdf", "差旅票据示例.pdf": "Sample Travel Receipt.pdf", "银行流水示例.pdf": "Sample Bank Statement.pdf", "达人候选表.xlsx": "Creator Shortlist.xlsx", "门店清单.xlsx": "Store List.xlsx", "策略初稿.pdf": "Initial Strategy.pdf", "执行方案-V3.pdf": "Execution Proposal-V3.pdf",
    "提出": "Proposed by", "批准": "Approved by", "日期": "Date", "税率": "Tax Rate", "付款条件": "Payment Terms", "项目方向": "Project Direction", "项目目标": "Project Objectives", "执行策略": "Execution Strategy", "排期与预算": "Schedule & Budget",
    "语音输入": "Voice Input", "语音": "Voice", "未来 3 个月期末现金": "Three-Month Closing Cash", "未来三个月期末现金趋势": "Three-Month Closing Cash Trend", "业务状态": "business status", "商务更新": "commercial update", "查看": "View", "微信（模拟）": "WeChat (Simulated)", "商务条件": "Commercial Terms", "我知道你正在处理": "I know you are working on", "我知道你正在查看": "I know you are viewing"
  };

  let currentLocale = localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh";
  const orderedTerms = Object.entries(terms).sort((a, b) => b[0].length - a[0].length);

  function formatDates(value) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return value
      .replace(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, (_, y, m, d) => `${months[Number(m)-1]} ${Number(d)}, ${y}`)
      .replace(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, (_, m, d) => `${months[Number(m)-1]} ${Number(d)}`)
      .replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/g, (_, y, m, d) => `${months[Number(m)-1]} ${Number(d)}, ${y}`)
      .replace(/(\d{1,2})\s*月/g, (_, m) => months[Number(m)-1]);
  }

  function translate(value) {
    if (currentLocale !== "en" || value == null) return String(value ?? "");
    let output = String(value);
    const direct = exact[output.trim()];
    if (direct) return output.replace(output.trim(), direct);
    output = formatDates(output);
    output = output.replace(/(\d+(?:\.\d+)?)万/g, (_, value) => `${Number(value) * 10}k`);
    output = output
      .replace(/(\d+)\s*个项目/g, "$1 projects")
      .replace(/(\d+)\s*个月/g, "$1 months")
      .replace(/(\d+)\s*天/g, "$1 days")
      .replace(/(\d+)\s*笔/g, "$1 items")
      .replace(/(\d+)\s*份/g, "$1 files")
      .replace(/(\d+)\s*条/g, "$1 items");
    for (const [zh, en] of orderedTerms) output = output.split(zh).join(en);
    output = output
      .replace(/(\d+)\s*days/g, "$1 days")
      .replace(/(\d+)\s*items/g, "$1 items")
      .replace(/(\d+)\s*files/g, "$1 files")
      .replace(/\s+([,.;:])/g, "$1");
    return output;
  }

  function apply(root) {
    const scope = root && root.nodeType ? root : document;
    document.documentElement.lang = currentLocale === "en" ? "en" : "zh-CN";
    document.title = currentLocale === "en" ? "AI-Native Business & Finance Operating System" : "AI Native 业财经营系统";
    if (currentLocale === "en") {
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || /^(SCRIPT|STYLE|TEXTAREA|OPTION)$/.test(parent.tagName) || parent.closest(".language-switch")) return NodeFilter.FILTER_REJECT;
          return /[\u3400-\u9fff]/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => { node.nodeValue = translate(node.nodeValue); });
      scope.querySelectorAll?.("[placeholder],[aria-label],[title]").forEach(element => {
        ["placeholder", "aria-label", "title"].forEach(name => {
          if (element.hasAttribute(name)) element.setAttribute(name, translate(element.getAttribute(name)));
        });
      });
      scope.querySelectorAll?.("option").forEach(option => { option.textContent = translate(option.textContent); });
    }
    document.querySelectorAll("[data-locale]").forEach(button => {
      button.classList.toggle("active", button.dataset.locale === currentLocale);
      button.setAttribute("aria-pressed", String(button.dataset.locale === currentLocale));
    });
  }

  function setLocale(locale) {
    const next = locale === "en" ? "en" : "zh";
    if (next === currentLocale) return;
    currentLocale = next;
    localStorage.setItem(STORAGE_KEY, currentLocale);
    document.dispatchEvent(new CustomEvent("demo:localechange", { detail: { locale: currentLocale } }));
  }

  document.addEventListener("click", event => {
    const control = event.target.closest("[data-locale]");
    if (control) setLocale(control.dataset.locale);
  });

  window.DemoI18n = { apply, locale: () => currentLocale, setLocale, t: key => translate(key), translate };
})();
