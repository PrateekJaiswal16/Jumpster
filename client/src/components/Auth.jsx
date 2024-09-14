import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async () => {
    
    try {
      // console.log('API URL:', apiUrl);

      // console.log(process.env.REACT_APP_API_URL);
      const response = await axios.post(`${apiUrl}/api/login`, { username, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/game');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/signup`, { username, password });
      if (response.status === 201) {
        alert('Registration successful. Please log in.');
        setIsLogin(true);
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      alert('An error occurred during registration. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-blue-600 p-4">
      <div className="flex flex-wrap bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <div className="w-full lg:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <button
            className="mt-4 text-blue-500 font-semibold hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>

        <div className="w-full lg:w-1/2 p-8 bg-gray-100 rounded-r-lg flex items-center justify-center">
          <div>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Game Instructions</h3>
            <ul className="list-disc font-serif ml-6 text-lg">
              <li className="mb-2">Welcome to <span className='font-black'>Jumpster</span> !!</li>
              <li className="mb-2">New here? Click register to create an account.</li>
              <li className="mb-2">Once logged in, you'll be taken to the game.</li>
              <li className="mb-2">Keep jumping and avoid falling to score points.</li>
              <li className="mb-2">Break the high score and have fun!!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
