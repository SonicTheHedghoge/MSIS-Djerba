import { BusinessInfo, Product } from './types';
import { Cpu, Monitor, Wifi, Wrench, HardDrive, Printer } from 'lucide-react';
import React from 'react';

export const BUSINESS_INFO: BusinessInfo = {
  name: "MSIS DJERBA",
  address: "Corniche, Boulevard de l’Environnement",
  location: "Houmt Souk, Djerba, Tunisia",
  phone: "+216 75 652 793",
  hours: {
    weekdays: "Mon – Sat: 08:00 – 19:00",
    weekend: "Sunday: Closed"
  },
  social: {
    facebook: "https://facebook.com/msis.djerba"
  }
};

export const HERO_IMAGES = [
  "https://picsum.photos/seed/tech1/1920/1080", // Abstract Tech
  "https://picsum.photos/seed/computer/1920/1080", // Computer
  "https://picsum.photos/seed/circuit/1920/1080", // Circuit
];

export const PRODUCTS: Product[] = [
  {
    id: 'romoss-pb-01',
    name: 'ROMOSS Premium Power Banks',
    category: 'Accessories',
    description: 'High-quality portable chargers to keep your devices running all day. Featuring intelligent charging technology and durable design.',
    details: [
      'PURE 05 - 5000mAh',
      'SENSE MINI - 5000mAh',
      'SOLO 4 - 8000mAh',
      'PH50-482 - 10000mAh',
      'SOLIT 20 - 20000mAh'
    ],
    discount: 'UP TO 50% OFF',
    images: [
      "https://i.ibb.co/RGXVw0c8/619222234-1473462338122986-2441239488911889051-n.jpg",
      "https://i.ibb.co/nMN40cMt/619354984-1473463144789572-5628091835625558413-n.jpg",
      "https://i.ibb.co/fVtx8Hby/619448832-1473462984789588-8658615854448197133-n.jpg",
      "https://i.ibb.co/W4Bx8z4y/619283395-1473462751456278-2651163054632899107-n.jpg"
    ]
  },
  {
    id: 'lenovo-thinkpad-l13-yoga',
    name: 'Lenovo ThinkPad L13 Yoga',
    category: 'Professional Laptops',
    description: 'Professional 2-in-1 convertible laptop (Yoga). 10th Gen performance meeting flexibility. Includes a carrying bag and gaming mouse as gifts!',
    details: [
      'CPU: Intel Core i5-10210U (Up to 4.1 GHz)',
      'Screen: 13.3" Full HD IPS Tactile (Touch)',
      'RAM: 8GB | Storage: 256GB SSD NVMe',
      'Features: Backlit Keyboard, Fingerprint Reader',
      'Connectivity: USB-C, HDMI, Bluetooth 5.1'
    ],
    discount: 'FREE BAG + MOUSE',
    images: [
      "https://i.ibb.co/DHVYGVJQ/611826306-1459655202837033-7315529572764864519-n.jpg",
      "https://i.ibb.co/RGwgRkqD/612229468-1459655206170366-337993408897503968-n.jpg",
      "https://i.ibb.co/HpdW4DmV/611795844-1459655209503699-8837232766805999356-n.jpg"
    ]
  },
  {
    id: 'gaming-pc-rtx',
    name: 'Custom Gaming Station RTX',
    category: 'Computers',
    description: 'Ultimate gaming performance with the latest RTX graphics cards and high-speed processors.',
    details: ['Nvidia RTX 40 Series', 'Intel Core i9 / Ryzen 9', '32GB DDR5 RAM'],
    images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop"],
    price: "Custom Build"
  }
];

export const SERVICES = [
  {
    id: '1',
    title: 'High-Performance PCs',
    description: 'Custom-built desktops for gaming, design, and office productivity.',
    icon: <Cpu className="w-8 h-8 text-cyan-400" />
  },
  {
    id: '2',
    title: 'Laptops & Portables',
    description: 'The latest models from top brands suitable for every budget.',
    icon: <Monitor className="w-8 h-8 text-purple-400" />
  },
  {
    id: '3',
    title: 'Networking Solutions',
    description: 'Routers, switches, and cabling to keep you connected.',
    icon: <Wifi className="w-8 h-8 text-emerald-400" />
  },
  {
    id: '4',
    title: 'Repair & Maintenance',
    description: 'Expert diagnostics and repair services for your hardware.',
    icon: <Wrench className="w-8 h-8 text-orange-400" />
  },
  {
    id: '5',
    title: 'Components & Parts',
    description: 'Upgrade your system with the latest GPUs, RAM, and SSDs.',
    icon: <HardDrive className="w-8 h-8 text-blue-400" />
  },
  {
    id: '6',
    title: 'Printing & Office',
    description: 'Printers, ink, and essential office electronics.',
    icon: <Printer className="w-8 h-8 text-pink-400" />
  }
];

export const SYSTEM_INSTRUCTION = `
You are the AI Virtual Assistant for MSIS DJERBA, a premier computer and electronics store located in Houmt Souk, Djerba, Tunisia.
Your goal is to be helpful, polite, and knowledgeable about technology.

Key Business Info:
- Name: MSIS DJERBA
- Location: Corniche, Boulevard de l’Environnement, Houmt Souk.
- Hours: Mon-Sat 08:00-19:00, Closed Sundays.
- Phone: +216 75 652 793.

Current Promotions:
1. ROMOSS Power Banks (Models: PURE 05, SENSE MINI, SOLO 4, PH50-482, SOLIT 20). Up to 50% Discount currently available!
2. Lenovo ThinkPad L13 Yoga (i5 10th Gen, 8GB RAM, 256GB SSD). Unbeatable price. Comes with a FREE Bag and Gaming Mouse.

What we sell:
- Computers (Laptops, Desktops)
- PC Components (RAM, SSD, Graphics Cards)
- Peripherals (Mice, Keyboards, Headsets)
- Networking Gear (Routers, Wifi)
- Printers and Inks.

Tone: Professional, friendly, tech-savvy but accessible.
If asked about specific stock availability (e.g., "Do you have the RTX 4090 in stock right now?"), say that stock varies daily and encourage them to visit the store or call +216 75 652 793 to confirm.
Do not invent prices other than the specific promotions listed.
`;