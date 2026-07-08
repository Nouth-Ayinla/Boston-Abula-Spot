import { type StaticImageData } from "next/image";
import heroAmala from "@/assets/hero-amala.png";
import assortedMeat from "@/assets/dish-assorted-meat.png";
import plantain from "@/assets/dish-plantain.png";
import egusi from "@/assets/dish-egusi.png";
import efoRiro from "@/assets/dish-efo-riro.png";
import poundedYam from "@/assets/dish-pounded-yam.png";
import ewedu from "@/assets/dish-ewedu-gbegiri.png";
import zobo from "@/assets/dish-zobo.png";
import semo from "@/assets/dish-semo with efo-riro.png";
import amalaBuilder from "@/assets/Amala1.png";
import jollof from "@/assets/dish-jollof.png";
import semoWrap from "@/assets/semo-wrap.png";
import ebaWrap from "@/assets/eba-wrap.png";
import fanta from "@/assets/drink-fanta.png";

export const images = {
  heroAmala,
  assortedMeat,
  plantain,
  egusi,
  efoRiro,
  poundedYam,
  ewedu,
  zobo,
  semo,
  amalaBuilder,
  jollof,
  semoWrap,
  ebaWrap,
  fanta,
};

export type Category = "Signature" | "Soups" | "Swallows" | "Proteins" | "Sides" | "Drinks";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: StaticImageData | string;
}

export const CATEGORIES: Category[] = [
  "Signature",
  "Soups",
  "Swallows",
  "Proteins",
  "Sides",
  "Drinks",
];

export const MENU: MenuItem[] = [
  {
    id: "abula-classic",
    name: "Classic Abula Bowl",
    description: "Amala, ewedu & gbegiri with assorted meats in palm-oil stew",
    price: 4500,
    category: "Signature",
    image: heroAmala,
  },
  {
    id: "jollof-rice",
    name: "Smoky Jollof Rice",
    description: "Authentic party-style smoky Jollof rice, served with fried chicken and sweet dodo",
    price: 4200,
    category: "Signature",
    image: jollof,
  },
  {
    id: "semo-efo-riro",
    name: "Semo & Efo Riro",
    description: "Smooth semolina swallow served with rich, savory spinach stew (Efo Riro)",
    price: 3500,
    category: "Signature",
    image: semo,
  },
  {
    id: "ewedu-gbegiri",
    name: "Ewedu & Gbegiri",
    description: "Silky jute leaf soup swirled with beans soup",
    price: 1500,
    category: "Soups",
    image: ewedu,
  },
  {
    id: "egusi",
    name: "Egusi Soup",
    description: "Melon seed soup with spinach & beef",
    price: 2200,
    category: "Soups",
    image: egusi,
  },
  {
    id: "efo-riro",
    name: "Efo Riro",
    description: "Rich vegetable stew with smoked fish",
    price: 2200,
    category: "Soups",
    image: efoRiro,
  },
  {
    id: "amala",
    name: "Amala",
    description: "Soft yam-flour swallow, one wrap",
    price: 500,
    category: "Swallows",
    image: amalaBuilder,
  },
  {
    id: "pounded-yam",
    name: "Pounded Yam",
    description: "Smooth hand-pounded yam, one wrap",
    price: 600,
    category: "Swallows",
    image: poundedYam,
  },
  {
    id: "semo-swallow",
    name: "Semolina (Semo)",
    description: "Smooth and light semolina swallow, one wrap",
    price: 500,
    category: "Swallows",
    image: semoWrap,
  },
  {
    id: "eba-swallow",
    name: "Eba (Yellow Garri)",
    description: "Traditional swallow made from yellow cassava flakes, one wrap",
    price: 400,
    category: "Swallows",
    image: ebaWrap,
  },
  {
    id: "assorted-meat",
    name: "Assorted Meats",
    description: "Shaki, ponmo & beef in pepper stew",
    price: 2000,
    category: "Proteins",
    image: assortedMeat,
  },
  {
    id: "dodo",
    name: "Fried Plantain (Dodo)",
    description: "Golden ripe plantain slices",
    price: 1200,
    category: "Sides",
    image: plantain,
  },
  {
    id: "zobo",
    name: "Chilled Zobo",
    description: "Hibiscus drink with lime & ginger",
    price: 800,
    category: "Drinks",
    image: zobo,
  },
  {
    id: "fanta",
    name: "Fanta Orange",
    description: "Chilled refreshing orange soda bottle",
    price: 600,
    category: "Drinks",
    image: fanta,
  },
];

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export const getImgSrc = (image: StaticImageData | string | undefined): string | undefined => {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return image.src;
};
