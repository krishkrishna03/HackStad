import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, TextField, Typography, Card, CardContent, Grid, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/system';

const Alert = styled(MuiAlert)(({ theme }) => ({
  width: '100%',
}));

const FacultyManagementPage = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    department: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchFacultyData = async () => {
    if (!token) {
      alert("Authorization token is missing");
      return;
    }

    try {
      const response = await axios.get('https://hackstad-0nqg.onrender.com/college_faculty', {
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
      });

      if (response.status === 200) {
        setFacultyList(response.data);
      } else {
        alert("Failed to fetch faculty data. Status Code: " + response.status);
      }
    } catch (error) {
      console.error("Error fetching faculty data:", error.response || error.message);
      if (error.response) {
        alert(`Error fetching faculty data. Server responded with: ${error.response.status} - ${error.response.data.message}`);
      } else {
        alert('Error fetching faculty data. Please try again.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Authorization token is missing");
      return;
    }

    const formDataToSend = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
    };

    try {
      const response = await axios.post('https://hackstad-0nqg.onrender.com/faculty', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSnackbarMessage("Faculty Added Successfully");
        setSnackbarOpen(true);
        fetchFacultyData();
        setFormData({
          name: "",
          role: "",
          email: "",
          phone: "",
          department: "",
        });
        setShowAddForm(false);
      } else {
        alert(`Error: ${response.data.detail || 'Failed to add faculty'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Error adding faculty. Please try again.');
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const FacultyList = () => {
    return (
      <Box mt={4}>
        <Typography variant="h4">Faculty List</Typography>
        {facultyList.length === 0 ? (
          <Typography>No faculty members found.</Typography>
        ) : (
          facultyList.map((faculty, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Name: {faculty.name}</Typography>
                <Typography>Role: {faculty.role}</Typography>
                <Typography>Email: {faculty.email}</Typography>
                <Typography>Phone: {faculty.phone}</Typography>
                <Typography>Department: {faculty.department}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  };

  return (
    <Container>
      <Box mt={4} mb={2} textAlign="center">
        <Typography variant="h3">Faculty Management</Typography>
      </Box>
      <Box display="flex" justifyContent="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAddForm(true)}
        >
          Add Faculty
        </Button>
      </Box>

      {showAddForm && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Add Faculty</Typography>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role"
                  variant="outlined"
                  fullWidth
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Department"
                  variant="outlined"
                  fullWidth
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Add Faculty
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

      <FacultyList />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FacultyManagementPage;
