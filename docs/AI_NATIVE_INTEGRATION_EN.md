# AI Native Integration

[中文](AI_NATIVE_INTEGRATION.md) | English

[← Back to README](../README_EN.md)

## 1. AI Native Applications in This Project

In project-based marketing services firms, much of the business information first appears in communication, voice messages, proposals, contracts, quotes, invoices, platform data, and Excel files.

In this solution, AI Native capabilities primarily connect that everyday information with the system of record. AI interprets and organizes unstructured information, identifies business entities and changes, and helps consolidate information and process business activities. Business facts enter the system of record after human confirmation, with subsequent processing performed by deterministic business rules.

The current Concept Demo focuses on designing and validating AI Native workflows for business information entry, organizing communication, and file processing.

Other stages in the full workflow, such as creator selection and content performance data collection and aggregation, are also suitable for further AI integration. The current Demo does not cover these capabilities, but the product design retains them as potential extensions.

## 2. How AI Participates in Business Processes

AI Native capabilities can support project execution and business management in different ways according to the needs of each stage.

Business information capture and organization

AI identifies business facts in natural language, voice messages, communication records, contracts, invoices, and Excel files, then organizes and links them using existing projects and counterparties.

Creator selection and partnership matching

AI can use client requirements, project proposals, creator characteristics, historical performance, quotes, and past engagements to screen and organize candidate creators, supporting the project team's partnership decisions.

This capability is not implemented in the current Concept Demo.

Communication and execution follow-up

AI identifies quotes, commercial terms, delivery milestones, revision requests, and status changes in communication with clients, creators, and suppliers, then organizes them into business updates awaiting confirmation or follow-up tasks.

File and business material processing

AI identifies key business information in contracts, invoices, quotes, proposals, and other files, matches it to existing projects and business entities, and helps consolidate the materials.

Content performance data collection and aggregation

After publication, the system can obtain performance data through platform interfaces and other methods. AI can help match content, organize data, and aggregate it by project for subsequent management use.

This capability is not implemented in the current Concept Demo.

## 3. Responsibilities of AI, Rules, and People

The nature of each task determines whether it is handled by AI, deterministic rules, or people.

AI is suited to work requiring semantic understanding and unstructured information processing, such as interpreting communication and files, extracting business information, matching entities, preliminary creator screening, and organizing content performance data.

Deterministic rules handle tasks requiring stable, consistent, and verifiable results, such as amount calculations, budget usage, expense attribution and allocation, revenue, cost and profit calculations, receivables and payables, status conditions, and access controls.

People confirm business facts and handle matters requiring business judgment and accountability. This includes reviewing and amending AI-prepared results, selecting final partners, approving management matters, and handling exceptional business situations.

The overall principles are:

Ambiguous information and semantic understanding → AI

Deterministic calculations and business rules → System rules

Business facts, management judgment, and accountability → People

Business facts identified and organized by AI initially remain information awaiting confirmation. Only after people review, amend, and confirm them do they enter the system of record and contribute to subsequent business statuses and performance calculations.

## 4. How AI Native Changes the Way Work Is Done

AI Native primarily changes how business information enters the system and how people collaborate with it.

From data entry to fact confirmation

Staff can directly submit voice messages, communication, and files already produced during business activity. AI identifies the information and performs the initial organization.

People's main task shifts from repeatedly organizing and entering information to reviewing, supplementing, and confirming business facts.

Structured actions alongside natural language collaboration

Structured pages continue to provide clear views of projects, contracts, settlements, and business analytics. Users can also describe business matters directly to Xiao A, with AI helping interpret and process the information.

The resulting interaction model combines structured page actions with natural language collaboration.

Business activity continuously generates management information

Information is continuously organized, confirmed, and linked during project execution. Data on partnerships, contracts, settlements, invoices, and cash therefore develops progressively as work advances.

Project statuses and performance results can consequently reflect actual business progress more promptly.

## 5. Current Concept Demo

The current Concept Demo primarily validates product interactions and business logic for AI Native information entry, communication organization, file processing, and human confirmation.

Intelligent creator screening and the collection and organization of real platform content data are AI Native capabilities that could be integrated later.

Xiao A's AI outputs are currently simulated. For the production implementation of real LLMs, Agents, tool calling, and external system integrations, see [SYSTEM_ARCHITECTURE_EN.md](SYSTEM_ARCHITECTURE_EN.md).
