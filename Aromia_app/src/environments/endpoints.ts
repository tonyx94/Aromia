export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
  },
  USERS: {
    GET_ALL: 'customers',
    GET_BY_ID: (id: string) => `customers/${id}`,
    CREATE: 'customers',
    UPDATE: (id: string) => `customers/${id}`,
    DELETE: (id: string) => `customers/${id}`,
  },
   
};
