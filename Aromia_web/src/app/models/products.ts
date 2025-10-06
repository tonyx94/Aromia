export interface IProductsCotizacion {
  cant: number;
  comment: string;
  currency: string;
  date_created: string;
  id: any;
  name: string;
  price: string;
  priceTotal: string;
  producto_id: string;
  uuid: any;

  quantity?: any,
  size?: any,
  gender?: any,
  fabric_type?: any,
  technique?: any,
  color?: any,
  description?: any
}

export interface ProductoCotizacionDTO {
  product?: any;
  producto_id: string;
  name: string;
  comment: string;
  currency: string;
  cant: any;
  price: any;
  priceTotal: any;
}