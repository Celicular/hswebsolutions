# PROPOSALS MANAGEMENT MODULE - COMPREHENSIVE IMPLEMENTATION PLAN

---

## 📋 EXECUTIVE SUMMARY

This document outlines the complete architecture for a **Proposals Management Module** that will:

- Allow admins to create and manage proposals with comprehensive details
- Provide a client-facing proposal viewer with payment integration
- Maintain data consistency between admin and client views
- Support dark/light theme consistency across all new components
- Include database migration capabilities via Query Runner API

---

## 1. DATABASE STRUCTURE

### 1.1 New Tables Required

#### Table: `proposals`

```sql
CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id CHAR(8) NOT NULL UNIQUE,  -- Auto-generated 8-digit code (e.g., "PROP0001")

  -- Client Information
  client_name VARCHAR(100) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_email VARCHAR(100) NOT NULL,

  -- Company Information
  company_name VARCHAR(100) NOT NULL,
  company_phone VARCHAR(20) NOT NULL,
  company_email VARCHAR(100) NOT NULL,
  old_website_url VARCHAR(255) NULL,

  -- Proposal Document
  pdf_google_drive_link VARCHAR(500) NOT NULL,  -- Link to Google Drive PDF

  -- Payment Information
  payment_policies TEXT NOT NULL,  -- Large textarea content
  total_amount DECIMAL(10, 2) NOT NULL,
  advance_payment_count INT NOT NULL DEFAULT 0,
  milestone_count INT NOT NULL DEFAULT 0,
  milestones JSON,  -- Store as JSON array: [{"id":1,"name":"UI Design","amount":1000,"isPaid":false,...}]

  -- Additional Fields
  notes TEXT NULL,

  -- Status and Metadata
  status ENUM('draft', 'sent', 'viewed', 'paid', 'completed', 'expired', 'rejected') DEFAULT 'draft',
  payment_status ENUM('pending', 'partially_paid', 'fully_paid') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  viewed_at TIMESTAMP NULL,

  -- Tracking
  created_by INT,  -- Admin user ID

  INDEX idx_proposal_id (proposal_id),
  INDEX idx_client_email (client_email),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
);
```

#### Table: `proposal_payments`

```sql
CREATE TABLE IF NOT EXISTS proposal_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id CHAR(8) NOT NULL,
  payment_type ENUM('advance', 'milestone', 'full') NOT NULL,
  milestone_id INT NULL,  -- Reference to milestone index in JSON
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),  -- 'razorpay', 'bank_transfer', etc.
  razorpay_order_id VARCHAR(100) NULL,
  razorpay_payment_id VARCHAR(100) NULL,
  transaction_id VARCHAR(100) NULL,
  payment_date TIMESTAMP NULL,
  status ENUM('pending', 'initiated', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (proposal_id) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  INDEX idx_proposal_id (proposal_id),
  INDEX idx_status (status),
  INDEX idx_razorpay_payment_id (razorpay_payment_id)
);
```

#### Table: `proposal_audit_log`

```sql
CREATE TABLE IF NOT EXISTS proposal_audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id CHAR(8) NOT NULL,
  action VARCHAR(100) NOT NULL,  -- 'created', 'updated', 'viewed', 'payment_initiated', 'payment_completed'
  changed_by INT,  -- Admin ID or 'client' for client actions
  old_value JSON NULL,
  new_value JSON NULL,
  ip_address VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (proposal_id) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  INDEX idx_proposal_id (proposal_id),
  INDEX idx_action (action)
);
```

### 1.2 Milestone JSON Structure

```json
[
  {
    "id": 1,
    "name": "UI Design",
    "description": "Complete UI/UX design mockups",
    "amount": 1000,
    "dueDate": "2025-01-15",
    "isPaid": false,
    "paymentDate": null,
    "razorpayPaymentId": null
  },
  {
    "id": 2,
    "name": "Frontend Development",
    "description": "Responsive frontend implementation",
    "amount": 2500,
    "dueDate": "2025-02-15",
    "isPaid": false,
    "paymentDate": null,
    "razorpayPaymentId": null
  },
  {
    "id": 3,
    "name": "Backend Development",
    "description": "API and database setup",
    "amount": 2500,
    "dueDate": "2025-03-15",
    "isPaid": false,
    "paymentDate": null,
    "razorpayPaymentId": null
  }
]
```

