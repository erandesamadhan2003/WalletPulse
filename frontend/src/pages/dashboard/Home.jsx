import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { InfoCard } from '../../components/card/InfoCard';
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from '../../utils/helper';
import { LuHandCoins, LuTrash2, LuWalletMinimal } from 'react-icons/lu';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { FinanceOverview } from '../../components/dashboard/FinanceOverview';
import { ExpenseTransactions } from '../../components/dashboard/ExpenseTransactions';
import { Last30DaysExpenses } from '../../components/dashboard/Last30DaysExpenses';
import { RecentIncomeWithChart } from '../../components/dashboard/RecentIncomeWithChart';
import { RecentIncome } from '../../components/dashboard/RecentIncome';
import { MdAccountBalanceWallet } from "react-icons/md";
import { TbCashRegister } from "react-icons/tb";
import { GiWallet } from "react-icons/gi";
import toast from 'react-hot-toast';



export const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashBoardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again", error);
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBudget = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_BUDGET(id));
      toast.success("Budget deleted successfully");

      fetchDashBoardData();
    } catch (error) {
      toast.error("Failed to delete budget");
      console.error("Delete Error:", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchDashBoardData();
    return () => { }
  }, [])


  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label='Total Balance'
            value={addThousandsSeparator(dashboardData?.totalBalance) || 0}
            color='bg-purple-700'
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label='Total Income'
            value={addThousandsSeparator(dashboardData?.totalIncome) || 0}
            color='bg-orange-500'
          />
          <InfoCard
            icon={<LuHandCoins />}
            label='Total Expense'
            value={addThousandsSeparator(dashboardData?.totalExpense) || 0}
            color='bg-red-500'
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate('/expense')}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance}
            totalIncome={dashboardData?.totalIncome}
            totalExpense={dashboardData?.totalExpense}
          />
        </div>

        {dashboardData && dashboardData.activeBudgets?.length > 0 && (
          <div className='card mt-6'>
            <span className='text-gray-900'>Budget Management</span>
            {dashboardData.activeBudgets.map((budget) => {
              const start = new Date(budget?.startDate);
              const end = new Date(budget?.endDate);
              const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // inclusive

              return (
                <div key={budget._id}>
                  <div className='border my-3'></div>
                  <div className='flex justify-between flex-wrap'>
                    <p className='text-sm'>
                      <span className='text-gray-600'>Duration:</span> {durationInDays} days
                    </p>
                    <div className='flex gap-10 flex-wrap'>
                      <p className='text-sm'>
                        <span className='text-gray-600'>Start Date:</span> {budget?.startDate.split('T')[0]}
                      </p>
                      <p className='text-sm'>
                        <span className='text-gray-600'>End Date:</span> {budget?.endDate.split('T')[0]}
                      </p>
                      <button className="text-gray-400 hover:text-red-500 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => handleDeleteBudget(budget._id)}
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 mb-6">
                    <InfoCard
                      icon={<MdAccountBalanceWallet />}
                      label='Balance Left'
                      value={addThousandsSeparator(budget?.totalBudget - budget?.amountspend) || 0}
                      color='bg-purple-700'
                    />
                    <InfoCard
                      icon={<TbCashRegister />}
                      label='Total Budget Set'
                      value={addThousandsSeparator(budget?.totalBudget) || 0}
                      color='bg-orange-500'
                    />
                    <InfoCard
                      icon={<GiWallet />}
                      label='Spend Budget'
                      value={addThousandsSeparator(budget?.amountspend) || 0}
                      color='bg-red-500'
                    />
                  </div>

                  {budget?.amountspend > budget?.totalBudget && (
                    <p className="text-sm text-red-600 font-medium mt-2">
                      ⚠️ You have crossed your budget limit!
                    </p>
                  )}
                </div>

              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpense?.transaction || []}
            onSeeMore={() => navigate('/expense')}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpense?.transaction || []}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transaction || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transaction || []}
            onSeeMore={() => navigate('/income')}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
