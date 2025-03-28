import React from 'react'
import CARD_2 from "/images/Expense.jpg"
import { LuTrendingUpDown } from "react-icons/lu";

const StatsInfoCard = ({icon, label, value, color}) => {
    return (
        <div className='flex gap-6 bg-white rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10'>
            <div className={`w-12 h-12 flex item-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl my-auto`}>
                {icon}
            </div>
            <div>
                <h6 className='text-xs text-gray-500 my-1'>{label}</h6>
                <span className='text-[20px]'>${value}</span>
            </div>
        </div>
    );
}

export const AuthLayout = ({ children }) => {
    return (
        <div className='flex'>
            <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
                <h2 className='text-lg font-medium text-black'>WalletPulse</h2>
                {children}
            </div>
            <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
                <div className='w-48 h-48 rounded-[40px] bg-purple-700 absolute -top-7 -left-5'/>
                <div className='w-48 h-48 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10'/>
                <div className='w-48 h-48 rounded-[40px] bg-violet-700 absolute -bottom-7 -left-5'/>

                <div className='grid grid-cols-1 z-20'>
                    <StatsInfoCard 
                        icon={<LuTrendingUpDown 
                            className='text-black my-auto ml-3 bg-purple-700 p-2 w-full h-auto rounded-full'
                        />}
                        label="Track Your Income and Expenses"
                        value="430,000"
                        color="bg-primary"
                    />

                </div>
                <img 
                    src={CARD_2} 
                    alt="ExpenseManagementImage" 
                    className='ml-6 w-48 h-[54%] lg:w-[80%] absolute bottom-10 shadow-lg shadow-blue-400/15 rounded-xl'
                />
            </div>
        </div>
    )
}
