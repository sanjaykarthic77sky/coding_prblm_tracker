import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  Globe,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { getProblemById, updateProblemStatus, deleteProblem } from '../services/problemService';

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProblemById(id);
        if (res.success) {
          setProblem(res.data);
        }
      } catch (err) {
        console.error('Error fetching problem details:', err);
        setError('Problem not found or failed to load from backend.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!problem) return;
    const newStatus = problem.status === 'Solved' ? 'Unsolved' : 'Solved';
    try {
      const res = await updateProblemStatus(problem._id, newStatus);
      if (res.success) {
        setProblem((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!problem) return;
    if (window.confirm(`Are you sure you want to delete "${problem.title}"?`)) {
      try {
        const res = await deleteProblem(problem._id);
        if (res.success) {
          navigate('/problems');
        }
      } catch (err) {
        alert('Failed to delete problem.');
      }
    }
  };

  const getDifficultyBadgeClass = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'badge-easy';
      case 'medium':
        return 'badge-medium';
      case 'hard':
        return 'badge-hard';
      default:
        return 'badge-easy';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading problem details...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="empty-state" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <AlertCircle className="empty-state-icon" size={44} />
        <h3 className="empty-state-title">Problem Not Found</h3>
        <p className="empty-state-text">{error || 'The requested problem could not be found.'}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/problems')}>
          <ArrowLeft size={16} />
          <span>Back to Problems</span>
        </button>
      </div>
    );
  }

  const isSolved = problem.status === 'Solved';

  const formattedCreated = problem.createdAt
    ? new Date(problem.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Back Link */}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={15} />
        <span>Back</span>
      </button>

      {/* Details Card */}
      <div className="details-card">
        {/* Header */}
        <div className="details-header">
          <div>
            <h1 className="details-title">{problem.title}</h1>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-platform">{problem.platform}</span>
              <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="badge badge-topic">{problem.topic}</span>
              <span className={`badge ${isSolved ? 'badge-solved' : 'badge-unsolved'}`}>
                {problem.status}
              </span>
            </div>
          </div>

          {/* Status quick toggle */}
          <button
            type="button"
            className={`btn btn-sm ${isSolved ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleToggleStatus}
            title="Toggle Solved Status"
          >
            {isSolved ? (
              <>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Solved</span>
              </>
            ) : (
              <>
                <Circle size={16} />
                <span>Mark as Solved</span>
              </>
            )}
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="details-grid">
          <div className="details-field">
            <span className="details-field-label">
              <Globe size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Platform
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{problem.platform}</span>
          </div>

          <div className="details-field">
            <span className="details-field-label">
              <Layers size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Topic
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{problem.topic}</span>
          </div>

          <div className="details-field">
            <span className="details-field-label">
              <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Date Added
            </span>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{formattedCreated}</span>
          </div>
        </div>

        {/* Personal Notes Section */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="details-field-label">Personal Notes & Solution Approach</span>
          {problem.notes ? (
            <div className="notes-box">{problem.notes}</div>
          ) : (
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              No notes added for this problem yet. Click Edit to add key observations or time/space complexities.
            </p>
          )}
        </div>

        {/* Action Footer */}
        <div className="details-actions">
          <div>
            {problem.link ? (
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={16} />
                <span>Open Original Problem</span>
              </a>
            ) : (
              <button className="btn btn-secondary" disabled title="No link provided">
                <ExternalLink size={16} />
                <span>No Link Provided</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/edit/${problem._id}`} className="btn btn-secondary">
              <Edit3 size={16} />
              <span>Edit</span>
            </Link>

            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
