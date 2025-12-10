/**
 * Format currency with Indian rupees
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Calculate total paid amount
 */
export function calculateTotalPaid(milestones) {
  if (!milestones) return 0;
  return milestones.reduce((sum, m) => {
    return sum + (m.isPaid ? m.amount : 0);
  }, 0);
}

/**
 * Get payment percentage
 */
export function getPaymentPercentage(paid, total) {
  if (!total || total === 0) return 0;
  return Math.round((paid / total) * 100);
}

/**
 * Get milestone status
 */
export function getMilestoneStatus(milestone) {
  if (milestone.isPaid) return "paid";
  if (milestone.isApproved) return "approved";
  if (milestone.isSubmitted) return "submitted";
  return "pending";
}

/**
 * Get proposal status display
 */
export function getProposalStatusDisplay(status) {
  const displayMap = {
    draft: "📝 Draft",
    sent: "📧 Sent",
    viewed: "👁️ Viewed",
    accepted: "✓ Accepted",
    rejected: "✕ Rejected",
    paid: "💰 Paid",
  };
  return displayMap[status] || status;
}
