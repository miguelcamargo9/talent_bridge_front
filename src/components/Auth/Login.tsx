import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { loginService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const [username, setUsername] = useState('ernser.brielle');
  const [password, setPassword] = useState('secret');
  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = loginService(username, password);
    
    loginData.then((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'talent') {
        navigate('/talent/opportunities');
      } else
      if (data.user.role === 'recruiter') {
        navigate('/recruiter/opportunities/');
      }
    }).catch((error) => {
      console.error('Error logging in:', error);
    });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '40vh' }}>
      <div className='w-100' style={{ maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={handleUsernameChange}
              className='w-100'
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 text-center" style={{ minWidth: "100%" }}>
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;