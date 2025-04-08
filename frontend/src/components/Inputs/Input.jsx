import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

export const Input = ({ value, onChange, placeholder, label, type, ref,className }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    return (
        <div className='text-[14px] text-slate-800'>
            <label className=''>{label}</label>
            <div className='input-box'>
                <input
                    ref={ref}
                    type={type == 'password' ? showPassword ? 'text' : 'password' : type}
                    placeholder={placeholder}
                    className={`w-full bg-transparent outline-none ${className}`}
                    value={value}
                    onChange={(e) => onChange(e)}
                />
                {type === 'password' && (
                    <>
                        {showPassword ? (
                            <IoEyeOutline
                                size={22}
                                className='text-slate-400 cursor-pointer'
                                onClick={() => toggleShowPassword()}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='text-slate-400 cursor-pointer'
                                onClick={() => toggleShowPassword()}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
