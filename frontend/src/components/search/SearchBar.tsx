import { Search } from "lucide-react";
import { Input } from "../ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      icon={<Search className="h-4 w-4" aria-hidden="true" />}
      placeholder={placeholder}
      type="search"
      aria-label={placeholder}
    />
  );
}
