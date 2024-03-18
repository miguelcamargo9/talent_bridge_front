import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import UsersGrid from "./components/Users/UsersGrid";
import CreateUser from "./components/Users/Create/CreateUser";
import UpdateUser from "./components/Users/Update/UpdateUser";
import OpportunitiesGrid from "./components/Opportunuties/OpportunitiesGrid";
import Opportunities from "./components/Opportunuties/Opportunities";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<OpportunitiesGrid />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
