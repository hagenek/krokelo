import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

interface DropdownItem {
  id: number;
  name: string;
}

interface GenericSearchableDropdownProps {
  items: DropdownItem[];
  onItemSelect: (itemId: number) => void;
  placeholder: string;
  selectedItem?: DropdownItem;
  className?: string;
}

const GenericSearchableDropdown: React.FC<GenericSearchableDropdownProps> = ({
  items,
  onItemSelect,
  placeholder,
  selectedItem,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(items);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const fuse = new Fuse(items, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.3, // You can adjust this for more or less strict searching
    });

    if (searchTerm) {
      const results = fuse.search(searchTerm).map((result) => result.item);
      setFilteredItems(results);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  return (
    <div
      className={`container relative w-full flex-col items-center justify-center ${className}`}
    >
      <input
        className="focus:ring-primary-500 focus:border-primary-500 w-1/2 rounded-md border
                   border-gray-300 bg-white px-3 py-2 text-center
                   text-xl shadow-sm
                   focus:outline-none
                   dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onFocus={() => setFocused(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredItems.length > 0 && focused ? (
        <div className="relative w-full px-2">
          <ul className="absolute left-0 right-0 z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-900 dark:text-white">
            {filteredItems.map((item) => (
              <li
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedItem?.id === item.id ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                key={item.id}
                onClick={() => {
                  onItemSelect(item.id);
                  setFocused(false);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GenericSearchableDropdown;
