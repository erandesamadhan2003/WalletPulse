import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { InfoCard } from '../../components/card/InfoCard';
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from '../../utils/helper';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { FinanceOverview } from '../../components/dashboard/FinanceOverview';
import { ExpenseTransactions } from '../../components/dashboard/ExpenseTransactions';
import { Last30DaysExpenses } from '../../components/dashboard/Last30DaysExpenses';
import { RecentIncomeWithChart } from '../../components/dashboard/RecentIncomeWithChart';
import { RecentIncome } from '../../components/dashboard/RecentIncome';

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
            onSeeMore={()=>navigate('/expense')}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance}
            totalIncome={dashboardData?.totalIncome}
            totalExpense={dashboardData?.totalExpense}
          />


          <ExpenseTransactions 
            transactions={dashboardData?.last30DaysExpense?.transaction || []}
            onSeeMore={()=>navigate('/expense')}
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
            onSeeMore={()=>navigate('/income')}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
