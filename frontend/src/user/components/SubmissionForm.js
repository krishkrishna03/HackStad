import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px', // Wider dialog
    maxHeight: '90vh', // Limit height
    margin: '16px',
    display: 'flex',
    flexDirection: 'column',
  }
}));

const StyledDialogTitle = styled(DialogTitle)({
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: '700',
  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  marginBottom: '16px',
  padding: '12px',
});

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
  padding: '16px',
  '& .MuiTextField-root': {
    margin: 0,
    '& .MuiOutlinedInput-root': {
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
      },
      '&.Mui-focused': {
        transform: 'translateY(-1px)',
        boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
      }
    }
  },
  '& .full-width': {
    gridColumn: '1 / -1',
  }
}));

const StyledDialogActions = styled(DialogActions)({
  padding: '24px',
  justifyContent: 'center',
  gap: '20px',
});

const SubmitButton = styled(Button)(({ theme }) => ({
  minWidth: '140px',
  height: '48px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  }
}));

const CancelButton = styled(Button)(({ theme }) => ({
  minWidth: '140px',
  height: '48px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'none',
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  }
}));

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    height: 'auto',
    '& textarea': {
      height: '80px !important', // Fixed height for multiline
    },
    '&:hover': {
      backgroundColor: '#ffffff',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '14px',
    padding: '12px',
  }
};

const SubmissionForm = ({ open, onClose, hackathonId }) => {
  const [formData, setFormData] = useState({
    project_title: '',
    problem_statement: '',
    project_description: '',
    linkedin_url: '',
    github_url: '',
    other_url: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const getBaseURL = () => {
    const ip = window.location.hostname;
    return `http://${ip}:8000`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${getBaseURL()}/api/individualsubmission`, // Added /api prefix to match backend routes
        {
          ...formData,
          hackathon_id: hackathonId,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess('Project submitted successfully!');
        setTimeout(() => {
          onClose();
          setFormData({
            project_title: '',
            problem_statement: '',
            project_description: '',
            linkedin_url: '',
            github_url: '',
            other_url: '',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response?.status === 404) {
        setError('API endpoint not found. Please check server configuration.');
      } else {
        setError(
          error.response?.data?.detail || 
          'Failed to submit. Please check your connection and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>Submit Your Project</StyledDialogTitle>
      <form onSubmit={handleSubmit}>
        <StyledDialogContent>
          {error && (
            <Alert 
              severity="error" 
              className="full-width"
              sx={{ borderRadius: '8px' }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success"
              className="full-width"
              sx={{ borderRadius: '8px' }}
            >
              {success}
            </Alert>
          )}
          <TextField
            required
            label="Project Title"
            name="project_title"
            value={formData.project_title}
            onChange={handleChange}
            disabled={loading}
            className="full-width"
            sx={inputStyles}
          />
          <TextField
            required
            label="Problem Statement"
            name="problem_statement"
            value={formData.problem_statement}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={loading}
            className="full-width"
            sx={inputStyles}
          />
          <TextField
            required
            label="Project Description"
            name="project_description"
            value={formData.project_description}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={loading}
            className="full-width"
            sx={inputStyles}
          />
          <TextField
            label="LinkedIn URL"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            disabled={loading}
            sx={inputStyles}
          />
          <TextField
            label="GitHub URL"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            disabled={loading}
            sx={inputStyles}
          />
          <TextField
            label="Other URL"
            name="other_url"
            value={formData.other_url}
            onChange={handleChange}
            disabled={loading}
            sx={inputStyles}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <CancelButton 
            onClick={onClose} 
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </CancelButton>
          <SubmitButton 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? (
              <CircularProgress 
                size={24} 
                sx={{ color: '#fff' }}
              /> 
            ) : (
              'Submit Project'
            )}
          </SubmitButton>
        </StyledDialogActions>
      </form>
    </StyledDialog>
  );
};

export default SubmissionForm;