import { Header } from "./components/layout/Header";
import { Hero } from "./components/layout/Hero";
import { Footer } from "./components/layout/Footer";
import { useEffect, useRef, useState } from "react";
import { products, categories } from "./data/products";
import type { Product, Filters, Category } from "./types";
import { calculateTotals, filterProducts, money } from "./lib/shop";
import { Icon } from "./components/common/Icon";
import { Modal } from "./components/common/Modal";
import { ProductCard } from "./components/catalog/ProductCard";
import { ProductDetail } from "./components/catalog/ProductDetail";
import { Cart } from "./components/cart/Cart";
import { FilterControls } from "./components/catalog/FilterControls";
import { useShopStore } from "./hooks/useShopStore";

const defaults: Filters = {
  query: "",
  category: "All objects",
  maxPrice: 100000,
  inStockOnly: false,
  sort: "featured",
  favoritesOnly: false,
};
export default function App() {
  const [filters, setFilters] = useState<Filters>(defaults);
  const {
    cart,
    favorites,
    storageWarning,
    addItem,
    changeQuantity,
    toggleFavorite,
  } = useShopStore(products);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [info, setInfo] = useState<"shipping" | "story" | null>(null);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const collectionRef = useRef<HTMLElement>(null);
  const totals = calculateTotals(cart, products);
  const visible = filterProducts(products, filters, favorites);
  const activeFilters =
    Number(filters.maxPrice < defaults.maxPrice) +
    Number(filters.inStockOnly) +
    Number(filters.category !== "All objects");
  useEffect(() => () => clearTimeout(timer.current), []);
  function notify(text: string) {
    clearTimeout(timer.current);
    setToast(text);
    timer.current = setTimeout(() => setToast(""), 3800);
  }
  function add(product: Product, quantity = 1) {
    addItem(product, quantity);
    notify(`${product.name} added to your bag`);
  }
  function scrollToCollection() {
    collectionRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function chooseCategory(category: Category) {
    setFilters((f) => ({ ...f, category, favoritesOnly: false }));
    scrollToCollection();
  }
  function clearFilters() {
    setFilters(defaults);
  }
  const filterControls = (
    <FilterControls
      filters={filters}
      products={products}
      categories={categories}
      maxPrice={defaults.maxPrice}
      onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
      onReset={clearFilters}
    />
  );
  return (
    <>
      <a href="#collection" className="skip-link">
        Skip to products
      </a>
      <Header
        count={totals.count}
        savedCount={favorites.length}
        savedActive={filters.favoritesOnly}
        onHome={() => {
          clearFilters();
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        onSaved={() => {
          setFilters({ ...defaults, favoritesOnly: !filters.favoritesOnly });
          scrollToCollection();
        }}
        onBag={() => setCartOpen(true)}
        onInfo={setInfo}
      />
      <main>
        <Hero
          onExplore={() => {
            clearFilters();
            scrollToCollection();
          }}
        />
        <section
          id="collection"
          className="collection section-container"
          ref={collectionRef}
          aria-labelledby="collection-title"
        >
          <div className="collection-heading">
            <div>
              <span className="eyebrow">THE EDIT, JUST FOR YOU</span>
              <h2 id="collection-title">
                {filters.favoritesOnly
                  ? "Your saved objects"
                  : "Objects worth coming home to"}
                <span>.</span>
              </h2>
            </div>
            <p>
              A little function. A little feeling.
              <br />
              Find the pieces that belong in your everyday.
            </p>
          </div>
          <div className="collection-toolbar">
            <div className="collection-tabs">
              <button
                className={!filters.favoritesOnly ? "current" : ""}
                onClick={() =>
                  setFilters((f) => ({ ...f, favoritesOnly: false }))
                }
              >
                The collection <span>{products.length}</span>
              </button>
              <button
                className={filters.favoritesOnly ? "current" : ""}
                onClick={() =>
                  setFilters((f) => ({ ...f, favoritesOnly: true }))
                }
              >
                Saved objects <span>{favorites.length}</span>
              </button>
            </div>
            <form
              className="search-box"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                scrollToCollection();
              }}
            >
              <Icon name="search" size={18} />
              <input
                aria-label="Search products"
                placeholder="Find something lovely..."
                value={filters.query}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, query: e.target.value }))
                }
              />
              {filters.query && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => setFilters((f) => ({ ...f, query: "" }))}
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </form>
          </div>
          <div className="catalog-layout">
            <aside className="desktop-filters" aria-label="Product filters">
              {!filterOpen && filterControls}
              <div className="sidebar-note">
                <Icon name="leaf" size={24} />
                <h3>
                  Fewer things.
                  <br />
                  Better moments.
                </h3>
                <p>
                  Surround yourself with objects you love, and leave room for
                  living.
                </p>
              </div>
            </aside>
            <div className="catalog-results">
              <div className="results-toolbar">
                <span role="status" aria-live="polite">
                  {visible.length} {visible.length === 1 ? "object" : "objects"}
                  {filters.query ? ` for “${filters.query}”` : ""}
                </span>
                <button
                  className="mobile-filter-button"
                  onClick={() => setFilterOpen(true)}
                >
                  <Icon name="filter" size={17} /> Filters
                  {activeFilters > 0 && <span>{activeFilters}</span>}
                </button>
                <label className="sort-control">
                  <span>Sort by:</span>
                  <select
                    aria-label="Sort products"
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, sort: e.target.value }))
                    }
                  >
                    <option value="featured">Our favorites</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </label>
              </div>
              {(activeFilters > 0 || filters.query) && (
                <div className="active-filters">
                  {filters.category !== "All objects" && (
                    <button
                      onClick={() =>
                        setFilters((f) => ({ ...f, category: "All objects" }))
                      }
                    >
                      {filters.category}
                      <Icon name="close" size={13} />
                    </button>
                  )}
                  {filters.maxPrice < defaults.maxPrice && (
                    <button
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          maxPrice: defaults.maxPrice,
                        }))
                      }
                    >
                      Under {money(filters.maxPrice)}
                      <Icon name="close" size={13} />
                    </button>
                  )}
                  {filters.inStockOnly && (
                    <button
                      onClick={() =>
                        setFilters((f) => ({ ...f, inStockOnly: false }))
                      }
                    >
                      In stock
                      <Icon name="close" size={13} />
                    </button>
                  )}
                  <button className="clear-all" onClick={clearFilters}>
                    Clear all
                  </button>
                </div>
              )}
              {visible.length ? (
                <div className="product-grid">
                  {visible.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      favorite={favorites.includes(p.id)}
                      onFavorite={() => toggleFavorite(p.id)}
                      onView={() => setSelected(p)}
                      onAdd={() => add(p)}
                      atLimit={
                        (cart.find((i) => i.id === p.id)?.quantity || 0) >=
                        p.stock
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <Icon
                    name={filters.favoritesOnly ? "heart" : "search"}
                    size={36}
                  />
                  <h3>
                    {filters.favoritesOnly && !favorites.length
                      ? "Keep the things you love close."
                      : "A little too well hidden."}
                  </h3>
                  <p>
                    {filters.favoritesOnly && !favorites.length
                      ? "Tap the heart on any object to save it here."
                      : "No objects match this selection. Try another search or give your filters a little more room."}
                  </p>
                  <button className="button primary" onClick={clearFilters}>
                    Explore all objects <Icon name="arrow" size={17} />
                  </button>
                </div>
              )}
              {visible.length > 0 && (
                <div className="catalog-end">
                  <span /> You've seen all {visible.length} objects. Good things
                  take their time. <span />
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="story-strip" id="story">
          <div className="story-symbol">
            f<span>&</span>f
          </div>
          <div>
            <span className="eyebrow">A MORE CONSIDERED EVERYDAY</span>
            <h2>
              Not more. <em>More meaningful.</em>
            </h2>
            <p>
              We believe the best spaces aren't filled overnight. They're
              collected, piece by piece,
              <br className="desktop-break" /> with things that feel right.
              Start with something you love.
            </p>
          </div>
          <button className="text-link" onClick={() => setInfo("story")}>
            Our philosophy <Icon name="arrow" size={18} />
          </button>
        </section>
      </main>
      <Footer
        onShop={() => chooseCategory("All objects")}
        onShipping={() => setInfo("shipping")}
      />
      {selected && (
        <ProductDetail
          product={selected}
          inBag={cart.find((i) => i.id === selected.id)?.quantity || 0}
          onClose={() => setSelected(null)}
          onAdd={(qty) => add(selected, qty)}
          onBag={() => {
            setSelected(null);
            setCartOpen(true);
          }}
        />
      )}
      {cartOpen && (
        <Cart
          items={cart}
          products={products}
          onClose={() => setCartOpen(false)}
          onQuantity={changeQuantity}
        />
      )}
      {filterOpen && (
        <Modal
          title="Product filters"
          className="filter-dialog"
          onClose={() => setFilterOpen(false)}
        >
          <div className="filter-dialog-content">
            <span className="eyebrow">FIND YOUR EVERYDAY</span>
            <h2>Refine your collection</h2>
            {filterControls}
            <button
              className="button primary"
              onClick={() => setFilterOpen(false)}
            >
              Show {visible.length} objects <Icon name="arrow" size={18} />
            </button>
          </div>
        </Modal>
      )}
      {info && (
        <Modal
          title={
            info === "shipping" ? "Shipping and returns" : "Our philosophy"
          }
          className="info-dialog"
          onClose={() => setInfo(null)}
        >
          <div className="info-content">
            <Icon name={info === "shipping" ? "truck" : "leaf"} size={32} />
            <span className="eyebrow">FORM & FIELD</span>
            <h2>
              {info === "shipping"
                ? "Good things, delivered."
                : "Fewer things. Better moments."}
            </h2>
            {info === "shipping" ? (
              <>
                <p>
                  Our demo shipping policy keeps things simple:{" "}
                  <strong>$8 flat-rate shipping</strong>, or{" "}
                  <strong>
                    complimentary shipping on orders of $150 or more
                  </strong>
                  .
                </p>
                <p>
                  Estimated delivery: 5–8 business days. Returns are accepted
                  within 30 days for unused items in their original packaging.
                </p>
                <p className="info-disclaimer">
                  This is a sample storefront. Products, stock, delivery times,
                  and return policies are simulated. No purchases, payments, or
                  deliveries take place.
                </p>
              </>
            ) : (
              <>
                <p>
                  A home isn't a checklist. It's a collection of small
                  decisions, familiar rituals, and things that make you feel at
                  ease.
                </p>
                <p>
                  Form & Field is a concept store for considered living. We
                  bring furniture, light, and everyday objects into one quiet
                  collection — so you can find something you love, without the
                  noise.
                </p>
                <p className="info-disclaimer">
                  An original React shopping demo, created for the Presence
                  frontend exercise. Product imagery is illustrative.
                </p>
              </>
            )}
            <button
              className="button primary"
              onClick={() => {
                setInfo(null);
                scrollToCollection();
              }}
            >
              Meet the collection <Icon name="arrow" size={18} />
            </button>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={19} />
          <span>{toast}</span>
          <button
            onClick={() => {
              setSelected(null);
              setCartOpen(true);
              setToast("");
            }}
          >
            View bag <Icon name="arrow" size={15} />
          </button>
        </div>
      )}
      {storageWarning && (
        <div className="storage-warning" role="status">
          Browser storage is unavailable. Your bag works, but won't be saved
          after closing this page.
        </div>
      )}
    </>
  );
}
