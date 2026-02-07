import React from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface BusinessInfo {
  name: string;
  address: string;
  location: string;
  phone: string;
  hours: {
    weekdays: string;
    weekend: string;
  };
  social: {
    facebook: string;
  };
}

// Normalized Data Structures for Database/Context

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  description: string; // Supports rich text (HTML string) or markdown
  specs: Record<string, string>; // Key-Value pairs for technical specs
  price: number;
  stock: number;
  images: string[];
  createdAt: string;
}

export interface Offer {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  startDate: string;
  endDate: string;
  productIds: string[]; // Products this offer applies to
  description?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  message?: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total_amount: number;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED';
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  lastLogin?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  ip: string; // Simulated IP/UserAgent
}

// Filter State Interface
export interface ProductFilter {
  search: string;
  categoryId: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  onlyInStock: boolean;
  onlyDiscounted: boolean;
}