# Business Logic

[中文](BUSINESS_LOGIC.md) | English

[← Back to README](../README_EN.md)

## 1. Core Business Entities and Relationships

Projects are the central unit for execution and business management. Clients, counterparties, contracts, settlements, invoices, receivables, payables, receipts, and payments remain linked to specific projects.

The overall relationship is:

Client → Project → Business execution → Contracts and settlements → Invoices, receivables, and payables → Receipts and payments → Project performance results

Within each project, proposals, creator partnerships, content deliveries, budgets, and other records together describe the entire lifecycle from initiation to completion.

Clients and projects

Clients are the source of project business. A client can have multiple projects, each independently recording execution, budgets, revenue, costs, contracts, settlements, and performance results.

Projects are the primary unit for aggregating performance data. Related partnerships, revenue, costs, receivables, payables, and cash transactions must ultimately be traceable to the relevant project.

Creators, accounts, and settlement entities

A creator is the person engaged in the partnership. A creator account is that person's specific business identity on a content platform.

The same creator can have multiple platform accounts. Each project engagement must specify the actual account and platform used.

The actual payee may be the creator, a multi-channel network (MCN), an agency, or another settlement entity. Creators, creator accounts, and settlement entities are therefore managed separately and linked within each engagement.

Contracts and settlements

Contracts record agreed commercial terms. Settlement records specify the amounts actually due for collection or payment and the relevant dates.

A contract can have multiple settlement milestones, and a project can have multiple contracts on both the client and cost sides.

Each actual collection or payment obligation has its own settlement record, linked to the relevant invoices, receivables or payables, and actual receipts or payments.

The flow is therefore:

Business engagement → Contractual agreement → Settlement obligation → Invoice → Receivable / Payable → Actual receipt or payment

Original contracts, invoices, quotes, and other supporting files remain linked to their corresponding structured business records.

## 2. Project and Business Status Logic

A project's status reflects its current primary business stage and is updated as business facts change.

The main project workflow is:

Project creation → Proposal development → Client confirmation → Contract signing → Creator execution → Content review → Publication → Client acceptance → Settlement → Completion

Project status follows actual progress. For example, client approval of a proposal leads to contracting and execution. Once creator partnerships are confirmed and work begins, the project enters creator execution. Publication and client acceptance complete business fulfillment, while settlement, invoicing, collections, and payments continue to be tracked.

Creator partnership statuses

Creator partnerships have an execution workflow independent of the main project status:

Candidate → Contacted → Quoting → Negotiating → Confirmed → In production → Awaiting publication → Published → Awaiting settlement → Settled

A project can involve multiple creators, each progressing through their own partnership statuses.

A project in the Creator Execution stage therefore does not imply that every creator is at the same stage. Each partnership record captures its own progress, which is then aggregated into the overall project status.

Project closure

Project completion takes both business fulfillment and financial settlement into account.

Business Closed

Agreed deliverables have been completed, content has been published and accepted by the client, and all related business fulfillment activities have concluded.

Financial Closed

Client-side sales invoicing and receivables collection are complete, and cost-side purchase invoices, payables, and related reimbursements have been fully processed.

A project reaches final completion only when both business and financial closure are complete:

Project Completed = Business Closed + Financial Closed

A project that has completed delivery and client acceptance but still has outstanding client payments is therefore complete from a delivery perspective but still requires management follow-up.

## 3. Partnership, Contract, and Settlement Logic

Commercial agreements made during project execution progressively become manageable collection and payment obligations through partnership, contract, and settlement records.

Client side

The client side primarily establishes revenue and collection relationships:

Client project → Client contract → Collection milestone → Sales invoice → Receivable → Actual receipt

A client contract may specify one or multiple payments.

For example, a project may require 50% after signing and the remaining 50% after acceptance. The system records the two collection milestones separately and independently tracks their invoicing, receivables, and collection status.

Cost side

Cost-side payment relationships arise from actual business engagements:

Creator / Platform / Supplier engagement → Contract or commercial agreement → Cost settlement → Purchase invoice → Payable → Actual payment

Each cost has a separate settlement record based on the actual settlement counterparty.

For example, a creator engagement may include:

- Creator fee: ¥8,000
- Platform service fee: ¥400

If ¥8,000 is payable to the creator or their settlement entity and ¥400 is payable to the platform, these create two separate settlement obligations.

This allows the contractual basis, invoices, payables, and payment statuses to be managed independently, while preserving the link between both costs and the same project and creator engagement.

Settlement records

Settlement records connect business engagements with financial processing.

Each settlement record must identify at least:

- Project
- Originating business activity
- Collection or payment counterparty
- Settlement amount
- Expected settlement date
- Relevant contract or commercial basis
- Invoice status
- Receivable or payable status
- Actual receipt or payment status

Settlement records allow commercial agreements formed during project execution to flow into subsequent financial operations.

## 4. Revenue, Cost, and Profit Logic

Performance results use consistent management definitions so that profitability can be analyzed on a comparable basis across projects.

Revenue

Project revenue is recognized based on business fulfillment.

Under the current management framework, revenue is recognized when the relevant deliverables are complete and accepted by the client.

Contract value and client payment progress describe commercial commitments and cash recovery respectively. Neither substitutes for revenue recognition.

Therefore:

Contract signing ≠ Revenue recognition

Revenue recognition ≠ Cash received

