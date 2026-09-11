# AI Native Business & Finance Management System

[中文](README.md) | English

An AI Native business and finance management system designed for project-based marketing services firms.

This project is grounded in real business operations. It began with business research and an assessment of operational challenges, examining how the company runs projects, coordinates its people, shares business information, and manages performance. That work informed a redesign of project processes, business rules, data relationships, and management views, alongside an exploration of AI Native interactions that reduce the effort required to use a business system.

The current version is an interactive Concept Demo for validating the overall management framework, core business logic, and AI Native ways of working.

## Project Background

The company is a small marketing services firm that delivers projects for brand clients. With a lean team, staff handle client communication, proposal development, creator partnerships, content execution, and project follow-up, without a large, dedicated operations or finance support team.

A typical project moves through client requirements, proposal development, creator selection and pricing, partnership confirmation, contracts and orders, content production and review, publication, performance tracking, settlement, invoicing, and collection. Throughout this process, substantial business information is generated, including client requirements, creator quotes, commercial terms, delivery milestones, contractual commitments, expenses, invoices, and receipt and payment schedules.

Existing practices support project delivery, but business information remains scattered across chat histories, Excel files, contracts and invoices, platform portals, email, and personal notes. Different people hold different pieces of information, and the same business fact often has to be recorded repeatedly, checked manually, and reorganized.

Core challenges:

- Heavy manual recordkeeping — Project progress depends heavily on manual tracking and follow-up. Staff continually switch between chats, spreadsheets, files, and platforms to find, reconcile, and update information. As project volume grows, omissions become more likely.
- Fragmented, inconsistent business data — Information about projects, clients, creators, contracts, expenses, invoices, and cash is spread across tools and people. Inconsistent records and formats, together with weak links between them, make it difficult to build a complete, continuously maintained data foundation.
- Limited management visibility — The company can keep projects moving, but project execution is not systematically connected to business results. Project profit, budget usage, receivables collection, and future cash flow depend on retrospective manual analysis, making it difficult for management to understand performance promptly and intervene early.

The project therefore starts with how projects actually operate and redesigns the relationships between execution, business performance data, and management information. Key business facts are captured as work happens, creating a data foundation for project management, cash planning, and business decisions.

## Solution

The system centers on project performance, bringing project execution, business partners, contracts, settlements, invoices, receivables, payables, and cash into a unified management framework.

Staff carry out their work through the workspace, everyday communication, voice input, and files. AI identifies projects, counterparties, amounts, dates, contractual terms, and status changes in this information and organizes them into structured information. Business facts enter the system of record only after human confirmation. Shared data relationships then connect projects, contracts, settlements, invoices, receipts, and payments.

As projects progress, the system continuously builds data on project status, budgets, revenue, costs, receivables, payables, and cash flow, then aggregates it into the information management needs.

Solution highlights:

- Low-effort information capture — Business information is captured as naturally as possible during everyday work. AI identifies, organizes, and links information from voice input, communication, and files, reducing additional recordkeeping, duplicate entry, and maintenance of system records.
- An operational management framework — Connecting project execution, contracts, settlements, invoices, and cash allows business activity to continuously generate data on revenue, costs, profit, receivables, payables, and cash flow. This supports management views of project performance, client performance, collections, and cash flow.
- AI Native ways of working — Users collaborate with the system through natural language, voice, communication, and files. AI interprets and organizes business information, while the rules system handles key calculations and status controls. Business facts enter the system of record only after human confirmation, embedding AI directly into business processes.

The overall flow is:

Business activity → Information capture → Data formation → Performance analysis → Management decisions

AI interprets and organizes unstructured information. Business rules handle amounts, statuses, permissions, and calculations. Business facts enter the system of record only after human confirmation, and the database stores those confirmed facts.

## System Structure

The system captures information from everyday business activity and progressively turns it into data for business management.

1. Business information enters the system

   Staff handle everyday work through text, voice, communication records, and files, bringing business information into the system.

2. Structured business data is created

   AI interprets and organizes the input, identifies key business information, and combines business rules with human confirmation to turn it into authoritative business data that can be linked to other records.

3. Business performance data is produced

   As projects progress, the system links, calculates, and aggregates business data according to established relationships, rules, and management definitions, progressively building project- and company-level performance data.

4. Business management is supported

   Management views show project performance, client performance, collections, and cash flow, with the ability to trace results back to individual business records.

## My Role

Project Lead / Business Management and Product Solution Design

Led the project from business research, requirements identification, and problem diagnosis through management solution design, business processes and rules, data relationships, AI Native ways of working, and product design. Built and iteratively validated the interactive Concept Demo through AI-assisted development / Vibe Coding.

The current deliverable is a Concept Demo for validating the business solution, management logic, system design, and product interactions.

Production deployment is outside the current project scope. A professional engineering team would need to implement backend services, databases, identity and access management, security controls, real LLM and third-party API integrations, testing, deployment, and ongoing operations.

## Data & Privacy

The public version is for demonstration purposes only.

Company, client, employee, creator, supplier, contract, invoice, amount, date, communication, and other business records have been anonymized, modified, or reconstructed. They do not represent actual company operating records.

The public repository contains no real contracts, invoices, banking information, chat histories, client materials, trade secrets, API keys, or other sensitive information.

## Demo

Live Demo: `https://yingjuegu.github.io/ai-native-business-finance-demo_AY/`

For a first walkthrough, see:

[Product Overview & Workflow](docs/PRODUCT_OVERVIEW_AND_WORKFLOW_EN.md)

## Documentation

- [Product Overview & Workflow](docs/PRODUCT_OVERVIEW_AND_WORKFLOW_EN.md) — Product structure, core workflows, and a Concept Demo walkthrough
- [System Architecture](docs/SYSTEM_ARCHITECTURE_EN.md) — System architecture and the approach to production implementation
- [Business Logic](docs/BUSINESS_LOGIC_EN.md) — Business rules, management definitions, and data relationships
- [AI Native Integration](docs/AI_NATIVE_INTEGRATION_EN.md) — How AI participates in business processes and how responsibilities are divided among AI, rules, and people
