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
   PRODUCTS: {
    GET_ALL: 'products',
    GET_BY_ID: (id: string) => `products/${id}`,
    CREATE: 'products',
    UPDATE: (id: string) => `products/${id}`,
    DELETE: (id: string) => `products/${id}`,
  }
};
