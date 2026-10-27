import { useState } from "react";
import type { Product } from "../../types";
import { money } from "../../lib/shop";
import { Icon } from "../common/Icon";
import { QuantityControl } from "../common/QuantityControl";
import { Modal } from "../common/Modal";
export function ProductDetail({
  product: p,
  inBag,
  onClose,
  onAdd,
  onBag,
}: {
  product: Product;
  inBag: number;
  onClose: () => void;
  onAdd: (quantity: number) => void;
  onBag: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const available = Math.max(0, p.stock - inBag);
  const selected = Math.min(quantity, available);
  return (
    <Modal title={p.name} onClose={onClose} className="product-dialog">
      <div className="detail-layout">
        <div className="detail-image">
          <img src={p.image} alt={p.name} />
          <span className="image-caption">
            A little more considered. A little more you.
          </span>
        </div>
        <div className="detail-content">
          <span className="eyebrow">
            THE {p.category.toUpperCase()} COLLECTION
          </span>
          <h2>{p.name}</h2>
          <div className="detail-price">
            {money(p.price)}{" "}
            {p.previousPrice && <del>{money(p.previousPrice)}</del>}
            <span>USD</span>
          </div>
          <p className="detail-description">{p.description}</p>
          <dl className="specs">
            <div>
              <dt>Material</dt>
              <dd>{p.material}</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd>{p.dimensions}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>
                {p.stock
                  ? `${p.stock} in stock${inBag ? ` · ${inBag} in your bag` : ""}`
                  : "Currently sold out"}
              </dd>
            </div>
          </dl>
          <div className="detail-actions">
            <QuantityControl
              value={available ? selected : 0}
              max={available}
              onChange={setQuantity}
            />
            <button
              className="button primary"
              disabled={!available}
              onClick={() => {
                onAdd(selected);
                setAdded(true);
                setQuantity(1);
              }}
            >
              {!p.stock
                ? "Sold out"
                : !available
                  ? "All available items in bag"
                  : "Add to bag"}
              <Icon name="bag" size={18} />
            </button>
          </div>
          {added && (
            <button className="added-link" onClick={onBag}>
              <Icon name="check" size={17} /> Added to your bag · View bag{" "}
              <Icon name="arrow" size={17} />
            </button>
          )}
          <div className="detail-promises">
            <span>
              <Icon name="truck" size={18} /> Free shipping on orders $150+
            </span>
            <span>
              <Icon name="return" size={18} /> 30-day returns, thoughtfully
              simple
            </span>
          </div>
          <p className="fine-print">
            Sample product and store policies for this shopping demo.
          </p>
        </div>
      </div>
    </Modal>
  );
}
