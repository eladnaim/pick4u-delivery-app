import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { filterCities } from '@/data/cities';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder = "הקלד שם עיר...", 
  label,
  required = false 
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    const filtered = filterCities(inputValue);
    setSuggestions(filtered);
    setIsOpen(filtered.length > 0 && inputValue.length > 0);
  };

  const handleSuggestionClick = (city: string) => {
    onChange(city);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (value.length > 0) {
      const filtered = filterCities(value);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <Label htmlFor="city-input">
          {label} {required && '*'}
        </Label>
      )}
      <Input
        ref={inputRef}
        id="city-input"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto border shadow-lg bg-white">
          <div className="p-1">
            {suggestions.map((city, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-sm"
                onClick={() => handleSuggestionClick(city)}
              >
                {city}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}