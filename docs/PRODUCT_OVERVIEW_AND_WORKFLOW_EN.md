# Product Overview & Workflow

[中文](PRODUCT_OVERVIEW_AND_WORKFLOW.md) | English

[← Back to README](../README_EN.md)

## 1. Product Overview

The AI Native Business & Finance Management System is designed for project-based marketing services firms. It brings project execution, business collaboration, contracts and settlements, financial operations, and performance analysis into a unified management framework.

The system uses AI to capture and organize everyday business information, continuously turning it into structured business and performance data and connecting execution with business management from end to end.

## 2. Product Architecture

The system is built around project performance and consists of six main work areas:

Workspace / Project Management / Communication Center / Partner Management / Financial Operations / Business Analytics

The Workspace is the main entry point for daily work. Project Management supports the full project lifecycle. The Communication Center connects everyday communication with business statuses. Partner Management maintains ongoing business entities. Financial Operations handles settlements and cash matters arising from projects. Business Analytics turns business data into management information.

Xiao A, the system-wide AI business assistant, works across these areas to help capture, organize, link, query, and process business information.

Workspace

The Workspace is the system's primary work area and the main entry point for business information.

Users can submit information or initiate business actions directly through natural language, extended voice messages, images, Excel files, PDFs, contracts, invoices, screenshots, or multiple files.

Xiao A uses the current user, project, counterparties, and existing system data to understand the business context, identify key facts and relationships, and prepare organized results or business actions. Users review, amend, and confirm business facts before they are written to the system of record.

Core interaction flow:

Business input → AI interpretation and organization → Business entity matching → Human confirmation → Data update

The Workspace also brings together the tasks, projects, and performance information most relevant to the current user. Managers focus on company-wide project status, performance, and cash matters; project team members focus on their own tasks, projects they participate in, and everyday business processing.

Project Management

Project Management supports the full lifecycle, from proposals and execution to content delivery, contracts, and settlements.

Each project has a unified workspace:

Overview / Proposals / Creators / Content & Data / Contracts & Settlements / Project Records

Project status, proposal versions, partnership execution, content delivery, budgets, contracts, settlements, and related records remain linked within the same project, connecting execution with business results.

Communication Center

The Communication Center manages project-related business communication and uses AI to turn unstructured conversations into actionable business information.

Using conversation context, counterparties, and associated projects, Xiao A identifies quotes, commercial terms, key dates, client feedback, execution statuses, and potential risks, then prepares structured summaries, business updates, or follow-up tasks.

Human-confirmed information enters the relevant project and business records, making communication an ongoing source of business data.

Partner Management

Partner Management maintains clients, creators, platforms, suppliers, and other counterparties, together with related accounts, past engagements, and business relationships. This provides reference data for project execution, settlement, and performance analysis.

Financial Operations

Financial Operations centrally manages project-related receivables, payables, sales and purchase invoices, receipts, payments, and exceptions.

Financial data remains linked to its originating projects, contracts, and settlements, so cash outcomes can be traced back to specific business activities.

Business Analytics

Business Analytics aggregates data from project execution and financial operations into management information.

The current version prioritizes fundamental, frequently used views: project performance, client performance, receivables and collections, cash flow forecasts, and project operating status. These help management understand project results, client contribution, collection progress, future cash positions, and the status of key projects.

Metrics, analytical dimensions, and management views can be extended as the company's scale, business model, and management needs evolve.

## 3. End-to-End Business Workflow

The system uses projects as the organizing unit, continuously connecting execution with business results.

Project creation → Proposal development → Client confirmation → Contract signing → Creator execution → Content review → Publication → Client acceptance → Settlement → Completion

As a project progresses, partnerships, content, contracts, expenses, invoices, receipts, and payments remain linked to it.

After execution is complete, the system tracks business fulfillment and financial settlement separately, managing the project from initiation through final closure.

The business process ultimately produces:

Project execution → Business fulfillment → Contracts and settlements → Revenue and costs → Receivables and payables → Receipts and payments → Project performance results

## 4. How Business Data Is Created

Performance data is built progressively from information generated during business activity. AI identifies and organizes information, staff confirm business facts, and the system then allocates, calculates, and aggregates the data using established relationships, rules, and calculation definitions.

Business information → AI identification and organization → Human confirmation → Business data creation → Rule-based allocation and calculation → Performance data → Management views

Information identification and organization

The system identifies projects, clients, counterparties, amounts, dates, contractual terms, business statuses, and other information in natural language, voice input, communication records, contracts, proposals, quotes, invoices, Excel files, and other business materials, then matches them to existing business entities.

Human confirmation and data creation

AI organizes its findings into business information awaiting confirmation. Staff review, amend, and confirm it. Confirmed facts are written to the relevant project, partnership, contract, settlement, and financial records, becoming authoritative business data.

Business allocation and performance calculations

The system processes confirmed business data according to established relationships and rules. For example, it assigns costs from different counterparties to the relevant projects and settlements, creates receivables and payables from contract and settlement arrangements, allocates project costs under budget and expense rules, and calculates project revenue, costs, profit, and cash positions using consistent management definitions.

Performance data aggregation

Project-level performance data is further aggregated by project, client, time, cash, and other management dimensions. This produces views of project performance, client performance, receivables and collections, and cash flow, while preserving traceability from results to individual business records.

## 5. Core Design Principles

Low-effort information capture

Embed information capture in actual business activity, using natural language, voice, communication, and files to collect information continuously and reduce additional recordkeeping and repeated organization.

Integrated execution and management

Connect execution, contracts, settlements, invoices, and cash around projects, allowing performance data to develop continuously as work progresses.

AI Native interaction

AI participates in interpreting, organizing, linking, and processing business information, so users can carry out actions in ways that fit their everyday work.

Confirmation of key matters

Business facts enter the system of record only after human confirmation, improving information processing efficiency while maintaining reliable business data.

A shared data foundation

Maintain ongoing links among projects, counterparties, contracts, settlements, invoices, and cash to support traceability across business stages and performance analysis.

Role-based work views

Managers and project teams use the same underlying business data, with tasks, projects, and performance information tailored to their responsibilities.

## 6. Concept Demo

The current version is an interactive Concept Demo designed to present and validate business logic, AI Native ways of working, and the complete connection between execution and business management.

Live Demo: `https://yingjuegu.github.io/ai-native-business-finance-demo_AY/`

Start with Jessica, the manager role.

Business information entry

Open the Workspace and enter a business update through Xiao A, or submit a voice message, file, or other business material. Explore how AI interprets and organizes the input, identifies relevant projects and business entities, and updates the system with business facts after human confirmation.

Project management

Open a project and explore its overview, proposals, creators, content and data, contracts and settlements, and project records. The project details show how different business activities are organized and linked around the same project, and how statuses and performance data change as work progresses.

Business management

Open the Business Analytics Dashboard to explore project performance, client performance, receivables and collections, cash flow forecasts, and project operating status. Trace performance results back to the relevant projects and business records.

The system also provides Amy, the project team role. Switch roles to explore differences in the Workspace, project scope, and information access according to each role's responsibilities.
