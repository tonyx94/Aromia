export interface Address {
  id?: number;
  alias: string;           
  street_address: string; 
  city: string;
  state: string;        
  postal_code?: string;
  country?: string;
  additional_info?: string;
  is_default?: boolean;
}