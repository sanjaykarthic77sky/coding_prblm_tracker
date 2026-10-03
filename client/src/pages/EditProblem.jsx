import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, AlertCircle } from 'lucide-react';
import ProblemForm from '../components/ProblemForm';
import { getProblemById, updateProblem } from '../services/problemService';

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await getProblemById(id);
        if (res.success) {
          setProblemData(res.data);
        }
      } catch (err) {
        console.error('Error fetching problem to edit:', err);
        setErrorMessage('Could not load problem data for editing.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  const handleUpdateProblem = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const response = await updateProblem(id, formData);
      if (response.success) {
        // Redirect back to problem details
        navigate(`/problems/${id}`);
      }
    } catch (err) {
      console.error('Error updating problem:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to update problem. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
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

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ justifyContent: 'center' }}>
          <Edit3 size={26} color="var(--accent-primary)" />
          <span>Edit Problem</span>
        </h1>
        <p className="page-subtitle">Update problem details, status, or solution notes</p>
      </div>

      {errorMessage && (
        <div className="alert alert-error" style={{ maxWidth: '680px', margin: '0 auto 1.5rem auto' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {problemData ? (
        <ProblemForm
          initialData={problemData}
          onSubmit={handleUpdateProblem}
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      ) : (
        <div className="empty-state" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <AlertCircle className="empty-state-icon" size={40} />
          <h3 className="empty-state-title">Problem Not Found</h3>
          <p className="empty-state-text">The problem you are trying to edit does not exist.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/problems')}>
            Back to Problems
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProblem;
