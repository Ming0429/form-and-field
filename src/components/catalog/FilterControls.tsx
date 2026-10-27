import { useId } from "react";
import type { Filters, Product, Category } from "../../types";
import { money } from "../../lib/shop";
import { Icon } from "../common/Icon";
type Props = {
  filters: Filters;
  products: Product[];
  categories: Category[];
  maxPrice: number;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
};
export function FilterControls({
  filters,
  products,
  categories,
  maxPrice,
  onChange,
  onReset,
}: Props) {
  const id = useId();
  return (
    <>
      <div className="filter-section">
        <div className="filter-section-title">
          Collections <span>—</span>
        </div>
        <div className="category-options">
          {categories.map((category) => (
            <button
              key={category}
              className={filters.category === category ? "selected" : ""}
              aria-pressed={filters.category === category}
              onClick={() => onChange({ category })}
            >
              <span>{category}</span>
              <span>
                {category === "All objects"
                  ? products.length
                  : products.filter((p) => p.category === category).length}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <label className="filter-section-title" htmlFor={id}>
          Price range <span>—</span>
        </label>
        <div className="price-range-label">
          <span>$0</span>
          <strong>Up to {money(filters.maxPrice)}</strong>
        </div>
        <input
          id={id}
          aria-label="Maximum price"
          type="range"
          min="2500"
          max={maxPrice}
          step="2500"
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
        />
      </div>
      <div className="filter-section">
        <label className="stock-filter">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
          />
          <span>In-stock objects only</span>
        </label>
      </div>
      <button className="reset-filter" onClick={onReset}>
        Reset all filters <Icon name="return" size={15} />
      </button>
    </>
  );
}
