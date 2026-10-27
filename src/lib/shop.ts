import type { Product, Filters, CartItem } from "../types.ts";
export const FREE_SHIPPING_THRESHOLD = 15000;
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
export function filterProducts(
  products: Product[],
  filters: Filters,
  favorites: string[],
): Product[] {
  const query = filters.query.trim().toLowerCase();
  return products
    .filter(
      (p) =>
        (!query ||
          `${p.name} ${p.category} ${p.material} ${p.color} ${p.description}`
            .toLowerCase()
            .includes(query)) &&
        (filters.category === "All objects" ||
          p.category === filters.category) &&
        p.price <= filters.maxPrice &&
        (!filters.inStockOnly || p.stock > 0) &&
        (!filters.favoritesOnly || favorites.includes(p.id)),
    )
    .sort((a, b) =>
      filters.sort === "price-asc"
        ? a.price - b.price
        : filters.sort === "price-desc"
          ? b.price - a.price
          : filters.sort === "name"
            ? a.name.localeCompare(b.name)
            : a.featured - b.featured,
    );
}
export function setQuantity(
  cart: CartItem[],
  product: Product,
  quantity: number,
): CartItem[] {
  const next = Number.isFinite(quantity)
    ? Math.max(0, Math.min(product.stock, Math.floor(quantity)))
    : 0;
  const others = cart.filter((item) => item.id !== product.id);
  if (!next) return others;
  return cart.some((item) => item.id === product.id)
    ? cart.map((item) =>
        item.id === product.id ? { ...item, quantity: next } : item,
      )
    : [...others, { id: product.id, quantity: next }];
}
export function restoreCart(
  raw: string | null,
  products: Product[],
): CartItem[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(value)) return [];
    return value.reduce<CartItem[]>((cart, item) => {
      if (
        !item ||
        typeof item.id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      )
        return cart;
      const product = products.find((p) => p.id === item.id);
      return product
        ? setQuantity(
            cart,
            product,
            (cart.find((p) => p.id === item.id)?.quantity || 0) + item.quantity,
          )
        : cart;
    }, []);
  } catch {
    return [];
  }
}
export function calculateTotals(cart: CartItem[], products: Product[]) {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (products.find((p) => p.id === item.id)?.price || 0) * item.quantity,
    0,
  );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? 800 : 0;
  return { subtotal, shipping, total: subtotal + shipping, count };
}
