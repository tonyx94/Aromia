export interface IUser {
  color: string;
  date_created: string;
  emailCompany: string;
  lastname: string;
  name: string;
  phone: string;
  position: string;
  rol: string[];
  status: true;
  user: string;
  user_id: string;
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
