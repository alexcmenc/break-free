import { Link } from "react-router-dom";

export default function HomePage() {
  // Motivational quotes
  const quotes = [
    "One day at a time.",
    "Small steps every day lead to big change.",
    "Your journey is your strength.",
    "Recovery is progress, not perfection.",
    "Believe you can and you're halfway there.",
    "Every step forward is a step toward success.",
    "Recovery is not a race. You don’t have to feel guilty if it takes you longer than you thought it would.",
    "The chains of addiction are too light to be felt until they are too heavy to be broken — break them while you can.",
    "Your future needs you. Your past does not.",
    "Don’t let the substance define you. Let your strength redefine you.",
    "Each day is a new chance to build the life you deserve.",
    "Healing doesn’t mean the damage never existed. It means it no longer controls your life.",
    "Recovery is hard, but regret is harder.",
    "You are allowed to be both a masterpiece and a work in progress.",
    "Addiction is giving up everything for one thing. Recovery is giving up one thing for everything.",
    "Be stronger than your strongest excuse.",
    "Rock bottom became the solid foundation on which I rebuilt my life.",
    "The comeback is always stronger than the setback.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // ocean
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // mountain
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // forest
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // sunrise
  ];
  const randomImage = heroImages[Math.floor(Math.random() * heroImages.length)];

  return (
    <div className="page page-home">
      {/* Hero Section */}
      <div className="hero">
        <img src={randomImage} alt="Calm background" className="hero-img" />
        <div className="hero-overlay">
          <h1 className="hero-title">Break Free</h1>
          <p className="hero-subtitle">
            Track your recovery journey with hope and strength.
          </p>
        </div>
      </div>

      {/* Quote */}
      <p className="quote">“{randomQuote}”</p>

      {/* Actions */}
      <div className="actions">
        <Link className="btn btn-primary" to="/login">
          Log in
        </Link>
        <Link className="btn" to="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
