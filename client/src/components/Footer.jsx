export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        © {new Date().getFullYear()} Break Free — Built with ❤️
      </p>
      <div className="footer-links">
        <a href="/resources" className="footer-link">Resources</a>
        <a href="/about" className="footer-link">About</a>
        <a href="/contact" className="footer-link">Contact</a>
      </div>
    </footer>
  );
}