---

## 2. PAGE STRUCTURE & LAYOUTS

### 2.1 ADMIN PANEL - PROPOSALS SECTION

#### Location: `/admin/page.js` (New Tab/Section)

**Navigation Structure:**

```
Admin Dashboard
├── Estimate Submissions (existing)
├── Users (existing)
└── Proposals (NEW)
    ├── View All Proposals (list view)
    ├── Create New Proposal (form)
    └── Edit/View Proposal Details
```

**Create Proposal Form Layout:**

```
┌─────────────────────────────────────────────┐
│        CREATE PROPOSAL - ADMIN FORM          │
│─────────────────────────────────────────────│
│                                              │
│  [Progress Indicator: Step 1 of 4]          │
│                                              │
│  STEP 1: CLIENT & COMPANY DETAILS            │
│  ┌──────────────────────────────────┐       │
│  │ CLIENT INFORMATION               │       │
│  │ ┌──────────────────┐             │       │
│  │ │ Client Name*     │ Phone*      │       │
│  │ └──────────────────┘             │       │
│  │ ┌──────────────────────────────┐ │       │
│  │ │ Email*                       │ │       │
│  │ └──────────────────────────────┘ │       │
│  │                                   │       │
│  │ COMPANY INFORMATION              │       │
│  │ ┌──────────────────┐             │       │
│  │ │ Company Name*    │ Phone*      │       │
│  │ └──────────────────┘             │       │
│  │ ┌──────────────────────────────┐ │       │
│  │ │ Company Email*               │ │       │
│  │ │ Old Website (optional)       │ │       │
│  │ └──────────────────────────────┘ │       │
│  └──────────────────────────────────┘       │
│                                              │
│  [Previous] [Next]                          │
└─────────────────────────────────────────────┘
```

```
STEP 2: PROPOSAL DOCUMENT & POLICIES

┌──────────────────────────────────────────────┐
│ PROPOSAL DOCUMENT                            │
│ ┌────────────────────────────────────────┐   │
│ │ Google Drive PDF Link*                 │   │
│ │ (Paste full shareable link)            │   │
│ │ Example: https://drive.google.com/... │   │
│ └────────────────────────────────────────┘   │
│ [Open PDF Preview] ← Opens in new tab       │
│                                              │
│ PAYMENT POLICIES                            │
│ ┌────────────────────────────────────────┐   │
│ │                                        │   │
│ │ [Large textarea - min 400px height]   │   │
│ │                                        │   │
│ │ Paste your payment policy terms here  │   │
│ │                                        │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ [Previous] [Next]                           │
└──────────────────────────────────────────────┘
```

```
STEP 3: PAYMENT DETAILS

┌──────────────────────────────────────────────┐
│ PAYMENT INFORMATION                          │
│ ┌────────────────────────────────────────┐   │
│ │ Total Amount (₹)*          5000        │   │
│ │ Advance Payments           2           │   │
│ │ Milestones                 3           │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ MILESTONES CONFIGURATION                   │
│ ┌────────────────────────────────────────┐   │
│ │ Milestone 1:                           │   │
│ │  Name: UI Design                       │   │
│ │  Amount: ₹1000                         │   │
│ │  Due Date: [picker]                    │   │
│ │                                        │   │
│ │ Milestone 2:                           │   │
│ │  Name: Frontend Dev                    │   │
│ │  Amount: ₹2500                         │   │
│ │                                        │   │
│ │ Milestone 3:                           │   │
│ │  Name: Backend Dev                     │   │
│ │  Amount: ₹1500                         │   │
│ │                                        │   │
│ │ [Add Milestone] [Remove]               │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ [Previous] [Next]                           │
└──────────────────────────────────────────────┘
```

