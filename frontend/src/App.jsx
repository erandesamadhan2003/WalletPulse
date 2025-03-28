import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import { Home } from './pages/dashboard/Home.jsx'
import { Login } from './pages/auth/Login.jsx';
import { Signup } from './pages/auth/Signup.jsx'
import { Expense } from './pages/dashboard/Expense.jsx'
import { Income } from './pages/dashboard/Income.jsx' 

const Root = () => {
  //check if token exists in localstorage
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard"/>
  ) : (
    <Navigate to="/login"/>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/dashboard',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path:'/expense',
    element: <Expense />
  },
  {
    path:'/income',
    element: <Income />
  },
])

function App() {
  
  return (
    <>
      <RouterProvider router={router}>

      </RouterProvider>
    </>
  )
}

export default App

