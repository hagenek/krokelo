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
}

const GenericSearchableDropdown: React.FC<GenericSearchableDropdownProps> = ({
  items,
  onItemSelect,
  placeholder,
  selectedItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(items);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const fuse = new Fuse(items, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.3 // You can adjust this for more or less strict searching
    });

    if (searchTerm) {
      const results = fuse.search(searchTerm).map(result => result.item);
      setFilteredItems(results);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  return (
      <div className="container flex-col relative items-center justify-center w-full">
        <input
            className="text-xl w-1/2 py-2 px-3 border
                   border-gray-300 bg-white rounded-md shadow-sm focus:outline-none
                   focus:ring-primary-500 focus:border-primary-500
                   text-center
                   dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onFocus={() => setFocused(true)}
            onChange={e => setSearchTerm(e.target.value)}
        />
        {filteredItems.length > 0 && focused ? (
            <div className="relative w-full px-2">
              <ul className="absolute left-0 right-0 border border-gray-300 bg-white overflow-y-auto max-h-64 rounded-md shadow-lg w-full mt-1 dark:bg-gray-900 dark:text-white dark:border-gray-600 z-10">
                {filteredItems.map(item => (
                    <li
                        className={`py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${selectedItem?.id === item.id ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                        key={item.id}
                        onClick={() => {
                          onItemSelect(item.id)
                          setFocused(false)
                        }}
                    >
                      {item.name}
                    </li>
                ))}
              </ul>
            </div>
        ) : <></>}
      </div>
  );
};

export default GenericSearchableDropdown;