```
STEP 4: REVIEW & SUBMIT

┌──────────────────────────────────────────────┐
│ REVIEW PROPOSAL                              │
│                                              │
│ CLIENT: John Doe | john@example.com         │
│ COMPANY: ABC Corp | +91-9999-999999         │
│ TOTAL: ₹5000 | 2 Advance + 3 Milestones    │
│                                              │
│ [View PDF] [Edit Details]                   │
│                                              │
│ Proposal ID (auto-generated): PROP0001     │
│                                              │
│ ⚠️ Review all details before submission    │
│                                              │
│ [Cancel] [Submit Proposal]                  │
└──────────────────────────────────────────────┘
```

**Proposals List View Layout:**

```
┌──────────────────────────────────────────────────────┐
│ PROPOSALS MANAGEMENT                                 │
│ [+ Create New]  [Search] [Filter]                    │
├──────────────────────────────────────────────────────┤
│ ID      │ Client      │ Amount │ Status │ Date      │
├─────────┼─────────────┼────────┼────────┼──────────┤
│PROP0001 │ John Doe    │ ₹5000  │ Draft  │ 10/12/25 │
│PROP0002 │ Jane Smith  │ ₹10000 │ Sent   │ 09/12/25 │
│PROP0003 │ Corp Ltd    │ ₹15000 │ Viewed │ 08/12/25 │
│PROP0004 │ StartUp Inc │ ₹7500  │ Paid   │ 07/12/25 │
└──────────────────────────────────────────────────────┘
```

---

### 2.2 HOMEPAGE - BILLING WIDGET

#### Location: After Hero Section in `/page.js`

**Widget Layout:**

```
┌──────────────────────────────────────────────┐
│                                              │
│  TRACK YOUR PROPOSAL                        │
│  ─────────────────────────────────────────  │
│                                              │
│  Already have a Proposal ID?                │
│  Enter it below to view details & pay       │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │ Enter Proposal ID (e.g., PROP0001) │    │
│  │ [Search →]                         │    │
│  └────────────────────────────────────┘    │
│                                              │
│  Your proposal ID is in your email from    │
│  us or in your confirmation message.       │
│                                              │
└──────────────────────────────────────────────┘
```

**Responsive Behavior:**

- Desktop: Full width widget, centered
- Tablet: 90% width with padding
- Mobile: Stacked, full-width input

---

### 2.3 PROPOSAL VIEWER PAGE (CLIENT-FACING)

#### Location: `/proposals/[id]/page.js`

**Page Layout:**

