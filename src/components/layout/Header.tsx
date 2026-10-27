import { Icon } from "../common/Icon";
type Props = {
  count: number;
  savedCount: number;
  savedActive: boolean;
  onHome: () => void;
  onSaved: () => void;
  onBag: () => void;
  onInfo: (value: "shipping" | "story") => void;
};
export function Header({
  count,
  savedCount,
  savedActive,
  onHome,
  onSaved,
  onBag,
  onInfo,
}: Props) {
  return (
    <>
      <div className="announcement">
        <span>Thoughtful things. A little closer to home.</span>
        <button onClick={() => onInfo("shipping")}>
          Complimentary shipping on orders $150+ <Icon name="arrow" size={14} />
        </button>
      </div>
      <header className="site-header">
        <div className="header-main">
          <a
            href="#"
            className="wordmark"
            aria-label="Form and Field home"
            onClick={(event) => {
              event.preventDefault();
              onHome();
            }}
          >
            form <span>&</span> field<span className="brand-period">.</span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#collection" className="active">
              The collection
            </a>
            <button onClick={() => onInfo("story")}>Our philosophy</button>
          </nav>
          <div className="header-actions">
            <span className="currency">US / USD</span>
            <button
              className={`icon-button saved-button ${savedActive ? "active" : ""}`}
              aria-label="View saved objects"
              aria-pressed={savedActive}
              onClick={onSaved}
            >
              <Icon name="heart" filled={savedActive} />
              {savedCount > 0 && (
                <span className="tiny-count">{savedCount}</span>
              )}
            </button>
            <button
              className="bag-button"
              aria-label={`Open shopping bag, ${count} items`}
              onClick={onBag}
            >
              <Icon name="bag" />
              <span className="bag-label">Bag</span>
              <span className="bag-count">{count}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
