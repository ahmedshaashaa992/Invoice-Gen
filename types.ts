export interface LineItem {
  id: string;
  description: string;
  details?: string;
  hours?: number;
  rate?: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  paymentTerms: string;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  taxNumber: string;
  logoUrl?: string;
  sender: {
    name: string;
    address: string;
    phone: string;
  };
  recipient: {
    name: string;
    address: string;
  };
  subject?: string;
  contractDate?: string;
  items: LineItem[];
  notes: string;
  payee: string;
  bankDetails: string;
}

// New type for Template
export interface Template extends Omit<Invoice, 'invoiceNumber' | 'invoiceDate' | 'recipient'> {
  id: string;
  name: string;
  recipient?: {
    name: string;
    address: string;
  };
}

// New type for UserData
export interface UserData {
    customers: Customer[];
    templates: Template[];
}

// New type for User
export interface User {
    username: string;
    password: string; // Stored in plaintext for simplicity, NOT FOR PRODUCTION
    email: string;
    data: UserData;
}
