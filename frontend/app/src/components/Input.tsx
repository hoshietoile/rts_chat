import React, { useMemo } from 'react';

type Props = {
  value: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ value, className, onChange }: Props) => {
  const inputClass = useMemo<string>(() => {
    const baseClass = `rounded
        px-4
        py-2
        text-gray-800
        dark:text-gray-200
        dark:bg-slate-600
        border-none
        outline-0

        focus:outline-none
        focus:ring-4
        focus:ring-teal-300
        dark:focus:ring-teal-800
       `;
    return [className || '', baseClass].join(' ');
  }, [className]);

  return <input onChange={onChange} value={value} className={inputClass} />;
};

export default Input;
