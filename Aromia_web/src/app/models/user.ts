export interface IUser {
  id?: number;
  user_id?: string;
  firstName?: string;
  lastName?: string;
  lastname?: string;
  name?: string;
  email: string;
  phone: string;
  roleId: number;
  role?: any;
  isActive: boolean;

  color?: string;
  position?: string;
}

export interface IClient {
  address: string;
  client_id: string;
  company_id: string;
  date_created: string;
  email: string;
  identity: string;
  lastname: string;
  name: string;
  phone: string;
  status: number;
  user_id: string;
}
