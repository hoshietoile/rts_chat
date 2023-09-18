import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import React, { useMemo, useState } from 'react';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const onClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const dropdownClass = useMemo(() => {
    return (
      (isOpen ? '' : 'hidden') +
      ' absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
    );
  }, [isOpen]);

  return (
    <>
      <button onClick={isOpen ? onClose : onOpen} className="relative">
        <EllipsisHorizontalIcon className="w-5 h-5 hover:bg-teal-300 hover:text-white rounded" />
      </button>
      <div className={dropdownClass}>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200 w-100"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Update
            </span>
          </li>
          <li>
            <span className="text-red-400 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              Delete
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Dropdown;
