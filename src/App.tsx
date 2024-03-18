import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Users from "./components/Users/Users";
import UsersGrid from "./components/Users/UsersGrid";
import CreateUser from "./components/Users/Create/CreateUser";
import UpdateUser from "./components/Users/Update/UpdateUser";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<UsersGrid />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
