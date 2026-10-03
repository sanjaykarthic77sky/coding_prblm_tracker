import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertCircle } from 'lucide-react';

const COMMON_TOPICS = [
  'Array',
  'String',
  'Linked List',
  'Stack',
  'Queue',
  'Tree',
  'Graph',
  'Dynamic Programming',
  'Sorting',
  'Searching',
  'Two Pointers',
  'Sliding Window',
  'Recursion / Backtracking',
  'Bit Manipulation',
  'Greedy',
  'Other',
];

const ProblemForm = ({ initialData, onSubmit, isEditing = false, isSubmitting = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Array',
    status: 'Unsolved',
    link: '',
    notes: '',
  });

  const [customTopic, setCustomTopic] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Populate form if initialData is provided (when editing)
  useEffect(() => {
    if (initialData) {
      const isPredefined = COMMON_TOPICS.includes(initialData.topic);
      setFormData({
        title: initialData.title || '',
        platform: initialData.platform || 'LeetCode',
        difficulty: initialData.difficulty || 'Easy',
        topic: isPredefined ? initialData.topic : 'Other',
        status: initialData.status || 'Unsolved',
        link: initialData.link || '',
        notes: initialData.notes || '',
      });
      if (!isPredefined && initialData.topic) {
        setCustomTopic(initialData.topic);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a problem title.');
      return;
    }

    const finalTopic = formData.topic === 'Other' && customTopic.trim()
      ? customTopic.trim()
      : formData.topic;

    if (!finalTopic || !finalTopic.trim()) {
      setErrorMessage('Please specify a topic.');
      return;
    }

    // Call submit handler with cleaned payload
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      topic: finalTopic,
      link: formData.link.trim(),
      notes: formData.notes.trim(),
    });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Problem Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Problem Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-input"
          placeholder="e.g. Two Sum, Reverse Linked List"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Platform and Difficulty Row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="platform">
            Platform <span className="required">*</span>
          </label>
          <select
            id="platform"
            name="platform"
            className="form-select"
            value={formData.platform}
            onChange={handleChange}
            required
          >
            <option value="LeetCode">LeetCode</option>
            <option value="HackerRank">HackerRank</option>
            <option value="CodeChef">CodeChef</option>
            <option value="GeeksforGeeks">GeeksforGeeks</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="difficulty">
            Difficulty <span className="required">*</span>
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="form-select"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Topic and Status Row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="topic">
            Topic <span className="required">*</span>
          </label>
          <select
            id="topic"
            name="topic"
            className="form-select"
            value={formData.topic}
            onChange={handleChange}
            required
          >
            {COMMON_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status">
            Status <span className="required">*</span>
          </label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Unsolved">Unsolved</option>
            <option value="Solved">Solved</option>
          </select>
        </div>
      </div>

      {/* Custom Topic Input if "Other" is selected */}
      {formData.topic === 'Other' && (
        <div className="form-group">
          <label className="form-label" htmlFor="customTopic">
            Custom Topic Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="customTopic"
            className="form-input"
            placeholder="e.g. Trie, Segment Tree, Bitmask"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            required
          />
        </div>
      )}

      {/* Problem Link */}
      <div className="form-group">
        <label className="form-label" htmlFor="link">
          Problem Link (URL)
        </label>
        <input
          type="url"
          id="link"
          name="link"
          className="form-input"
          placeholder="https://leetcode.com/problems/..."
          value={formData.link}
          onChange={handleChange}
        />
      </div>

      {/* Personal Notes */}
      <div className="form-group">
        <label className="form-label" htmlFor="notes">
          Personal Notes / Solution Approach
        </label>
        <textarea
          id="notes"
          name="notes"
          className="form-textarea"
          placeholder="Key observations, edge cases, time/space complexity (e.g. O(n) time, O(1) auxiliary space)..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          <X size={16} />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          <Save size={16} />
          <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Problem' : 'Save Problem'}</span>
        </button>
      </div>
    </form>
  );
};

export default ProblemForm;