```
┌─────────────────────────────────────────────┐
│ [← Back] PROPOSAL #PROP0001                 │
├─────────────────────────────────────────────┤
│                                              │
│  PROPOSAL HEADER                            │
│  ┌─────────────────────────────────────┐   │
│  │ HS Web Solutions                    │   │
│  │ Your Project Details                │   │
│  │ Status: ✓ APPROVED                  │   │
│  │ Created: 10 Dec 2025                │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  [TABS: Details | PDF | Payment | Notes]    │
│                                              │
│  ═══════════════════════════════════════    │
│  TAB: PROPOSAL DETAILS                      │
│  ═══════════════════════════════════════    │
│                                              │
│  CLIENT INFORMATION                        │
│  ┌─────────────────────────────────────┐   │
│  │ Name: John Doe                      │   │
│  │ Email: john@example.com             │   │
│  │ Phone: +91-9999-999999              │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  PROJECT SCOPE                              │
│  ┌─────────────────────────────────────┐   │
│  │ Description of the project...       │   │
│  │ Features: A, B, C                   │   │
│  │ Timeline: 3 months                  │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  PAYMENT BREAKDOWN                          │
│  ┌─────────────────────────────────────┐   │
│  │ Total Amount: ₹5,000                │   │
│  │                                     │   │
│  │ Milestone 1: UI Design              │   │
│  │  └─ Amount: ₹1,000 [✓ Paid]         │   │
│  │                                     │   │
│  │ Milestone 2: Frontend Dev           │   │
│  │  └─ Amount: ₹2,000 [⏳ Pending]      │   │
│  │                                     │   │
│  │ Milestone 3: Backend Dev            │   │
│  │  └─ Amount: ₹2,000 [⏳ Pending]      │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  PAYMENT POLICIES                           │
│  ┌─────────────────────────────────────┐   │
│  │ [Expandable section]                │   │
│  │ Payment terms and conditions...     │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ═══════════════════════════════════════    │
│  TAB: PDF VIEWER                            │
│  ═══════════════════════════════════════    │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │  [Embedded PDF Viewer]              │   │
│  │  (Google Drive PDF via iframe)      │   │
│  │                                     │   │
│  │  [Download PDF] [Print]             │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ═══════════════════════════════════════    │
│  TAB: PAYMENT                               │
│  ═══════════════════════════════════════    │
│                                              │
│  PAYMENT STATUS                             │
│  ┌─────────────────────────────────────┐   │
│  │ Overall Status: Partially Paid      │   │
│  │ Paid: ₹1,000 / ₹5,000 (20%)         │   │
│  │                                     │   │
│  │ ┌─ Milestone 1: UI Design          │   │
│  │ │  ✓ PAID on 09 Dec 2025           │   │
│  │ │                                   │   │
│  │ │                                   │   │
│  │ ├─ Milestone 2: Frontend Dev       │   │
│  │ │  Amount: ₹2,000                  │   │
│  │ │  [Pay Now →] [Offer Discount]   │   │
│  │ │                                   │   │
│  │ │                                   │   │
│  │ ├─ Milestone 3: Backend Dev        │   │
│  │ │  Amount: ₹2,000                  │   │
│  │ │  (Unlocks after Milestone 2)     │   │
│  │ │                                   │   │
│  │ └─────────────────────────────────┘   │
│  │                                     │   │
│  │ [Pay All Milestones] [Pay Selected]│   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ═══════════════════════════════════════    │
│  TAB: NOTES                                 │
│  ═══════════════════════════════════════    │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ Additional Notes from Team:         │   │
│  │                                     │   │
│  │ We'll start with wireframes once   │   │
│  │ you approve and advance payment... │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  SUPPORT                                    │
│  ┌─────────────────────────────────────┐   │
│  │ Email: contact@hswebsolutions.com   │   │
│  │ Phone: +91-9942-868093              │   │
│  │ Hours: Mon-Fri, 10am-6pm IST        │   │
│  └─────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 3. API ENDPOINTS REQUIRED

### 3.1 Admin APIs (Protected - Auth Required)

#### POST `/api/admin/proposals/create`

- **Purpose:** Create new proposal
- **Input:** All form data from step 4
- **Output:**
  ```json
  {
    "success": true,
    "proposal_id": "PROP0001",
    "message": "Proposal created successfully"
  }
  ```
- **Process:**
  1. Generate unique 8-digit proposal ID
  2. Insert into `proposals` table
  3. Create audit log entry
  4. Return generated ID

#### GET `/api/admin/proposals`

- **Purpose:** Fetch all proposals with pagination/filters
- **Query Params:** `page`, `limit`, `search`, `status`, `date_from`, `date_to`
- **Output:**
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": { "total": 100, "page": 1, "pages": 10 }
  }
  ```

#### GET `/api/admin/proposals/[id]`

- **Purpose:** Fetch single proposal details
- **Output:** Complete proposal object with all relations

#### PUT `/api/admin/proposals/[id]`

- **Purpose:** Update proposal details
- **Input:** Updated form data
- **Restrictions:** Cannot edit if payment already initiated

#### DELETE `/api/admin/proposals/[id]`

- **Purpose:** Delete proposal (soft delete recommended)
- **Restrictions:** Only if draft status

#### POST `/api/admin/proposals/[id]/send`

- **Purpose:** Send proposal to client (email + status update)
- **Output:** Email sent confirmation

---

### 3.2 Client APIs (Public/Token-Protected)

#### GET `/api/proposals/[proposal_id]`

