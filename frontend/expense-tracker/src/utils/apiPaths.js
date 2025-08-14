// API Endpoints
export const BASE_URL = 'http://localhost:5000';

export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
        GET_USER_INFO: '/api/v1/auth/getUser',
        UPDATE_PROFILE: '/api/v1/auth/update-profile',
        CHANGE_PASSWORD: '/api/v1/auth/change-password',
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: '/api/v1/auth/dashboard/data',
        GET_DASHBOARD_SUMMARY: '/api/v1/auth/dashboard/summary',
        GET_QUICK_STATS: '/api/v1/auth/dashboard/getQuick',
        GET_DASHBOARD_CHARTS: '/api/v1/auth/dashboard/charts',
        GET_WEEKLY_PROGRESS: '/api/v1/auth/dashboard/weeklyProgress',
    },
    INCOME: {   
        ADD_INCOME: '/api/v1/auth/income/add',
        GET_INCOME: '/api/v1/auth/income/get',
        UPDATE_INCOME: (incomeId) => `/api/v1/auth/income/update/${incomeId}`,
        DELETE_INCOME: (incomeId) => `/api/v1/auth/income/delete/${incomeId}`,
        DOWNLOAD_INCOME_EXCEL: '/api/v1/auth/income/downloadexcel',
    },
    EXPENSE: {
        ADD_EXPENSE: '/api/v1/auth/expense/add',
        GET_EXPENSE: '/api/v1/auth/expense/get',
        UPDATE_EXPENSE: (expenseId) => `/api/v1/auth/expense/update/${expenseId}`,
        DELETE_EXPENSE: (expenseId) => `/api/v1/auth/expense/delete/${expenseId}`,
        DOWNLOAD_EXPENSE_EXCEL: '/api/v1/auth/expense/downloadexcel',
    },
    MEALPLAN: {
        ADD_MEALPLAN: '/api/v1/auth/mealplan/add',
        GET_MEALPLAN: '/api/v1/auth/mealplan/get',
        DELETE_MEALPLAN: (mealplanId) => `/api/v1/auth/mealplan/${mealplanId}`,
        GET_MEALPLAN_BY_DATE: (date) => `/api/v1/auth/mealplan/date/${date}`,
        GET_MEALPLAN_BY_RANGE: '/api/v1/auth/mealplan/range',
        GET_MEALPLAN_STATS: '/api/v1/auth/mealplan/stats',
        UPDATE_MEALPLAN: (mealplanId) => `/api/v1/auth/mealplan/update/${mealplanId}`,
    },
    DAILYLOG: {
        CREATE_DAILYLOG: '/api/v1/auth/dailylog/add',
        GET_ALL_LOGS: '/api/v1/auth/dailylog/getUser',
        GET_LOG_BY_DATE: (date) => `/api/v1/auth/dailylog/${date}`,
        UPDATE_LOG: (logId) => `/api/v1/auth/dailylog/${logId}`,
        DELETE_LOG: (logId) => `/api/v1/auth/dailylog/${logId}`,
    },
    FIXEDEXPENSE: {
        ADD_FIXEDEXPENSE: '/api/v1/auth/fixedexpenses/add',
        GET_ALL_FIXEDEXPENSES: '/api/v1/auth/fixedexpenses/getall',
        UPDATE_FIXEDEXPENSE: (expenseId) => `/api/v1/auth/fixedexpenses/update/${expenseId}`,
        DELETE_FIXEDEXPENSE: (expenseId) => `/api/v1/auth/fixedexpenses/delete/${expenseId}`,
    },
    NOTE: {
        ADD_NOTE: '/api/v1/auth/note/add',
        GET_ALL_NOTE: '/api/v1/auth/note/getUser',
        DELETE_NOTE: (noteId) => `/api/v1/auth/note/delete/${noteId}`,

        UPDATE_NOTE: (noteId) => `/api/v1/auth/note/update/${noteId}`
    },
    IMAGE: {
        UPLOAD_IMAGE: '/api/v1/auth/image/upload-image',
    },
    ADMIN: {
        USERS: '/api/v1/auth/admin/users',
        USER_ROLE: (id) => `/api/v1/auth/admin/users/${id}/role`,
        USER_DELETE: (id) => `/api/v1/auth/admin/users/${id}`,
    }
}
