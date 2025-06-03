import { useEffect, useState } from "react";

export default function AutoComplete({ suggestions, onChange, onSelect }) {
  const [query, setQuery] = useState("");
  const [isShowSuggestions, setIsShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onChange(value);
  };
  const handleClear = () => {
    setQuery("");
  };
  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        onFocus={() => {
          setIsShowSuggestions(true);
        }}
      />
      <div className="absolute right-1 top-1 bottom-1 flex flex-row items-center gap-2 bg-white px-2">
        {query && (
          <button
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            &times;
          </button>
        )}
        <button
          className="bg-red-500 text-white px-2"
          onClick={() => {
            const item = suggestions.filter((f) => f.name == query);
            if (item) {
              onSelect(item);
            }
          }}
        >
          Search
        </button>
      </div>

      {isShowSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-[2001] w-full bg-white border border-gray-200 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setQuery(item.name);
                setIsShowSuggestions(false);
                onSelect(item);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
