import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/Inputs/Input';
import { ProfilePhotoSelector } from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';

export const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // handle singup form submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    const profileImgageUrl = "";

    if(!fullName) {
      setError('Please Enter your name');
      return;
    }

    if(!validateEmail(email)) {
      setError('Please Enter a valid Email');
      return;
    }

    if(!password) {
      setError('Please Enter a password');
      return;
    }

    setError("");

    // Sign up API call

  };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <div className='text-xl font-semibold text-black'>Create an Account</div>
        <p className='text-xs text-slate-700 nt-[5px] mb-6'>
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="fullname"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              placeholder="email@gmail.com"
              type="email"
            />
            <div className='col-span-2'>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="min 8 character"
                type="password"
              />
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' onClick={handleSignUp} className='btn-primary'>
            SIGN UP
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already Have an Account? {" "}
            <Link className='font-medium text-blue-800 underline' to='/login'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
