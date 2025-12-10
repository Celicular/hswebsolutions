"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProposalForm.module.css";

export default function ProposalsListView() {
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [invoices, setInvoices] = useState([]);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [selectedProposalForInvoices, setSelectedProposalForInvoices] =
    useState(null);

  useEffect(() => {
    fetchProposals();
  }, [page, searchTerm, statusFilter, sortBy]);

  const fetchInvoices = async (proposalId) => {
    try {
      const response = await fetch(`/api/admin/invoices/${proposalId}`);
      const data = await response.json();

      if (response.ok) {
        setInvoices(data.data || []);
        setShowInvoicesModal(true);
      } else {
        alert("Failed to fetch invoices");
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      alert("Failed to load invoices");
    }
  };

  const handleViewInvoices = (proposal) => {
    setSelectedProposalForInvoices(proposal);
    fetchInvoices(proposal.proposal_id);
  };

  const fetchProposals = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        status: statusFilter !== "all" ? statusFilter : "",
        search: searchTerm,
        sort: sortBy,
      });

      const response = await fetch(`/api/admin/proposals?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch proposals");
      }

      setProposals(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setError(err.message || "Failed to load proposals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this proposal?")) return;

    try {
      const response = await fetch(`/api/admin/proposals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete proposal");
      }

      setProposals((prev) => prev.filter((p) => p.proposal_id !== id));
    } catch (err) {
      console.error("Error deleting proposal:", err);
      setError(err.message || "Failed to delete proposal");
    }
  };

  const handleSendProposal = async (id) => {
    try {
      const response = await fetch(`/api/admin/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sent" }),
      });

      if (!response.ok) {
        throw new Error("Failed to send proposal");
      }

      setProposals((prev) =>
        prev.map((p) =>
          p.proposal_id === id
            ? { ...p, status: "sent", sent_at: new Date().toISOString() }
            : p
        )
      );
    } catch (err) {
      console.error("Error sending proposal:", err);
      setError(err.message || "Failed to send proposal");
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      draft: styles.statusDraft,
      sent: styles.statusSent,
      viewed: styles.statusViewed,
      accepted: styles.statusAccepted,
      rejected: styles.statusRejected,
      paid: styles.statusPaid,
    };
    return statusMap[status] || styles.statusDraft;
  };

  const getStatusDisplay = (status) => {
    const displayMap = {
      draft: "📝 Draft",
      sent: "📧 Sent",
      viewed: "👁️ Viewed",
      accepted: "✓ Accepted",
      rejected: "✕ Rejected",
      paid: "💰 Paid",
    };
    return displayMap[status] || status;
  };

  return (
    <div className={styles.listViewContainer}>
      <div className={styles.listViewHeader}>
        <div>
          <h1>Proposals</h1>
          <p>Manage and track all client proposals</p>
        </div>
        <button
          onClick={() => router.push("/admin?tab=create-proposal")}
          className={styles.btnPrimary}
        >
          + Create New Proposal
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={() => setError("")} className={styles.closeBtn}>
            ✕
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name, email, or proposal ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="created">Newest First</option>
            <option value="amount">Amount</option>
            <option value="name">Client Name</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading proposals...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && proposals.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>No proposals found</h3>
          <p>
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first proposal to get started"}
          </p>
          <button
            onClick={() => router.push("/admin?tab=create-proposal")}
            className={styles.btnPrimary}
          >
            + Create New Proposal
          </button>
        </div>
      )}

      {/* Proposals Table */}
      {!isLoading && proposals.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.proposalsTable}>
              <thead>
                <tr>
                  <th>Proposal ID</th>
                  <th>Client Name</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.proposal_id} className={styles.tableRow}>
                    <td className={styles.proposalId}>
                      <code>{proposal.proposal_id || "N/A"}</code>
                    </td>
                    <td>
                      <div className={styles.clientInfo}>
                        <div className={styles.clientName}>
                          {proposal.client_name}
                        </div>
                        <div className={styles.clientEmail}>
                          {proposal.client_email}
                        </div>
                      </div>
                    </td>
                    <td className={styles.projectTitle}>
                      {proposal.project_title || "N/A"}
                    </td>
                    <td className={styles.amount}>
                      ₹{parseFloat(proposal.total_amount || 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                          proposal.status
                        )}`}
                      >
                        {getStatusDisplay(proposal.status)}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {new Date(proposal.created_at).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>
                    <td className={styles.actions}>
                      <button
                        onClick={() =>
                          router.push(`/proposals/${proposal.proposal_id}`)
                        }
                        className={styles.btnAction}
                        title="View Proposal"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/proposals/${proposal.proposal_id}/edit`
                          )
                        }
                        className={styles.btnAction}
                        title="Edit Proposal"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleViewInvoices(proposal)}
                        className={styles.btnAction}
                        title="View Invoices"
                      >
                        📄 Invoices
                      </button>
                      {proposal.status === "draft" && (
                        <button
                          onClick={() =>
                            handleSendProposal(proposal.proposal_id)
                          }
                          className={`${styles.btnAction} ${styles.btnSend}`}
                          title="Send to Client"
                        >
                          📧 Send
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(proposal.proposal_id)}
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                        title="Delete Proposal"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.paginationBtn}
              >
                ← Previous
              </button>

              <div className={styles.pageInfo}>
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={styles.paginationBtn}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Invoice Modal */}
      {showInvoicesModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowInvoicesModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>📄 Invoice History</h2>
              <button
                onClick={() => setShowInvoicesModal(false)}
                className={styles.closeModalBtn}
              >
                ✕
              </button>
            </div>

            {selectedProposalForInvoices && (
              <div className={styles.invoiceProposalInfo}>
                <div>
                  <strong>Proposal ID:</strong>{" "}
                  {selectedProposalForInvoices.proposal_id}
                </div>
                <div>
                  <strong>Client:</strong>{" "}
                  {selectedProposalForInvoices.client_name}
                </div>
                <div>
                  <strong>Amount:</strong> ₹
                  {parseFloat(
                    selectedProposalForInvoices.total_amount || 0
                  ).toFixed(2)}
                </div>
              </div>
            )}

            <div className={styles.invoicesList}>
              {invoices.length === 0 ? (
                <div className={styles.emptyInvoices}>
                  <p>No invoices generated yet</p>
                </div>
              ) : (
                <table className={styles.invoicesTable}>
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Generated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className={styles.invoiceRow}>
                        <td className={styles.invoiceId}>
                          <code>{invoice.razorpay_invoice_id || "N/A"}</code>
                        </td>
                        <td className={styles.invoiceType}>
                          {invoice.invoice_type === "milestone"
                            ? "🎯 Milestone"
                            : "💳 Full Payment"}
                        </td>
                        <td className={styles.invoiceAmount}>
                          ₹{parseFloat(invoice.amount || 0).toFixed(2)}
                        </td>
                        <td className={styles.invoiceStatus}>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[`status${invoice.status}`]
                            }`}
                          >
                            {invoice.status || "draft"}
                          </span>
                        </td>
                        <td className={styles.invoiceDate}>
                          {new Date(invoice.generated_at).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>
                        <td className={styles.invoiceAction}>
                          {invoice.short_url ? (
                            <a
                              href={invoice.short_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.downloadLink}
                            >
                              ⬇️ Download PDF
                            </a>
                          ) : (
                            <span className={styles.noLink}>No URL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowInvoicesModal(false)}
                className={styles.btnPrimary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
