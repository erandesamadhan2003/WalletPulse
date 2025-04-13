import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layouts/DashboardLayout'
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../utils/axiosInstance';
import { ExpenseOverView } from '../../components/Expense/ExpenseOverView';
import { ExpenseList } from '../../components/Expense/ExpenseList';
import { Modal } from '../../components/Modal';
import { DeleteAlert } from '../../components/DeleteAlert';
import { AddExpenseForm } from '../../components/Expense/AddExpenseForm';

export const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);

      if (response.data) setExpenseData(response.data);

    } catch (error) {
      console.log("Something went wrong. Please try again.", error)
    } finally {
      setLoading(false)
    }
  };

  // Handle Add Income
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category) {
      toast.error("category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount Should be valid number greater tha 0");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category, amount, date, icon
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense Added Successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding Expense:", error.response?.data?.message || error.message)
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted Successfully");
      fetchExpenseDetails();
    } catch (error) {
      toast.error("error in deleting Expense")
      console.log("Error in deleting Expense: ", error.response?.data?.message || error.message)
    }
  };
  // handle download income details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {responseType: "blob"});

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href=url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error in Downloading expense details: ",error);
      toast.error("failed to download. please try again");
    }
  };
  useEffect(() => {
    fetchExpenseDetails();
  }, [])
  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverView
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure want to delete this expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
