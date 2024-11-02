export interface Login {
  username: string;
  password: string;
}

export interface Table {
  id: number;
  number: string;
  is_available: boolean;
}

export interface User {
  id: number;
  username: string;
  document_number: "DNI" | "CE" | "PP";
  document_type: string;
  name: string;
  is_enabled: boolean;
  phone: string;
  role: "ADMIN" | "WAITER" | "STOREKEEPER";
  created_at: string;
  updated_at: string;
}
