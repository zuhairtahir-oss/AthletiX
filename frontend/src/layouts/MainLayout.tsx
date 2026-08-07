import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

/**
 * Root application shell: sticky nav + routed page content + footer.
 * Every route renders inside the <main> via <Outlet />.
 */
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
