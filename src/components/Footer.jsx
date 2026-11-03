export default function Footer() {
  return (
    <footer className="mt-10 flex flex-wrap justify-between gap-4 px-4 text-lg text-muted">
      <span>DEVLOG</span>
      <span>
        <a href="#problems" className="hover:text-ink">Problems</a> ·{" "}
        <a href="/privacy" className="hover:text-ink">Privacy</a> ·{" "}
        <a href="/contact" className="hover:text-ink">Contact</a>
      </span>
    </footer>
  );
}