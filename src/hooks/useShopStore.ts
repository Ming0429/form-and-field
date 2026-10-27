import { useEffect, useState } from "react";
import type { CartItem, Product } from "../types";
import { restoreCart, setQuantity } from "../lib/shop";
import { readStorage, writeStorage, restoreSavedIds } from "../lib/storage";

const CART_KEY = "form-field.cart.v1";
const SAVED_KEY = "form-field.saved.v1";

/** Owns persistence and cart mutations; catalog/UI do not depend on browser storage. */
export function useShopStore(products: Product[]) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    restoreCart(readStorage(CART_KEY), products),
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    restoreSavedIds(
      readStorage(SAVED_KEY),
      products.map((p) => p.id),
    ),
  );
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    const cartSaved = writeStorage(CART_KEY, cart);
    const favoritesSaved = writeStorage(SAVED_KEY, favorites);
    setStorageWarning(!cartSaved || !favoritesSaved);
  }, [cart, favorites]);

  return {
    cart,
    favorites,
    storageWarning,
    addItem(product: Product, quantity = 1) {
      setCart((current) =>
        setQuantity(
          current,
          product,
          (current.find((item) => item.id === product.id)?.quantity || 0) +
            quantity,
        ),
      );
    },
    changeQuantity(product: Product, quantity: number) {
      setCart((current) => setQuantity(current, product, quantity));
    },
    toggleFavorite(id: string) {
      setFavorites((current) =>
        current.includes(id)
          ? current.filter((value) => value !== id)
          : [...current, id],
      );
    },
  };
}
