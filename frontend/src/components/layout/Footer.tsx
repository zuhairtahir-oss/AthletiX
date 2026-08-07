import { Logo } from "../brand/Logo";

/**
 * Minimal footer. No fake social links or newsletter signup — just
 * brand mark and a data attribution line (required since the app
 * consumes a third-party sports API).
 */
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <Logo />
        <p className="text-xs text-text-muted">
          Data provided by sports APIs. Built for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
