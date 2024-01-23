import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  //allows cookies to be saved to browser and sent in future request
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,  
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // data to be sent
    const userData = {
      username: username,
      password: password,
    };

    // Make the POST request
    api.post('/auth/login', userData)
      .then((response) => {
        console.log(response.data);
        // successful login
        setErrorMessage('')
        setSuccessMessage('Login successfull!')
        setTimeout(() =>{navigate('/');}, 1000);
      })
      .catch((error) => {
        console.log(error);
        // Handling login error
        setErrorMessage(error.response.data.error)
        setUsername('');
        setPassword('');
      });
  };

  const handleRegister = () => {
    navigate('/registration');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:&nbsp;
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <br/>
        <div>
          <label>
            Password:&nbsp;
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <br/>
        <div>
          <button class="loginButton" type="submit">Login</button>&nbsp;
          <button class="registerButton" type="button" onClick={handleRegister}>Register</button>
        </div>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default Login;