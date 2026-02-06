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

export interface Product {
  id: string;
  name: string;
  description: string;
  details: string[];
  price?: string;
  discount?: string;
  images: string[];
  category: string;
}