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
  CLIENTS: {
    GET_ALL: 'customers',
    GET_BY_ID: (id: string) => `customers/${id}`,
    CREATE: 'customers',
    UPDATE: (id: string) => `customers/${id}`,
    DELETE: (id: string) => `customers/${id}`,
  },
  ADMINS: {
    GET_ALL: 'admin-users',
    GET_BY_ID: (id: string) => `admin-users/${id}`,
    CREATE: 'admin-users',
    UPDATE: (id: string) => `admin-users/${id}`,
    DELETE: (id: string) => `admin-users/${id}`,
  },
  PRODUCTS: {
    GET_ALL: 'products',
    GET_BY_ID: (id: string) => `products/${id}`,
    CREATE: 'products',
    UPDATE: (id: string) => `products/${id}`,
    DELETE: (id: string) => `products/${id}`,
  }

};
