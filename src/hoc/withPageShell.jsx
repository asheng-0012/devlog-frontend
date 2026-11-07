import MainNavbar from "../components/MainNavbar";

// HOC: takes a page component, returns it wrapped with the card + fixed navbar
export default function withPageShell(Component) {
  function PageShell(props) {
    return (
      <div className="p-3 md:p-8">
        <div className="mx-auto max-w-[1472px] rounded-3xl bg-surface p-5 pb-28 md:min-h-[calc(100vh-4rem)] md:rounded-[36px] md:p-8 md:pb-8 md:pl-[140px]">
          <MainNavbar />
          <main className="min-w-0">
            <Component {...props} />
          </main>
        </div>
      </div>
    );
  }

  PageShell.displayName = `withPageShell(${Component.displayName || Component.name || "Page"})`;
  return PageShell;
}