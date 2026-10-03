import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  CheckCircle,
  Clock,
  Sparkles,
  Flame,
  Zap,
  Plus,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ProblemCard from '../components/ProblemCard';
import { getProblems, updateProblemStatus, deleteProblem } from '../services/problemService';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch all problems to compute accurate live metrics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProblems();
      if (res.success) {
        setProblems(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(
        'Failed to connect to backend server. Make sure MongoDB and Node server are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick status toggle directly from dashboard
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Solved' ? 'Unsolved' : 'Solved';
    try {
      const res = await updateProblemStatus(id, newStatus);
      if (res.success) {
        setProblems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        showNotification(`Problem marked as ${newStatus}!`);
      }
    } catch (err) {
      showNotification('Failed to update status', true);
    }
  };

  // Delete problem handler with confirmation
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await deleteProblem(id);
        if (res.success) {
          setProblems((prev) => prev.filter((p) => p._id !== id));
          showNotification(`"${title}" deleted successfully.`);
        }
      } catch (err) {
        showNotification('Failed to delete problem', true);
      }
    }
  };

  const showNotification = (msg, isErr = false) => {
    setNotification({ message: msg, isError: isErr });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Compute live statistics from problems list
  const total = problems.length;
  const solved = problems.filter((p) => p.status === 'Solved').length;
  const unsolved = total - solved;
  const easy = problems.filter((p) => p.difficulty === 'Easy').length;
  const medium = problems.filter((p) => p.difficulty === 'Medium').length;
  const hard = problems.filter((p) => p.difficulty === 'Hard').length;
  const progressPercentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  // Recent 5 problems
  const recentProblems = problems.slice(0, 5);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your coding dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Title & Action */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="page-title">
            <Sparkles size={26} color="var(--accent-primary)" />
            <span>Dashboard</span>
          </h1>
          <p className="page-subtitle">Track your problem solving progress & stats</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchDashboardData}
            title="Refresh Data"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <Link to="/add" className="btn btn-primary">
            <Plus size={16} />
            <span>Add Problem</span>
          </Link>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {notification && (
        <div
          className={`alert ${
            notification.isError ? 'alert-error' : 'alert-success'
          }`}
        >
          {notification.isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="stats-grid">
        <StatsCard
          label="Total Problems"
          value={total}
          icon={Code}
          color="#6366f1"
          bgColor="rgba(99, 102, 241, 0.15)"
        />
        <StatsCard
          label="Solved"
          value={solved}
          icon={CheckCircle}
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.15)"
        />
        <StatsCard
          label="Unsolved"
          value={unsolved}
          icon={Clock}
          color="#94a3b8"
          bgColor="rgba(148, 163, 184, 0.15)"
        />
        <StatsCard
          label="Easy"
          value={easy}
          icon={Zap}
          color="#34d399"
          bgColor="rgba(16, 185, 129, 0.15)"
        />
        <StatsCard
          label="Medium"
          value={medium}
          icon={Flame}
          color="#fbbf24"
          bgColor="rgba(245, 158, 11, 0.15)"
        />
        <StatsCard
          label="Hard"
          value={hard}
          icon={Flame}
          color="#f87171"
          bgColor="rgba(239, 68, 68, 0.15)"
        />
      </div>

      {/* Overall Solving Progress */}
      <div className="progress-card">
        <div className="progress-header">
          <div>
            <h3 className="progress-title">Overall Solving Progress</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {solved} of {total} problems completed
            </p>
          </div>
          <span className="progress-pct">{progressPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Difficulty Breakdown Sub-grid */}
        <div className="difficulty-breakdown">
          <div className="diff-item">
            <div className="diff-item-label" style={{ color: 'var(--diff-easy-text)' }}>
              Easy
            </div>
            <div className="diff-item-val" style={{ color: 'var(--diff-easy-text)' }}>
              {easy}
            </div>
          </div>
          <div className="diff-item">
            <div className="diff-item-label" style={{ color: 'var(--diff-medium-text)' }}>
              Medium
            </div>
            <div className="diff-item-val" style={{ color: 'var(--diff-medium-text)' }}>
              {medium}
            </div>
          </div>
          <div className="diff-item">
            <div className="diff-item-label" style={{ color: 'var(--diff-hard-text)' }}>
              Hard
            </div>
            <div className="diff-item-val" style={{ color: 'var(--diff-hard-text)' }}>
              {hard}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Problems Section */}
      <div style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Problems</h2>
          {problems.length > 0 && (
            <Link
              to="/problems"
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recentProblems.length === 0 ? (
          <div className="empty-state">
            <Code className="empty-state-icon" size={40} />
            <h3 className="empty-state-title">No problems logged yet</h3>
            <p className="empty-state-text">
              Start by adding your first coding practice problem from LeetCode, HackerRank, or any platform!
            </p>
            <Link to="/add" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} />
              <span>Add Your First Problem</span>
            </Link>
          </div>
        ) : (
          <div className="problems-list">
            {recentProblems.map((problem) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
