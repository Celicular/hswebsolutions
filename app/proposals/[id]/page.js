"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../ProposalViewer.module.css";
import { formatCurrency, formatDate } from "../../lib/proposal-utils-client";

export default function ProposalViewerPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchProposal();
    }
  }, [params.id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/proposals/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Proposal not found");
        } else {
          setError("Failed to load proposal");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setProposal(data.data);
      setError("");
    } catch (err) {
      setError("Error loading proposal");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGenerateInvoice = async (invoiceType, milestoneId = null) => {
    try {
      setPaymentProcessing(true);
      const response = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: proposal.proposal_id,
          invoiceType: invoiceType,
          milestoneId: milestoneId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invoice");
      }

      // Show custom invoice modal
      setCurrentInvoice(data.invoice);
      setShowInvoiceModal(true);
    } catch (err) {
      console.error("Invoice generation error:", err);
      alert("Failed to generate invoice: " + err.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const downloadInvoicePDF = async () => {
    if (!currentInvoice) return;

    try {
      // Dynamically import html2pdf
      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.getElementById("invoice-content");
      const opt = {
        margin: 10,
        filename: `Invoice-${currentInvoice.id}.pdf`,
        image: { type: "png", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to download PDF");
    }
  };

  const handleRazorpayPayment = async (amount, milestoneId = null) => {
    // Prevent payment if already fully paid
    if (proposal.total_amount <= paidMilestonesTotalAmount && !milestoneId) {
      alert("This proposal is already fully paid");
      return;
    }

    // Prevent milestone payment if milestone is already paid
    if (milestoneId) {
      const milestone = milestones.find((m) => m.id === milestoneId);
      if (milestone?.isPaid) {
        alert("This milestone is already paid");
        return;
      }
    }

    try {
      setPaymentProcessing(true);

      // Step 1: Create Razorpay order
      const orderResponse = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          proposalId: proposal.proposal_id,
          description: milestoneId
            ? `Payment for Milestone - Proposal ${proposal.proposal_id}`
            : `Payment for Proposal ${proposal.proposal_id}`,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.order.id;

      // Step 2: Open Razorpay payment gateway
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // Amount in paise
        currency: "INR",
        name: "HS Web Solutions",
        description: `Payment for Proposal ${proposal.proposal_id}`,
        order_id: orderId,
        prefill: {
          name: proposal.client_name,
          email: proposal.client_email,
          contact: proposal.client_phone,
        },
        handler: async (response) => {
          // Step 3: Verify payment on server
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                proposalId: proposal.proposal_id,
                milestoneId: milestoneId,
                amount: amount,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // Refresh proposal data
            await fetchProposal();
            alert("Payment successful! Thank you.");
            setPaymentProcessing(false);
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
            setPaymentProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
          },
        },
        theme: {
          color: "#4CAF50",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Razorpay failed to load");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message || "Payment failed. Please try again.");
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p>Loading proposal...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
          <h2>{error || "Proposal not found"}</h2>
          <p style={{ color: "var(--secondary-text)", marginTop: "1rem" }}>
            Please check the proposal ID and try again.
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: "2rem",
              padding: "0.8rem 2rem",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ← Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const milestones = Array.isArray(proposal.milestones)
    ? proposal.milestones
    : [];

  // Calculate total paid from actual payment records in database
  const payments = Array.isArray(proposal.payments) ? proposal.payments : [];
  const totalPaid = payments.reduce((sum, p) => {
    return p.status === "completed" ? sum + parseFloat(p.amount || 0) : sum;
  }, 0);

  // Calculate amounts based on milestone payment status
  const paidMilestonesTotalAmount = milestones.reduce((sum, m) => {
    return m.isPaid ? sum + parseFloat(m.amount || 0) : sum;
  }, 0);

  const dueMilestonesTotalAmount = milestones.reduce((sum, m) => {
    return !m.isPaid ? sum + parseFloat(m.amount || 0) : sum;
  }, 0);

  const paymentPercentage = Math.round(
    (paidMilestonesTotalAmount / proposal.total_amount) * 100
  );

  return (
    <div>
      <Navbar />
      <main className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            ← Back
          </button>
          <div className={styles.headerTitle}>
            <h1 className={styles.proposalTitle}>{proposal.proposal_id}</h1>
            <p className={styles.proposalSubtitle}>
              {proposal.client_name}'s Project
            </p>
          </div>
          <div className={styles.statusIndicator}>
            <span className={styles.statusIcon}>✓</span>
            {proposal.payment_status
              ? proposal.payment_status.toUpperCase().replace("_", " ")
              : "PENDING"}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {["details", "pdf", "payment", "notes"].map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${
                  activeTab === tab ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "details" && "📋 Details"}
                {tab === "pdf" && "📄 PDF"}
                {tab === "payment" && "💳 Payment"}
                {tab === "notes" && "📝 Notes"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className={styles.tabContent}>
            <div className={styles.detailsGrid}>
              {/* Client Info */}
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>👤 Client Information</h3>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Name</div>
                  <div className={styles.infoValue}>{proposal.client_name}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Email</div>
                  <a
                    href={`mailto:${proposal.client_email}`}
                    className={styles.infoLink}
                  >
                    {proposal.client_email}
                  </a>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Phone</div>
                  <a
                    href={`tel:${proposal.client_phone}`}
                    className={styles.infoLink}
                  >
                    {proposal.client_phone}
                  </a>
                </div>
              </div>

              {/* Company Info */}
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>🏢 Company Information</h3>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Company</div>
                  <div className={styles.infoValue}>
                    {proposal.company_name}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Email</div>
                  <a
                    href={`mailto:${proposal.company_email}`}
                    className={styles.infoLink}
                  >
                    {proposal.company_email}
                  </a>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Phone</div>
                  <a
                    href={`tel:${proposal.company_phone}`}
                    className={styles.infoLink}
                  >
                    {proposal.company_phone}
                  </a>
                </div>
                {proposal.old_website_url && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Old Website</div>
                    <a
                      href={proposal.old_website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoLink}
                    >
                      View Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className={styles.paymentBreakdown}>
              <div className={styles.totalAmount}>
                <span className={styles.amountLabel}>Total Project Amount</span>
                <span className={styles.amountValue}>
                  {formatCurrency(proposal.total_amount)}
                </span>
              </div>

              <div className={styles.paymentProgress}>
                <div className={styles.progressLabel}>
                  <span>Payment Progress</span>
                  <span>{paymentPercentage}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${paymentPercentage}%` }}
                  ></div>
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--secondary-text)",
                    marginTop: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    ✓ Paid:{" "}
                    <strong>{formatCurrency(paidMilestonesTotalAmount)}</strong>
                  </span>
                  <span>
                    ⏳ Due:{" "}
                    <strong>{formatCurrency(dueMilestonesTotalAmount)}</strong>
                  </span>
                </p>
              </div>

              <h3 className={styles.sectionTitle} style={{ marginTop: "2rem" }}>
                📊 Milestones
              </h3>
              <div className={styles.milestonesList}>
                {milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`${styles.milestoneCard} ${
                      milestone.isPaid ? styles.milestoneCardPaid : ""
                    }`}
                  >
                    <div className={styles.milestoneHeader}>
                      <div>
                        <div className={styles.milestoneName}>
                          {milestone.name}
                        </div>
                        {milestone.description && (
                          <p className={styles.milestoneDescription}>
                            {milestone.description}
                          </p>
                        )}
                        {milestone.dueDate && (
                          <p className={styles.milestoneDueDate}>
                            Due: {formatDate(milestone.dueDate)}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className={styles.milestoneAmount}>
                          {formatCurrency(milestone.amount)}
                        </div>
                        <div
                          className={`${styles.milestoneStatus} ${
                            milestone.isPaid ? "" : styles.milestonePending
                          }`}
                        >
                          {milestone.isPaid ? "✓ Paid" : "⏳ Pending"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Policies */}
            <div className={styles.infoSection} style={{ marginTop: "2rem" }}>
              <h3 className={styles.sectionTitle}>📋 Payment Policies</h3>
              <div
                className={styles.infoValue}
                style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
              >
                {proposal.payment_policies}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pdf" && (
          <div className={styles.tabContent}>
            <div className={styles.pdfContainer}>
              <div className={styles.pdfControls}>
                <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                  📄 Proposal Document
                </h3>
                <div className={styles.pdfButtonGroup}>
                  {proposal.pdf_google_drive_link && (
                    <a
                      href={proposal.pdf_google_drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.pdfButton}
                    >
                      📥 Download PDF
                    </a>
                  )}
                </div>
              </div>
              {proposal.pdf_google_drive_link ? (
                <iframe
                  src={`https://drive.google.com/file/d/${extractGoogleDriveFileId(
                    proposal.pdf_google_drive_link
                  )}/preview`}
                  className={styles.pdfViewer}
                  title="Proposal PDF"
                  allow="fullscreen"
                ></iframe>
              ) : (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--secondary-text)",
                  }}
                >
                  PDF not available
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "payment" && (
          <div className={styles.tabContent}>
            <div className={styles.paymentStatus}>
              <h3 className={styles.paymentStatusTitle}>💳 Payment Status</h3>
              <div className={styles.paymentStatusItem}>
                <span className={styles.statusLabel}>Overall Status</span>
                <span className={styles.statusAmount}>
                  {proposal.payment_status
                    ? proposal.payment_status.toUpperCase().replace("_", " ")
                    : "PENDING"}
                </span>
              </div>
              <div className={styles.paymentStatusItem}>
                <span className={styles.statusLabel}>Amount Paid</span>
                <span className={styles.statusAmount}>
                  {formatCurrency(paidMilestonesTotalAmount)}
                </span>
              </div>
              <div className={styles.paymentStatusItem}>
                <span className={styles.statusLabel}>Amount Due</span>
                <span className={styles.statusAmount}>
                  {formatCurrency(dueMilestonesTotalAmount)}
                </span>
              </div>
              <div className={styles.paymentStatusItem}>
                <span className={styles.statusLabel}>Total Project Value</span>
                <span className={styles.statusAmount}>
                  {formatCurrency(proposal.total_amount)}
                </span>
              </div>
            </div>

            {dueMilestonesTotalAmount > 0 && (
              <div className={styles.paymentMethods}>
                <div className={styles.paymentMethod}>
                  <div className={styles.paymentMethodIcon}>💳</div>
                  <div className={styles.paymentMethodName}>Razorpay</div>
                  <div className={styles.paymentMethodDesc}>
                    Secure online payment
                  </div>
                </div>
                <div className={styles.paymentMethod}>
                  <div className={styles.paymentMethodIcon}>🏦</div>
                  <div className={styles.paymentMethodName}>Bank Transfer</div>
                  <div className={styles.paymentMethodDesc}>
                    Direct bank payment
                  </div>
                </div>
              </div>
            )}

            <button
              className={styles.payButton}
              disabled={dueMilestonesTotalAmount <= 0 || paymentProcessing}
              onClick={() => handleRazorpayPayment(dueMilestonesTotalAmount)}
            >
              {paymentProcessing
                ? "Processing..."
                : dueMilestonesTotalAmount <= 0
                ? "✓ Fully Paid"
                : `Pay ₹${Math.round(dueMilestonesTotalAmount)}`}
            </button>

            <div className={styles.infoSection} style={{ marginTop: "2rem" }}>
              <h3 className={styles.sectionTitle}>📊 Milestone Payments</h3>
              <div className={styles.milestonesList}>
                {milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`${styles.milestoneCard} ${
                      milestone.isPaid ? styles.milestoneCardPaid : ""
                    }`}
                  >
                    <div className={styles.milestoneHeader}>
                      <div>
                        <div className={styles.milestoneName}>
                          {milestone.name}
                        </div>
                        {milestone.dueDate && (
                          <p className={styles.milestoneDueDate}>
                            Due: {formatDate(milestone.dueDate)}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className={styles.milestoneAmount}>
                          {formatCurrency(milestone.amount)}
                        </div>
                        {milestone.isPaid ? (
                          <>
                            <div className={styles.milestoneStatus}>✓ Paid</div>
                            <p
                              style={{
                                fontSize: "0.85rem",
                                color: "var(--secondary-text)",
                                marginTop: "0.3rem",
                              }}
                            >
                              {formatDate(milestone.paymentDate)}
                            </p>
                          </>
                        ) : (
                          <button
                            className={styles.milestoneStatus}
                            style={{
                              cursor:
                                paymentProcessing || milestone.isPaid
                                  ? "not-allowed"
                                  : "pointer",
                              padding: "0.5rem 1rem",
                              opacity:
                                paymentProcessing || milestone.isPaid ? 0.6 : 1,
                            }}
                            onClick={() =>
                              handleRazorpayPayment(
                                milestone.amount,
                                milestone.id
                              )
                            }
                            disabled={paymentProcessing || milestone.isPaid}
                          >
                            {paymentProcessing ? "Processing..." : "Pay Now"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment History */}
            {proposal.payments && proposal.payments.length > 0 && (
              <div className={styles.infoSection} style={{ marginTop: "2rem" }}>
                <h3 className={styles.sectionTitle}>📜 Payment History</h3>
                <div className={styles.paymentHistoryList}>
                  {proposal.payments.map((payment, idx) => (
                    <div key={idx} className={styles.paymentHistoryItem}>
                      <div className={styles.paymentHistoryLeft}>
                        <div className={styles.paymentType}>
                          {payment.payment_type === "milestone"
                            ? `Milestone Payment`
                            : "Full Payment"}
                        </div>
                        <div className={styles.paymentDate}>
                          {formatDate(payment.payment_date)}
                        </div>
                      </div>
                      <div className={styles.paymentHistoryRight}>
                        <div className={styles.paymentAmount}>
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className={styles.paymentMethod}>
                          {payment.payment_method === "razorpay"
                            ? "🔐 Razorpay"
                            : payment.payment_method}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(!proposal.payments || proposal.payments.length === 0) &&
              paidMilestonesTotalAmount === 0 && (
                <div
                  className={styles.infoSection}
                  style={{
                    marginTop: "2rem",
                    textAlign: "center",
                    color: "var(--secondary-text)",
                  }}
                >
                  <p>No payments recorded yet</p>
                </div>
              )}

            {/* Invoice Generation Section */}
            {paidMilestonesTotalAmount > 0 && (
              <div className={styles.invoiceSection}>
                <h3>📄 Generate Invoices</h3>
                <div className={styles.invoiceButtonsContainer}>
                  {/* Show milestone invoices for all paid milestones */}
                  {milestones
                    .filter((m) => m.isPaid)
                    .map((milestone, idx) => (
                      <button
                        key={idx}
                        className={styles.invoiceButton}
                        onClick={() =>
                          handleGenerateInvoice("milestone", milestone.id)
                        }
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? (
                          "Generating..."
                        ) : (
                          <>
                            📥 Invoice -{" "}
                            {milestone.title ||
                              milestone.name ||
                              `Milestone ${idx + 1}`}
                          </>
                        )}
                      </button>
                    ))}

                  {/* Full Payment Invoice - only if all milestones are paid */}
                  {paidMilestonesTotalAmount === proposal.total_amount && (
                    <button
                      className={styles.invoiceButton}
                      onClick={() => handleGenerateInvoice("full")}
                      disabled={paymentProcessing}
                      style={{ marginTop: "0.5rem" }}
                    >
                      {paymentProcessing
                        ? "Generating..."
                        : "📥 Full Project Invoice"}
                    </button>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    marginTop: "1rem",
                    opacity: 0.9,
                  }}
                >
                  💡 Click any button above to generate and download invoice
                  PDFs
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className={styles.tabContent}>
            <div className={styles.notesSection}>
              <h3 className={styles.sectionTitle}>📝 Additional Notes</h3>
              <div className={styles.notesContent}>
                {proposal.notes || "No additional notes"}
              </div>
            </div>
          </div>
        )}

        {/* Support Section */}
        <div className={styles.supportSection} style={{ marginTop: "4rem" }}>
          <h3 className={styles.supportTitle}>🤝 Need Help?</h3>
          <div className={styles.supportGrid}>
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>📧</div>
              <div className={styles.supportInfo}>
                <div className={styles.supportLabel}>Email Us</div>
                <a
                  href="mailto:contact@hswebsolutions.com"
                  className={styles.supportValue}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  contact@hswebsolutions.com
                </a>
              </div>
            </div>
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>📞</div>
              <div className={styles.supportInfo}>
                <div className={styles.supportLabel}>Call Us</div>
                <a
                  href="tel:+919942868093"
                  className={styles.supportValue}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  +91 9942 868093
                </a>
              </div>
            </div>
            <div className={styles.supportItem}>
              <div className={styles.supportIcon}>⏰</div>
              <div className={styles.supportInfo}>
                <div className={styles.supportLabel}>Hours</div>
                <div className={styles.supportValue}>Mon-Fri, 10am-6pm IST</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Invoice Modal */}
      {showInvoiceModal && currentInvoice && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowInvoiceModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px", maxHeight: "90vh", overflow: "auto" }}
          >
            <div className={styles.modalHeader}>
              <h2>📄 Invoice</h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className={styles.closeModalBtn}
              >
                ✕
              </button>
            </div>

            <div
              id="invoice-content"
              style={{
                padding: "2rem",
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
            >
              {!currentInvoice ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#999",
                  }}
                >
                  Loading invoice...
                </div>
              ) : (
                <>
                  {/* Logo and Company Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "2rem",
                      paddingBottom: "1rem",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: "#667eea",
                          backgroundColor: "#f0f0f0",
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                        }}
                      >
                        HS
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "#000000",
                            marginBottom: "0.25rem",
                          }}
                        >
                          HS Web Solutions
                        </div>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "0.85rem",
                            color: "#333333",
                          }}
                        >
                          Professional Web Solutions
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <h1
                        style={{
                          margin: "0 0 0.5rem 0",
                          color: "#000000",
                          fontSize: "2rem",
                          fontWeight: "700",
                        }}
                      >
                        INVOICE
                      </h1>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div
                    style={{
                      marginBottom: "2rem",
                      padding: "1rem",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <p
                      style={{
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                        color: "#000000",
                      }}
                    >
                      Invoice ID: <strong>{currentInvoice?.id || "N/A"}</strong>
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                        color: "#000000",
                      }}
                    >
                      Proposal ID:{" "}
                      <strong>
                        {currentInvoice?.proposal?.proposal_id || "N/A"}
                      </strong>
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                        color: "#000000",
                      }}
                    >
                      Generated: <strong>{formatDate(new Date())}</strong>
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                        color: "#000000",
                      }}
                    >
                      Type:{" "}
                      <strong>
                        {currentInvoice?.invoiceType === "milestone"
                          ? "Milestone Invoice"
                          : "Full Project Invoice"}
                      </strong>
                    </p>
                  </div>

                  {/* Bill To & From */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          marginBottom: "0.75rem",
                          textTransform: "uppercase",
                          color: "#000000",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Bill To
                      </h3>
                      <p
                        style={{
                          margin: "0.25rem 0",
                          fontSize: "1rem",
                          color: "#000000",
                          fontWeight: "600",
                        }}
                      >
                        {currentInvoice.proposal.client_name}
                      </p>
                      <p
                        style={{
                          margin: "0.25rem 0",
                          fontSize: "0.9rem",
                          color: "#333333",
                        }}
                      >
                        {currentInvoice.proposal.client_email}
                      </p>
                      {currentInvoice.proposal.company_name && (
                        <p
                          style={{
                            margin: "0.25rem 0",
                            fontSize: "0.9rem",
                            color: "#333333",
                          }}
                        >
                          {currentInvoice.proposal.company_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          marginBottom: "0.75rem",
                          textTransform: "uppercase",
                          color: "#000000",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Invoice Details
                      </h3>
                      <p
                        style={{
                          margin: "0.25rem 0",
                          fontSize: "0.9rem",
                          color: "#333333",
                        }}
                      >
                        Proposal ID:{" "}
                        <strong style={{ color: "#000000" }}>
                          {currentInvoice.proposal.proposal_id}
                        </strong>
                      </p>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                        Invoice Type:{" "}
                        <strong>
                          {currentInvoice.invoiceType === "milestone"
                            ? "Milestone"
                            : "Full Project"}
                        </strong>
                      </p>
                      {currentInvoice.payment?.razorpay_payment_id && (
                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                          Payment ID:{" "}
                          <strong>
                            {currentInvoice.payment.razorpay_payment_id}
                          </strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Milestones Table */}
                  <div style={{ marginBottom: "2rem" }}>
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        marginBottom: "1rem",
                        textTransform: "uppercase",
                        color: "#000000",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Project Milestones
                    </h3>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#f5f5f5",
                            borderBottom: "2px solid #ddd",
                          }}
                        >
                          <th
                            style={{
                              padding: "0.75rem",
                              textAlign: "left",
                              fontWeight: "700",
                              color: "#000000",
                            }}
                          >
                            Description
                          </th>
                          <th
                            style={{
                              padding: "0.75rem",
                              textAlign: "right",
                              fontWeight: "700",
                              color: "#000000",
                            }}
                          >
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.milestones &&
                          currentInvoice.milestones.map((milestone, idx) => (
                            <tr
                              key={idx}
                              style={{ borderBottom: "1px solid #eee" }}
                            >
                              <td style={{ padding: "0.75rem" }}>
                                <div
                                  style={{
                                    fontWeight: "600",
                                    color: "#000000",
                                  }}
                                >
                                  {milestone.title ||
                                    milestone.name ||
                                    `Milestone ${idx + 1}`}
                                </div>
                                {milestone.description && (
                                  <div
                                    style={{
                                      fontSize: "0.85rem",
                                      color: "#333333",
                                      marginTop: "0.25rem",
                                    }}
                                  >
                                    {milestone.description}
                                  </div>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "0.75rem",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: "#000000",
                                }}
                              >
                                {formatCurrency(milestone.amount)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Summary */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "1rem",
                      marginBottom: "2rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: "#e3f2fd",
                        borderRadius: "8px",
                        border: "1px solid #bbdefb",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          fontSize: "0.85rem",
                          color: "#000000",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        Amount Paid
                      </p>
                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#1976d2",
                        }}
                      >
                        {formatCurrency(currentInvoice.financial.amount_paid)}
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: "#fff3e0",
                        borderRadius: "8px",
                        border: "1px solid #ffe0b2",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          fontSize: "0.85rem",
                          color: "#000000",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        Amount Due
                      </p>
                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#f57c00",
                        }}
                      >
                        {formatCurrency(currentInvoice.financial.amount_due)}
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: "#f3e5f5",
                        borderRadius: "8px",
                        border: "1px solid #e1bee7",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          fontSize: "0.85rem",
                          color: "#000000",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        Total Value
                      </p>
                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#7b1fa2",
                        }}
                      >
                        {formatCurrency(currentInvoice.financial.total_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  {currentInvoice.payment && (
                    <div
                      style={{
                        marginBottom: "2rem",
                        padding: "1rem",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <h3
                        style={{
                          margin: "0 0 0.5rem 0",
                          fontSize: "0.9rem",
                          fontWeight: "700",
                          color: "#000000",
                          textTransform: "uppercase",
                        }}
                      >
                        Payment Status
                      </h3>
                      <p
                        style={{
                          margin: "0.25rem 0",
                          fontSize: "0.9rem",
                          color: "#000000",
                        }}
                      >
                        Status:{" "}
                        <strong>
                          {currentInvoice.payment?.status?.toUpperCase() ||
                            "COMPLETED"}
                        </strong>
                      </p>
                      <p
                        style={{
                          margin: "0.25rem 0",
                          fontSize: "0.9rem",
                          color: "#000000",
                        }}
                      >
                        Payment Method:{" "}
                        <strong>
                          {currentInvoice.payment?.payment_method || "Online"}
                        </strong>
                      </p>
                      <p
                        style={{
                          margin: "0.25rem 0",
                          fontSize: "0.9rem",
                          color: "#000000",
                        }}
                      >
                        Payment Date:{" "}
                        <strong>
                          {formatDate(currentInvoice.payment?.payment_date)}
                        </strong>
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div
                    style={{
                      marginTop: "3rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #ddd",
                      textAlign: "center",
                      color: "#000000",
                      fontSize: "0.85rem",
                    }}
                  >
                    <p style={{ margin: "0.5rem 0", color: "#000000", fontWeight: "500" }}>
                      Thank you for your business!
                    </p>
                    <p style={{ margin: "0.5rem 0", color: "#333333" }}>
                      For any questions, contact us at contact@hswebsolutions.com
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <button
                onClick={downloadInvoicePDF}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginRight: "1rem",
                }}
              >
                📥 Download as PDF
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

// Helper function to extract Google Drive file ID
function extractGoogleDriveFileId(url) {
  if (!url) return "";
  const match = url.match(/\/d\/(.*?)(\/|$)/);
  return match ? match[1] : "";
}
