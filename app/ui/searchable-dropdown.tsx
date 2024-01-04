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
      <div className="container w-full items-center justify-center p-4">
        <input
            className="mb-4 text-xl w-1/2 py-2 px-3 border
                   border-gray-300 bg-white rounded-md shadow-sm focus:outline-none
                   focus:ring-primary-500 focus:border-primary-500
                   dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="relative inline-block text-left">
          <div>
    <span className="rounded-md shadow-sm">
      <button type="button" className="inline-flex justify-center dark:text-gray-200 hover:bg-gray-100 text-sm w-full"
              id="options-menu" aria-haspopup="true" aria-expanded="true">
        Select an item
        <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"/></svg>
      </button>
    </span>
          </div>

          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg dark:bg-gray-800">
            <div className="rounded-md bg-white dark:bg-gray-800 shadow-xs">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {filteredItems.map((item) => (
                    <a
                        className={`${
                            selectedItem?.id === item.id ? 'bg-gray-200 dark:bg-gray-700' : 'dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-200 cursor-pointer`}
                        key={item.id}
                        onClick={() => onItemSelect(item.id)}
                        role="menuitem"
                    >
                      {item.name}
                    </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GenericSearchableDropdown;