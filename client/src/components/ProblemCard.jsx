import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Edit3, Trash2, Eye, CheckCircle2, Circle } from 'lucide-react';

const ProblemCard = ({ problem, onToggleStatus, onDelete }) => {
  const { _id, title, platform, difficulty, topic, status, link, createdAt } = problem;

  // Format creation date nicely (e.g. Oct 3, 2026)
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

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

  const isSolved = status === 'Solved';

  return (
    <div className="problem-card">
      <div className="problem-main-info">
        <div className="problem-title-row">
          {/* Quick Solved / Unsolved Toggle */}
          <button
            className="status-toggle-btn"
            onClick={() => onToggleStatus(_id, status)}
            title={`Mark as ${isSolved ? 'Unsolved' : 'Solved'}`}
            aria-label={`Toggle status for ${title}`}
          >
            {isSolved ? (
              <CheckCircle2 size={20} color="#10b981" />
            ) : (
              <Circle size={20} color="#64748b" />
            )}
          </button>

          {/* Title Link to Details */}
          <Link to={`/problems/${_id}`} className="problem-title">
            {title}
          </Link>

          {/* Optional Direct External Link Icon */}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              title="Open original problem"
              style={{ color: 'var(--text-dim)', display: 'flex' }}
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>

        {/* Metadata Badges */}
        <div className="problem-meta-row">
          <span className="badge badge-platform">{platform}</span>
          <span className={`badge ${getDifficultyBadgeClass(difficulty)}`}>
            {difficulty}
          </span>
          <span className="badge badge-topic">{topic}</span>
          <span className={`badge ${isSolved ? 'badge-solved' : 'badge-unsolved'}`}>
            {status}
          </span>
          {formattedDate && <span className="problem-date">{formattedDate}</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="problem-actions">
        <Link
          to={`/problems/${_id}`}
          className="btn btn-secondary btn-sm"
          title="View Details"
        >
          <Eye size={15} />
          <span>View</span>
        </Link>

        <Link
          to={`/edit/${_id}`}
          className="btn btn-secondary btn-sm"
          title="Edit Problem"
        >
          <Edit3 size={15} />
          <span>Edit</span>
        </Link>

        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(_id, title)}
          title="Delete Problem"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProblemCard;
