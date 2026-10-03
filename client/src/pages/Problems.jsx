import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ListFilter, Plus, SearchX, AlertCircle, CheckCircle } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import SearchBar from '../components/SearchBar';
import { getProblems, updateProblemStatus, deleteProblem } from '../services/problemService';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const fetchProblemsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProblems();
      if (res.success) {
        setProblems(res.data);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Could not load problems from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemsList();
  }, []);

  // Dynamically extract unique topic names from loaded problems for filter dropdown
  const topicsList = useMemo(() => {
    const topicsSet = new Set();
    problems.forEach((p) => {
      if (p.topic) topicsSet.add(p.topic);
    });
    return Array.from(topicsSet).sort();
  }, [problems]);

  // Combined client-side search and multi-criteria filtering
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // Search match across title, topic, platform, and notes
      const matchesSearch =
        !searchTerm.trim() ||
        problem.title?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        problem.topic?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        problem.platform?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        problem.notes?.toLowerCase().includes(searchTerm.toLowerCase().trim());

      // Filter matches
      const matchesDifficulty =
        selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;

      const matchesPlatform =
        selectedPlatform === 'All' || problem.platform === selectedPlatform;

      const matchesStatus =
        selectedStatus === 'All' || problem.status === selectedStatus;

      const matchesTopic =
        selectedTopic === 'All' || problem.topic === selectedTopic;

      return matchesSearch && matchesDifficulty && matchesPlatform && matchesStatus && matchesTopic;
    });
  }, [problems, searchTerm, selectedDifficulty, selectedPlatform, selectedStatus, selectedTopic]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('All');
    setSelectedPlatform('All');
    setSelectedStatus('All');
    setSelectedTopic('All');
  };

  // Toggle problem status
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Solved' ? 'Unsolved' : 'Solved';
    try {
      const res = await updateProblemStatus(id, newStatus);
      if (res.success) {
        setProblems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        showNotification(`Problem marked as ${newStatus}`);
      }
    } catch (err) {
      showNotification('Failed to update status', true);
    }
  };

  // Delete problem with confirmation
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

  return (
    <div>
      {/* Header */}
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
            <ListFilter size={26} color="var(--accent-primary)" />
            <span>Problem Archive</span>
          </h1>
          <p className="page-subtitle">
            Showing {filteredProblems.length} of {problems.length} total problems
          </p>
        </div>

        <Link to="/add" className="btn btn-primary">
          <Plus size={16} />
          <span>Add Problem</span>
        </Link>
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

      {/* Search and Filters Bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        topicsList={topicsList}
        onReset={handleResetFilters}
      />

      {/* Problems List or Loading/Empty State */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading problems...</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="empty-state">
          <SearchX className="empty-state-icon" size={44} />
          <h3 className="empty-state-title">No problems found</h3>
          <p className="empty-state-text">
            {problems.length === 0
              ? "You haven't added any coding problems yet."
              : 'No problems match your current search and filter combination.'}
          </p>
          {problems.length > 0 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetFilters}
              style={{ marginTop: '0.5rem' }}
            >
              Clear All Filters
            </button>
          ) : (
            <Link to="/add" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} />
              <span>Add First Problem</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="problems-list">
          {filteredProblems.map((problem) => (
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
  );
};

export default Problems;
