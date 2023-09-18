import React, { ReactNode, useMemo, useState } from 'react';

export type Align = 'left' | 'right';

type Props = {
  userName?: string;
  children: ReactNode;
  align: Align;
  onClickForget: () => void;
};

const Dropdown = ({ userName, children, align, onClickForget }: Props) => {
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
    return [
      isOpen ? '' : 'hidden',
      align === 'right' ? 'right-0' : '',
      'absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 text-left',
    ].join(' ');
  }, [isOpen, align]);

  return (
    <div className="relative">
      <button onClick={isOpen ? onClose : onOpen}>{children}</button>
      <div className={dropdownClass}>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200 w-100"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              {userName}
            </span>
          </li>
          <li>
            <button
              onClick={onClickForget}
              className="text-left w-full text-red-400 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Forget UserName
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
