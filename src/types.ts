export type Category =
  "All objects" | "Furniture" | "Lighting" | "Decor" | "Everyday";
export type Product = {
  id: string;
  name: string;
  category: Exclude<Category, "All objects">;
  price: number;
  previousPrice?: number;
  image: string;
  color: string;
  description: string;
  material: string;
  dimensions: string;
  stock: number;
  badge?: string;
  featured: number;
};
export type CartItem = { id: string; quantity: number };
export type Filters = {
  query: string;
  category: Category;
  maxPrice: number;
  inStockOnly: boolean;
  sort: string;
  favoritesOnly: boolean;
};