- **Purpose:** Fetch proposal by 8-digit ID
- **Authentication:** Public (no auth, but validate proposal_id format)
- **Security:** Rate limiting, IP logging
- **Output:** Proposal details (excluding sensitive admin notes if any)
- **Action:** Log "viewed_at" timestamp

#### POST `/api/proposals/[proposal_id]/initiate-payment`

- **Purpose:** Create Razorpay order for milestone payment
- **Input:**
  ```json
  {
    "milestone_id": 1,
    "amount": 2000,
    "customer_email": "client@example.com"
  }
  ```
- **Output:**
  ```json
  {
    "order_id": "order_xxx",
    "amount": 2000,
    "currency": "INR",
    "razorpay_key": "key_xxx"
  }
  ```

#### POST `/api/proposals/[proposal_id]/verify-payment`

- **Purpose:** Verify Razorpay payment webhook
- **Input:** Razorpay signature + order details
- **Actions:**
  1. Verify signature
  2. Update milestone status to paid
  3. Update proposal payment_status
  4. Create audit log
  5. Send confirmation email

---

### 3.3 Query Runner API (Admin Only)

#### POST `/api/admin/query-runner`

- **Purpose:** Execute custom SQL queries (migrations, schema updates)
- **Authentication:** Admin only, additional password protection
- **Input:**
  ```json
  {
    "query": "ALTER TABLE proposals ADD COLUMN ...",
    "admin_password": "query_runner_password"
  }
  ```
- **Restrictions:**
  - Only SELECT, ALTER, CREATE, DROP allowed
  - Cannot execute INSERT/DELETE on sensitive tables
  - Query timeout: 30 seconds
  - All queries logged for audit
- **Output:**
  ```json
  {
    "success": true,
    "affected_rows": 5,
    "execution_time": "0.25s",
    "query_id": "qr_xxx"
  }
  ```

---

## 4. COMPONENT HIERARCHY

### 4.1 Admin Components

```
AdminDashboard
├── ProposalsSection (new)
│   ├── ProposalsNav (tabs: List, Create, View)
│   ├── ProposalsListView
│   │   ├── ProposalTable
│   │   ├── FilterBar
│   │   └── Pagination
│   ├── CreateProposalForm (4-step wizard)
│   │   ├── Step1ClientCompanyDetails
│   │   ├── Step2DocumentPolicies
│   │   ├── Step3PaymentMilestones
│   │   ├── Step4Review
│   │   └── ProgressIndicator
│   └── EditProposalView
│       └── EditableProposalForm
├── QueryRunnerSection (new)
│   ├── QueryEditor (textarea)
│   ├── ExecuteButton
│   └── ResultsPanel
└── [Existing sections...]
```

### 4.2 Homepage Components

```
HomePage
├── Hero
├── BillingWidget (new)
│   ├── SearchInput
│   └── SubmitButton
├── Services
└── [Other sections...]
```

### 4.3 Proposal Viewer Components

```
ProposalViewerPage
├── Header
│   ├── BackButton
│   └── ProposalTitle
├── ProposalNav (tabs)
├── DetailsTab
│   ├── ClientInfo
│   ├── ProjectScope
│   └── PaymentBreakdown
├── PDFTab
│   └── PDFViewer (iframe)
├── PaymentTab
│   ├── PaymentStatus
│   ├── MilestoneList
│   └── RazorpayCheckout
├── NotesTab
│   └── AdditionalNotes
└── SupportSection
```

---

## 5. STYLING & THEME CONSISTENCY

### 5.1 Design Approach

**Color Scheme (from globals.css):**

```css
Light Mode:
  --background: #e0f2fe
  --card-bg: #FFFFFF
  --foreground: #333333
  --primary: #4CAF50
  --accent: #FF8C00

Dark Mode:
  --background: #0f172a
  --card-bg: #1e293b
  --foreground: #F5F5F5
  --primary: #4CAF50 (same)
  --accent: #FF8C00 (same)
```

### 5.2 Component-Specific Styling

**ProposalFormSection.module.css**

