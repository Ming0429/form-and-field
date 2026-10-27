import { useState } from "react";
import type { CartItem, Product } from "../../types";
import {
  calculateTotals,
  FREE_SHIPPING_THRESHOLD,
  money,
} from "../../lib/shop";
import { Icon } from "../common/Icon";
import { QuantityControl } from "../common/QuantityControl";
import { Modal } from "../common/Modal";
export function Cart({
  items,
  products,
  onClose,
  onQuantity,
}: {
  items: CartItem[];
  products: Product[];
  onClose: () => void;
  onQuantity: (product: Product, quantity: number) => void;
}) {
  const totals = calculateTotals(items, products);
  const [review, setReview] = useState(false);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
  return (
    <Modal title="Shopping bag" className="cart-dialog" onClose={onClose}>
      <div className="cart-shell">
        <header className="cart-heading">
          <span className="eyebrow">GOOD THINGS, WELL CHOSEN</span>
          <h2>
            {review ? "Your order preview" : "Your bag"}{" "}
            <span>({totals.count})</span>
          </h2>
        </header>
        {!items.length ? (
          <div className="empty-bag">
            <div className="empty-icon">
              <Icon name="bag" size={36} />
            </div>
            <h3>A little room for something lovely.</h3>
            <p>
              Your bag is empty. Discover objects that make the everyday feel a
              little better.
            </p>
            <button className="button primary" onClick={onClose}>
              Explore the collection <Icon name="arrow" size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="shipping-progress">
              <p>
                <Icon name="truck" size={18} />
                {remaining ? (
                  <>
                    You're <strong>{money(remaining)}</strong> away from free
                    shipping.
                  </>
                ) : (
                  <>
                    A little perk: <strong>shipping is on us.</strong>
                  </>
                )}
              </p>
              <div>
                <span
                  style={{
                    width: `${Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
            {review && (
              <div className="demo-notice" role="status">
                <Icon name="check" />
                <div>
                  <strong>Your selection is ready to review.</strong>
                  <p>
                    This is a shopping demo. No order has been placed and no
                    payment will be collected.
                  </p>
                </div>
              </div>
            )}
            <div className="cart-items">
              {items.map((item) => {
                const p = products.find((p) => p.id === item.id)!;
                return (
                  <article className="cart-item" key={p.id}>
                    <img src={p.image} alt={p.name} />
                    <div className="cart-item-info">
                      <span className="eyebrow">{p.category}</span>
                      <h3>{p.name}</h3>
                      <p>{money(p.price)}</p>
                      <div className="cart-item-controls">
                        <QuantityControl
                          value={item.quantity}
                          min={0}
                          max={p.stock}
                          label={p.name}
                          onChange={(quantity) => {
                            onQuantity(p, quantity);
                            setReview(false);
                          }}
                        />
                        <button
                          className="text-button remove-button"
                          onClick={() => {
                            onQuantity(p, 0);
                            setReview(false);
                          }}
                          aria-label={`Remove ${p.name}`}
                        >
                          Remove
                        </button>
                      </div>
                      {item.quantity >= p.stock && (
                        <small className="stock-note">
                          Stock limit reached
                        </small>
                      )}
                    </div>
                    <strong className="line-total">
                      {money(p.price * item.quantity)}
                    </strong>
                  </article>
                );
              })}
            </div>
            <footer className="cart-summary">
              <div>
                <span>Subtotal</span>
                <span>{money(totals.subtotal)}</span>
              </div>
              <div>
                <span>Estimated shipping</span>
                <span>
                  {totals.shipping ? money(totals.shipping) : "Complimentary"}
                </span>
              </div>
              <div className="cart-total">
                <span>Estimated total</span>
                <strong>
                  {money(totals.total)} <small>USD</small>
                </strong>
              </div>
              <p className="fine-print">
                Tax is not included. Prices and shipping are simulated.
              </p>
              <button
                className="button primary"
                onClick={() => setReview(!review)}
              >
                {review ? "Back to your bag" : "Review order"}
                <Icon name="arrow" size={18} />
              </button>
              <button
                className="text-button continue-shopping"
                onClick={onClose}
              >
                Continue exploring
              </button>
            </footer>
          </>
        )}
      </div>
    </Modal>
  );
}
