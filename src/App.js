import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./Home/Loading";
import Home from "./Home/Home";
import SignupSelection from './Home/SignupSelection';
import CollegeRegister from './College/Collegeregister';
import CollegeDashboard from './College/CollegeDashboard';
import CollegeLogin from "./College/Collegelogin";

import Login from "./Home/LoginSelection";
import StudentLogin from "./user/LoginPage";
import StudentRegister from "./user/UserRegister";
import UserDashboard from "./user/UserDashbaord";
 // Import Register page
import Dashboard from './user/components/Dashboard';

import TeamDashboard from "./team/TeamDashboard";
import TeamHome from './team/components/TeamHome';
import Teamchat from './team/components/Teamchat';
import ProblemStatement from './team/components/ProblemStatement';
import SubmitProject from './team/components/SubmitProject';
// import TeamCompiler from './team/components/TeamCompiler';
import Leaderboard from './team/components/LeaderBoard';
import TimeTable from './team/components/TimeTable';
import MentorLogin from './Mentor/MentorLogin';
import MentorDashboard from './Mentor/MentorDashboard';
import HackathonDetails from "./user/components/HackathonDetails";
import FacultyLogin from "./Faculty/FacultyLogin";
import "./App.css";
import HomeDashboard from "./Mentor/components/HomeDashboard";
import Hackathons from "./Mentor/components/Hackathons";
import Quiz from "./Mentor/components/Quiz";
import Chat from "./Mentor/components/Chat";
import Profile from "./user/components/Profile";
import Courses from "./user/components/Courses";
import RegisteredHackathons from "./user/components/RegisteredHackathons";
import UpcomingHackathons from "./user/components/UpcomingHackathons";
import HackathonDashboard from "./user/components/HackathonDashboard";
// import CollegeProfile from "./College/CollegeProfile";
import OngoingHackathons from "./user/components/OngoingHackathons";
import PastHackathons from "./user/components/PastHackathons";
import Achievement from "./user/components/Achievements";
import CodeCompiler from "./user/components/Compiler";
import TeamFormationPage from "./user/components/TeamFormationPage";
import AcceptInvitation from "./user/components/AcceptInvitation";
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulated loading time

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup-selection" element={<SignupSelection />} />
          <Route path="/college-signup" element={<CollegeRegister />} />
          <Route path="/college-dashboard" element={<CollegeDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-student" element={<StudentLogin />} />
          <Route path="/college-login" element={<CollegeLogin />} />
          <Route path="/student-signup" element={<StudentRegister />} />
        
          <Route path="/login-faculty" element={<FacultyLogin />} />
          <Route path="/login-mentor" element={<MentorLogin />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />

          {/* User Dashboard with nested routes */}
          <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route index element={<Dashboard /> } />
          <Route path="profile" element={<Profile/>} />
              <Route path="courses" element={<Courses />} />
              <Route path="hackathons/registered" element={<RegisteredHackathons />} />
              <Route path="hackathons/upcoming" element={<UpcomingHackathons />} />
              <Route path='hackathons/details' element={<HackathonDetails />} />
              <Route path="hackathons/ongoing" element={<OngoingHackathons />} />
              <Route path="hackathons/past" element={<PastHackathons />} />
              <Route path="hackathons/dashboard" element={<HackathonDashboard />} /> 
              <Route path="compiler" element={<CodeCompiler />} />
              <Route path="achievements" element={<Achievement />} />
              <Route path="teamcreate" element={<TeamFormationPage />} />
              
           </Route>
           <Route path="/api/accept_invite" element={<AcceptInvitation />} />
          {/* Team Dashboard with nested routes */}
            <Route path="/team-dashboard" element={<TeamDashboard />}>
            <Route index element={<TeamHome />} />
            <Route path="team-home" element={<TeamHome />} />
            <Route path="team-chat" element={<Teamchat />} />
            <Route path="problem-statement" element={<ProblemStatement />} />
            <Route path="submit-project" element={<SubmitProject />} />
            {/* <Route path="team-compiler" element={<TeamCompiler />} /> */}
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="timetable" element={<TimeTable />} />

          </Route>

          {/* Mentor Dashboard with nested routes */}
          <Route path="/mentor-dashboard" element={<MentorDashboard />}>
            <Route index element={<HomeDashboard />} />
            <Route path="mentor-home" element={<HomeDashboard />} />
            <Route path="hackathons" element={<Hackathons />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="chat" element={<Chat />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
