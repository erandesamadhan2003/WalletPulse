import React, { useState } from 'react'
import { AuthLayout } from '../../components/layouts/AuthLayout.jsx'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/Inputs/Input.jsx';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper.js';
import { axiosInstance } from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("please enter a valid email address");
      return;
    }

    if (!password) {
      setError("please Enter the password");
      return;
    }
    setError("");

    //login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })

      const { token, user } = response.data;
      console.log("User", user);
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    }

  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please Enter your detail to login</p>

        <form>
          <Input
            type="email"
            value={email}
            label="Email Address"
            placeholder='abc@example.com'
            onChange={({ target }) => setEmail(target.value)}
          />
          <Input
            type="password"
            value={password}
            label="password"
            placeholder='Enter a password'
            onChange={({ target }) => setPassword(target.value)}
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' onClick={handleLogin} className='btn-primary'>
            LOGIN
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Don't Have an Account? {" "}
            <Link className='font-medium text-blue-800 underline' to='/signup'>
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