```css
/* Inherit from admin.module.css structure */
.formContainer {
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px var(--shadow);
  border: 1px solid var(--border);
}

.formSection {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.formSection:last-child {
  border-bottom: none;
}

/* Dark mode support */
:global(.dark-mode) .formContainer {
  background-color: var(--card-bg);
  border-color: var(--border);
}
```

**BillingWidget.module.css**

```css
.container {
  background: linear-gradient(
    135deg,
    var(--primary),
    rgba(var(--color-primary-rgb), 0.2)
  );
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  margin: 4rem auto;
  max-width: 600px;
  box-shadow: 0 8px 32px var(--shadow);
  border: 1px solid rgba(var(--border-color-rgb), 0.2);
}

:global(.dark-mode) .container {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.15),
    rgba(76, 175, 80, 0.05)
  );
}
```

**ProposalViewer.module.css**

```css
.container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--card-bg);
  color: var(--foreground);
  min-height: 100vh;
}

.tabContent {
  padding: 2rem;
  background-color: var(--card-bg);
}

.paymentCard {
  background: linear-gradient(
    135deg,
    var(--primary),
    rgba(var(--color-primary-rgb), 0.1)
  );
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
}

:global(.dark-mode) .paymentCard {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.2),
    rgba(76, 175, 80, 0.05)
  );
}
```

### 5.3 Responsive Design Breakpoints

```css
/* Mobile First */
@media (max-width: 768px) {
  .formContainer {
    padding: 1rem;
  }

  .formFields {
    flex-direction: column;
    gap: 1rem;
  }

  .tabContainer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}
```

---

## 6. PROPOSAL LIFECYCLE & STATE MANAGEMENT

### 6.1 Proposal Status Flow

```
┌─────────┐
│ DRAFT   │  (Admin creating, not sent)
└────┬────┘
     │ (Admin sends via email)
     ↓
┌─────────┐
│ SENT    │  (Email sent, awaiting client view)
└────┬────┘
     │ (Client opens proposal)
     ↓
┌─────────┐
│ VIEWED  │  (Client has seen it)
└────┬────┘
     │
     ├─ (Client pays advance)
     │  ↓
     │ ┌──────────────────┐
     │ │ PARTIALLY_PAID   │
     │ └────┬─────────────┘
     │      │
     │      ├─ (Client pays remaining)
     │      │  ↓
     │      │ ┌─────────┐
     │      └─→│ PAID    │
     │         └─────────┘
     │
     └─ (Client rejects)
        ↓
     ┌──────────┐
     │ REJECTED │
     └──────────┘
```

### 6.2 Payment Status Tracking

**In Milestones JSON:**

```json
{
  "id": 1,
  "name": "UI Design",
  "amount": 1000,
  "isPaid": false,
  "paymentDate": null,
  "razorpayPaymentId": null
}
```

**In proposal_payments table:**

- Track individual payment transactions
- Link to Razorpay orders
- Store payment method and metadata

---

## 7. SECURITY CONSIDERATIONS

### 7.1 Authentication & Authorization

- Admin panel: Existing JWT/session auth
- Proposal viewer: Public access with proposal_id validation
- Query runner: Admin + additional password protection

### 7.2 Data Protection

- Razorpay payment verification via signature
- SQL injection prevention in query runner (whitelist queries)
- Rate limiting on proposal lookup (prevent ID enumeration)
- HTTPS enforcement for payment flows
- PII logging in audit trail (encrypted)

### 7.3 Payment Security

- All Razorpay integrations server-side
- No payment details stored locally
- Webhook signature verification required
- Idempotent payment handling (prevent double-processing)

---

## 8. PAYMENT INTEGRATION (RAZORPAY)

### 8.1 Payment Flow Sequence

```
1. Client clicks "Pay" for milestone
   ↓
2. Frontend calls /api/proposals/[id]/initiate-payment
   ↓
3. Backend creates Razorpay order
   ↓
4. Razorpay checkout modal opens
   ↓
5. Client completes payment
   ↓
6. Razorpay redirects to callback
   ↓
7. Frontend calls /api/proposals/[id]/verify-payment
   ↓
8. Backend verifies signature
   ↓
9. Update milestone status + email confirmation
```

