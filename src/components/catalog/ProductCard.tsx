import type { Product } from "../../types";
import { money } from "../../lib/shop";
import { Icon } from "../common/Icon";
export function ProductCard({
  product: p,
  favorite,
  onFavorite,
  onView,
  onAdd,
  atLimit,
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  onView: () => void;
  onAdd: () => void;
  atLimit: boolean;
}) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button
          className="product-image-button"
          onClick={onView}
          aria-label={`View ${p.name}`}
        >
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            width="500"
            height="500"
          />
          <span className="quick-view">
            Discover the details <Icon name="arrow" size={16} />
          </span>
        </button>
        {p.badge && (
          <span
            className={`product-badge ${p.badge === "Sold out" ? "muted" : ""}`}
          >
            {p.badge}
          </span>
        )}
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          aria-label={`${favorite ? "Unsave" : "Save"} ${p.name}`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Icon name="heart" size={18} filled={favorite} />
        </button>
      </div>
      <div className="product-meta">
        <span>{p.category}</span>
        <span
          className="color-dot"
          style={{ background: p.color }}
          aria-label="Product color"
        />
      </div>
      <div className="product-title-row">
        <button className="product-title" onClick={onView}>
          {p.name}
        </button>
        <button
          className="quick-add"
          disabled={!p.stock || atLimit}
          aria-label={`Add ${p.name} to bag`}
          onClick={onAdd}
        >
          <Icon name={atLimit ? "check" : "plus"} size={19} />
        </button>
      </div>
      <div className="product-price">
        {money(p.price)}{" "}
        {p.previousPrice && <del>{money(p.previousPrice)}</del>}
        <span className="stock-note">
          {!p.stock ? "Back soon" : p.stock <= 3 ? `Only ${p.stock} left` : ""}
        </span>
      </div>
    </article>
  );
}
