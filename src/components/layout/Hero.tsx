import { Icon } from "../common/Icon";
export function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="small-line" /> LESS, BUT LOVELIER
          </div>
          <h1 id="hero-title">
            Good things.
            <br />
            For <em>everyday</em>
            <br />
            living.
          </h1>
          <p>
            Considered objects. Natural textures. Little things
            <br className="desktop-break" /> that make a space feel more like
            you.
          </p>
          <button className="button primary" onClick={onExplore}>
            Explore the collection <Icon name="arrow" size={19} />
          </button>
          <div className="hero-footnote">
            <span className="mini-star">✳</span> Thoughtfully chosen. Made to be
            kept.
          </div>
        </div>
        <div className="hero-visual">
          <img
            src={`${import.meta.env.BASE_URL}images/hero.jpg`}
            alt="A calm, sunlit living room with natural wood furniture, neutral upholstery, and leafy plants"
            fetchPriority="high"
          />
          <div className="hero-tag">
            <span>THE SLOW LIVING EDIT</span>
            <span>01 / 2026</span>
          </div>
          <div className="hero-photo-note">
            <span>A home, a little more you.</span>
            <span className="round-arrow">
              <Icon name="arrow" size={24} />
            </span>
          </div>
        </div>
      </section>
      <section className="benefits" aria-label="Shopping benefits">
        <div>
          <Icon name="leaf" />
          <span>Considered by design</span>
          <small>Good objects, chosen with care</small>
        </div>
        <div>
          <Icon name="truck" />
          <span>A little perk, on us</span>
          <small>Free shipping on orders $150+</small>
        </div>
        <div>
          <Icon name="return" />
          <span>Find your perfect fit</span>
          <small>Simple, 30-day returns</small>
        </div>
      </section>
    </>
  );
}
