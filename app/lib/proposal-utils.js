/**
 * Calculate payment status based on milestones
 */
export function calculatePaymentStatus(milestones, totalAmount) {
  if (!milestones || milestones.length === 0) {
    return "pending";
  }

  const paidAmount = milestones.reduce((sum, m) => {
    return sum + (m.isPaid ? m.amount : 0);
  }, 0);

  if (paidAmount === 0) {
    return "pending";
  } else if (paidAmount >= totalAmount) {
    return "fully_paid";
  } else {
    return "partially_paid";
  }
}

/**
 * Format milestones for display
 */
export function formatMilestones(milestones) {
  if (!milestones) return [];

  return milestones.map((m, idx) => ({
    id: m.id || idx + 1,
    name: m.name || `Milestone ${idx + 1}`,
    description: m.description || "",
    amount: parseFloat(m.amount) || 0,
    dueDate: m.dueDate || null,
    isPaid: m.isPaid || false,
    paymentDate: m.paymentDate || null,
    razorpayPaymentId: m.razorpayPaymentId || null,
  }));
}

/**
 * Update milestone payment status
 */
export function updateMilestonePayment(milestones, milestoneId, paymentData) {
  return milestones.map((m) => {
    if (m.id === milestoneId) {
      return {
        ...m,
        isPaid: true,
        paymentDate: new Date().toISOString(),
        razorpayPaymentId: paymentData.razorpay_payment_id || null,
      };
    }
    return m;
  });
}

/**
 * Validate proposal data
 */
export function validateProposalData(data) {
  const errors = {};

  // Client details
  if (!data.client_name?.trim()) errors.client_name = "Client name is required";
  if (!data.client_email?.trim())
    errors.client_email = "Client email is required";
  if (!data.client_phone?.trim())
    errors.client_phone = "Client phone is required";

  // Company details
  if (!data.company_name?.trim())
    errors.company_name = "Company name is required";
  if (!data.company_email?.trim())
    errors.company_email = "Company email is required";
  if (!data.company_phone?.trim())
    errors.company_phone = "Company phone is required";

  // Document
  if (!data.pdf_google_drive_link?.trim())
    errors.pdf_google_drive_link = "PDF link is required";

  // Payment
  if (!data.payment_policies?.trim())
    errors.payment_policies = "Payment policies are required";
  if (
    !data.payment_methods ||
    !Array.isArray(data.payment_methods) ||
    data.payment_methods.length === 0
  )
    errors.payment_methods = "At least one payment method is required";
  if (!data.total_amount || data.total_amount <= 0)
    errors.total_amount = "Valid amount is required";
  if (!data.milestones || data.milestones.length === 0)
    errors.milestones = "At least one milestone is required";

  return Object.keys(errors).length === 0 ? null : errors;
}

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
export function getPaymentPercentage(totalPaid, totalAmount) {
  if (totalAmount === 0) return 0;
  return Math.round((totalPaid / totalAmount) * 100);
}
