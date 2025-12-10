"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./admin.module.css";
import CreateProposalForm from "./components/proposals/CreateProposalForm";
import ProposalsListView from "./components/proposals/ProposalsListView";
import QueryRunner from "./components/QueryRunner";

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "users"
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ userid: "", password: "" });

  // New state for estimate submissions
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [submissionsError, setSubmissionsError] = useState("");
  const [submissionFilters, setSubmissionFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    searchTerm: "",
  });
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
  const [submissionPage, setSubmissionPage] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const submissionsPerPage = 10;

  // Add a fallback state to handle when the database isn't properly set up
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    // Check if user is logged in, if not redirect to login page
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }

    // Fetch users data
    fetchUsers();

    // Fetch submissions data
    fetchSubmissions();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setSubmissionsLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.append("page", submissionPage);
      queryParams.append("limit", submissionsPerPage);

      if (submissionFilters.startDate) {
        queryParams.append("startDate", submissionFilters.startDate);
      }

      if (submissionFilters.endDate) {
        queryParams.append("endDate", submissionFilters.endDate);
      }

      if (submissionFilters.status) {
        queryParams.append("status", submissionFilters.status);
      }

      if (submissionFilters.searchTerm) {
        queryParams.append("search", submissionFilters.searchTerm);
      }

      const response = await fetch(
        `/api/admin/estimate-submissions?${queryParams.toString()}`
      );
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.data || []);
        setTotalSubmissions(data.pagination?.total || 0);
        setDbConfigured(true);
      } else {
        if (
          data.message?.includes("Database table not found") ||
          data.error?.sqlMessage?.includes("doesn't exist")
        ) {
          setDbConfigured(false);
        }
        setSubmissionsError(data.message || "Failed to fetch submissions");
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setSubmissionsError(
        "An error occurred while fetching submissions. Check console for details."
      );
      setDbConfigured(false);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const viewSubmissionDetails = async (id) => {
    try {
      setSubmissionsLoading(true);
      const response = await fetch(`/api/admin/estimate-submissions/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCurrentSubmission(data.data);
        setShowSubmissionDetails(true);
      } else {
        setSubmissionsError(
          data.message || "Failed to fetch submission details"
        );
      }
    } catch (err) {
      setSubmissionsError(
        "An error occurred while fetching submission details"
      );
      console.error(err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const updateSubmissionStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/estimate-submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        if (currentSubmission && currentSubmission.submission_id === id) {
          setCurrentSubmission({
            ...currentSubmission,
            status: status,
          });
        }

        // Refresh submissions list
        fetchSubmissions();
      } else {
        setSubmissionsError(
          data.message || "Failed to update submission status"
        );
      }
    } catch (err) {
      setSubmissionsError("An error occurred");
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSubmissionFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setSubmissionPage(1); // Reset to first page when filtering
    fetchSubmissions();
  };

  const resetFilters = () => {
    setSubmissionFilters({
      startDate: "",
      endDate: "",
      status: "",
      searchTerm: "",
    });
    setSubmissionPage(1);
    fetchSubmissions();
  };

  const handlePageChange = (newPage) => {
    setSubmissionPage(newPage);
    fetchSubmissions();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ userid: "", password: "" });
        fetchUsers();
      } else {
        setError(data.message || "Failed to create user");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setEditingUser(null);
        setFormData({ userid: "", password: "" });
        fetchUsers();
      } else {
        setError(data.message || "Failed to update user");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        fetchUsers();
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setFormData({ userid: user.userid, password: "" });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setFormData({ userid: "", password: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "users" ? styles.tabActive : ""
          }`}
          onClick={() => handleTabChange("users")}
        >
          👥 Users
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "proposals" ? styles.tabActive : ""
          }`}
          onClick={() => handleTabChange("proposals")}
        >
          📋 Proposals
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "create-proposal" ? styles.tabActive : ""
          }`}
          onClick={() => handleTabChange("create-proposal")}
        >
          ➕ Create Proposal
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "submissions" ? styles.tabActive : ""
          }`}
          onClick={() => handleTabChange("submissions")}
        >
          📝 Estimate Submissions
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "query-runner" ? styles.tabActive : ""
          }`}
          onClick={() => handleTabChange("query-runner")}
        >
          🔧 Query Runner
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && (
        <div className={styles.section}>
          <h2>Manage Users</h2>

          <form
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            className={styles.form}
          >
            <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
            <div className={styles.formFields}>
              <div className={styles.formGroup}>
                <label htmlFor="userid">Username</label>
                <input
                  type="text"
                  id="userid"
                  name="userid"
                  value={formData.userid}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">
                  Password {editingUser && "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.button}>
                {editingUser ? "Update User" : "Add User"}
              </button>

              {editingUser && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className={styles.tableContainer}>
            <h3>Users List</h3>
            {loading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.userid}</td>
                      <td className={styles.actions}>
                        <button
                          onClick={() => startEditing(user)}
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Proposals List View Tab */}
      {activeTab === "proposals" && <ProposalsListView />}

      {/* Create Proposal Tab */}
      {activeTab === "create-proposal" && (
        <CreateProposalForm
          onSuccess={(proposalId) => {
            handleTabChange("proposals");
          }}
        />
      )}

      {/* Estimate Submissions Tab */}
      {activeTab === "submissions" && (
        <div className={styles.section}>
          <h2>Estimate Submissions</h2>

          {!dbConfigured ? (
            <div className={styles.setupMessage}>
              <h3>Database Setup Required</h3>
              <p>
                The estimate submissions database tables don't appear to be set
                up correctly.
              </p>
              <p>
                Please run the database setup script to create the necessary
                tables:
              </p>
              <pre className={styles.codeBlock}>
                mysql -u root -p -e "source app/lib/db-schema.sql"
              </pre>
              <p>Then run the admin views script:</p>
              <pre className={styles.codeBlock}>
                mysql -u root -p -e "source app/lib/admin-view.sql"
              </pre>
              <button className={styles.button} onClick={fetchSubmissions}>
                Retry
              </button>
            </div>
          ) : (
            <>
              {submissionsError && (
                <div className={styles.error}>{submissionsError}</div>
              )}

              <form onSubmit={applyFilters} className={styles.form}>
                <h3>Filter Submissions</h3>
                <div className={styles.formFields}>
                  <div className={styles.formGroup}>
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={submissionFilters.startDate}
                      onChange={handleFilterChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={submissionFilters.endDate}
                      onChange={handleFilterChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={submissionFilters.status}
                      onChange={handleFilterChange}
                      className={styles.input}
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_review">In Review</option>
                      <option value="quoted">Quoted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="searchTerm">
                      Search (Name, Email, Business)
                    </label>
                    <input
                      type="text"
                      id="searchTerm"
                      name="searchTerm"
                      value={submissionFilters.searchTerm}
                      onChange={handleFilterChange}
                      placeholder="Search submissions..."
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.button}>
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className={`${styles.button} ${styles.cancelButton}`}
                  >
                    Reset Filters
                  </button>
                </div>
              </form>

              <div className={styles.tableContainer}>
                <h3>Submissions ({totalSubmissions} total)</h3>

                {submissionsLoading && submissions.length === 0 ? (
                  <p className={styles.loadingText}>Loading submissions...</p>
                ) : submissions.length === 0 ? (
                  <p className={styles.emptyText}>No submissions found</p>
                ) : (
                  <>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Business</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((submission) => (
                          <tr key={submission.id}>
                            <td>{submission.name}</td>
                            <td>{submission.business_name || "N/A"}</td>
                            <td>{submission.email}</td>
                            <td>{submission.phone}</td>
                            <td>{formatDate(submission.submitted_at)}</td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  styles[submission.status]
                                }`}
                              >
                                {submission.status.replace("_", " ")}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actions}>
                                <button
                                  className={`${styles.actionButton} ${styles.viewButton}`}
                                  onClick={() =>
                                    viewSubmissionDetails(submission.id)
                                  }
                                >
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className={styles.pagination}>
                      <button
                        onClick={() => handlePageChange(submissionPage - 1)}
                        disabled={submissionPage === 1}
                        className={styles.paginationButton}
                      >
                        Previous
                      </button>

                      <span className={styles.pageInfo}>
                        Page {submissionPage} of{" "}
                        {Math.ceil(totalSubmissions / submissionsPerPage)}
                      </span>

                      <button
                        onClick={() => handlePageChange(submissionPage + 1)}
                        disabled={
                          submissionPage >=
                          Math.ceil(totalSubmissions / submissionsPerPage)
                        }
                        className={styles.paginationButton}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {showSubmissionDetails && currentSubmission && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Submission Details</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowSubmissionDetails(false)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.detailSection}>
                <h3 className={styles.detailTitle}>Status</h3>
                <div className={styles.statusActions}>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[currentSubmission.status]
                    }`}
                  >
                    {currentSubmission.status.replace("_", " ")}
                  </span>

                  <div className={styles.statusControls}>
                    <label htmlFor="changeStatus">Change Status:</label>
                    <select
                      id="changeStatus"
                      onChange={(e) =>
                        updateSubmissionStatus(
                          currentSubmission.submission_id,
                          e.target.value
                        )
                      }
                      value={currentSubmission.status}
                      className={styles.statusSelect}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_review">In Review</option>
                      <option value="quoted">Quoted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.detailTitle}>Basic Information</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Name:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.name}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Business:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.business_name || "N/A"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.email}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.phone}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Old Website:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.old_website ? (
                        <a
                          href={currentSubmission.old_website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {currentSubmission.old_website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date Submitted:</span>
                    <span className={styles.detailValue}>
                      {formatDate(currentSubmission.submitted_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.detailTitle}>Website Needs</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Website Type:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.website_design_approach
                        .charAt(0)
                        .toUpperCase() +
                        currentSubmission.website_design_approach.slice(1)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Page Count:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.page_count}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Mobile First:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.mobile_first ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      Convert Old Website:
                    </span>
                    <span className={styles.detailValue}>
                      {currentSubmission.convert_old_website ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className={styles.fullWidthDetail}>
                  <span className={styles.detailLabel}>Description:</span>
                  <p className={styles.detailValue}>
                    {currentSubmission.website_description}
                  </p>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.detailTitle}>Technical Details</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      Frontend Technologies:
                    </span>
                    <span className={styles.detailValue}>
                      {currentSubmission.frontend_technologies &&
                      currentSubmission.frontend_technologies.length > 0
                        ? currentSubmission.frontend_technologies.join(", ")
                        : "N/A"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Backend:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.backend}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Database:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.database_type}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Integrations:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.integrations &&
                      currentSubmission.integrations.length > 0
                        ? currentSubmission.integrations.join(", ")
                        : "None"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.detailTitle}>Budget & Timeline</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Budget:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.budget}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Timeline:</span>
                    <span className={styles.detailValue}>
                      {currentSubmission.timeline}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      Delivery Timeframe:
                    </span>
                    <span className={styles.detailValue}>
                      {currentSubmission.delivery_timeframe}
                    </span>
                  </div>
                </div>

                {currentSubmission.additional_info && (
                  <div className={styles.fullWidthDetail}>
                    <span className={styles.detailLabel}>
                      Additional Information:
                    </span>
                    <p className={styles.detailValue}>
                      {currentSubmission.additional_info}
                    </p>
                  </div>
                )}
              </div>

              {currentSubmission.payment_gateway_enabled && (
                <div className={styles.detailSection}>
                  <h3 className={styles.detailTitle}>Payment Gateway</h3>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Enabled:</span>
                      <span className={styles.detailValue}>Yes</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Gateway:</span>
                      <span className={styles.detailValue}>
                        {currentSubmission.payment_gateway_type ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {currentSubmission.google_ads_enabled && (
                <div className={styles.detailSection}>
                  <h3 className={styles.detailTitle}>Google Ads</h3>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Budget:</span>
                      <span className={styles.detailValue}>
                        {currentSubmission.google_ads_budget || "Not specified"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Campaign Type:</span>
                      <span className={styles.detailValue}>
                        {currentSubmission.google_ads_campaign_type ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Location:</span>
                      <span className={styles.detailValue}>
                        {currentSubmission.google_ads_location ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        Has Existing Account:
                      </span>
                      <span className={styles.detailValue}>
                        {currentSubmission.google_ads_has_account
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        Needs Management:
                      </span>
                      <span className={styles.detailValue}>
                        {currentSubmission.google_ads_need_management
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>

                  {currentSubmission.google_ads_keywords && (
                    <div className={styles.fullWidthDetail}>
                      <span className={styles.detailLabel}>Keywords:</span>
                      <p className={styles.detailValue}>
                        {currentSubmission.google_ads_keywords}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.button}
                onClick={() => setShowSubmissionDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Query Runner Tab */}
      {activeTab === "query-runner" && <QueryRunner />}
    </div>
  );
}
