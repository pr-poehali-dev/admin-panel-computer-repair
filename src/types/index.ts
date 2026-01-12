export type UserRole = 'admin' | 'manager' | 'technician';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { label: string; value: string }[];
}

export interface TableAction<T> {
  label: string;
  icon?: string;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'outline';
  permission?: UserRole[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'switch';
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}