### 8.2 Milestone-by-Milestone Implementation

- Each milestone has independent Razorpay order
- Locked/unlocked states based on dependencies
- Can pay in any order OR enforce sequence
- Payment history tracked in proposal_payments table

---

## 9. EMAIL NOTIFICATIONS

### 9.1 Triggers

**On Proposal Creation (Admin):**

- "Proposal created successfully" confirmation

**On Proposal Send (Admin → Client):**

- Email to client_email with proposal ID + link
- Subject: "Your Project Proposal - Action Required"

**On Proposal Viewed (System → Admin):**

- "Client viewed your proposal" notification

**On Payment Initiated (Client → System):**

- No email (real-time feedback via UI)

**On Payment Completed (System → Both):**

- Client: "Payment received - next milestone unlocked"
- Admin: "Payment received from [Client] - ₹X for [Milestone]"

**On Full Proposal Paid:**

- Both: "Proposal fully paid - project kickoff ready"

---

## 10. ERROR HANDLING & EDGE CASES

### 10.1 Client-Facing Errors

| Scenario            | Handling                                   |
| ------------------- | ------------------------------------------ |
| Invalid Proposal ID | Show 404 with "Check your ID" message      |
| Expired Proposal    | Show status with "Contact us to renew"     |
| Payment Failed      | Display Razorpay error + retry button      |
| Network Error       | Show retry with auto-refresh               |
| PDF Link Broken     | Show message "PDF temporarily unavailable" |

### 10.2 Admin Errors

| Scenario               | Handling                      |
| ---------------------- | ----------------------------- |
| Duplicate Client Email | Warn before saving            |
| Invalid PDF Link       | Test link on form submission  |
| Empty Milestones       | Require at least 1 milestone  |
| Query Syntax Error     | Show error line + suggest fix |

### 10.3 Payment Reconciliation

- Webhook timeout handling (retry mechanism)
- Manual payment verification in admin panel
- Payment status sync check (daily cron job)

---

## 11. DATABASE MIGRATION STRATEGY

### 11.1 Query Runner Usage Examples

**Create proposals table:**

```sql
CREATE TABLE IF NOT EXISTS proposals (...) -- From plan above
```

**Add new column:**

```sql
ALTER TABLE proposals ADD COLUMN description TEXT;
```

**Create index:**

```sql
CREATE INDEX idx_proposal_status ON proposals(status);
```

**Add constraint:**

```sql
ALTER TABLE proposal_payments
ADD CONSTRAINT fk_proposal
FOREIGN KEY (proposal_id) REFERENCES proposals(proposal_id);
```

### 11.2 Audit Trail for Migrations

Every query execution logged with:

- Query text (sanitized)
- Execution timestamp
- Admin user ID
- Rows affected
- Execution time
- Status (success/failed)

---

## 12. FILE STRUCTURE

```
app/
├── admin/
│   ├── page.js (modified - add Proposals tab)
│   ├── admin.module.css (modified - add dark mode support)
│   └── components/
│       └── proposals/ (new)
│           ├── ProposalsSection.js
│           ├── ProposalsNav.js
│           ├── ProposalsListView.js
│           ├── CreateProposalForm.js
│           ├── Step1ClientCompanyDetails.js
│           ├── Step2DocumentPolicies.js
│           ├── Step3PaymentMilestones.js
│           ├── Step4Review.js
│           ├── EditProposalView.js
│           └── ProposalForm.module.css
│
├── api/
│   ├── admin/
│   │   └── proposals/ (new)
│   │       ├── route.js (GET all, POST create)
│   │       ├── [id]/
│   │       │   ├── route.js (GET, PUT, DELETE)
│   │       │   └── send/
│   │       │       └── route.js (POST send)
│   │       └── query-runner/
│   │           └── route.js (POST execute query)
│   │
│   └── proposals/ (new)
│       ├── [id]/
│       │   ├── route.js (GET proposal)
│       │   ├── initiate-payment/
│       │   │   └── route.js
│       │   └── verify-payment/
│       │       └── route.js
│       └── search/
│           └── route.js (search by ID)
│
├── proposals/ (new)
│   └── [id]/
│       ├── page.js (Proposal viewer page)
│       ├── page.module.css
│       └── components/
│           ├── ProposalHeader.js
│           ├── ProposalTabs.js
│           ├── DetailsTab.js
│           ├── PDFTab.js
│           ├── PaymentTab.js
│           ├── NotesTab.js
│           └── ProposalViewer.module.css
│
├── components/
│   ├── BillingWidget.js (new)
│   └── BillingWidget.module.css
│
├── page.js (modified - add BillingWidget)
│
└── lib/
    ├── db.js (existing, will be used)
    └── proposal-utils.js (new)
        └── generateProposalId()
        └── calculatePaymentStatus()
        └── formatMilestones()
```

