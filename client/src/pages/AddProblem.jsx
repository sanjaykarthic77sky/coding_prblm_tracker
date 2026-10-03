import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, AlertCircle } from 'lucide-react';
import ProblemForm from '../components/ProblemForm';
import { createProblem } from '../services/problemService';

const AddProblem = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddProblem = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const response = await createProblem(formData);
      if (response.success) {
        // Redirect to problems list after success
        navigate('/problems');
      }
    } catch (err) {
      console.error('Error creating problem:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to add problem. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ justifyContent: 'center' }}>
          <PlusCircle size={26} color="var(--accent-primary)" />
          <span>Add New Problem</span>
        </h1>
        <p className="page-subtitle">Log a coding problem you practiced today</p>
      </div>

      {errorMessage && (
        <div className="alert alert-error" style={{ maxWidth: '680px', margin: '0 auto 1.5rem auto' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <ProblemForm onSubmit={handleAddProblem} isSubmitting={isSubmitting} isEditing={false} />
    </div>
  );
};

export default AddProblem;
