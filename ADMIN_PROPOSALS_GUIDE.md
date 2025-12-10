# Admin Dashboard - Quick Guide

## How to Access Proposal Management

### 1. **Go to Admin Dashboard**

- Navigate to `/admin`
- Login with your credentials

### 2. **Available Tabs**

#### 📋 Proposals Tab

- **View all proposals** with pagination
- **Search** by client name, email, or proposal ID
- **Filter by status**: Draft, Sent, Viewed, Accepted, Rejected, Paid
- **Sort** by newest, amount, or client name
- **Actions**: View, Edit, Send, or Delete proposals

#### ➕ Create Proposal Tab

- **4-Step Wizard** to create proposals:
  1. **Step 1**: Client & Company Details
  2. **Step 2**: Payment & Policies
  3. **Step 3**: Milestones (payment stages)
  4. **Step 4**: Review & Submit

### 3. **Creating a New Proposal**

1. Click the **➕ Create Proposal** tab
2. Fill in **Client Information**:

   - Name, Phone, Email
   - Company Name, Phone, Email
   - Optional: Old Website URL

3. Go to **Step 2**: Payment & Policies

   - Link to proposal PDF
   - Select accepted payment methods
   - Add payment terms & conditions
   - Optional: Additional policies

4. Go to **Step 3**: Milestones

   - Add project milestones
   - Set amount for each milestone
   - Set due dates
   - Add deliverables

5. Go to **Step 4**: Review
   - Review all details
   - Add optional notes
   - Click **Create Proposal**

### 4. **Managing Proposals**

Once created, go to **📋 Proposals** to:

- **View**: Click "👁️ View" to see the proposal as client sees it
- **Edit**: Click "✏️ Edit" to modify proposal details
- **Send**: Click "📧 Send" to change status to "Sent"
- **Delete**: Click "🗑️ Delete" to remove proposal

### 5. **Proposal Statuses**

- **📝 Draft** - Not sent to client yet
- **📧 Sent** - Sent to client
- **👁️ Viewed** - Client has viewed it
- **✓ Accepted** - Client accepted proposal
- **✕ Rejected** - Client rejected proposal
- **💰 Paid** - Payment received

## Features

✅ **Auto-generated Proposal IDs** (PROP0001, PROP0002, etc.)
✅ **Payment milestone tracking**
✅ **Multiple payment methods support**
✅ **Full audit trail** of changes
✅ **PDF integration** with Google Drive
✅ **Dark/Light mode** compatible
✅ **Mobile responsive**
✅ **Real-time validation**

## Database Setup

Before using proposals, ensure database tables are created:

```sql
-- Go to admin and use Query Runner to execute:
POST /api/admin/proposals/query-runner
{
  "query": "Your SQL from app/lib/proposals-schema.sql",
  "admin_password": "QueryRunner@2025"
}
```

## Support

For issues or questions:

- Email: contact@hswebsolutions.com
- Phone: +91 9942 868093
