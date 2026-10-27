import { Icon } from "../common/Icon";
export function Footer({
  onShop,
  onShipping,
}: {
  onShop: () => void;
  onShipping: () => void;
}) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <a
          href="#"
          className="wordmark"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          form <span>&</span> field.
        </a>
        <div>
          <button onClick={onShop}>Shop the collection</button>
          <button onClick={onShipping}>Shipping & returns</button>
          <span>
            <Icon name="globe" size={15} /> English · USD
          </span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Form & Field. An independent shopping demo.</span>
        <span>Sample products. No real payments or orders.</span>
      </div>
    </footer>
  );
}
