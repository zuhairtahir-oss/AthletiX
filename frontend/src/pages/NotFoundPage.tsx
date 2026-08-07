import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="mt-2 text-xl font-semibold text-text">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="secondary">Back to home</Button>
      </Link>
    </div>
  );
}
