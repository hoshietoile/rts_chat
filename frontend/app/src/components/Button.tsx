import React from 'react';

type Props = {
  children: string | React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({ children, onClick }: Props) => {
  return (
    <button
      className="
        
        text-white
        font-bold
        py-2
        px-4
        rounded

        focus:outline-none
        focus:ring-4
      bg-teal-300
      dark:bg-teal-700
      hover:bg-teal-500
      dark:hover:bg-teal-800
      focus:ring-teal-300
      dark:focus:ring-teal-800
      "
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