---

## 13. IMPLEMENTATION ROADMAP

### Phase 1: Database & Core APIs

1. Create all new tables
2. Implement proposal CRUD APIs
3. Build Query Runner API
4. Create utility functions

### Phase 2: Admin Panel

1. Create Proposals section components
2. Build 4-step form wizard
3. Add Proposals list view
4. Implement Query Runner UI

### Phase 3: Client-Facing

1. Build Proposal Viewer page
2. Add BillingWidget to homepage
3. Implement Razorpay integration
4. Add PDF viewer

### Phase 4: Polish & Testing

1. Dark/light mode refinement
2. Responsive design fixes
3. Performance optimization
4. Comprehensive testing

---

## 14. DESIGN SUMMARY - VISUAL CONSISTENCY

### Color Usage

- **Primary Actions:** Green (#4CAF50) - consistent with site
- **Accent:** Orange (#FF8C00) - for secondary actions
- **Status Indicators:**
  - ✓ Green = Paid/Complete
  - ⏳ Orange = Pending
  - ✗ Red = Failed/Rejected
  - ℹ Blue = Info/Draft

### Typography

- **Headings:** Existing font, scale: h1(3rem) → h3(1.2rem)
- **Body:** Consistent with site (0.95-1rem)
- **Labels:** 0.85rem, semi-bold

### Spacing

- **Containers:** 2rem padding (admin), 1.5rem (mobile)
- **Sections:** 1.5rem gap
- **Form fields:** 1rem margin-bottom

### Shadows & Effects

- **Cards:** 0 4px 12px rgba(0,0,0,0.08) - light
- **Hover:** Subtle scale(1.02) + shadow increase
- **Focus:** Blue glow 0 0 0 3px rgba(76,175,80,0.1)

### Animation

- **Transitions:** 0.2-0.3s for interactive elements
- **Page entry:** Fade + slide up (0.6s)
- **Modal/Dropdown:** 0.3s ease-out

---

## 15. COMPLETION CRITERIA

✅ All components implement dark/light mode via `:global(.dark-mode)`  
✅ Fully responsive (mobile, tablet, desktop)  
✅ All forms have validation and error messages  
✅ Payment flow secure (server-side verification)  
✅ Proposal ID auto-generation working  
✅ Audit trail complete for all actions  
✅ Database queries optimized with indexes  
✅ Query Runner UI intuitive and safe  
✅ PDFs load correctly in viewer  
✅ Email notifications sent (if configured)  
✅ No hardcoded colors (use CSS variables)  
✅ Accessibility: Form labels, ARIA attributes, keyboard navigation

---

## 16. NEXT STEPS

Before implementation begins:

1. **Confirm Requirements** - Review this plan with stakeholder
2. **Approve Design** - Finalize UI layouts and color choices
3. **Database Backup** - Before any schema changes
4. **Razorpay Setup** - Verify API keys in .env.local
5. **Email Service** - Confirm email provider for notifications

---

**Plan Created:** 10 Dec 2025  
**Plan Status:** Ready for Development  
**Approved By:** [Pending]