The system manages contracts, revenue, receivables, and actual receipts separately, allowing project profitability and cash positions to be viewed independently.

Costs

Project costs are allocated based on actual business obligations incurred.

The main categories are:

External execution costs

Creator fees, platform service fees, supplier fees, and other project costs arising directly from external engagements.

Company-borne costs

Expenses borne by the company and directly attributable to a project, such as project-related travel, purchases, reimbursements, and other execution expenses.

Allocated overhead

Shared company expenses that cannot be directly attributed to one project and are assigned to projects using defined allocation rules.

Whether a cost enters project performance results depends on confirmed business facts and actual settlement obligations.

During creator pricing or negotiation, quotes can inform business decisions and budget assessments. Once the engagement is confirmed and an actual settlement obligation exists, the corresponding cost enters formal cost management.

Similarly, an unconfirmed reimbursement request does not directly change the project's recorded profit.

Project profit

The current management definition of project profit is:

Project Profit = Net Revenue + Retained Rebate - External Execution Cost - Company-Borne Cost - Allocated Overhead

Where:

Net Revenue is the project's recognized net revenue.

Retained Rebate is the rebate retained by the company under the business rules and included in the project's performance results.

External Execution Cost comprises project execution costs arising from creator, platform, supplier, and other external engagements.

Company-Borne Cost comprises expenses directly borne by the company and attributable to the project.

Allocated Overhead comprises shared expenses assigned to the project under established rules.

A consistent profit definition makes project profitability comparable and supports aggregation into client- and company-level performance results.

## 5. Budget and Expense Allocation Logic

Budgets manage planned project spending and resource usage during execution.

Budget versions

An initial budget is established after project creation.

A formal adjustment creates a new budget version rather than overwriting the original:

Initial budget → Budget adjustment → Approval → New budget version

The latest approved version is the current effective budget. Historical versions and adjustment records are retained.

This enables ongoing tracking of:

- Original budget
- Budget adjustments
- Current budget
- Budget used
- Remaining budget
- Budget utilization

Where:

Remaining Budget = Current Effective Budget - Budget Used

Budget Utilization = Budget Used ÷ Current Effective Budget

Budget adjustments do not change costs already incurred. They only change the baseline used for current project management and budget control.

Overhead allocation

Costs clearly attributable to a single project are assigned directly to that project.

Shared expenses that belong to overall company operations but cannot be attributed directly to a project enter an overhead pool, then are allocated to projects under established rules.

The overall flow is:

Company overhead → Define allocation scope and rules → Allocate to projects → Include in full project operating costs

Allocation rules may use revenue, project size, staff effort, or other reasonable business drivers according to the company's management needs.

The system retains the original shared expenses, allocation rules, and project allocations, allowing full project profit to reflect both direct execution costs and the use of shared company resources.

## 6. Receivables, Payables, and Cash Logic

The system manages project performance results separately from actual cash movements, connecting them through receivables, payables, receipts, and payment records.

Receivables

Client contracts and settlement arrangements establish collection milestones.

A receivable is created when the relevant business conditions are met, with ongoing tracking through:

Collection agreement → Receivable creation → Sales invoice → Due date → Actual receipt

Each receivable records the expected collection date, amount due, invoice, and actual collection details.

Receivables not fully collected by the expected collection date become overdue for continued management follow-up.

Payables

Creator, platform, supplier, and other cost-side engagements create payment obligations.

The system tracks:

Cost settlement → Payable creation → Purchase invoice → Due date → Actual payment

Each payable retains its project, counterparty, and originating settlement, so actual payments remain traceable to the specific business activity that generated the cost.

Receipt and payment matching

Once bank transactions enter the system, they are matched against existing receivables and payables.

The process is:

Bank transactions → System matching → Human confirmation → Update receivables, payables, and receipt or payment statuses

Once an actual receipt or payment is confirmed, the corresponding receivable or payable balance and status are updated together.

Cash flow forecasting

Future cash flow is forecast from established receipt and payment arrangements.

Expected receipts come from project receivables and their expected collection dates.

Expected payments come from project payables and their expected payment dates.

The system aggregates future inflows and outflows by time period and combines them with opening cash to forecast cash flow:

Opening Cash + Expected Receipts - Expected Payments = Forecast Closing Cash

Management can therefore monitor project profit, receivables collection, and future cash positions together.

## 7. Business Facts, Confirmation, and Traceability

Authoritative business statuses and performance data are based on business facts confirmed by people.

Natural language, voice input, chat histories, contracts, invoices, Excel files, and other documents provide business information and supporting evidence. AI can identify business facts, organize information, and propose corresponding data updates.

Staff review, amend, and confirm the results prepared by AI. After human confirmation, the information becomes authoritative business facts and updates project, partnership, contract, settlement, and financial records under established business rules.

The overall flow is:

Original business information → AI identification and organization → Human confirmation → Confirmed business facts → Business rule processing → Performance results

Authoritative data also retains its links to original evidence and related business records.

When management reviews project profit, budget usage, receivables collection, or cash flow, it can trace the results to the corresponding revenue, costs, settlements, contracts, engagements, and original materials.

The system also records changes to key business facts, including status changes, amendments, the person performing the action, confirmation time, and supporting evidence, so the formation of performance results can be explained.

The resulting traceability path is:

Performance results → Financial records → Settlements and contracts → Business execution → Original business evidence
