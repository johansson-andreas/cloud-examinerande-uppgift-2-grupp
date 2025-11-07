import React, { useState } from "react";
import { SearchIcon } from "./icons/Search";
import { EnterIcon } from "./icons/Enter";

interface SearchProps {
  onSearch: (term: string) => void | Promise<void>;
  input?: string;
  isLoading?: boolean;
}

export default function Search({
  onSearch,
  input = "",
  isLoading = false,
}: SearchProps) {
  const [term, setTerm] = useState<string>(input);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await Promise.resolve(onSearch(term));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <input
        type="text"
        value={term}
        onChange={handleChange}
        placeholder="Search entries..."
        className="input-field text-xl font-serif px-12"
      />
      <div className="absolute top-0 bottom-0 left-3 flex justify-center items-center">
        <SearchIcon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="absolute right-2 top-1 bottom-1 flex items-center justify-center">
        <button
          type="submit"
          className="btn-search"
          aria-label="Submit search"
          disabled={isLoading}
        >
          <EnterIcon className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
