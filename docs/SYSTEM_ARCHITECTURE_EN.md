# System Architecture

[中文](SYSTEM_ARCHITECTURE.md) | English

[← Back to README](../README_EN.md)

## 1. Overall Architecture

The AI Native Business & Finance Management System consists of frontend interactions, an AI Agent, backend application services, data storage, external system integrations, and supporting backend infrastructure.

The system continuously captures information from everyday business activity. AI interprets and organizes unstructured information, backend application services execute deterministic business rules, and confirmed business facts become authoritative business data.

That data remains linked through projects and related business relationships, then feeds financial and performance data to support project management and business analytics.

The overall flow is:

Business activity → Information enters the system → AI interpretation and organization → Business rule processing → Authoritative business data → Financial and performance calculations → Performance data → Frontend display and business actions

## 2. Frontend and Interaction Layer

The frontend is the user entry point and displays the business statuses and performance results the system has produced.

Business action entry points

The system provides structured work areas: Workspace, Project Management, Communication Center, Partner Management, Financial Operations, and Business Analytics.

Users can directly view and handle projects, partnerships, contracts, settlements, financial matters, and performance management activities.

AI Native entry points

Users can also submit business information directly through natural language, extended voice messages, communication records, contracts, invoices, Excel files, and images.

AI interprets input using the current user, project, counterparties, and existing system data, identifies business facts, and prepares information for confirmation.

The system therefore supports two types of entry point:

Structured page actions → Structured requests

Natural language / Voice / Files → AI interpretation → Structured requests

Both ultimately enter the same business processing workflow.

## 3. Core Business Data Processing

The system progressively turns fragmented, inconsistent everyday information into authoritative business data. Data relationships, financial rules, and performance calculations then transform it into information for business management.

The full processing chain is:

Fragmented, inconsistent business information → Structured information → Authoritative business data → Project-level aggregation and financial data → Expense allocation and performance calculations → Performance data

Step 1: Fragmented business information → Structured information

When natural language, voice input, communication records, contracts, invoices, Excel files, and other fragmented information enter the system, the AI Agent interprets the business context using the current user, project, counterparties, and existing records.

It identifies key facts such as business entities, amounts, dates, commercial and contractual terms, and status changes, organizing scattered information expressed in inconsistent ways into structured information the system can process.

Fragmented, inconsistent business information → AI Agent interpretation and organization → Structured information

Step 2: Structured information → Authoritative business data

The AI Agent invokes the appropriate skill for the business activity. The skill defines the processing procedure and uses tools to read existing data, check business statuses, and call backend capabilities.

Users review, amend, and confirm information involving business facts that will enter the system of record. After human confirmation, backend application services follow the rules defined in [BUSINESS_LOGIC_EN.md](BUSINESS_LOGIC_EN.md) to validate data, evaluate business conditions, establish relationships, and update statuses, creating or updating the corresponding authoritative records.

Structured information → Skill and tool processing → Human confirmation → Backend business rule execution → Authoritative business data

Step 3: Authoritative business data → Project-level aggregation

When authoritative business data is written, relationships are also established with the project and related business records.

A unique project ID is generated when a project is created. Subsequent partnership, contract, settlement, revenue, cost, invoice, receivable, payable, receipt, and payment data remains linked to that project. More specific relationships are maintained through partnership, contract, and settlement records.

Data generated at different stages can therefore be brought together under the same project.

Authoritative business data → Establish business relationships → Aggregate by project

Step 4: Business data → Financial data

Using confirmed business data and deterministic business rules, the backend determines the financial effects of business activities and creates or updates the relevant revenue, cost, receivable, payable, invoice, receipt, and payment records.

These financial records retain their project and business source relationships, keeping execution connected to financial results.

Project business data + Business rules → Revenue / Costs / Receivables / Payables / Invoices / Receipts and payments

Step 5: Financial data → Performance data

Revenue and costs directly attributable to a project are assigned to it. Shared company expenses are allocated to projects under established rules.

After aggregation and allocation, the system calculates project budgets, revenue, costs, profit, receivables, payables, and cash data using consistent management definitions. It then aggregates these by client, time, and other dimensions into company-level performance data.

Example

Staff voice message: “Mia is confirmed: ¥8,000 for one Xiaohongshu post, with a 5% platform service fee. She'll publish through her Xiaohongshu account, and the client has approved the partnership.”

Structured information

Project: October New Product Content Campaign | Creator: Mia | Platform: Xiaohongshu | Engagement amount: ¥8,000 | Platform service fee rate: 5% | Partnership status: Confirmed | Client confirmation: Yes

↓

Authoritative business data

Creator engagement: Mia / ¥8,000 / Confirmed | Creator settlement: ¥8,000 | Platform service fee: ¥400 | Project: October New Product Content Campaign

↓

Project-level aggregation

Creator execution cost: ¥8,000 | Platform service fee: ¥400 | Additional project cost from this engagement: ¥8,400

↓

Financial data

