export interface Message {
  id?: number;
  user_id: string;
  cotizacion_id: number;
  content?: string;
  file_url?: string;
  created_at?: string;
  user?: {
    name: string;
    lastname: string;
  };
}
