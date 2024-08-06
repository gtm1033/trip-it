import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/v1/hosts/login', { email, password }, { withCredentials: true });
      console.log('Login success:', response.data);
      // Assuming the tokens are sent in response data
      Cookies.set('accessToken', response.data.accessToken, { path: '/', secure: true });
      Cookies.set('refreshToken', response.data.refreshToken, { path: '/', secure: true });

      // Redirect to the profile page
      navigate('/create-listing');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <h1>Host Login</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </div>
  );
};



// import React from 'react'

// export const Login = () => {
//     const isUserLoggedIn = false;
//   return (
//     <div>
//         <form method='post' action="http://localhost:8000/api/v1/hosts/login" className=''>
//             <label htmlFor="email">Email</label>
//             <input type="email" name="email" id="email" />
//             <label htmlFor="password">Password</label>
//             <input type="password" name="password" id="password" />
//             <button type="submit">Login</button>

//         </form>
//     </div>
//   )
// }
