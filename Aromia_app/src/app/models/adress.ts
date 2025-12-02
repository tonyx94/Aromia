export interface Address {
  id?: number;
  alias: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode?: string;
  country?: string;
  additionalInfo?: string;
  isDefault?: boolean;
}