Project cost: ¥8,400 | Payable to creator: ¥8,000 | Payable to platform: ¥400 | Purchase invoice: Awaiting receipt | Payment status: Awaiting payment

↓

Performance data

Project budget: ¥145,000 | Updated budget used: ¥139,700 | Remaining budget: ¥5,300 | Budget utilization: 96.3% | Project profit and cash flow data updated accordingly

## 4. Database and File Storage

The data layer stores authoritative business data, data relationships, and original business materials, providing a shared foundation for business processing and performance calculations.

Database

The database stores structured records for projects, partnerships, contracts, settlements, revenue, costs, invoices, receivables, payables, receipts, and payments.

Each project receives a unique ID at creation. Subsequent business and financial records retain their project association, while more specific relationships are maintained through partnership, contract, and settlement records.

The database therefore serves three main purposes:

Store authoritative data + Preserve data relationships + Provide a shared data source for business processing and performance calculations

File storage

File storage holds original contracts, invoice images, Excel files, communication records, and other original business materials.

Files are linked to the relevant project, contract, settlement, invoice, and other database records, allowing structured data to be traced to its original supporting evidence.

## 5. External System Integrations

External integrations bring information from WeCom, email, banks, content platforms, and other systems into the data processing workflow.

Integration methods

Depending on the capabilities each external system exposes, data can be obtained through APIs, webhooks, scheduled synchronization, or file imports.

Communication channels can provide messages through interfaces or push notifications. Banks and content platforms can provide transaction and business data through interfaces or scheduled synchronization. Excel files and bank statements can also enter through file imports.

Processing incoming data

Unstructured information, such as communication and contracts, goes to the AI Agent for interpretation and business entity matching before proceeding to human confirmation and backend processing.

Already structured information, such as bank transactions and platform data, enters matching and validation directly.

Confirmed data is written to the relevant business records and linked to its projects, then used in subsequent financial and performance calculations.

## 6. Supporting Backend Capabilities

A production system needs supporting backend capabilities across business processing, data storage, and external integrations to handle real company data reliably and securely.

API services

The frontend, AI Agent, and external systems read and update data through backend APIs.

The API separates frontend actions from the database, ensuring that all operations on authoritative data pass through backend business rules, permission checks, and validation.

Authentication and authorization

The backend identifies the current user and role, then controls access to projects, financial data, and management information according to permissions.

The same business data supports different information scopes and action permissions for managers, project teams, and other responsibilities.

Background tasks

Time-consuming work such as contract parsing, bulk file processing, AI calls, bank transaction matching, and external platform synchronization can run asynchronously as background tasks.

The system tracks task status and retries failed tasks or handles them as exceptions.

Logging and audit

The system records the creation, modification, and confirmation of key data, including who acted, when, what changed, and how AI and human confirmation were involved.

Business statuses and performance data can be traced to specific data changes and business actions.

Exception handling and security controls

The backend centrally handles operational exceptions such as API failures, duplicate data, synchronization errors, and failed AI calls. Access controls, sensitive data protection, key management, and encryption protect company data.

## 7. Deployment and Runtime Architecture

A production environment must deploy the frontend, backend services, database, file storage, LLM, and external interfaces as a complete system capable of continuous operation.

The main runtime relationship is:

User → Frontend application → Backend API / AI Agent → Backend application services → Database and file storage

Alongside:

Backend services ↔ LLM

Backend services ↔ WeCom / Banks / Content platforms and other external systems

Production also requires development, test, and production environments, together with automated deployment, system monitoring, error alerts, data backups, and recovery mechanisms to support reliable ongoing operation.

## 8. Concept Demo and Production Boundaries

The current version has reached the Concept Demo stage. It focuses on validating business workflows, data relationships, management rules, AI Native ways of working, and overall product interactions.

Production implementation

During production development, an engineering team will need to implement the validated workflows, data relationships, and management rules as real backend services and databases, and integrate the AI Agent, LLM, external system APIs, and file storage.

Production capabilities are also required for identity and access management, background tasks, logging and audit, exception handling, security, testing, monitoring, backups, deployment, and operations.

What has been completed

The Demo implements the main product interfaces and interactive business workflows, with relationships among projects, partnerships, contracts, settlements, invoices, receivables, payables, cash, and business analytics.

Project statuses, budgets, revenue, costs, profit, and related performance data are linked and calculated using consistent business logic.

Xiao A simulates the full AI Agent process from interpreting and organizing business information through human confirmation and data updates, validating how AI participates in business workflows.

The current version can validate:

Business workflows + Data relationships + Management rules + AI participation + Product interactions + Performance results

Current implementation boundaries

The Demo runs primarily in the browser.

Production backend services and databases have not yet been built. Frontend code, demonstration data, and browser local storage currently simulate business processing, data states, and some performance calculations.

Xiao A simulates AI Agent outputs and is not connected to a real LLM. External systems such as WeCom, banks, and content platforms are also not connected through live interfaces.

The current deliverable is therefore an interactive validation of the product solution and system logic.
