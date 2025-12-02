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
  },
  ADDRESSES: {
    GET_ALL: 'customers/me/addresses',
    CREATE: 'customers/me/addresses',
    UPDATE: (id: number) => `customers/me/addresses/${id}`,
    DELETE: (id: number) => `customers/me/addresses/${id}`,
    SET_DEFAULT: (id: number) => `customers/me/addresses/${id}/default`,
  },
  DIRECTION: {
    GET_BY_ID: (id: string) => `customer-addresses/${id}`,
    CREATE: 'customer-addresses',
    UPDATE: (id: string) => `customer-addresses/${id}`,
    DELETE: (id: string) => `customer-addresses/${id}`,
  },
  ORDERS: {
    GET_ALL: 'products',
    GET_BY_ID: (id: string) => `products/${id}`,
    CREATE: 'products',
    UPDATE: (id: string) => `products/${id}`,
    DELETE: (id: string) => `products/${id}`,
  },
};
