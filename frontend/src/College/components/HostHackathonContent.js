import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const HackathonForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    register_deadline: "",
    team: "",
    no_of_people_in_team: "",
    hackathon_type: "",
    hackathon_mode: "",
    registration_fee: "",
    location: "",
    max_participants: "",
    mentor_emails: "",
    description: "",
    hackathon_focus:"",
    prize_pool: "",
    category: "", // New category field
    problem_statement_text: "", // For single problem statement category
    // For idea/project submission category
  });

  const [files, setFiles] = useState({
    poster: null,
    problem_statements_file: null,

    timetable: null,
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList[0];
    
    if (name === "poster" && file && !file.type.startsWith("image/")) {
      alert("Please upload a valid image file for the poster.");
      return;
    }
  
    if (name === "problem_statements" && file && !file.type.endsWith("pdf")) {
      alert("Please upload a valid PDF file for the problem statements.");
      return;
    }
  
 
  
    if (name === "timetable" && file && !file.type.endsWith("pdf")) {
      alert("Please upload a valid PDF file for the timetable.");
      return;
    }
  
    setFiles((prevFiles) => ({ ...prevFiles, [name]: file }));
  };
  
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a hackathon.");
      return;
    }
    setLoading(true);

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const registerDeadline = new Date(formData.register_deadline);
    
    if (endDate <= startDate) {
      setMessage("End date must be after the start date.");
      return;
    }

    if (registerDeadline >= startDate) {
      setMessage("Registration deadline must be before the start date.");
      return;
    }
    
    const formDataToSubmit = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formDataToSubmit.append(key, files[key]);
      }
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/create_hackathon", formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Hackathon created successfully!");
      setLoading(false);
      console.log("Response:", response.data);
      setFormData({
        title: "",
        start_date: "",
        end_date: "",
        register_deadline: "",
        team: "",
        no_of_people_in_team: "",
        hackathon_type: "",
        hackathon_mode: "",
        registration_fee: "",
        location: "",
        max_participants: "",
        mentor_emails: "",
        description: "",
        hackathon_focus: "",
        prize_pool: "",
        category: "", // New category field
        problem_statement_text: "", // For single problem statement category
        // For idea/project submission category
      });
      setFiles({
        poster: null,
        problem_statements_file: null,

        timetable: null,
      });
    } catch (error) {
      console.error("Error:", error.response?.data);
      const errorMessage =
        error.response?.data?.detail || "An error occurred while creating the hackathon.";
      setMessage(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Hackathon
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        sx={{ mt: 3, mb: 3 }}
      >
        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hackathon Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Dates */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Start Date & Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="End Date & Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Registration Deadline */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Registration Deadline"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              name="register_deadline"
              value={formData.register_deadline}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Team Details */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Team Mode</InputLabel>
              <Select
                name="team"
                value={formData.team}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="team">Team</MenuItem>
                <MenuItem value="individual">Individual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.team === "team" && (
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="No of People in Team"
                type="number"
                name="no_of_people_in_team"
                value={formData.no_of_people_in_team}
                onChange={handleInputChange}
                required
              />
            </Grid>
          )}

          {/* Hackathon Type */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Hackathon Type</InputLabel>
              <Select
                name="hackathon_type"
                value={formData.hackathon_type}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.hackathon_type === "paid" && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Registration Fee"
                  type="number"
                  name="registration_fee"
                  value={formData.registration_fee}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prize Pool Details"
                name="prize_pool"
                multiline
                rows={3}
                value={formData.prize_pool}
                onChange={handleInputChange}
                required
              />
            </Grid>


            </>
          )}

          {/* Hackathon Mode */}
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Hackathon Mode</InputLabel>
              <Select
                name="hackathon_mode"
                value={formData.hackathon_mode}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.hackathon_mode === "offline" &&(
            <>
            <Grid item xs={6}>
            <TextField
              fullWidth
              label="Address"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            </Grid>
            </>
          )

          }
          {/* Add Category */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Hackathon Category</InputLabel>
              <Select name="category" value={formData.category} onChange={handleInputChange}>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="single_problem_statement">Single Problem Statement</MenuItem>
                <MenuItem value="multiple_problem_statements">Multiple Problem Statements</MenuItem>
                <MenuItem value="idea_project_submission">Idea/Project Submission</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Conditional fields based on category */}
          {formData.category === "single_problem_statement" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Problem Statement"
                name="problem_statement_text"
                value={formData.problem_statement_text}
                onChange={handleInputChange}
                required
              />
            </Grid>
          )}

          {formData.category === "multiple_problem_statements" && (
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Problem Statements
                <input type="file" hidden name="problem_statements" onChange={handleFileChange} />
              </Button>
            </Grid>
          )}

          {formData.category === "idea_project_submission" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hackathon Focus"
                name="hackathon_focus"
                value={formData.hackathon_focus}
                onChange={handleInputChange}
                required
              />
            </Grid>
          )}

          {/* Mentor Emails */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mentor Emails (comma separated)"
              name="mentor_emails"
              value={formData.mentor_emails}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hackathon Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
          
          {/* File Uploads */}
          <Grid item xs={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Upload Poster
              <input type="file" hidden name="poster" onChange={handleFileChange} />
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
            variant="outlined"
            component="label"
            fullWidth
            >
              Upload Time Timetable
              <input type="file" hidden name="timetable" onChange={handleFileChange}/>
            </Button>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Create Hackathon
            </Button>
          </Grid>
        </Grid>
      </Box>
      {message && (
        <Typography color="success" align="center">
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default HackathonForm;
