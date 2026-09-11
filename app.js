(function () {
  const D = window.BusinessDemoData;
  const I = window.DemoI18n;
  const workspace = document.getElementById("workspace");
  const nav = document.getElementById("primaryNav");
  const toast = document.getElementById("toast");
  const agentOrb = document.getElementById("agentOrb");
  const agentPanelElement = document.getElementById("agentPanel");
  const globalSearch = document.getElementById("globalSearch");
  const searchResults = document.getElementById("searchResults");
  const ui = {
    route: "home", projectFilter: "全部", selectedProjectId: "proj-a", projectTab: "overview",
    selectedProposalVersion: 3, partnerTab: "customers", selectedCustomerId: null, customerTab: "overview",
    selectedCreatorId: null, creatorTab: "overview", creatorSearch: "", creatorStatus: "active", creatorPlatform: "全部平台",
    selectedCollaborationId: null, communicationId: "comm-mia-a", editingProposed: false,
    financeFocus: "overview", reportTab: "project-profit", expandedEventId: null,
    agentOpen: false, agentStage: "idle", agentInput: "", agentInputMode: "text", agentAnswer: "", voiceMessage: "", activeProposedId: null,
    taskTab: "todo", taskFilter: "all", workInput: "", workStage: "idle", workIntent: null, attachments: [], documentDrafts: [], modal: null
  };
  const routes = [
    ["home", "⌂", "工作台"], ["projects", "▣", "项目管理"], ["communications", "◌", "沟通中心"],
    ["partners", "♙", "合作管理"], ["finance", "▤", "财务运营"], ["reports", "▥", "经营分析"]
  ];
  const money = D.formatMoney;
  const number = D.formatNumber;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const pct = value => `${value.toFixed(1)}%`;
  const item = (collection, id, key) => D.findById(collection, id, key);
  const project = id => item("projects", id);
  const customer = id => item("customers", id);
  const creator = id => item("creators", id);
  const account = id => item("creatorAccounts", id);
  const entity = id => item("settlementEntities", id);
  const vendor = id => item("vendors", id);
  const projectCustomer = projectId => customer(project(projectId).customerId);
  const projectEvents = projectId => D.state.businessEvents.filter(e => e.projectId === projectId);
  const projectAR = projectId => D.state.receivables.filter(x => x.projectId === projectId);
  const projectAP = projectId => D.state.payables.filter(x => x.projectId === projectId);
  const projectInvoices = projectId => D.state.invoices.filter(x => x.projectId === projectId);
  const currentUser = () => D.getCurrentUser();
  const isOwner = () => currentUser().role === "owner";
  const visibleProjects = () => D.getVisibleProjects();
  const visibleProjectIds = () => new Set(D.getVisibleProjectIds());
  const activeProjects = () => visibleProjects().filter(p => p.status !== "completed");
  const unreadCount = () => D.state.communications.filter(c => visibleProjectIds().has(c.projectId) && c.unread).length;
  const showToast = text => { toast.textContent = I.translate(text); toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2600); };
  const clearGlobalSearch = () => { globalSearch.value=""; searchResults.innerHTML=""; searchResults.classList.remove("open"); };
  const go = (route, extras = {}) => { Object.assign(ui, extras, { route }); render(); window.scrollTo(0, 0); };
  const statusPill = (text, tone = "blue") => `<span class="pill ${tone}">${text}</span>`;
  const tabs = (items, current, attr) => `<div class="tabs">${items.map(([key, label]) => `<button class="tab ${current === key ? "active" : ""}" data-${attr}="${key}">${label}</button>`).join("")}</div>`;
  const empty = text => `<div class="empty">${text}</div>`;

  function renderNav() {
    const activeRoute = ui.route === "project" || ui.route === "collaboration" ? "projects" : ui.route === "customer" || ui.route === "creator" ? "partners" : ui.route;
    nav.innerHTML = routes.map(([route, icon, label]) => `<button data-route="${route}" class="${activeRoute === route ? "active" : ""}">${icon}<span>${label}</span>${route === "communications" && unreadCount() ? `<span class="count">${unreadCount()}</span>` : ""}</button>`).join("");
    document.getElementById("profileAvatar").textContent = currentUser().name[0];
    document.getElementById("profileName").textContent = currentUser().name;
    document.getElementById("profileRole").textContent = currentUser().roleLabel;
  }

  function pageTitle(title, subtitle, actions = "") {
    const topLevel=["home","projects","communications","partners","finance","reports"].includes(ui.route);
    return `<div class="page-title ${topLevel?"page-hero":""}"><div><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ""}</div>${actions}</div>`;
  }

  function metric(label, value, note = "", tone = "") {
    return `<div class="card metric ${tone}"><span>${label}</span><strong>${value}</strong>${note ? `<small>${note}</small>` : ""}</div>`;
  }

  function projectStatus(projectItem) { return D.label("projectStatuses", projectItem.status); }
  function creatorStatus(creatorItem) { return D.label("creatorStatuses", creatorItem.status); }
  function collaborationStatus(collab) { return D.label("collaborationStatuses", collab.status); }
  function proposalStatus(proposal) { return D.label("proposalStatuses", proposal.status); }

  function projectRow(p) {
    const usage=D.calculateBudgetUsage(p);
    return `<tr class="clickable-row" data-project-id="${p.id}"><td><b>${p.name}</b><small>${projectCustomer(p.id).name}</small></td><td>${statusPill(projectStatus(p), p.risk ? "orange" : "blue")}</td><td>${p.owner}</td><td>${p.deliveryDate||p.endDate}</td><td>${pct(usage)}<div class="progress"><span style="width:${Math.min(usage,100)}%"></span></div></td><td>${statusPill(p.collectionStatus, p.collectionStatus === "逾期" ? "red" : "green")}</td></tr>`;
  }

  function projectTable(projects) {
    return `<div class="table-wrap"><table><thead><tr><th>项目 / 客户</th><th>当前阶段</th><th>负责人</th><th>交付日期</th><th>预算使用</th><th>回款状态</th></tr></thead><tbody>${projects.map(projectRow).join("")}</tbody></table></div>`;
  }

  function renderHome() {
    const projects = visibleProjects();
    if (!isOwner()) return `${pageTitle(`${currentUser().name} 的工作台`, "只显示你负责或参与的项目与相关业务事项。")}
      <section class="kpi-grid three">${metric("我的进行中项目",activeProjects().length)}${metric("待催回款",D.state.receivables.filter(x=>visibleProjectIds().has(x.projectId)&&x.status!=="已收款").length)}${metric("待处理财务事项",teamExceptions().length)}</section>
      <section class="card section"><div class="section-head"><div><h2>我的项目</h2><p>项目、沟通、合作方与结算均按当前项目范围显示。</p></div><button class="btn secondary" data-route="projects">查看项目</button></div>${projectTable(projects)}</section>
      <section class="card section"><h2>与我相关的待处理事项</h2>${exceptionList(true)}</section>`;
    const focus = project("proj-a"), change = D.state.profitChanges[focus.id], nextForecast = D.state.cashForecasts[0];
    const portfolioProfit = projects.reduce((sum, p) => sum + D.calculateProjectProfit(p), 0);
    return `${pageTitle("老板工作台", "公司经营状态、现金和需要处理的异常。")}
      <section class="kpi-grid">${metric("进行中项目", activeProjects().length, "1 个项目存在风险")}${metric("当前现金",money(D.state.currentCash),"公司可用现金")}${metric("未来 30 天净流入",money(nextForecast.inflow-nextForecast.outflow),"预计流入减预计流出")}${metric("项目组合预测利润", money(portfolioProfit), change ? `最新变动 ${money(change.delta)}` : "含公司保留返佣")}</section>
      <section class="card section cash-card"><div class="section-head"><div><h2>现金流预测</h2><p>未来三个月期末现金趋势</p></div><button class="text-btn" data-route="reports" data-report-default="cash-forecast">查看明细</button></div>${cashForecastChart()}</section>
      <div class="two-col home-lower"><section class="card section"><div class="section-head"><div><h2>重点项目</h2><p>确认业务更新后，成本与利润自动变化。</p></div><button class="text-btn" data-route="projects">查看全部</button></div>${projectTable(projects)}</section><section class="card section"><h2>需要关注</h2>${attentionList()}</section></div>`;
  }

  function cashForecastChart() {
    const max=Math.max(...D.state.cashForecasts.map(x=>x.opening+x.inflow-x.outflow));
    return `<div class="cash-summary"><span>当前现金 <b>${money(D.state.currentCash)}</b></span><span>未来 30 天流入 <b>${money(D.state.cashForecasts[0].inflow)}</b></span><span>未来 30 天流出 <b>${money(D.state.cashForecasts[0].outflow)}</b></span></div><div class="cash-chart">${D.state.cashForecasts.map(x=>{const closing=x.opening+x.inflow-x.outflow;return `<div class="cash-month"><div class="bar-area"><span class="cash-bar" style="height:${Math.max(28,closing/max*112)}px"></span></div><b>${x.month.slice(5)} 月</b><small>收入 ${money(x.inflow)}</small><small>支出 ${money(x.outflow)}</small><strong>${money(closing)}</strong></div>`}).join("")}</div>`;
  }

  function attentionList() {
    const pending=Object.keys(D.state.proposedUpdates).length;
    const confirmation=pending?`<button data-finance-focus="review"><span class="attention-dot"></span><b>${pending} 个业务更新等待人工确认</b><span>→</span></button>`:"";
    return `<div class="attention-list"><button data-finance-focus="ar"><span class="attention-dot"></span><b>客户 D 回款逾期 12 天</b><span>→</span></button><button data-project-id="proj-c"><span class="attention-dot"></span><b>项目 C 处于方案阶段且存在风险</b><span>→</span></button>${confirmation}<button data-finance-focus="bank"><span class="attention-dot"></span><b>2 笔银行流水待匹配</b><span>→</span></button></div>`;
  }

  function filteredProjects() {
    const projects=visibleProjects();
    if (ui.projectFilter === "全部") return projects;
    if (ui.projectFilter === "进行中") return projects.filter(p => p.status !== "completed");
    if (ui.projectFilter === "待收款") return projects.filter(p => ["待收款", "逾期"].includes(p.collectionStatus));
    if (ui.projectFilter === "存在风险") return projects.filter(p => p.risk);
    return projects.filter(p => p.status === "completed");
  }

  function renderProjects() {
    const filterTabs = ["全部", "进行中", "待收款", "已完成"].map(x => [x, x]);
    return `${pageTitle("项目管理", "从方案、达人执行到结算的完整项目工作区。")}
      <section class="card section">${tabs(filterTabs, ui.projectFilter, "project-filter")}${projectTable(filteredProjects())}</section>`;
  }

  function projectHeader(p) {
    const budget = D.calculateCurrentApprovedBudget(p), used = D.calculateCommittedCost(p);
    return `<section class="project-summary card"><div class="project-heading"><button class="back" data-route="projects">← 项目列表</button><h1>${p.name}</h1><div class="summary-meta"><span>${projectCustomer(p.id).name}</span><span>${projectStatus(p)}</span><span>负责人 ${p.owner}</span><span>${p.collectionStatus}</span></div></div><div class="summary-numbers"><div><small>执行预算</small><b>${money(budget)}</b></div><div><small>已用预算</small><b>${money(used)}</b></div><div><small>剩余预算</small><b>${money(budget-used)}</b></div></div></section>`;
  }

  function renderProject() {
    const p = project(ui.selectedProjectId);
    const projectTabs = [["overview", "概览"], ["proposal", "方案"], ["creators", "达人"], ["content", "内容与数据"], ["settlement", "合同与结算"], ["records", "项目记录"]];
    const bodies = { overview: projectOverview, proposal: projectProposal, creators: projectCreators, content: projectContent, settlement: projectSettlement, records: projectRecords };
    return `${projectHeader(p)}${tabs(projectTabs, ui.projectTab, "project-tab")}<div>${bodies[ui.projectTab](p)}</div>`;
  }

  function projectOverview(p) {
    const stages = D.dictionaries.projectStatuses;
    const current = stages.findIndex(x => x[0] === p.status);
    const profit = D.calculateProjectProfit(p);
    return `<section class="card section"><h2>项目进度</h2><div class="lifecycle">${stages.map(([key, label], i) => `<div class="stage ${i <= current ? "done" : ""} ${key === p.status ? "current" : ""}"><span>${i + 1}</span><small>${label}</small></div>`).join("")}</div></section>
      <div class="two-col"><section class="card section"><h2>关键经营信息</h2><dl class="info-list"><div><dt>项目周期</dt><dd>${p.startDate} — ${p.endDate}</dd></div><div><dt>项目团队</dt><dd>${[p.owner, ...p.team].join("、")}</dd></div><div><dt>预算使用率</dt><dd>${pct(D.calculateBudgetUsage(p))}</dd></div><div><dt>项目利润率</dt><dd>${pct(D.calculateProjectMargin(p))}</dd></div></dl></section><section class="card section"><h2>财务闭环状态</h2>${closureSummary(p)}</section></div>`;
  }

  function projectProposal(p) {
    const proposal = D.state.proposals.find(x => x.projectId === p.id);
    if (!proposal) return `<section class="card section">${empty("该项目尚未建立方案对象。")}</section>`;
    const versions = D.state.proposalVersions.filter(x => x.proposalId === proposal.proposalId).sort((a, b) => b.version - a.version);
    let selected = versions.find(x => x.version === ui.selectedProposalVersion) || versions[0];
    return `<div class="two-col proposal-layout"><section class="card section"><div class="section-head"><div><h2>当前方案</h2><p>版本历史保留每轮业务反馈。</p></div>${statusPill(proposalStatus(proposal), proposal.status === "approved" ? "green" : "orange")}</div><div class="four-fields"><div><small>当前版本</small><b>V${proposal.currentVersion}</b></div><div><small>当前状态</small><b>${proposalStatus(proposal)}</b></div><div><small>更新时间</small><b>${new Date(proposal.updatedAt).toLocaleDateString("zh-CN")}</b></div><div><small>创建人</small><b>${proposal.createdBy}</b></div></div><h3>历史版本</h3><div class="version-list">${versions.map(v => `<button class="version ${selected.version === v.version ? "active" : ""}" data-proposal-version="${v.version}"><b>V${v.version}</b><span>${v.summary}</span><small>${v.createdBy} · ${new Date(v.createdAt).toLocaleDateString("zh-CN")}</small></button>`).join("")}</div></section>
      <section class="card section version-detail"><div class="section-head"><div><span class="eyebrow">方案 V${selected.version}</span><h2>${selected.summary}</h2></div><span class="muted">${new Date(selected.createdAt).toLocaleString("zh-CN")}</span></div><div class="detail-block"><h3>方案内容摘要</h3><p>${selected.content}</p></div><div class="detail-block"><h3>本次修改</h3><p>${selected.changes}</p></div><div class="feedback-grid"><div><small>员工 comments</small><p>${selected.internalComments}</p></div><div><small>老板反馈</small><p>${selected.managerFeedback}</p></div><div><small>客户反馈</small><p>${selected.clientFeedback}</p></div></div><div class="attachments"><small>附件</small><span>${selected.attachments.length ? selected.attachments.join("、") : "暂无附件"}</span></div></section></div>`;
  }

  function projectCreators(p) {
    const collabs = D.projectCollaborations(p.id);
    return `<section class="card section"><div class="section-head"><div><h2>项目达人合作</h2><p>这里是当前项目的一次性 Collaboration，不是长期达人主档。</p></div></div><div class="table-wrap"><table><thead><tr><th>达人</th><th>平台 / 账号</th><th>内容形式</th><th>当前状态</th><th>报价</th><th>已确认金额</th><th>计划发布时间</th></tr></thead><tbody>${collabs.map(c => { const cr = creator(c.creatorId), ac = account(c.creatorAccountId); return `<tr class="clickable-row" data-collaboration-id="${c.id}"><td><b>${cr.displayName}</b></td><td>${ac.platform}<small>${ac.accountName}</small></td><td>${c.contentType}</td><td>${statusPill(collaborationStatus(c), ["confirmed", "producing", "published", "settled"].includes(c.status) ? "green" : "orange")}</td><td>${money(c.quotedAmount)}</td><td><b>${money(c.confirmedAmount)}</b></td><td>${c.plannedPublishDate}</td></tr>`; }).join("")}</tbody></table></div></section>`;
  }

  function projectContent(p) {
    const contents = D.state.contents.filter(x => x.projectId === p.id);
    if (!contents.length) return `<section class="card section">${empty("当前项目尚无已建立的内容记录。")}</section>`;
    return `<section class="card section"><h2>内容与数据</h2><div class="table-wrap"><table><thead><tr><th>达人</th><th>平台</th><th>内容形式</th><th>发布时间</th><th>内容链接</th><th>发布状态</th><th>浏览 / 播放</th><th>点赞</th><th>收藏</th><th>评论</th><th>分享</th></tr></thead><tbody>${contents.map(c => { const perf = D.state.performanceSnapshots.filter(x => x.contentId === c.contentId).sort((a,b) => b.capturedAt.localeCompare(a.capturedAt))[0]; return `<tr><td>${creator(c.creatorId).displayName}</td><td>${c.platform}</td><td>${c.contentType}</td><td>${c.publishDate}</td><td><a href="${c.contentUrl}" target="_blank" rel="noreferrer">查看内容 ↗</a></td><td>${statusPill(c.status, c.status === "已发布" ? "green" : "orange")}</td><td>${perf ? number(perf.views) : "—"}</td><td>${perf ? number(perf.likes) : "—"}</td><td>${perf ? number(perf.saves) : "—"}</td><td>${perf ? number(perf.comments) : "—"}</td><td>${perf ? number(perf.shares) : "—"}</td></tr>`; }).join("")}</tbody></table></div></section>`;
  }

  function projectSettlement(p) {
    const revenue = D.state.revenues.find(x => x.projectId === p.id);
    const ars = projectAR(p.id);
    const platformName = id => D.state.platforms.find(x => x.id === id)?.name || "—";
    const rows = D.projectSettlementLines(p.id, "payable").filter(line => line.status !== "cancelled").map(line => {
      const collaboration = line.collaborationId && item("collaborations", line.collaborationId);
      const counterparty = line.creatorId ? creator(line.creatorId).displayName : line.counterpartyType === "supplier" ? vendor(line.counterpartyId)?.name : line.counterpartyType === "platform" ? platformName(line.platformId) : line.counterpartyType === "employee" ? D.findById("users", line.counterpartyId)?.name : "公司承担";
      const labels = { creator_fee: ["达人合作", collaboration?.contentType || "达人费用"], platform_fee: ["平台服务", "平台服务费"], vendor_fee: ["供应商服务", "外部执行服务"], reimbursement: ["费用报销", "公司承担费用"] };
      const descriptor = labels[line.lineType] || [line.businessObjectType, line.lineType];
      return { object: descriptor[0], substance: descriptor[1], counterparty, platform: platformName(line.platformId), entity: line.settlementEntityId ? entity(line.settlementEntityId)?.name : "—", amount: line.amount, invoice: line.invoiceId && item("invoices", line.invoiceId), ap: line.payableId && item("payables", line.payableId), status: line.status };
    });
    const customerRows = ars.map((ar, index) => { const line = ar.settlementLineId && item("settlementLines", ar.settlementLineId); const invoice = line?.invoiceId && item("invoices", line.invoiceId); return `<tr><td>${index === 0 ? money(revenue.contractValue) : "同一合同"}</td><td>${index === 0 ? money(revenue.netRevenue) : "—"}</td><td>${index === 0 ? money(revenue.taxAmount) : "—"}</td><td>${invoice ? money(invoice.amount) : "—"}</td><td>${invoice?.status || "未建立"}</td><td>${invoice?.invoiceDate || "—"}</td><td>${money(ar.amount)}</td><td>${ar.expectedDate || "—"}</td><td>${money(ar.actualAmount)}</td><td>${ar.actualDate || "—"}</td><td>${ar.status}</td></tr>`; }).join("");
    return `<section class="card section"><div class="section-head"><div><h2>客户侧</h2><p>收入、开票与回款分别追踪。</p></div>${closureBadge(p)}</div><div class="table-wrap"><table><thead><tr><th>合同 / 报价金额</th><th>不含税收入</th><th>销项税</th><th>销售发票金额</th><th>销售发票状态</th><th>开票日期</th><th>应收金额</th><th>预计收款日</th><th>实际收款</th><th>实际收款日</th><th>回款状态</th></tr></thead><tbody>${customerRows || `<tr><td colspan="11">${empty("暂无应收结算记录")}</td></tr>`}</tbody></table></div></section>
      <section class="card section"><div class="section-head"><div><h2>成本侧</h2><p>业务对象与支付、进项发票状态保持关联。</p></div></div><div class="table-wrap"><table><thead><tr><th>业务对象</th><th>业务实质</th><th>达人 / 供应商</th><th>平台</th><th>结算主体</th><th>应付金额</th><th>进项发票状态</th><th>进项发票金额</th><th>预计付款日</th><th>实际付款日</th><th>付款状态</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.object}</td><td>${r.substance}</td><td>${r.counterparty}</td><td>${r.platform}</td><td>${r.entity}</td><td>${money(r.amount)}</td><td>${r.invoice?.status || "待核对"}</td><td>${r.invoice ? money(r.invoice.amount) : "—"}</td><td>${r.ap?.expectedDate || "—"}</td><td>${r.ap?.actualDate || "—"}</td><td>${r.ap?.status || (r.status === "pending_approval" ? "待审批" : "待建立")}</td></tr>`).join("")}</tbody></table></div></section>`;
  }

  function closureBadge(p) {
    const closure = D.getProjectClosureStatus(p);
    return statusPill(closure.financialClosed ? "具备财务结项条件" : "尚未具备财务结项条件", closure.financialClosed ? "green" : "orange");
  }

  function closureSummary(p) {
    const closure = D.getProjectClosureStatus(p);
    return `<div class="check-list"><div><span>${closure.businessClosed ? "✓" : "!"}</span><p>业务结项<b>${closure.businessClosed ? "已完成" : "未完成"}</b></p></div><div><span>${closure.salesInvoicesComplete ? "✓" : "!"}</span><p>销售发票<b>${closure.salesInvoicesComplete ? "已完成" : "未完成"}</b></p></div><div><span>${closure.receivablesCollected ? "✓" : "!"}</span><p>客户回款<b>${closure.receivablesCollected ? "已收齐" : "未收齐"}</b></p></div><div><span>${closure.payablesPaid && closure.purchaseInvoicesComplete ? "✓" : "!"}</span><p>成本结算<b>${closure.payablesPaid && closure.purchaseInvoicesComplete ? "已完成" : "未完成"}</b></p></div></div>`;
  }

  function projectRecords(p) {
    return `<section class="card section"><div class="section-head"><div><h2>项目记录</h2><p>默认展示业务可读摘要，点击后查看审计字段。</p></div></div>${eventList(projectEvents(p.id), true)}</section>`;
  }

  function eventList(events, expandable) {
    if (!events.length) return empty("暂无项目记录");
    return `<div class="event-list">${events.map(e => `<button class="event-row ${ui.expandedEventId === e.id ? "expanded" : ""}" ${expandable ? `data-event-id="${e.id}"` : ""}><div><b>${e.title}</b><small>${new Date(e.timestamp).toLocaleString("zh-CN")}</small></div><span>${expandable ? (ui.expandedEventId === e.id ? "收起" : "详情") : D.label("projectStatuses", project(e.projectId)?.status)}</span>${ui.expandedEventId === e.id ? `<dl class="audit"><div><dt>Source</dt><dd>${e.source}</dd></div><div><dt>Agent detected</dt><dd>${e.detectedByAgent ? "Yes" : "No"}</dd></div><div><dt>Human confirmed</dt><dd>${e.confirmedByUser ? "Yes" : "No"}</dd></div><div><dt>Old value</dt><dd>${formatValue(e.oldValue)}</dd></div><div><dt>New value</dt><dd>${formatValue(e.newValue)}</dd></div><div><dt>Timestamp</dt><dd>${e.timestamp}</dd></div></dl>` : ""}</button>`).join("")}</div>`;
  }

  function formatValue(value) { return typeof value === "number" ? money(value) : value ?? "—"; }

  function renderCollaboration() {
    const c = item("collaborations", ui.selectedCollaborationId); const cr = creator(c.creatorId); const ac = account(c.creatorAccountId); const p = project(c.projectId);
    const events = D.state.businessEvents.filter(e => e.collaborationId === c.id);
    return `${pageTitle("达人合作详情", `${p.name} · 单次达人合作`, `<button class="btn secondary" data-project-id="${p.id}" data-project-tab="creators">← 返回项目达人</button>`)}<section class="card section"><div class="detail-hero"><div><span class="eyebrow">${ac.platform} · ${ac.accountName}</span><h2>${cr.displayName}</h2><p>${c.contentType} · ${c.plannedPublishDate}</p></div>${statusPill(collaborationStatus(c), "green")}</div><div class="detail-grid"><div><small>最终确认金额</small><b>${money(c.confirmedAmount)}</b></div><div><small>结算主体</small><b>${entity(c.settlementEntityId).name}</b></div><div><small>差旅处理</small><b>${c.travelTreatment}</b></div></div></section><div class="two-col"><section class="card section"><h2>报价历史</h2>${c.quoteHistory.map(q => `<div class="line-item"><span>${q.at}</span><b>${money(q.amount)}</b></div>`).join("")}</section><section class="card section"><h2>关联沟通</h2>${c.communicationIds.length ? `<button class="action-row" data-open-communication="${c.communicationIds[0]}"><span>微信（模拟）</span><b>${c.communicationIds.length} 个会话 →</b></button>` : empty("暂无关联沟通")}</section></div><section class="card section"><h2>关联业务记录</h2>${eventList(events, true)}</section>`;
  }

  function renderPartners() {
    const partnerTabs = [["customers", "客户"], ["creators", "达人"]];
    return `${pageTitle("合作方", "客户关系与长期达人主档。")}${tabs(partnerTabs, ui.partnerTab, "partner-tab")}${ui.partnerTab === "customers" ? customerList() : creatorList()}`;
  }

  function customerList() {
    const scopedProjects=visibleProjects(); const customerIds=new Set(scopedProjects.map(p=>p.customerId));
    const rows = D.state.customers.filter(c=>customerIds.has(c.id)).map(c => {
      const projects = scopedProjects.filter(p => p.customerId === c.id); const ar = projects.reduce((sum, p) => sum + projectAR(p.id).reduce((s,x)=>s+(x.amount-x.actualAmount),0),0);
      const recent = [...projects].sort((a,b)=>b.startDate.localeCompare(a.startDate))[0];
      return `<tr class="clickable-row" data-customer-id="${c.id}"><td><b>${c.name}</b></td><td>${projects.filter(p=>p.status!=="completed").length}</td><td>${projects.length}</td><td>${money(projects.reduce((s,p)=>s+p.contractValue,0))}</td><td>${money(ar)}</td><td>${recent?.name || "—"}</td><td>${statusPill(c.status, c.status === "合作中" ? "green" : "orange")}</td></tr>`;
    }).join("");
    return `<section class="card section"><div class="table-wrap"><table><thead><tr><th>客户名称</th><th>活跃项目数</th><th>累计项目数</th><th>累计合同金额</th><th>应收金额</th><th>最近合作项目</th><th>状态</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }

  function creatorList() {
    const platforms = ["全部平台", ...new Set(D.state.creatorAccounts.map(a => a.platform))];
    const scopedCreatorIds=new Set(D.state.collaborations.filter(c=>visibleProjectIds().has(c.projectId)).map(c=>c.creatorId));
    const filtered = D.state.creators.filter(cr => (isOwner() || scopedCreatorIds.has(cr.id)) && (() => {
      const accounts = D.state.creatorAccounts.filter(a => a.creatorId === cr.id);
      const query = ui.creatorSearch.trim().toLowerCase();
      return (!query || cr.displayName.toLowerCase().includes(query) || accounts.some(a => a.accountName.toLowerCase().includes(query))) &&
        (ui.creatorStatus === "all" || cr.status === ui.creatorStatus) && (ui.creatorPlatform === "全部平台" || accounts.some(a => a.platform === ui.creatorPlatform));
    })());
    const rows = filtered.map(cr => { const accounts = D.state.creatorAccounts.filter(a => a.creatorId === cr.id); const collabs = D.state.collaborations.filter(c => c.creatorId === cr.id && visibleProjectIds().has(c.projectId)); const recent = [...collabs].sort((a,b)=>b.plannedPublishDate.localeCompare(a.plannedPublishDate))[0]; const entities = [...new Set(collabs.map(c => entity(c.settlementEntityId)?.name).filter(Boolean))]; return `<tr class="clickable-row" data-creator-id="${cr.id}"><td><b>${cr.displayName}</b></td><td>${accounts.map(a=>a.platform).join("、")}</td><td>${accounts.length}</td><td>${collabs.length}</td><td>${recent?.plannedPublishDate || "—"}</td><td>${entities.join("、") || "—"}</td><td>${statusPill(creatorStatus(cr), cr.status === "active" ? "green" : cr.status === "inactive" ? "gray" : "orange")}</td></tr>`; }).join("");
    return `<section class="card section"><div class="filters"><label class="search"><span>⌕</span><input id="creatorSearch" placeholder="搜索达人或账号" value="${ui.creatorSearch}"></label><select id="creatorStatus"><option value="active" ${ui.creatorStatus === "active" ? "selected" : ""}>默认：正式达人</option><option value="all" ${ui.creatorStatus === "all" ? "selected" : ""}>全部状态</option>${D.dictionaries.creatorStatuses.map(([key,label])=>`<option value="${key}" ${ui.creatorStatus === key ? "selected" : ""}>${label}</option>`).join("")}</select><select id="creatorPlatform">${platforms.map(p=>`<option ${ui.creatorPlatform === p ? "selected" : ""}>${p}</option>`).join("")}</select></div><div class="table-wrap"><table><thead><tr><th>达人昵称</th><th>主要平台</th><th>平台账号数</th><th>合作次数</th><th>最近合作时间</th><th>所属 / 常用结算主体</th><th>状态</th></tr></thead><tbody>${rows || `<tr><td colspan="7">${empty("没有符合筛选条件的达人。")}</td></tr>`}</tbody></table></div></section>`;
  }

  function renderCustomer() {
    const c = customer(ui.selectedCustomerId); const projects = visibleProjects().filter(p => p.customerId === c.id);
    const customerTabs = [["overview","概览"],["projects","项目历史"],["contracts","合同 / 报价"],["collections","回款"],["invoices","销售发票"]];
    const totalValue = projects.reduce((s,p)=>s+p.contractValue,0); const totalProfit = projects.reduce((s,p)=>s+D.calculateProjectProfit(p),0);
    let body = "";
    if (ui.customerTab === "overview") body = `<section class="kpi-grid three">${metric("累计合同金额",money(totalValue))}${metric("累计项目利润",money(totalProfit))}${metric("平均回款周期",`${c.averageCollectionDays} 天`)}</section>${projectTable(projects)}`;
    if (ui.customerTab === "projects") body = projectTable(projects);
    if (ui.customerTab === "contracts") body = simpleTable(["项目","合同 / 报价金额","当前阶段"], projects.map(p=>[p.name,money(p.contractValue),projectStatus(p)]));
    if (ui.customerTab === "collections") body = simpleTable(["项目","应收金额","预计收款日","状态"], projects.flatMap(p=>projectAR(p.id).map(ar=>[p.name,money(ar.amount-ar.actualAmount),ar.expectedDate,ar.status])));
    if (ui.customerTab === "invoices") body = simpleTable(["项目","销售发票金额","开票日期","状态"], projects.flatMap(p=>projectInvoices(p.id).filter(i=>i.direction==="sales").map(i=>[p.name,money(i.amount),i.invoiceDate||"—",i.status])));
    return `${pageTitle(c.name, `客户详情 · ${c.status}`, `<button class="btn secondary" data-route="partners">← 返回合作方</button>`)}${tabs(customerTabs,ui.customerTab,"customer-tab")}<section class="card section">${body}</section>`;
  }

  function renderCreator() {
    const cr = creator(ui.selectedCreatorId); const accounts = D.state.creatorAccounts.filter(a=>a.creatorId===cr.id); const collabs = D.state.collaborations.filter(c=>c.creatorId===cr.id&&visibleProjectIds().has(c.projectId));
    const creatorTabs = [["overview","概览"],["accounts","平台账号"],["history","合作历史"],["settlement","结算主体"],["performance","数据表现"]];
    let body = "";
    if (ui.creatorTab === "overview") body = `<div class="detail-hero"><div><span class="eyebrow">长期达人档案</span><h2>${cr.displayName}</h2><p>${cr.notes}</p></div>${statusPill(creatorStatus(cr),cr.status==="active"?"green":"orange")}</div><section class="kpi-grid three">${metric("平台账号",accounts.length)}${metric("累计合作",collabs.length)}${metric("已确认合作金额",money(collabs.reduce((s,c)=>s+c.confirmedAmount,0)))}</section>`;
    if (ui.creatorTab === "accounts") body = simpleTable(["平台","账号名称","粉丝数","互动率","状态","主页"],accounts.map(a=>[a.platform,a.accountName,number(a.followers),pct(a.engagementRate*100),a.status==="active"?"正常":"待核对",`<a href="${a.profileUrl}" target="_blank" rel="noreferrer">查看 ↗</a>`]));
    if (ui.creatorTab === "history") body = simpleTable(["项目","平台 / 账号","内容形式","确认金额","状态","发布时间"],collabs.map(c=>{const a=account(c.creatorAccountId);return [`<button class="link-button" data-collaboration-id="${c.id}">${project(c.projectId).name}</button>`,`${a.platform} / ${a.accountName}`,c.contentType,money(c.confirmedAmount),collaborationStatus(c),c.plannedPublishDate]}));
    if (ui.creatorTab === "settlement") body = simpleTable(["结算主体","类型","开票能力","使用项目"],[...new Set(collabs.map(c=>c.settlementEntityId))].map(id=>{const e=entity(id);return [e.name,e.type,e.invoiceCapability,collabs.filter(c=>c.settlementEntityId===id).map(c=>project(c.projectId).name).join("、")]}));
    if (ui.creatorTab === "performance") { const content = D.state.contents.filter(c=>c.creatorId===cr.id); body = simpleTable(["内容","平台","发布时间","浏览 / 播放","点赞","收藏","评论","分享"],content.map(c=>{const s=D.state.performanceSnapshots.find(x=>x.contentId===c.contentId);return [c.contentType,c.platform,c.publishDate,s?number(s.views):"—",s?number(s.likes):"—",s?number(s.saves):"—",s?number(s.comments):"—",s?number(s.shares):"—"]})); }
    return `${pageTitle(cr.displayName, `达人详情 · 跨项目长期档案`, `<button class="btn secondary" data-route="partners" data-partner-default="creators">← 返回达人主库</button>`)}${tabs(creatorTabs,ui.creatorTab,"creator-tab")}<section class="card section">${body}</section>`;
  }

  function simpleTable(headers, rows) {
    return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">${empty("暂无数据")}</td></tr>`}</tbody></table></div>`;
  }

  function renderCommunications() {
    const c = item("communications", ui.communicationId); const collab = item("collaborations", c.collaborationId); const p = project(c.projectId);
    return `${pageTitle("沟通", "消息经 Agent 解释并由人确认后，才更新正式业务状态。")}
      <div class="inbox-layout"><aside><button class="conversation active"><div><b>Mia Notes</b><span>${c.channel}</span></div>${statusPill(c.unread?"未读":c.ignored?"已忽略":"已分析",c.unread?"red":"blue")}</button><div class="guardrail"><b>确认边界</b><p>Agent 只生成 Proposed State。正式数据必须由人点击确认。</p></div></aside><section class="card section conversation-main"><div class="section-head"><div><h2>Mia Notes × ${p.name}</h2><p>小红书 · ${account(collab.creatorAccountId).accountName}</p></div><button class="btn agent" data-action="analyze">✦ AI 分析</button></div><div class="messages">${c.messages.map(m=>`<div class="message ${m.sender==="Jessica"?"mine":""}"><b>${m.sender}</b><p>${m.text}</p></div>`).join("")}</div>${proposedUpdate(c.id)}${!D.state.proposedUpdates[c.id]&&c.analyzed&&!c.ignored?`<div class="success-note"><b>更新已确认</b><span>Collaboration、项目利润和 Business Event 已同步。</span></div>`:""}</section></div>`;
  }

  function productProposedUpdate(id) {
    const p=D.state.proposedUpdates[id]; if(!p)return "";
    if(ui.editingProposed)return `<div class="proposal-card"><div class="section-head"><h2>编辑待确认业务更新</h2>${statusPill("等待确认","orange")}</div><div class="form-grid"><label>内容形式<input id="editContentType" value="${p.contentType}"></label><label>计划发布时间<input id="editPublishDate" type="date" value="${p.publishDate}"></label><label>合作金额<input id="editAmount" type="number" value="${p.proposedAmount}"></label><label>差旅处理<input id="editTravel" value="${p.travelTreatment}"></label></div><div class="actions"><button class="btn secondary" data-action="cancel-edit">取消</button><button class="btn primary" data-action="save-proposed">保存修改</button></div></div>`;
    const cr=creator(p.creatorId),ac=account(p.creatorAccountId);
    return `<div class="proposal-card"><div class="section-head"><div><span class="eyebrow">小A整理结果</span><h2>待确认业务更新</h2></div>${statusPill("等待确认","orange")}</div><div class="proposed-fields"><div><small>达人</small><b>${cr.displayName}</b></div><div><small>平台账号</small><b>${p.platform} · ${ac.accountName}</b></div><div><small>内容形式</small><b>${p.contentType}</b></div><div><small>计划发布时间</small><b>${p.publishDate}</b></div><div><small>差旅处理</small><b>${p.travelTreatment}</b></div><div><small>合作状态</small><b>${p.agreementStatus}</b></div></div><div class="value-change"><div><small>当前金额</small><strong>${money(p.currentAmount)}</strong></div><span>→</span><div><small>建议金额</small><strong>${money(p.proposedAmount)}</strong></div></div><div class="proposal-meta"><span>来源：沟通记录</span><span>状态：等待确认</span></div><div class="actions"><button class="btn danger" data-action="ignore-proposed">忽略</button><button class="btn secondary" data-action="edit-proposed">编辑</button><button class="btn agent" data-action="confirm-proposed">确认更新</button></div></div>`;
  }

  function renderCommunicationsProduct() {
    const visible=D.state.communications.filter(comm=>visibleProjectIds().has(comm.projectId));
    if(!visible.some(comm=>comm.id===ui.communicationId))ui.communicationId=visible[0]?.id;
    const comm=item("communications",ui.communicationId); if(!comm)return pageTitle("沟通中心","当前没有可见会话。");
    const name=communicationTitle(comm),p=project(comm.projectId),conversationType=({commercial_terms:"商务条件",execution_feedback:"执行反馈",quotation:"报价沟通",delivery_risk:"交付风险"}[comm.conversationType]||"业务沟通");
    const analysis=comm.analysisResult?`<div class="analysis-note"><span class="eyebrow">小A整理结果</span><b>${comm.analysisResult}</b></div>`:"";
    return `${pageTitle("沟通中心","小A会整理沟通中的业务信息；涉及正式业务状态变化时，由人确认后写入系统。")}<div class="inbox-layout"><aside>${visible.map(c=>`<button class="conversation ${c.id===comm.id?"active":""}" data-communication-id="${c.id}"><div><b>${communicationTitle(c)}</b><span>${project(c.projectId).name} · ${c.channel}</span></div>${c.unread?statusPill("未读","red"):statusPill("已整理","blue")}</button>`).join("")}<div class="guardrail"><b>确认与审批不同</b><p>商务事实走确认；报销等业务动作走审批。</p></div></aside><section class="card section conversation-main"><div class="section-head"><div><h2>${name} × ${p.name}</h2><p>${conversationType}</p></div><button class="btn agent" data-action="analyze" data-communication-id="${comm.id}">✦ 小A整理</button></div><div class="messages">${comm.messages.map(m=>`<div class="message ${["Jessica","Amy"].includes(m.sender)?"mine":""}"><b>${m.sender}</b><p>${m.text}</p></div>`).join("")}</div>${analysis}${productProposedUpdate(comm.id)}${comm.analyzed&&!D.state.proposedUpdates[comm.id]&&comm.interpretationEligibility==="agreement_confirmed"?`<div class="success-note"><b>业务更新已处理</b><span>正式状态只会在人工确认后变化。</span></div>`:""}</section></div>`;
  }

  function proposedUpdate(id) {
    const p = D.state.proposedUpdates[id]; if (!p) return "";
    if (ui.editingProposed) return `<div class="proposal-card"><div class="section-head"><h2>编辑 Proposed State</h2>${statusPill("等待人工确认","orange")}</div><div class="form-grid"><label>内容形式<input id="editContentType" value="${p.contentType}"></label><label>计划发布时间<input id="editPublishDate" type="date" value="${p.publishDate}"></label><label>合作金额<input id="editAmount" type="number" value="${p.proposedAmount}"></label><label>差旅处理<input id="editTravel" value="${p.travelTreatment}"></label></div><div class="actions"><button class="btn secondary" data-action="cancel-edit">取消</button><button class="btn primary" data-action="save-proposed">保存修改</button></div></div>`;
    const cr = creator(p.creatorId), ac = account(p.creatorAccountId);
    return `<div class="proposal-card"><div class="section-head"><div><span class="eyebrow">Agent Interpretation</span><h2>Proposed State</h2></div>${statusPill("等待人工确认","orange")}</div><div class="proposed-fields"><div><small>达人</small><b>${cr.displayName}</b></div><div><small>平台账号</small><b>${p.platform} · ${ac.accountName}</b></div><div><small>内容形式</small><b>${p.contentType}</b></div><div><small>计划发布时间</small><b>${p.publishDate}</b></div><div><small>差旅处理</small><b>${p.travelTreatment}</b></div><div><small>合作状态</small><b>${p.agreementStatus}</b></div></div><div class="value-change"><div><small>Current</small><strong>${money(p.currentAmount)}</strong></div><span>→</span><div><small>Proposed</small><strong>${money(p.proposedAmount)}</strong></div></div><div class="proposal-meta"><span>Source: Communication</span><span>Status: Awaiting Human Confirmation</span></div><div class="actions"><button class="btn danger" data-action="ignore-proposed">忽略</button><button class="btn secondary" data-action="edit-proposed">编辑</button><button class="btn agent" data-action="confirm-proposed">确认更新</button></div></div>`;
  }

  function exceptionList(compact) {
    const ids=visibleProjectIds(), receivables=D.state.receivables.filter(x=>ids.has(x.projectId)&&x.status==="逾期"), payables=D.state.payables.filter(x=>ids.has(x.projectId)&&x.status==="即将到期"), purchase=D.state.invoices.filter(x=>ids.has(x.projectId)&&x.direction==="purchase"&&x.status!=="已收到"), sales=D.state.invoices.filter(x=>ids.has(x.projectId)&&x.direction==="sales"&&x.status!=="已开具"), bank=D.state.cashTransactions.filter(x=>ids.has(x.projectId)&&x.status==="未匹配"), review=Object.values(D.state.proposedUpdates).filter(x=>ids.has(x.projectId));
    const items = [
      ["逾期应收", `${receivables.length} 笔 · ${money(receivables.reduce((s,x)=>s+x.amount-x.actualAmount,0))}`, "ar", "red"],
      ["即将到期应付", `${payables.length} 笔 · ${money(payables.reduce((s,x)=>s+x.amount,0))}`, "ap", "orange"],
      ["缺失进项发票", `${purchase.length} 笔`, "purchase-invoice", "orange"],
      ["未开销售发票", `${sales.length} 笔`, "sales-invoice", "purple"],
      ["未匹配银行流水", `${bank.length} 笔 · 净额 ${money(bank.reduce((s,x)=>s+x.amount,0))}`, "bank", "purple"],
      ["待人工确认事项", `${review.length} 条 Proposed State`, "review", "blue"]
    ];
    return `<div class="exception-list">${items.map(([title,detail,focus,tone])=>`<button class="exception ${compact?"compact":""}" data-finance-focus="${focus}"><span class="dot ${tone}"></span><div><b>${title}</b><small>${detail}</small></div><span>→</span></button>`).join("")}</div>`;
  }

  function teamExceptions() {
    const ids=visibleProjectIds();
    return [...D.state.receivables.filter(x=>ids.has(x.projectId)&&x.status!=="已收款"),...D.state.payables.filter(x=>ids.has(x.projectId)&&x.status!=="已付款"),...D.state.invoices.filter(x=>ids.has(x.projectId)&&!["已开具","已收到"].includes(x.status)),...D.state.cashTransactions.filter(x=>ids.has(x.projectId)&&x.status==="未匹配")];
  }

  function renderFinance() {
    const ids=visibleProjectIds(), overdue=D.state.receivables.filter(x=>ids.has(x.projectId)&&x.status==="逾期"), due=D.state.payables.filter(x=>ids.has(x.projectId)&&x.status==="即将到期"), missing=D.state.invoices.filter(x=>ids.has(x.projectId)&&x.direction==="purchase"&&x.status!=="已收到"), bank=D.state.cashTransactions.filter(x=>ids.has(x.projectId)&&x.status==="未匹配");
    if (ui.financeFocus === "overview") return `${pageTitle("财务运营", isOwner()?"应收、应付、发票、资金匹配与异常处理":"仅显示你负责或参与项目的应收、应付、发票、资金匹配与异常。") }<section class="kpi-grid">${metric("逾期应收",money(overdue.reduce((s,x)=>s+x.amount-x.actualAmount,0)),`${overdue.length} 个项目`,"red")}${metric("即将到期应付",money(due.reduce((s,x)=>s+x.amount,0)),"未来 7 天")}${metric("缺失进项发票",missing.length)}${metric("未匹配流水",bank.length,`净额 ${money(bank.reduce((s,x)=>s+x.amount,0))}`)}</section><section class="card section"><h2>异常与待处理事项</h2>${exceptionList(false)}</section>`;
    const map = {
      ar:["逾期应收",["项目","客户","应收金额","预计收款日","账龄","状态"],D.state.receivables.filter(x=>ids.has(x.projectId)&&x.status==="逾期").map(x=>[`<button class="link-button" data-project-id="${x.projectId}" data-project-tab="settlement">${project(x.projectId).name}</button>`,projectCustomer(x.projectId).name,money(x.amount-x.actualAmount),x.expectedDate,x.agingBucket,x.status])],
      ap:["即将到期应付",["项目","业务对象","应付金额","预计付款日","状态"],D.state.payables.filter(x=>ids.has(x.projectId)&&x.status==="即将到期").map(x=>[`<button class="link-button" data-project-id="${x.projectId}" data-project-tab="settlement">${project(x.projectId).name}</button>`,x.businessObject,money(x.amount),x.expectedDate,x.status])],
      "purchase-invoice":["缺失进项发票",["项目","方向","金额","状态"],D.state.invoices.filter(x=>ids.has(x.projectId)&&x.direction==="purchase"&&x.status!=="已收到").map(x=>[`<button class="link-button" data-project-id="${x.projectId}" data-project-tab="settlement">${project(x.projectId).name}</button>`,`进项`,money(x.amount),x.status])],
      "sales-invoice":["未开销售发票",["项目","客户","金额","状态"],D.state.invoices.filter(x=>ids.has(x.projectId)&&x.direction==="sales"&&x.status!=="已开具").map(x=>[`<button class="link-button" data-project-id="${x.projectId}" data-project-tab="settlement">${project(x.projectId).name}</button>`,projectCustomer(x.projectId).name,money(x.amount),x.status])],
      bank:["未匹配银行流水",["项目","日期","对方","金额","状态"],D.state.cashTransactions.filter(x=>ids.has(x.projectId)&&x.status==="未匹配").map(x=>[project(x.projectId).name,x.date,x.counterparty,money(x.amount),x.status])],
      review:["待人工确认事项",["来源","项目","对象","当前值","建议值","状态"],Object.values(D.state.proposedUpdates).filter(x=>ids.has(x.projectId)).map(x=>[x.source,project(x.projectId).name,creator(x.creatorId).displayName,money(x.currentAmount),money(x.proposedAmount),"等待人工确认"])]
    };
    const current = map[ui.financeFocus];
    return `${pageTitle(current[0], "财务异常处理上下文", `<button class="btn secondary" data-finance-focus="overview">← 财务工作台</button>`)}<section class="card section">${simpleTable(current[1],current[2])}</section>`;
  }

  function profitRows(projects) {
    return projects.map(p=>[p.name,money(D.calculateNetRevenue(p)),`+ ${money(D.calculateRetainedRebate(p))}`,money(D.calculateExternalExecutionCost(p)),money(D.calculateCompanyBorneCost(p)),money(D.calculateAllocatedOverhead(p)),`<b>${money(D.calculateProjectProfit(p))}</b>`,pct(D.calculateProjectMargin(p))]);
  }

  function renderReports() {
    const reportTabs = [["project-profit","项目盈利"],["customer-profit","客户盈利"],["cash-forecast","现金流预测"],["ar","应收与回款"],["operations","项目经营状态"]];
    return `${pageTitle("经营分析", "统一业务状态形成项目、客户、现金和经营视角。")}${tabs(reportTabs,ui.reportTab,"report-tab")}<section class="card section">${reportBody()}</section>`;
  }

  function reportBody() {
    if (ui.reportTab === "project-profit") return simpleTable(["项目","不含税收入","公司保留返佣（收益）","外部执行成本","公司承担费用","分摊公共费用","项目利润","利润率"],profitRows(visibleProjects()));
    if (ui.reportTab === "customer-profit") { const customerIds=new Set(visibleProjects().map(p=>p.customerId)); return simpleTable(["客户","项目数","不含税收入","利润","利润率","应收","平均回款周期"],D.state.customers.filter(c=>customerIds.has(c.id)).map(c=>{const ps=visibleProjects().filter(p=>p.customerId===c.id),net=ps.reduce((s,p)=>s+D.calculateNetRevenue(p),0),profit=ps.reduce((s,p)=>s+D.calculateProjectProfit(p),0),ar=ps.reduce((s,p)=>s+projectAR(p.id).reduce((a,x)=>a+x.amount-x.actualAmount,0),0);return [c.name,ps.length,money(net),money(profit),pct(net?profit/net*100:0),money(ar),`${c.averageCollectionDays} 天`]})); }
    if (ui.reportTab === "cash-forecast") { if(!isOwner()) return empty("项目团队视角不展示公司级现金流预测。"); const first=D.state.cashForecasts[0]; return `<section class="kpi-grid">${metric("当前现金",money(D.state.currentCash))}${metric("未来 30 天流入",money(first.inflow))}${metric("未来 30 天流出",money(first.outflow))}${metric("预计期末现金",money(first.opening+first.inflow-first.outflow))}</section>${simpleTable(["月份","期初现金","预计流入","预计流出","期末现金"],D.state.cashForecasts.map(x=>[x.month,money(x.opening),money(x.inflow),money(x.outflow),money(x.opening+x.inflow-x.outflow)]))}`; }
    if (ui.reportTab === "ar") { const ids=visibleProjectIds(), receivables=D.state.receivables.filter(x=>ids.has(x.projectId)), buckets=[["Current","当前"],["Overdue","逾期"],["7 Days","7 天"],["30 Days","30 天"],["60 Days","60 天"]]; const values=buckets.map(([key])=>receivables.filter(x=>key==="Overdue"?x.status==="逾期":x.agingBucket===key).reduce((s,x)=>s+x.amount-x.actualAmount,0)); return `<section class="kpi-grid five">${buckets.map(([,label],i)=>metric(label,money(values[i]))).join("")}</section>${simpleTable(["项目","客户","应收金额","预计收款日","账龄","状态"],receivables.map(x=>[project(x.projectId).name,projectCustomer(x.projectId).name,money(x.amount-x.actualAmount),x.expectedDate,({Current:"当前","7 Days":"7 天","30 Days":"30 天","60 Days":"60 天"}[x.agingBucket]||x.agingBucket),x.status]))}`; }
    const scopedProjects=visibleProjects(), scopedIds=visibleProjectIds(), missingInvoices=D.state.invoices.filter(x=>scopedIds.has(x.projectId)&&x.status==="未收到").length, due=D.state.payables.filter(x=>scopedIds.has(x.projectId)&&x.status==="即将到期").length;
    return `<section class="kpi-grid">${metric("进行中项目",activeProjects().length)}${metric("存在风险",scopedProjects.filter(p=>p.risk).length)}${metric("待收款",scopedProjects.filter(p=>["待收款","逾期"].includes(p.collectionStatus)).length)}${metric("已完成",scopedProjects.filter(p=>p.status==="completed").length)}${metric("预算异常",scopedProjects.filter(p=>D.calculateBudgetUsage(p)>100).length)}${metric("缺失发票",missingInvoices)}${metric("即将到期付款",due)}</section>${projectTable(scopedProjects)}`;
  }

  function renderAssistant() {
    const pending=Object.entries(D.state.proposedUpdates).filter(([,x])=>visibleProjectIds().has(x.projectId));
    return `${pageTitle("小A中心", "查看 Agent 的确认边界、执行结果与完整活动记录。", `<button class="btn secondary" data-action="reset-demo">重置演示数据</button>`)}
      <div class="two-col agent-center"><section class="card section"><h2>待我确认</h2>${pending.length?pending.map(([id,x])=>`<button class="action-row" data-action="open-pending" data-proposed-id="${id}"><span>${creator(x.creatorId).displayName} 合作金额更新</span><b>${money(x.currentAmount)} → ${money(x.proposedAmount)}</b></button>`).join(""):empty("当前没有等待确认的业务变化")}</section><section class="card section"><h2>小A最近完成</h2><div class="completed-list"><p>分析 5 条沟通</p><p>关联 Collaboration 与项目</p><p>按统一口径重新计算项目利润</p></div></section></div>
      <div class="two-col"><section class="card section"><h2>自动发现</h2><div class="attention-list"><button data-finance-focus="ar"><b>客户 D 回款逾期</b><span>查看 →</span></button><button data-project-id="proj-c"><b>项目 C 处于方案阶段且存在风险</b><span>查看 →</span></button></div></section><section class="card section"><h2>Agent Activity</h2>${simpleTable(["时间","动作","来源","结果","人工确认"],D.state.agentActivities.filter(x=>isOwner()||!x.projectId||visibleProjectIds().has(x.projectId)).map(x=>[new Date(x.timestamp).toLocaleString("zh-CN"),x.action,x.source,x.result,x.humanConfirmed?"是":"否"]))}</section></div>`;
  }

  function renderSettings() {
    const rules=D.state.settings.businessRules;
    return `${pageTitle("设置", "当前用户、通知、AI 确认策略和基础经营规则。", `<button class="btn secondary" data-action="reset-demo">重置演示数据</button>`)}
      <div class="two-col"><section class="card section"><h2>当前用户与演示角色</h2>${D.state.users.map(u=>`<button class="role-option ${u.id===currentUser().id?"active":""}" data-user-id="${u.id}"><span class="avatar">${u.name[0]}</span><div><b>${u.name}</b><small>${u.roleLabel}</small></div><span>${u.id===currentUser().id?"当前":"切换"}</span></button>`).join("")}<h3>团队成员</h3><div class="team-list"><span>Jessica · 老板</span><span>Amy · 项目团队</span><span>David · 项目团队</span><span>Coco · 项目团队</span></div></section>
      <section class="card section"><h2>通知偏好</h2><label class="setting-row"><span><b>经营异常</b><small>逾期、超预算和结算异常</small></span><input type="checkbox" checked></label><label class="setting-row"><span><b>等待确认</b><small>金额与业务事实确认提醒</small></span><input type="checkbox" checked></label><label class="setting-row"><span><b>普通进度</b><small>低风险项目动态</small></span><input type="checkbox"></label></section></div>
      <section class="card section"><h2>小A 工作方式</h2><p class="muted">小A 不拥有无限权限。高风险事实必须由人确认后才写入正式业务状态。</p>${simpleTable(["业务类型","处理策略","风险等级"],D.state.settings.aiGovernance.map(x=>[x.subject,x.policy,statusPill(x.risk,x.risk==="高"?"orange":"green")]))}</section>
      <section class="card section"><h2>基础经营规则</h2><div class="rule-grid"><div><small>演示税率</small><b>${pct(rules.taxRate*100)}</b></div><div><small>公共费用分摊</small><b>${rules.overheadRule}</b></div><div><small>项目利润</small><b>不含税收入 + 公司保留返佣 − 各项成本</b></div></div></section>`;
  }

  function contextInfo() {
    if (ui.route === "project") return [`当前：${project(ui.selectedProjectId).name}`,`我知道你正在处理「${project(ui.selectedProjectId).name}」。`];
    if (ui.route === "collaboration") return [`当前：${project(item("collaborations",ui.selectedCollaborationId).projectId).name} / 达人合作`,"我知道你正在处理当前项目的达人合作。"];
    if (ui.route === "creator") return [`当前：${creator(ui.selectedCreatorId).displayName}`,`我知道你正在查看 ${creator(ui.selectedCreatorId).displayName}。`];
    if (ui.route === "customer") return [`当前：${customer(ui.selectedCustomerId).name}`,`我知道你正在查看 ${customer(ui.selectedCustomerId).name}。`];
    if (ui.route === "finance") return [`当前：财务运营 / ${ui.financeFocus==="overview"?"异常总览":({ar:"应收",ap:"应付","purchase-invoice":"进项发票","sales-invoice":"销售发票",bank:"银行流水",review:"待确认"}[ui.financeFocus])}`,"我可以帮你处理当前范围的回款、付款、发票和流水事项。"];
    if (ui.route === "reports") return [`当前：经营分析 / ${{"project-profit":"项目盈利","customer-profit":"客户盈利","cash-forecast":"现金流预测",ar:"应收与回款",operations:"项目经营状态"}[ui.reportTab]}`,"你可以直接问我利润、现金或经营变化的原因。"];
    return [`当前：${({home:"工作台",projects:"项目管理",communications:"沟通中心",partners:"合作管理",settings:"设置"}[ui.route]||"工作台")}`,"告诉我发生了什么，或者你想让我帮你做什么。"];
  }

  function agentProposalCard(id,p) {
    const cr=creator(p.creatorId), ac=account(p.creatorAccountId);
    return `<div class="agent-interpretation"><span class="eyebrow">我理解到以下业务变化</span><div class="agent-fields"><div><small>达人</small><b>${cr.displayName}</b></div><div><small>平台</small><b>${ac.platform}</b></div><div><small>当前合作金额</small><b>${money(p.currentAmount)}</b></div><div><small>建议合作金额</small><b>${money(p.proposedAmount)}</b></div><div><small>差旅</small><b>${p.travelTreatment}</b></div><div><small>发布时间</small><b>10 月 15 日</b></div><div><small>合作状态</small><b>${p.agreementStatus}</b></div><div><small>来源</small><b>${p.source}</b></div></div><div class="actions"><button class="btn secondary" data-action="cancel-agent-proposal" data-proposed-id="${id}">取消</button><button class="btn secondary" data-action="edit-agent-proposal" data-proposed-id="${id}">编辑</button><button class="btn agent" data-action="confirm-agent-proposal" data-proposed-id="${id}">确认更新</button></div><p class="confirmation-note">确认前不会修改达人合作或任何财务数据。</p></div>`;
  }

  function renderAgentPanel() {
    const context=contextInfo(), proposedId=ui.activeProposedId&&D.state.proposedUpdates[ui.activeProposedId]?ui.activeProposedId:(D.state.proposedUpdates["agent-mia-a"]?"agent-mia-a":null), proposed=proposedId?D.state.proposedUpdates[proposedId]:null;
    agentPanelElement.classList.toggle("open",ui.agentOpen);
    const voiceStatus=ui.agentStage==="listening"?`<div class="voice-status listening"><i></i>正在听你说…</div>`:ui.agentStage==="heard"?`<div class="voice-status"><b>我听到的是</b><span>${escapeHtml(ui.agentInput)}</span></div>`:ui.voiceMessage?`<div class="voice-status">${escapeHtml(ui.voiceMessage)}</div>`:"";
    const body=proposed?agentProposalCard(proposedId,proposed):ui.agentStage==="answer"?`<div class="agent-response">${ui.agentAnswer}</div>`:"";
    agentPanelElement.innerHTML=`<div class="agent-panel-head"><div><b>小A</b><small>智能业务助手</small></div><button data-action="close-agent" aria-label="关闭小A">×</button></div><div class="agent-context">${context[0]}</div><p class="agent-hint">${context[1]}</p>${voiceStatus}${body}<div class="agent-compose"><textarea id="agentInput" rows="4" placeholder="说给我听，或者输入你想让我处理的事情…">${escapeHtml(ui.agentInput)}</textarea><div><button class="mic-button ${ui.agentStage==="listening"?"active":""}" data-action="start-voice" aria-label="${ui.agentStage==="listening"?"停止":"开始"}语音输入">◉<span>${ui.agentStage==="listening"?"停止":"语音"}</span></button><button class="btn agent" data-action="submit-agent">交给小A</button></div></div>`;
    const pending=Object.values(D.state.proposedUpdates).filter(x=>visibleProjectIds().has(x.projectId)).length;
    const alerts=D.state.receivables.filter(x=>visibleProjectIds().has(x.projectId)&&x.status==="逾期").length+D.state.cashTransactions.filter(x=>visibleProjectIds().has(x.projectId)&&x.status==="未匹配").length;
    const badge=document.getElementById("agentBadge"), count=pending||alerts; badge.textContent=count?Math.min(count,9):""; badge.classList.toggle("show",count>0);
    I.apply(agentPanelElement);
  }

  function answerAgent(text) {
    const normalized=text.toLowerCase(), p=ui.route==="project"?project(ui.selectedProjectId):project("proj-a"), change=D.state.profitChanges[p.id];
    if (/mia|九千|9000|差旅|15\s*号|nine thousand|travel|oct(?:ober)?\s*15|confirmed/.test(normalized)) { D.interpretAgentInput(text,ui.agentInputMode); ui.activeProposedId="agent-mia-a"; ui.agentStage="interpretation"; return; }
    if (/利润|盈利|下降|profit|margin|decline/.test(normalized)) ui.agentAnswer=`<b>${p.name}</b><p>当前项目利润为 <strong>${money(D.calculateProjectProfit(p))}</strong>，利润率 ${pct(D.calculateProjectMargin(p))}。</p>${change?`<p>最近下降 ${money(Math.abs(change.delta))}，原因是 Mia Notes 合作金额增加 ${money(500)}。</p>`:`<p>当前没有已确认的利润变动。</p>`}`;
    else if (/现金|够不够|流入|流出|cash|inflow|outflow|enough/.test(normalized)) ui.agentAnswer=isOwner()?`<b>未来三个月现金可覆盖预计支出</b><p>当前现金 ${money(D.state.currentCash)}；未来 30 天预计流入 ${money(D.state.cashForecasts[0].inflow)}，预计流出 ${money(D.state.cashForecasts[0].outflow)}。</p>`:`<b>我的项目资金事项</b><p>当前范围有 ${teamExceptions().length} 项回款、付款、发票或流水事项需要跟进。</p>`;
    else if (/表现|达人|performance|creator/.test(normalized)) {const c=creator("creator-mia"),contents=D.state.contents.filter(x=>x.creatorId===c.id);ui.agentAnswer=`<b>${c.displayName} 最近合作表现</b><p>共有 ${D.state.collaborations.filter(x=>x.creatorId===c.id&&visibleProjectIds().has(x.projectId)).length} 次相关合作，${contents.length?"已有内容表现记录。":"当前项目内容尚未发布。"}</p>`;}
    else if (/风险|注意|risk|attention/.test(normalized)) ui.agentAnswer=`<b>当前项目风险</b><p>${visibleProjects().filter(x=>x.risk).length} 个可见项目标记为风险；另有 ${teamExceptions().length} 项财务事项需要跟进。</p>`;
    else ui.agentAnswer="<b>我已收到</b><p>这个 Demo 当前可以处理 Mia 合作更新、项目利润、现金流、达人表现和项目风险。</p>";
    ui.agentStage="answer";
  }

  // Round 2 integration views use the existing shared state and calculation helpers.
  function taskTypeLabel(type) {
    return ({ confirmation:"确认", approval:"审批", collection:"催款", invoice:"发票", risk:"风险", payment:"付款" }[type] || "待办");
  }

  function taskCard() {
    const mine = D.state.tasks.filter(task => task.assigneeUserId === currentUser().id);
    const todo = mine.filter(task => task.status === "todo");
    let done = mine.filter(task => task.status === "done");
    const requests = D.state.businessRequests.filter(request => request.applicantUserId === currentUser().id);
    if (ui.taskFilter === "confirmation") done = done.filter(task => task.type === "confirmation");
    if (ui.taskFilter === "approval") done = done.filter(task => task.type === "approval");
    const rows = ui.taskTab === "todo" ? todo.slice(0,4).map(task => {
      const p = project(task.projectId);
      return `<button class="task-row" data-task-id="${task.id}"><span class="task-kind ${task.type}">${taskTypeLabel(task.type)}</span><div><b>${task.title}</b><small>${p?.name || "公司事项"}${task.dueDate ? ` · ${task.dueDate.slice(5).replace("-","/")}` : ""}</small></div><i>→</i></button>`;
    }) : (ui.taskFilter === "request" ? requests.map(request => {
      const approver = item("users", request.currentApproverUserId);
      const status = ({ draft:"草稿", pending_approval:"等待审批", approved:"已批准", rejected:"已拒绝", needs_info:"需补充资料" }[request.status] || request.status);
      return `<button class="task-row" data-request-id="${request.id}"><span class="task-kind request">申请</span><div><b>${request.description}</b><small>${project(request.projectId).name} · ${money(request.amount)} · 审批人 ${approver.name}</small></div>${statusPill(status, request.status === "approved" ? "green" : "orange")}</button>`;
    }) : done.slice(0,4).map(task => `<button class="task-row" data-task-id="${task.id}"><span class="task-kind ${task.type}">${taskTypeLabel(task.type)}</span><div><b>${task.title}</b><small>${project(task.projectId)?.name || "公司事项"}</small></div>${statusPill("已办", "green")}</button>`));
    return `<section class="card section task-card"><div class="section-head"><h2>我的任务</h2><b class="task-count">${todo.length}</b></div>
      ${tabs([["todo","待办"],["done","已办"]], ui.taskTab, "task-tab")}
      ${ui.taskTab === "done" ? `<div class="mini-filters">${[["all","全部"],["confirmation","我已确认"],["approval","我已审批"],["request","我的申请"]].map(([key,label])=>`<button class="${ui.taskFilter===key?"active":""}" data-task-filter="${key}">${label}</button>`).join("")}</div>` : ""}
      <div class="task-list">${rows.join("") || empty(ui.taskTab === "todo" ? "当前没有待办事项" : "没有符合条件的已办事项")}</div></section>`;
  }

  function miniCashForecast() {
    const closings = D.state.cashForecasts.map(row => row.opening + row.inflow - row.outflow);
    const min = Math.min(...closings), max = Math.max(...closings), range = Math.max(1, max - min);
    const points = closings.map((value,index)=>`${18+index*112},${72-(value-min)/range*48}`).join(" ");
    return `<section class="card section mini-cash"><div class="section-head"><div><h2>现金流预测</h2><p>未来 3 个月期末现金</p></div><button class="text-btn" data-route="reports" data-report-default="cash-forecast">查看明细</button></div><svg viewBox="0 0 260 84" role="img" aria-label="未来三个月期末现金趋势"><polyline points="${points}" fill="none" stroke="url(#cashLine)" stroke-width="4" stroke-linecap="round"/><defs><linearGradient id="cashLine"><stop stop-color="#7164ef"/><stop offset="1" stop-color="#38b9c8"/></linearGradient></defs>${closings.map((value,index)=>`<circle cx="${18+index*112}" cy="${72-(value-min)/range*48}" r="5" fill="#fff" stroke="#7164ef" stroke-width="3"/>`).join("")}</svg><div class="mini-cash-labels">${D.state.cashForecasts.map((row,index)=>`<span><small>${Number(row.month.slice(5))} 月</small><b>${number(closings[index])}</b></span>`).join("")}</div></section>`;
  }

  function attachmentCards() {
    return ui.attachments.length ? `<div class="attachment-list">${ui.attachments.map((file,index)=>`<div class="attachment-chip">${file.preview ? `<img src="${file.preview}" alt="">` : `<span class="file-icon">${file.type.includes("pdf")?"PDF":file.name.split(".").pop().toUpperCase()}</span>`}<div><b>${escapeHtml(file.name)}</b><small>${file.type || "文件"} · ${(file.size/1024).toFixed(1)} KB</small></div><button data-remove-attachment="${index}" aria-label="删除附件">×</button></div>`).join("")}</div>` : "";
  }

  function workInterpretation() {
    if (ui.workStage === "reimbursement") return `<div class="work-result"><span class="eyebrow">演示识别结果</span><h3>待确认申请</h3><div class="agent-fields"><div><small>项目</small><b>城市探店计划</b></div><div><small>类型</small><b>费用报销</b></div><div><small>金额</small><b>${money(2514)}</b></div><div><small>费用说明</small><b>现场交通与物料</b></div><div><small>申请人</small><b>Amy</b></div><div><small>附件</small><b>${ui.attachments.length || 1} 份</b></div></div><p class="confirmation-note">这是演示识别，只读取文件信息和预设规则，不会读取真实票据内容。</p><div class="actions"><button class="btn secondary" data-action="cancel-work">取消</button><button class="btn agent" data-action="confirm-reimbursement">确认发起</button></div></div>`;
    if (ui.workStage === "contract") return `<div class="work-result"><span class="eyebrow">演示识别结果</span><h3>待确认项目与合同</h3><div class="agent-fields"><div><small>客户</small><b>客户 A</b></div><div><small>项目</small><b>冬季新品内容项目</b></div><div><small>合同编号</small><b>CT-2026-A002</b></div><div><small>合同金额</small><b>${money(168000)}</b></div><div><small>税率</small><b>6%</b></div><div><small>付款条件</small><b>30% / 40% / 30%</b></div><div><small>项目周期</small><b>10/08 — 12/20</b></div><div><small>负责人</small><b>${currentUser().name}</b></div></div><p class="confirmation-note">确认前不会创建项目、合同、应收或其他正式记录。</p><div class="actions"><button class="btn secondary" data-action="cancel-work">取消</button><button class="btn agent" data-action="confirm-contract-project">确认创建</button></div></div>`;
    if (ui.workStage === "documents") {
      const options = [`<option value="">待确认</option>`, ...visibleProjects().map(p=>`<option value="${p.id}">${p.name}</option>`)].join("");
      return `<div class="work-result document-result"><span class="eyebrow">小A整理结果</span><h3>确认资料如何进入系统</h3>${ui.documentDrafts.map((draft,index)=>`<div class="document-draft"><div><b>${escapeHtml(draft.fileName)}</b><small>${draft.documentTypeLabel}</small></div><label>关联项目<select data-document-project="${index}">${options.replace(`value="${draft.projectId}"`,`value="${draft.projectId}" selected`)}</select></label><div><small>关联对象</small><b>${draft.relatedLabel}</b></div><div><small>建议用途</small><b>${draft.usage}</b></div></div>`).join("")}<p class="confirmation-note">当前只是整理建议，确认后才会创建资料记录并关联项目。</p><div class="actions"><button class="btn secondary" data-action="edit-documents">修改</button><button class="btn agent" data-action="confirm-documents">确认进系统</button></div></div>`;
    }
    if (ui.workStage === "answer") return `<div class="work-result"><h3>小A 已收到</h3><p>${ui.agentAnswer}</p></div>`;
    return "";
  }

  function recentDocuments() {
    const ids = visibleProjectIds();
    const requestDocs = new Set(D.state.businessRequests.filter(request=>request.applicantUserId===currentUser().id).flatMap(request=>request.documentIds || []));
    const documents = D.state.documents.filter(doc=>isOwner() || ids.has(doc.projectId) || requestDocs.has(doc.id)).sort((a,b)=>Number(b.id.startsWith("doc-upload-"))-Number(a.id.startsWith("doc-upload-"))||b.uploadedAt.localeCompare(a.uploadedAt));
    return `<section class="recent-documents"><div class="section-head"><div><h3>最近资料</h3><p>与当前项目和申请关联的资料</p></div><button class="text-btn" data-action="view-all-documents">查看全部</button></div><div class="recent-doc-list">${documents.slice(0,4).map(doc=>`<button data-document-id="${doc.id}"><span>⌑</span><div><b>${doc.fileName}</b><small>${doc.projectId ? project(doc.projectId)?.name : "公司资料"} · ${new Date(doc.uploadedAt).toLocaleDateString("zh-CN")}</small></div><i>查看</i></button>`).join("")}</div></section>`;
  }

  function agentWorkSurface() {
    const listening = ui.agentStage === "listening";
    return `<section class="card section agent-work-surface"><div class="work-heading"><span class="agent-mark">小A</span><div><h2>告诉我发生了什么，或者把资料交给我。</h2><p>我会先整理出建议结果；涉及正式业务数据变化时，由你确认后写入系统。</p></div></div>${attachmentCards()}${workInterpretation()}<div id="workDropZone" class="work-compose ${ui.attachments.length?"has-files":""}"><textarea id="workInput" rows="5" placeholder="输入业务情况，或配合票据、合同文件说明希望我处理什么…">${escapeHtml(ui.workInput)}</textarea><div class="work-tools"><input id="workFiles" type="file" multiple accept="image/*,.pdf,.xls,.xlsx,.csv" hidden><button class="tool-button" data-action="choose-files">＋ 图片 / 文件</button><button class="tool-button ${listening?"active":""}" data-action="start-voice">◉ ${listening?"停止并使用语音":"语音输入"}</button><span class="drop-hint">也可以拖拽文件到这里</span><button class="btn agent" data-action="submit-work">交给小A</button></div></div><div class="starter-row"><span>从这里开始</span><button data-starter="contract">新建项目</button><button data-starter="reimbursement">发起申请</button><button data-starter="organize">整理资料</button></div>${recentDocuments()}</section>`;
  }

  function projectSummaryList(projects) {
    const rows = projects.filter(p=>!D.getProjectClosureStatus(p).fullyClosed).slice(0,4).map(p=>`<button class="project-summary-row ${isOwner()?"":"team-summary"}" data-project-id="${p.id}"><div><b>${p.name}</b><small>${projectCustomer(p.id).name} · ${projectStatus(p)}</small></div>${isOwner()?`<span><small>负责人</small><b>${p.owner}</b></span>`:""}<span><small>回款 / 状态</small><b class="${p.collectionStatus==="逾期"||p.risk?"risk-text":""}">${p.collectionStatus==="逾期"?"回款逾期":p.risk?"需要关注":"回款正常"}</b></span><i>→</i></button>`).join("");
    return `<section class="card section project-summary-card"><div class="section-head"><h2>${isOwner()?"项目概览":"我的项目"}</h2><button class="text-btn" data-route="projects">查看全部</button></div><div>${rows || empty("当前没有未结项项目")}</div></section>`;
  }

  function renderHome() {
    const projects = visibleProjects();
    if (!isOwner()) return `${pageTitle(`${currentUser().name} 的工作台`, "处理我的项目与任务。") }<div class="dashboard-top product-dashboard">${taskCard()}${projectSummaryList(projects)}</div>${agentWorkSurface()}`;
    const portfolioProfit = projects.reduce((sum,p)=>sum+D.calculateProjectProfit(p),0);
    const net = projects.reduce((sum,p)=>sum+D.calculateNetRevenue(p),0);
    return `${pageTitle("老板工作台", "处理任务并快速了解经营状态。")}<div class="dashboard-top product-dashboard">${taskCard()}<div class="owner-business">${projectSummaryList(projects)}<div class="owner-business-bottom"><section class="mini-kpis"><div><small>本期预计收入</small><b>${money(net)}</b></div><div><small>项目组合利润</small><b>${money(portfolioProfit)}</b></div></section>${miniCashForecast()}</div></div></div>${agentWorkSurface()}`;
  }

  function projectOverview(p) {
    const stages=D.dictionaries.projectStatuses, current=stages.findIndex(x=>x[0]===p.status), budget=D.calculateCurrentApprovedBudget(p), committed=D.calculateCommittedCost(p), closure=D.getProjectClosureStatus(p);
    const versions=D.state.budgetVersions.filter(x=>x.projectId===p.id).sort((a,b)=>a.version-b.version);
    return `<section class="card section"><h2>项目生命周期</h2><div class="lifecycle">${stages.map(([key,label],index)=>`<div class="stage ${index<=current?"done":""} ${key===p.status?"current":""}"><span>${index+1}</span><small>${label}</small></div>`).join("")}</div></section><div class="two-col"><section class="card section"><div class="section-head"><h2>预算</h2>${versions.length>1?`<button class="text-btn" data-budget-project="${p.id}">查看预算变更</button>`:`<span class="muted">当前为原始预算</span>`}</div><div class="budget-grid"><div><small>原始预算</small><b>${money(p.originalBudget)}</b></div><div><small>当前预算</small><b>${money(budget)}</b></div><div><small>已用预算</small><b>${money(committed)}</b></div><div><small>剩余预算</small><b>${money(budget-committed)}</b></div></div></section><section class="card section"><h2>结项状态</h2><div class="closure-strip"><div class="${closure.businessClosed?"done":""}"><small>业务结项</small><b>${closure.businessClosed?"已完成":"未完成"}</b></div><div class="${closure.financialClosed?"done":""}"><small>财务结项</small><b>${closure.financialClosed?"已完成":"未完成"}</b></div><div class="${closure.fullyClosed?"done":""}"><small>完全结项</small><b>${closure.fullyClosed?"已完成":"未完成"}</b></div></div></section></div>`;
  }

  function projectProposal(p) {
    const proposal=D.state.proposals.find(x=>x.projectId===p.id); if(!proposal)return `<section class="card section">${empty("该项目尚未建立方案对象。")}</section>`;
    const versions=D.state.proposalVersions.filter(x=>x.proposalId===proposal.proposalId).sort((a,b)=>b.version-a.version), selected=versions.find(x=>x.version===ui.selectedProposalVersion)||versions[0];
    let sections=selected.contentSections?.length?selected.contentSections:[{title:"方案摘要",body:selected.content}];
    if(p.id==="proj-a"&&selected.version===3&&sections.length>=9) sections=[
      {title:"项目背景",body:sections[0].body},
      {title:"目标与人群",body:`${sections[1].body} ${sections[2].body}`},
      {title:"核心策略",body:`${sections[3].body} ${sections[4].body}`},
      {title:"达人与内容方向",body:`${sections[5].body} ${sections[6].body}`},
      {title:"执行排期与预算",body:`${sections[7].body} ${sections[8].body}`}
    ];
    return `<section class="card section proposal-document"><div class="proposal-meta-line"><b>当前方案 V${proposal.currentVersion}</b><span>${proposalStatus(proposal)}</span><span>${proposal.createdBy}</span><span>${new Date(proposal.updatedAt).toLocaleDateString("zh-CN")} 更新</span></div><div class="proposal-document-grid"><aside><h3>版本历史</h3>${versions.map(v=>`<button class="version ${selected.version===v.version?"active":""}" data-proposal-version="${v.version}"><b>V${v.version}</b><span>${v.summary}</span><small>${new Date(v.createdAt).toLocaleDateString("zh-CN")}</small></button>`).join("")}</aside><article><span class="eyebrow">方案 V${selected.version}</span><h1>${selected.summary}</h1>${sections.map(section=>`<section><h2>${section.title}</h2><p>${section.body}</p></section>`).join("")}<div class="proposal-notes"><div><small>本次修改</small><p>${selected.changes}</p></div><div><small>内部意见</small><p>${selected.internalComments}</p></div><div><small>老板反馈</small><p>${selected.managerFeedback}</p></div><div><small>客户反馈</small><p>${selected.clientFeedback}</p></div><div><small>附件</small><p>${selected.attachments.length?selected.attachments.join("、"):"暂无附件"}</p></div></div></article></div></section>`;
  }

  function projectCreators(p) {
    const collabs=D.projectCollaborations(p.id);
    return `<section class="card section"><div class="section-head"><div><h2>项目达人合作</h2><p>展示当前项目中的单次达人合作。</p></div></div><div class="table-wrap"><table><thead><tr><th>达人</th><th>平台 / 账号</th><th>内容形式</th><th>状态</th><th>报价</th><th>确认金额</th><th>发布时间</th><th>沟通</th></tr></thead><tbody>${collabs.map(c=>{const cr=creator(c.creatorId),ac=account(c.creatorAccountId),commId=(c.communicationIds||[])[0];return `<tr class="clickable-row" data-collaboration-id="${c.id}"><td><b>${cr.displayName}</b></td><td>${ac.platform}<small>${ac.accountName}</small></td><td>${c.contentType}</td><td>${statusPill(collaborationStatus(c),["confirmed","producing","published","settled"].includes(c.status)?"green":"orange")}</td><td>${money(c.quotedAmount)}</td><td><b>${money(c.confirmedAmount)}</b></td><td>${c.plannedPublishDate}</td><td>${commId?`<button class="link-button" data-open-communication="${commId}">沟通 →</button>`:"—"}</td></tr>`}).join("")}</tbody></table></div></section>`;
  }

  function acceptancePanel(p) {
    const acceptance=D.state.acceptances.find(x=>x.projectId===p.id);
    if(!acceptance)return `<section class="card section"><h2>客户验收</h2>${empty("尚未建立验收记录")}</section>`;
    const status=({pending:"待验收",partial:"部分验收",accepted:"已验收",rejected:"未通过"}[acceptance.status]||acceptance.status);
    return `<section class="card section acceptance-panel"><div class="section-head"><div><h2>客户验收</h2><p>${acceptance.status==="accepted"?"已满足相关结算 / 收入确认条件":"相关尾款尚未满足验收条件"}</p></div>${statusPill(status,acceptance.status==="accepted"?"green":"orange")}</div><dl class="info-list"><div><dt>验收范围</dt><dd>${acceptance.scope}</dd></div><div><dt>验收日期</dt><dd>${acceptance.acceptedAt?new Date(acceptance.acceptedAt).toLocaleDateString("zh-CN"):"—"}</dd></div><div><dt>验收人 / 来源</dt><dd>${acceptance.acceptedBy||"—"} · ${acceptance.source}</dd></div><div><dt>备注</dt><dd>${acceptance.notes}</dd></div></dl>${acceptance.documentIds.length?acceptance.documentIds.map(id=>`<button class="document-link" data-document-id="${id}">查看验收资料 · ${item("documents",id).fileName}</button>`).join(""):""}</section>`;
  }

  function projectContent(p) {
    const contents=D.state.contents.filter(x=>x.projectId===p.id);
    const table=contents.length?simpleTable(["达人","平台","内容形式","发布时间","内容链接","发布状态","浏览 / 播放","点赞","收藏","评论","分享","操作"],contents.map(c=>{const perf=D.state.performanceSnapshots.filter(x=>x.contentId===c.contentId).sort((a,b)=>b.capturedAt.localeCompare(a.capturedAt))[0];return [creator(c.creatorId).displayName,c.platform,c.contentType,c.publishDate,`<a href="${c.contentUrl}" target="_blank">查看内容 ↗</a>`,c.status,perf?number(perf.views):"—",perf?number(perf.likes):"—",perf?number(perf.saves):"—",perf?number(perf.comments):"—",perf?number(perf.shares):"—",`<button class="link-button" data-boost-content="${c.contentId}">投流</button>`]})):empty("当前项目尚无内容记录");
    return `<section class="card section"><h2>内容与数据</h2>${table}</section>${acceptancePanel(p)}`;
  }

  function contractLink(contractId) { const contract=contractId&&item("contracts",contractId); return contract?`<button class="link-button" data-contract-id="${contract.id}">${contract.contractNumber}</button>`:"无独立合同 / 按平台规则"; }

  function projectSettlement(p) {
    const closure=D.getProjectClosureStatus(p), acceptance=D.state.acceptances.find(x=>x.projectId===p.id), contracts=D.state.contracts.filter(x=>x.projectId===p.id&&x.contractType==="customer_contract");
    const customerRows=contracts.flatMap(contract=>D.state.contractMilestones.filter(x=>x.contractId===contract.id).map(milestone=>{const ar=milestone.receivableId&&item("receivables",milestone.receivableId),line=D.state.settlementLines.find(x=>x.contractMilestoneId===milestone.id),invoice=line?.invoiceId&&item("invoices",line.invoiceId),label=milestone.label.replace(/^(\d+%) (.+)$/,"$2 $1");return [contractLink(contract.id),label,money(contract.totalAmount),money(milestone.amount),invoice?.invoiceNumber||"未开票",ar?.expectedDate||milestone.expectedDate,ar?.actualAmount?money(ar.actualAmount):"—",ar?.status||"未建立"]}));
    if(!customerRows.length) D.projectSettlementLines(p.id,"receivable").forEach(line=>{const ar=line.receivableId&&item("receivables",line.receivableId),invoice=line.invoiceId&&item("invoices",line.invoiceId);customerRows.push([contractLink(line.contractId),"项目结算款",money(item("contracts",line.contractId)?.totalAmount||line.amount),money(line.amount),invoice?.invoiceNumber||"未开票",ar?.expectedDate||"—",ar?.actualAmount?money(ar.actualAmount):"—",ar?.status||"未建立"]);});
    const costs=D.projectSettlementLines(p.id,"payable").filter(line=>line.status!=="cancelled").map(line=>{const collab=line.collaborationId&&item("collaborations",line.collaborationId),cr=line.creatorId&&creator(line.creatorId),platformName=D.state.platforms.find(x=>x.id===line.platformId)?.name||"—",counterparty=line.counterpartyType==="supplier"?vendor(line.counterpartyId)?.name:line.counterpartyType==="platform"?platformName:line.counterpartyType==="employee"?item("users",line.counterpartyId)?.name:entity(line.counterpartyId)?.name,invoice=line.invoiceId&&item("invoices",line.invoiceId),ap=line.payableId&&item("payables",line.payableId);return [collab?`${cr.displayName} · ${account(collab.creatorAccountId).accountName}`:line.businessObjectType==="reimbursement"?"Amy 费用报销":counterparty,({creator_fee:"达人费用",platform_fee:"平台服务费",vendor_fee:"供应商服务",reimbursement:"费用报销"}[line.lineType]||line.lineType),counterparty||"—",platformName,contractLink(line.contractId),line.settlementEntityId?entity(line.settlementEntityId)?.name:"—",money(line.amount),invoice?.invoiceNumber||"未收到",ap?.expectedDate||"—",ap?.actualDate||"—",ap?.status||(line.status==="pending_approval"?"待审批":line.status)]});
    return `<section class="card section closure-banner"><span>业务结项：<b>${closure.businessClosed?"已完成":"未完成"}</b></span><span>财务结项：<b>${closure.financialClosed?"已完成":"未完成"}</b></span><span>完全结项：<b>${closure.fullyClosed?"是":"否"}</b></span><small>${acceptance?.status==="accepted"?"客户已验收，相关尾款条件已满足。":"尚未验收，相关尾款尚未触发。"}</small></section><section class="card section"><div class="section-head"><h2>客户侧</h2></div>${simpleTable(["合同编号","结算节点","合同总额","本期应收","销售发票","预计收款日","实际收款日","回款状态"],customerRows)}</section><section class="card section"><div class="section-head"><div><h2>成本侧</h2><p>每一行对应一笔独立结算，分别追踪合同、发票和付款。</p></div></div>${simpleTable(["业务关联","费用类型","实际结算对象","平台","合同 / 协议","结算主体","金额","进项发票","预计付款日","实际付款日","付款状态"],costs)}</section>`;
  }

  function eventList(events, expandable) {
    if(!events.length)return empty("暂无项目记录");
    const objectLabel={project:"项目",collaboration:"达人合作",settlementLine:"结算记录",contract:"合同",invoice:"发票",acceptance:"客户验收",proposal:"方案",content:"内容",payable:"应付",businessRequest:"业务申请"};
    const relatedName=link=>{if(link.type==="contract")return item("contracts",link.id)?.contractNumber||"合同";if(link.type==="collaboration"){const c=item("collaborations",link.id);return c?`${creator(c.creatorId).displayName} 达人合作`:"达人合作";}if(link.type==="settlementLine"){const line=item("settlementLines",link.id),c=line?.creatorId&&creator(line.creatorId);return line?`${c?.displayName||line.counterpartyType} · ${{creator_fee:"达人费用",platform_fee:"平台费用",vendor_fee:"供应商费用",reimbursement:"费用报销",client_receivable:"客户应收"}[line.lineType]||"结算记录"}`:"结算记录";}if(link.type==="project")return project(link.id)?.name||"项目";if(link.type==="acceptance")return "客户验收";if(link.type==="proposal")return "项目方案";if(link.type==="invoice")return "发票";if(link.type==="businessRequest")return "业务申请";return objectLabel[link.type]||"业务记录";};
    return `<div class="event-list">${events.map(e=>`<div class="event-row ${ui.expandedEventId===e.id?"expanded":""}"><button data-event-id="${e.id}"><div><b>${e.title}</b><small>${new Date(e.timestamp).toLocaleString("zh-CN")}</small></div><span>${ui.expandedEventId===e.id?"收起":"详情"}</span></button>${ui.expandedEventId===e.id?`<div class="audit-detail"><dl class="audit"><div><dt>来源</dt><dd>${e.source}</dd></div><div><dt>小A识别</dt><dd>${e.detectedByAgent?"是":"否"}</dd></div><div><dt>人工确认</dt><dd>${e.confirmedByUser?"是":"否"}</dd></div><div><dt>原值</dt><dd>${formatValue(e.oldValue)}</dd></div><div><dt>新值</dt><dd>${formatValue(e.newValue)}</dd></div><div><dt>时间</dt><dd>${e.timestamp}</dd></div></dl><div class="trace-links"><b>关联对象</b>${(e.relatedObjects||[]).map(link=>`<button data-related-type="${link.type}" data-related-id="${link.id}">${relatedName(link)}</button>`).join("")||"<span>—</span>"}</div><div class="trace-links"><b>相关资料</b>${(e.evidenceDocumentIds||[]).map(id=>`<button data-document-id="${id}">${item("documents",id)?.fileName||"资料"}</button>`).join("")||"<span>—</span>"}</div></div>`:""}</div>`).join("")}</div>`;
  }

  function creatorList() {
    const platforms=["全部平台",...new Set(D.state.creatorAccounts.map(a=>a.platform))], scopedIds=new Set(D.state.collaborations.filter(c=>visibleProjectIds().has(c.projectId)).map(c=>c.creatorId));
    const filtered=D.state.creators.filter(cr=>(isOwner()||scopedIds.has(cr.id))&&(!ui.creatorSearch||cr.displayName.toLowerCase().includes(ui.creatorSearch.toLowerCase()))&&(ui.creatorStatus==="all"||cr.status===ui.creatorStatus)&&(ui.creatorPlatform==="全部平台"||D.state.creatorAccounts.some(a=>a.creatorId===cr.id&&a.platform===ui.creatorPlatform)));
    const rows=filtered.map(cr=>{const accounts=D.state.creatorAccounts.filter(a=>a.creatorId===cr.id),collabs=D.state.collaborations.filter(c=>c.creatorId===cr.id&&visibleProjectIds().has(c.projectId)),recent=[...collabs].sort((a,b)=>b.plannedPublishDate.localeCompare(a.plannedPublishDate))[0],followers=accounts.reduce((sum,a)=>sum+a.followers,0),engagement=accounts.length?accounts.reduce((sum,a)=>sum+a.engagementRate,0)/accounts.length*100:0;return `<tr class="clickable-row" data-creator-id="${cr.id}"><td><b>${cr.displayName}</b></td><td><div class="tag-list">${cr.contentTags.slice(0,3).map(tag=>`<span>${tag}</span>`).join("")}</div></td><td>${accounts.map(a=>a.platform).join("、")}</td><td>${number(followers)}</td><td>${pct(engagement)}</td><td>${collabs.length}</td><td>${recent?.plannedPublishDate||"—"}</td><td>${statusPill(creatorStatus(cr),cr.status==="active"?"green":"orange")}</td></tr>`}).join("");
    return `<section class="card section"><div class="filters"><label class="search"><span>⌕</span><input id="creatorSearch" placeholder="搜索达人" value="${escapeHtml(ui.creatorSearch)}"></label><select id="creatorStatus"><option value="active" ${ui.creatorStatus==="active"?"selected":""}>默认：正式达人</option><option value="all" ${ui.creatorStatus==="all"?"selected":""}>全部状态</option>${D.dictionaries.creatorStatuses.map(([key,label])=>`<option value="${key}" ${ui.creatorStatus===key?"selected":""}>${label}</option>`).join("")}</select><select id="creatorPlatform">${platforms.map(value=>`<option ${ui.creatorPlatform===value?"selected":""}>${value}</option>`).join("")}</select></div><div class="table-wrap"><table><thead><tr><th>达人昵称</th><th>内容方向</th><th>主要平台</th><th>粉丝量级</th><th>互动表现</th><th>合作次数</th><th>最近合作</th><th>状态</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }

  function platformList() {
    return `<section class="card section">${simpleTable(["平台","账号","账户余额","最近充值","扣点","结算主体"],D.state.platformAccounts.map(pa=>{const platform=D.state.platforms.find(x=>x.id===pa.platformId);return [platform.name,pa.accountName,money(pa.balance),pa.lastTopUpAt,pa.serviceFeeMethod,entity(pa.settlementEntityId).name]}))}</section>`;
  }

  function vendorList() {
    const rows=D.state.vendors.map(v=>{const lines=D.state.settlementLines.filter(line=>line.counterpartyType==="supplier"&&line.counterpartyId===v.id&&visibleProjectIds().has(line.projectId));return [v.name,v.type,[...new Set(lines.map(line=>project(line.projectId).name))].join("、")||"—",money(lines.reduce((sum,line)=>sum+line.amount,0)),entity(v.settlementEntityId)?.name||"—"]});
    return `<section class="card section">${simpleTable(["供应商","服务类型","合作项目","相关结算金额","结算主体"],rows)}</section>`;
  }

  function renderPartners() {
    const partnerTabs=[["customers","客户"],["creators","达人"],["platforms","平台"],["vendors","供应商"]], bodies={customers:customerList,creators:creatorList,platforms:platformList,vendors:vendorList};
    return `${pageTitle("合作管理","客户、达人、平台与供应商的业务主档。")}${tabs(partnerTabs,ui.partnerTab,"partner-tab")}${bodies[ui.partnerTab]()}`;
  }

  function renderCreator() {
    const cr=creator(ui.selectedCreatorId), accounts=D.state.creatorAccounts.filter(a=>a.creatorId===cr.id), collabs=D.state.collaborations.filter(c=>c.creatorId===cr.id&&visibleProjectIds().has(c.projectId));
    const creatorTabs=[["overview","概览"],["accounts","平台账号"],["history","合作历史"],["settlement","结算主体"],["performance","数据表现"]]; let body="";
    if(ui.creatorTab==="overview")body=`<div class="detail-hero"><div><span class="eyebrow">长期达人档案</span><h2>${cr.displayName}</h2><div class="tag-list">${cr.contentTags.map(tag=>`<span>${tag}</span>`).join("")}</div><p>${cr.notes}</p></div>${statusPill(creatorStatus(cr),cr.status==="active"?"green":"orange")}</div><section class="mini-kpis"><div><small>平台账号</small><b>${accounts.length}</b></div><div><small>累计合作</small><b>${collabs.length}</b></div><div><small>确认合作金额</small><b>${money(collabs.reduce((sum,c)=>sum+c.confirmedAmount,0))}</b></div></section>`;
    if(ui.creatorTab==="accounts")body=simpleTable(["平台","账号名称","粉丝数","互动率","状态"],accounts.map(a=>[a.platform,a.accountName,number(a.followers),pct(a.engagementRate*100),a.status]));
    if(ui.creatorTab==="history")body=simpleTable(["项目","平台 / 账号","内容形式","确认金额","状态"],collabs.map(c=>{const a=account(c.creatorAccountId);return [`<button class="link-button" data-collaboration-id="${c.id}">${project(c.projectId).name}</button>`,`${a.platform} / ${a.accountName}`,c.contentType,money(c.confirmedAmount),collaborationStatus(c)]}));
    if(ui.creatorTab==="settlement")body=simpleTable(["结算主体","开票能力","项目"],[...new Set(collabs.map(c=>c.settlementEntityId))].map(id=>[entity(id).name,entity(id).invoiceCapability,collabs.filter(c=>c.settlementEntityId===id).map(c=>project(c.projectId).name).join("、")]));
    if(ui.creatorTab==="performance")body=simpleTable(["内容","平台","浏览 / 播放","点赞","收藏"],D.state.contents.filter(c=>c.creatorId===cr.id).map(c=>{const perf=D.state.performanceSnapshots.find(x=>x.contentId===c.contentId);return [c.contentType,c.platform,perf?number(perf.views):"—",perf?number(perf.likes):"—",perf?number(perf.saves):"—"]}));
    return `${pageTitle(cr.displayName,"达人详情 · 跨项目长期档案",`<button class="btn secondary" data-route="partners" data-partner-default="creators">← 返回达人主库</button>`)}${tabs(creatorTabs,ui.creatorTab,"creator-tab")}<section class="card section">${body}</section>`;
  }

  function communicationTitle(comm) {
    if(comm.counterpartyType==="creator")return creator(comm.counterpartyId)?.displayName||"达人";
    if(comm.counterpartyType==="supplier")return vendor(comm.counterpartyId)?.name||"供应商";
    return "业务会话";
  }

  function renderCommunications() {
    const visible=D.state.communications.filter(comm=>visibleProjectIds().has(comm.projectId));
    if(!visible.some(comm=>comm.id===ui.communicationId))ui.communicationId=visible[0]?.id;
    const comm=item("communications",ui.communicationId); if(!comm)return `${pageTitle("沟通中心","当前没有可见会话。")}`;
    const collab=comm.collaborationId&&item("collaborations",comm.collaborationId), name=communicationTitle(comm), p=project(comm.projectId);
    const analysis=comm.analysisResult?`<div class="analysis-note"><span class="eyebrow">Agent Interpretation</span><b>${comm.analysisResult}</b></div>`:"";
    return `${pageTitle("沟通中心","消息先形成 Agent 解释，只有明确确认才更新正式业务状态。")}<div class="inbox-layout"><aside>${visible.map(c=>`<button class="conversation ${c.id===comm.id?"active":""}" data-communication-id="${c.id}"><div><b>${communicationTitle(c)}</b><span>${project(c.projectId).name} · ${c.channel}</span></div>${c.unread?statusPill("未读","red"):statusPill("已分析","blue")}</button>`).join("")}<div class="guardrail"><b>确认与审批不同</b><p>商务事实走确认；报销等业务动作走审批。</p></div></aside><section class="card section conversation-main"><div class="section-head"><div><h2>${name} × ${p.name}</h2><p>${comm.conversationType.replaceAll("_"," ")}</p></div><button class="btn agent" data-action="analyze" data-communication-id="${comm.id}">✦ AI 分析</button></div><div class="messages">${comm.messages.map(m=>`<div class="message ${["Jessica","Amy"].includes(m.sender)?"mine":""}"><b>${m.sender}</b><p>${m.text}</p></div>`).join("")}</div>${analysis}${proposedUpdate(comm.id)}${comm.analyzed&&!D.state.proposedUpdates[comm.id]&&comm.interpretationEligibility==="agreement_confirmed"?`<div class="success-note"><b>业务更新已处理</b><span>正式状态只会在人工确认后变化。</span></div>`:""}</section></div>`;
  }

  function renderModal() {
    const host=document.getElementById("overlayHost"); if(!host)return; if(!ui.modal){host.innerHTML="";return;}
    let title="",body="";
    const documentTypeLabel=type=>({contract:"合同",invoice:"发票",acceptance:"验收资料",proposal:"方案",receipt:"票据",screenshot:"截图",statement:"对账单",other:"其他资料"}[type]||type);
    if(ui.modal.type==="contract") { const c=item("contracts",ui.modal.id), counterparty=c.counterpartyType==="customer"?customer(c.counterpartyId)?.name:c.counterpartyType==="supplier"?vendor(c.counterpartyId)?.name:c.counterpartyType==="platform"?D.state.platforms.find(x=>x.id===c.counterpartyId)?.name:entity(c.counterpartyId)?.name,status=({draft:"草稿",signed:"已签署",active:"履行中",completed:"已完成",terminated:"已终止"}[c.status]||c.status); title=c.title; body=`<dl class="modal-info"><div><dt>合同编号</dt><dd>${c.contractNumber}</dd></div><div><dt>交易对方</dt><dd>${counterparty}</dd></div><div><dt>合同金额</dt><dd>${money(c.totalAmount)}</dd></div><div><dt>签署 / 生效</dt><dd>${c.signedDate} / ${c.effectiveDate}</dd></div><div><dt>付款条款</dt><dd>${c.paymentTerms}</dd></div><div><dt>开票条款</dt><dd>${c.invoicingTerms}</dd></div><div><dt>状态</dt><dd>${status}</dd></div></dl><h3>关联资料</h3>${c.documentIds.length?c.documentIds.map(id=>`<button class="document-link" data-document-id="${id}">${item("documents",id)?.fileName}</button>`).join(""):empty("无独立合同文件 / 按平台规则")}`; }
    if(ui.modal.type==="document") { const doc=item("documents",ui.modal.id); title=doc.fileName; body=`<div class="document-preview"><span>演示文件记录</span><b>资料</b></div><dl class="modal-info"><div><dt>文件类型</dt><dd>${doc.fileType}</dd></div><div><dt>上传人</dt><dd>${doc.uploadedBy}</dd></div><div><dt>上传时间</dt><dd>${new Date(doc.uploadedAt).toLocaleString("zh-CN")}</dd></div><div><dt>项目</dt><dd>${doc.projectId?project(doc.projectId)?.name:"公司资料"}</dd></div><div><dt>来源</dt><dd>${doc.source}</dd></div><div><dt>状态</dt><dd>${doc.status}</dd></div></dl><p class="confirmation-note">演示环境只保存文件信息，不保存真实文件内容。</p>`; }
    if(ui.modal.type==="documents") { title="全部资料"; const ids=visibleProjectIds(); const docs=D.state.documents.filter(doc=>isOwner()||ids.has(doc.projectId)||D.state.businessRequests.some(r=>r.applicantUserId===currentUser().id&&(r.documentIds||[]).includes(doc.id))); body=simpleTable(["文件名","资料类型","项目","状态","上传时间"],docs.map(doc=>[`<button class="link-button" data-document-id="${doc.id}">${doc.fileName}</button>`,documentTypeLabel(doc.documentType),doc.projectId?project(doc.projectId)?.name:"公司资料",doc.status,new Date(doc.uploadedAt).toLocaleDateString("zh-CN")])); }
    if(ui.modal.type==="budget") { const versions=D.state.budgetVersions.filter(x=>x.projectId===ui.modal.id).sort((a,b)=>a.version-b.version); title=`${project(ui.modal.id).name} · 预算变更`; body=versions.map(v=>`<div class="budget-version"><b>V${v.version} · ${money(v.amount)}</b><span>${v.reason}</span><small>提出 ${v.proposedBy} · 批准 ${v.approvedBy} · ${new Date(v.effectiveAt).toLocaleDateString("zh-CN")}</small></div>`).join(""); }
    if(ui.modal.type==="request") { const request=item("businessRequests",ui.modal.id), applicant=item("users",request.applicantUserId); title="费用报销申请"; body=`<div class="request-hero"><span>${statusPill(({draft:"草稿",pending_approval:"等待审批",approved:"已批准",needs_info:"需补充资料"}[request.status]||request.status),request.status==="approved"?"green":"orange")}</span><strong>${money(request.amount)}</strong></div><dl class="modal-info"><div><dt>申请人</dt><dd>${applicant.name}</dd></div><div><dt>项目</dt><dd>${project(request.projectId).name}</dd></div><div><dt>费用说明</dt><dd>${request.description}</dd></div><div><dt>当前审批人</dt><dd>${item("users",request.currentApproverUserId).name}</dd></div></dl><h3>费用明细</h3>${simpleTable(["说明","金额","费用类别"],request.lineItems.map(line=>[line.description,money(line.amount),line.costCategory]))}<h3>上传资料</h3>${request.documentIds.map(id=>`<button class="document-link" data-document-id="${id}">${item("documents",id)?.fileName}</button>`).join("")}${isOwner()&&request.status==="pending_approval"?`<div class="actions"><button class="btn secondary" data-action="return-request" data-request-id="${request.id}">退回补充</button><button class="btn agent" data-action="approve-request" data-request-id="${request.id}">批准</button></div>`:""}`; }
    if(ui.modal.type==="boost") { const content=item("contents",ui.modal.id,"contentId"),perf=D.state.performanceSnapshots.find(x=>x.contentId===content.contentId); title="投流功能演示入口"; body=`<dl class="modal-info"><div><dt>内容</dt><dd>${creator(content.creatorId).displayName} · ${content.contentType}</dd></div><div><dt>平台</dt><dd>${content.platform}</dd></div><div><dt>当前浏览 / 播放</dt><dd>${perf?number(perf.views):"暂无数据"}</dd></div></dl><p class="confirmation-note">本轮仅提供入口，不会改变预算、成本或项目利润。</p>`; }
    host.innerHTML=`<div class="overlay"><aside class="drawer" role="dialog" aria-modal="true"><div class="drawer-head"><h2>${title}</h2><button data-action="close-modal">×</button></div><div class="drawer-body">${body}</div></aside></div>`;
    I.apply(host);
  }

  function render() {
    renderNav();
    const views = { home:renderHome, projects:renderProjects, project:renderProject, collaboration:renderCollaboration, partners:renderPartners, customer:renderCustomer, creator:renderCreator, communications:renderCommunicationsProduct, finance:renderFinance, reports:renderReports, assistant:renderAssistant, settings:renderSettings };
    workspace.innerHTML = views[ui.route]();
    renderAgentPanel();
    renderModal();
    I.apply(document);
  }

  function renderSearchResults(query) {
    const q=query.trim().toLowerCase(); if(!q){searchResults.innerHTML="";searchResults.classList.remove("open");return;}
    const ids=visibleProjectIds(), projects=visibleProjects().filter(x=>x.name.toLowerCase().includes(q)), customerIds=new Set(visibleProjects().map(x=>x.customerId)), customers=D.state.customers.filter(x=>customerIds.has(x.id)&&x.name.toLowerCase().includes(q)), creatorIds=new Set(D.state.collaborations.filter(x=>ids.has(x.projectId)).map(x=>x.creatorId)), creators=D.state.creators.filter(x=>(isOwner()||creatorIds.has(x.id))&&x.displayName.toLowerCase().includes(q));
    const rows=[...projects.map(x=>["项目",x.name,`data-project-id="${x.id}"`]),...customers.map(x=>["客户",x.name,`data-customer-id="${x.id}"`]),...creators.map(x=>["达人",x.displayName,`data-creator-id="${x.id}"`])].slice(0,8);
    searchResults.innerHTML=rows.length?rows.map(([type,label,attr])=>`<button ${attr}><span>${type}</span><b>${label}</b><i>↗</i></button>`).join(""):`<div class="search-empty">没有匹配结果</div>`; searchResults.classList.add("open"); I.apply(searchResults);
  }

  document.addEventListener("input", event => {
    if (event.target.id === "creatorSearch") { ui.creatorSearch = event.target.value; render(); const input=document.getElementById("creatorSearch"); input.focus(); input.setSelectionRange(input.value.length,input.value.length); }
    if (event.target.id === "globalSearch") renderSearchResults(event.target.value);
    if (event.target.id === "agentInput") ui.agentInput=event.target.value;
    if (event.target.id === "workInput") ui.workInput=event.target.value;
  });
  document.addEventListener("change", event => {
    if (event.target.id === "creatorStatus") { ui.creatorStatus=event.target.value; render(); }
    if (event.target.id === "creatorPlatform") { ui.creatorPlatform=event.target.value; render(); }
    if (event.target.id === "workFiles") addAttachments(event.target.files);
    if (event.target.dataset.documentProject !== undefined) {
      const draft=ui.documentDrafts[Number(event.target.dataset.documentProject)];
      draft.projectId=event.target.value;
      if (draft.invoiceId && item("invoices",draft.invoiceId)?.projectId !== draft.projectId) { draft.invoiceId=null; draft.relatedLabel="待确认"; }
    }
  });
  document.addEventListener("click", event => {
    const target = event.target.closest("button, tr[data-project-id], tr[data-customer-id], tr[data-creator-id], tr[data-collaboration-id]"); if (!target) return;
    if (target.dataset.route) { if(target.dataset.partnerDefault) ui.partnerTab=target.dataset.partnerDefault; if(target.dataset.reportDefault) ui.reportTab=target.dataset.reportDefault; clearGlobalSearch(); return go(target.dataset.route); }
    if (target.dataset.projectId) { clearGlobalSearch(); return go("project", { selectedProjectId:target.dataset.projectId, projectTab:target.dataset.projectTab||"overview", selectedProposalVersion:3 }); }
    if (target.dataset.customerId) { clearGlobalSearch(); return go("customer", { selectedCustomerId:target.dataset.customerId, customerTab:"overview" }); }
    if (target.dataset.creatorId) { clearGlobalSearch(); return go("creator", { selectedCreatorId:target.dataset.creatorId, creatorTab:"overview" }); }
    if (target.dataset.collaborationId) return go("collaboration", { selectedCollaborationId:target.dataset.collaborationId });
    if (target.dataset.projectFilter) { ui.projectFilter=target.dataset.projectFilter; return render(); }
    if (target.dataset.projectTab) { ui.projectTab=target.dataset.projectTab; return render(); }
    if (target.dataset.communicationId && !target.dataset.action) { ui.communicationId=target.dataset.communicationId; ui.editingProposed=false; return render(); }
    if (target.dataset.partnerTab) { ui.partnerTab=target.dataset.partnerTab; ui.selectedCustomerId=null; ui.selectedCreatorId=null; return render(); }
    if (target.dataset.customerTab) { ui.customerTab=target.dataset.customerTab; return render(); }
    if (target.dataset.creatorTab) { ui.creatorTab=target.dataset.creatorTab; return render(); }
    if (target.dataset.proposalVersion) { ui.selectedProposalVersion=Number(target.dataset.proposalVersion); return render(); }
    if (target.dataset.reportTab) { ui.reportTab=target.dataset.reportTab; return render(); }
    if (target.dataset.financeFocus) { ui.financeFocus=target.dataset.financeFocus; return go("finance"); }
    if (target.dataset.eventId) { ui.expandedEventId=ui.expandedEventId===target.dataset.eventId?null:target.dataset.eventId; return render(); }
    if (target.dataset.taskTab) { ui.taskTab=target.dataset.taskTab; return render(); }
    if (target.dataset.taskFilter) { ui.taskFilter=target.dataset.taskFilter; return render(); }
    if (target.dataset.contractId) { ui.modal={type:"contract",id:target.dataset.contractId}; return renderModal(); }
    if (target.dataset.documentId) { ui.modal={type:"document",id:target.dataset.documentId}; return renderModal(); }
    if (target.dataset.budgetProject) { ui.modal={type:"budget",id:target.dataset.budgetProject}; return renderModal(); }
    if (target.dataset.requestId && !target.dataset.action) { ui.modal={type:"request",id:target.dataset.requestId}; return renderModal(); }
    if (target.dataset.removeAttachment !== undefined) { const removed=ui.attachments.splice(Number(target.dataset.removeAttachment),1)[0]; if(removed?.preview)URL.revokeObjectURL(removed.preview); return render(); }
    if (target.dataset.starter) { ui.workInput=({contract:"这是客户 A 的新合同，帮我建一个项目。",reimbursement:"这些是城市探店计划的现场交通和物料费，一共 2514，帮我报销。",organize:"请整理这些资料，并告诉我它们对应哪个项目。"}[target.dataset.starter]); ui.workStage="idle"; return render(); }
    if (target.dataset.taskId) {
      const task=item("tasks",target.dataset.taskId);
      if(task.relatedObjectType==="businessRequest") { ui.modal={type:"request",id:task.relatedObjectId}; return renderModal(); }
      if(task.relatedObjectType==="communication") return go("communications",{communicationId:task.relatedObjectId});
      if(task.relatedObjectType==="receivable"||task.relatedObjectType==="invoice") return go("project",{selectedProjectId:task.projectId,projectTab:"settlement"});
      return go("project",{selectedProjectId:task.projectId,projectTab:"records"});
    }
    if (target.dataset.relatedType) {
      const type=target.dataset.relatedType,id=target.dataset.relatedId;
      if(type==="contract"){ui.modal={type:"contract",id};return renderModal();}
      if(type==="businessRequest"){ui.modal={type:"request",id};return renderModal();}
      if(type==="collaboration")return go("collaboration",{selectedCollaborationId:id});
      const collection=type==="settlementLine"?"settlementLines":type==="invoice"?"invoices":type==="payable"?"payables":null;
      const related=collection&&item(collection,id); if(related)return go("project",{selectedProjectId:related.projectId,projectTab:"settlement"});
    }
    if (target.dataset.openCommunication) return go("communications",{communicationId:target.dataset.openCommunication});
    if (target.dataset.boostContent) { ui.modal={type:"boost",id:target.dataset.boostContent}; return renderModal(); }
    if (target.dataset.userId) return switchUser(target.dataset.userId);
    const action=target.dataset.action;
    if (action === "toggle-role") return switchUser(currentUser().role==="owner"?"user-amy":"user-jessica");
    if (action === "toggle-agent") { if(orbMoved){orbMoved=false;return;} ui.agentOpen=!ui.agentOpen; return renderAgentPanel(); }
    if (action === "close-agent") { ui.agentOpen=false; return renderAgentPanel(); }
    if (action === "submit-agent") { ui.agentInput=document.getElementById("agentInput").value.trim(); if(!ui.agentInput){showToast("请先说出或输入需要处理的事情");return;} answerAgent(ui.agentInput); return renderAgentPanel(); }
    if (action === "start-voice") return startVoiceRecognition(target.closest(".agent-work-surface") ? "work" : "agent");
    if (action === "start-work-voice") return startVoiceRecognition("work");
    if (action === "choose-files") return document.getElementById("workFiles")?.click();
    if (action === "view-all-documents") { ui.modal={type:"documents"}; return renderModal(); }
    if (action === "close-modal") { ui.modal=null; return renderModal(); }
    if (action === "cancel-work") { ui.workStage="idle"; return render(); }
    if (action === "submit-work") {
      ui.workInput=document.getElementById("workInput")?.value.trim()||ui.workInput;
      if(!ui.workInput&&!ui.attachments.length){showToast("请先输入说明或添加文件");return;}
      if(/报销|2514|票据|交通.*物料|reimburse|expense|receipt|transport.*material/i.test(ui.workInput)){ui.workStage="reimbursement";return render();}
      if(/合同|建.*项目|新建项目|contract|create.*project|new project/i.test(ui.workInput)&&isOwner()){ui.workStage="contract";return render();}
      if(ui.attachments.length||/整理|归档|资料|organize|file|document|archive/i.test(ui.workInput)){prepareDocumentDrafts();return render();}
      ui.workStage="answer";ui.agentAnswer=ui.attachments.length?"已收到文件，请告诉我它对应哪个项目，以及希望我怎么处理。":"我已收到。当前工作台可演示费用报销和合同建项目。";return render();
    }
    if (action === "edit-documents") { document.querySelector("[data-document-project]")?.focus(); showToast("可以直接修改每份资料的关联项目"); return; }
    if (action === "confirm-documents") {
      if(ui.documentDrafts.some(draft=>!draft.projectId)){showToast("请先为每份资料确认关联项目");return;}
      const metas=ui.attachments.map(({name,type,size})=>({name,type,size}));
      const created=D.confirmDocumentOrganization(metas,ui.documentDrafts);
      clearAttachments();ui.documentDrafts=[];ui.workStage="answer";ui.agentAnswer=`${created.length} 份资料已确认进入系统，并关联到对应项目。`;render();showToast("资料已确认进入系统");return;
    }
    if (action === "confirm-reimbursement") { D.submitReimbursementRequest("request-reimbursement-amy",ui.attachments.map(({name,type,size})=>({name,type,size}))); ui.workStage="answer";ui.agentAnswer="费用报销已发起，当前状态为等待 Jessica 审批。";clearAttachments();render();showToast("报销申请已发起，等待 Jessica 审批");return; }
    if (action === "confirm-contract-project") { const created=D.createProjectFromContractDraft({customerId:"cust-a",projectName:"冬季新品内容项目",contractNumber:"CT-2026-A002",contractAmount:168000,taxRate:0.06,owner:currentUser().name},ui.attachments.map(({name,type,size})=>({name,type,size}))); clearAttachments();ui.workStage="idle";ui.workInput="";showToast("项目、合同和收款节点已创建");return go("project",{selectedProjectId:created.id,projectTab:"overview",selectedProposalVersion:1}); }
    if (action === "approve-request") { D.approveBusinessRequest(target.dataset.requestId); ui.modal={type:"request",id:target.dataset.requestId}; render();showToast("已批准，项目成本与利润已同步");return; }
    if (action === "return-request") { D.returnBusinessRequest(target.dataset.requestId); ui.modal={type:"request",id:target.dataset.requestId}; render();showToast("已退回补充资料");return; }
    if (action === "cancel-agent-proposal") { D.cancelProposedUpdate(target.dataset.proposedId); ui.activeProposedId=null; ui.agentStage="idle"; ui.agentInput=""; return render(); }
    if (action === "edit-agent-proposal") { D.cancelProposedUpdate(target.dataset.proposedId); ui.activeProposedId=null; ui.agentStage="heard"; return renderAgentPanel(); }
    if (action === "confirm-agent-proposal") { D.confirmProposedUpdate(target.dataset.proposedId); ui.activeProposedId=null; ui.agentStage="answer"; ui.agentAnswer="<b>业务状态已更新</b><p>达人合作、项目成本、预算使用率、项目利润和业务记录已同步。</p>"; render(); showToast("小A 已在人工确认后更新业务状态"); return; }
    if (action === "open-pending") { ui.activeProposedId=target.dataset.proposedId; ui.agentOpen=true; ui.agentStage="interpretation"; return renderAgentPanel(); }
    if (action === "analyze") { const id=target.dataset.communicationId||ui.communicationId; const result=D.analyzeCommunication(id); ui.editingProposed=false; showToast(result?"小A 已生成待确认业务更新，正式业务数据尚未变化":item("communications",id).analysisResult); return render(); }
    if (action === "edit-proposed") { ui.editingProposed=true; return render(); }
    if (action === "cancel-edit") { ui.editingProposed=false; return render(); }
    if (action === "save-proposed") { D.updateProposedUpdate(ui.communicationId,{contentType:document.getElementById("editContentType").value,publishDate:document.getElementById("editPublishDate").value,proposedAmount:Number(document.getElementById("editAmount").value),travelTreatment:document.getElementById("editTravel").value}); ui.editingProposed=false; showToast("待确认业务更新已保存，仍等待人工确认"); return render(); }
    if (action === "ignore-proposed") { D.ignoreProposedUpdate(ui.communicationId); showToast("建议已忽略，正式业务数据没有变化"); return render(); }
    if (action === "confirm-proposed") { D.confirmProposedUpdate(ui.communicationId); showToast("已确认：合作、结算、项目利润和业务记录已同步"); return go("home"); }
    if (action === "reset-demo") { clearAttachments(); D.resetDemo(); Object.assign(ui,{expandedEventId:null,editingProposed:false,agentOpen:false,agentStage:"idle",agentInput:"",agentInputMode:"text",agentAnswer:"",voiceMessage:"",activeProposedId:null,taskTab:"todo",taskFilter:"all",workInput:"",workStage:"idle",documentDrafts:[],modal:null,communicationId:"comm-mia-a"}); showToast("演示数据已重置到 Jessica 老板视角"); return go("home"); }
  });

  function addAttachments(fileList) {
    [...fileList].forEach(file=>ui.attachments.push({name:file.name,type:file.type||"application/octet-stream",size:file.size,preview:file.type.startsWith("image/")?URL.createObjectURL(file):null}));
    ui.workStage="idle"; render();
  }
  function clearAttachments(){ui.attachments.forEach(file=>{if(file.preview)URL.revokeObjectURL(file.preview)});ui.attachments=[];}
  function prepareDocumentDrafts(){
    const presets=[
      {projectId:"proj-a",documentType:"invoice",documentTypeLabel:"进项发票",relatedLabel:"Mia Notes",usage:"达人费用发票",invoiceId:"invoice-a-mia"},
      {projectId:"proj-a",documentType:"invoice",documentTypeLabel:"进项发票",relatedLabel:"小红书平台",usage:"平台费用发票",invoiceId:"invoice-a-xhs"},
      {projectId:"proj-b",documentType:"receipt",documentTypeLabel:"费用票据",relatedLabel:"项目费用",usage:"费用报销资料",invoiceId:null}
    ];
    ui.documentDrafts=ui.attachments.map((file,index)=>({fileName:file.name,...(presets[index]||{projectId:"",documentType:"other",documentTypeLabel:"待确认资料",relatedLabel:"待确认",usage:"待确认",invoiceId:null})}));
    if(!ui.documentDrafts.length){ui.workStage="answer";ui.agentAnswer="请先添加需要整理的图片、PDF 或表格文件。";return;}
    ui.workStage="documents";
  }
  document.addEventListener("dragover",event=>{if(event.target.closest("#workDropZone")){event.preventDefault();event.target.closest("#workDropZone").classList.add("dragging");}});
  document.addEventListener("dragleave",event=>event.target.closest("#workDropZone")?.classList.remove("dragging"));
  document.addEventListener("drop",event=>{const zone=event.target.closest("#workDropZone");if(!zone)return;event.preventDefault();zone.classList.remove("dragging");addAttachments(event.dataTransfer.files);});

  function switchUser(userId) {
    D.setCurrentUser(userId); ui.route="home"; ui.financeFocus="overview"; ui.projectFilter="全部"; ui.taskTab="todo"; ui.taskFilter="all"; ui.agentOpen=false; ui.modal=null;
    const first=visibleProjects()[0]; if(first) ui.selectedProjectId=first.id;
    showToast(`已切换到 ${currentUser().name} · ${currentUser().roleLabel}`); render(); window.scrollTo(0,0);
  }

  let recognition, voiceListeningWanted=false, voiceTarget="agent", voiceFinal="", voiceRestartCount=0;
  function startVoiceRecognition(targetMode="agent") {
    if(voiceListeningWanted&&recognition){voiceListeningWanted=false;ui.agentStage=voiceTarget==="agent"?(ui.agentInput?"heard":"idle"):"idle";try{recognition.stop();}catch(_){}return voiceTarget==="agent"?renderAgentPanel():render();}
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){ui.voiceMessage="当前浏览器暂不支持语音识别，请使用文字输入。";ui.agentStage="idle";showToast(ui.voiceMessage);return targetMode==="agent"?renderAgentPanel():render();}
    voiceTarget=targetMode;voiceListeningWanted=true;voiceFinal=targetMode==="agent"?ui.agentInput:ui.workInput;voiceRestartCount=0;
    recognition=new SpeechRecognition(); recognition.lang=I.locale()==="en"?"en-US":"zh-CN"; recognition.interimResults=true; recognition.continuous=true;
    ui.agentStage="listening";ui.voiceMessage="";targetMode==="agent"?renderAgentPanel():render();
    recognition.onresult=event=>{let interim="";for(let i=event.resultIndex;i<event.results.length;i++){const text=event.results[i][0].transcript;if(event.results[i].isFinal)voiceFinal+=text;else interim+=text;}if(voiceTarget==="agent"){ui.agentInput=voiceFinal+interim;ui.agentInputMode="voice";renderAgentPanel();}else{ui.workInput=voiceFinal+interim;render();}};
    recognition.onerror=event=>{if(event.error!=="no-speech")voiceListeningWanted=false;ui.voiceMessage=event.error==="not-allowed"?"未获得麦克风权限，请使用文字输入。":"语音识别暂时中断，请重试或使用文字输入。";if(!voiceListeningWanted)ui.agentStage="idle";showToast(ui.voiceMessage);};
    recognition.onend=()=>{if(voiceListeningWanted&&voiceRestartCount<3){voiceRestartCount++;try{recognition.start();return;}catch(_){}}voiceListeningWanted=false;ui.agentStage=voiceTarget==="agent"?(ui.agentInput?"heard":"idle"):"idle";voiceTarget==="agent"?renderAgentPanel():render();};
    try{recognition.start();}catch(_){voiceListeningWanted=false;ui.agentStage="idle";ui.voiceMessage="语音识别暂时无法启动，请使用文字输入。";showToast(ui.voiceMessage);}
  }

  document.addEventListener("keydown",event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();globalSearch.focus();}});
  document.addEventListener("click",event=>{if(!event.target.closest(".global-search"))searchResults.classList.remove("open");});
  document.addEventListener("demo:localechange",()=>render());

  let dragStart=null,orbMoved=false;
  agentOrb.dataset.action="toggle-agent";
  try{const saved=JSON.parse(localStorage.getItem("small-a-position"));if(saved){agentOrb.style.left=saved.left+"px";agentOrb.style.top=saved.top+"px";agentOrb.style.right="auto";agentOrb.style.bottom="auto";}}catch(_){}
  agentOrb.addEventListener("pointerdown",event=>{dragStart={x:event.clientX,y:event.clientY,left:agentOrb.offsetLeft,top:agentOrb.offsetTop};agentOrb.setPointerCapture(event.pointerId);});
  agentOrb.addEventListener("pointermove",event=>{if(!dragStart)return;const dx=event.clientX-dragStart.x,dy=event.clientY-dragStart.y;if(Math.abs(dx)+Math.abs(dy)>5)orbMoved=true;const left=Math.max(14,Math.min(window.innerWidth-64,dragStart.left+dx)),top=Math.max(14,Math.min(window.innerHeight-64,dragStart.top+dy));agentOrb.style.left=left+"px";agentOrb.style.top=top+"px";agentOrb.style.right="auto";agentOrb.style.bottom="auto";});
  agentOrb.addEventListener("pointerup",()=>{if(orbMoved)localStorage.setItem("small-a-position",JSON.stringify({left:agentOrb.offsetLeft,top:agentOrb.offsetTop}));dragStart=null;});
  render();
})();
