export const BASE_URL = "http://localhost:3000/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/v1/auth/login",
    REGISTER: "/v1/auth/register",
    GET_USER_INFO: "/v1/auth/getUser",
  },
  DASHBOARD: {
    GET_DATA: "/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/v1/income/add",
    GET_ALL_INCOME: "/v1/income/get",
    DELETE_INCOME: (incomeId) => `/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: `/v1/income/downloadedexcel`,
  },
  EXPENSE: {
    ADD_EXPENSE: "/v1/expense/add",
    GET_ALL_EXPENSE: "/v1/expense/get",
    DELETE_EXPENSE: (expenseId) => `/v1/expense/delete/${expenseId}`,
    DOWNLOAD_EXPENSE: `/v1/expense/downloadedexcel`,
    ADD_BUDGET: `/v1/expense/setbudget`,
    DELETE_BUDGET: (budgetId) => `/v1/expense/budget/${budgetId}`
  },
  AI: {
    GET_INSIGHTS: "/v1/ai/insights",
    GET_PREDICTION: "/v1/ai/prediction",
    GET_BUDGET: "/v1/ai/budget",
    GET_REPORT: "/v1/ai/report",
  },
};