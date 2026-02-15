import React from 'react';

type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
};

export const Input = React.memo(
  ({ label, type = 'text', value, onChange, error, placeholder }: InputProps) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const borderClass = error
      ? 'border-red-500'
      : isFocused
      ? 'border-indigo-500'
      : 'border-gray-200';

    return (
      <div className="mb-1.5">
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          {label}
        </label>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3.5 py-3 rounded-[10px] border-2 outline-none text-[15px] transition-all bg-white text-gray-800 ${borderClass}`}
        />

        {error && (
          <p className="mt-1.5 text-[13px] text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);
