import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import CreateOpportunity from "./components/Opportunities/Create/CreateOpportunity";
import UpdateUser from "./components/Users/Update/UpdateUser";
import OpportunitiesGrid from "./components/Opportunities/OpportunitiesGrid";
import Opportunities from "./components/Opportunities/Opportunities";
import Login from "./components/Auth/Login";
import RequireAuth from "./components/Auth/RequireAuth";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><OpportunitiesGrid /></RequireAuth>} />
          <Route path="/talent/opportunities" element={<RequireAuth><OpportunitiesGrid /></RequireAuth>} />
          <Route path="/recruiter/opportunities" element={<RequireAuth><Opportunities /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth><CreateOpportunity /></RequireAuth>} />
          <Route path="/update/:id" element={<RequireAuth><UpdateUser /></RequireAuth>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
