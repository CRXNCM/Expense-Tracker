import React, { useState, useEffect, useRef } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  label,
  required = false,
  error = '',
  helperText = '',
  className = '',
  disabled = false,
  autoFocus = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  // For textarea auto resize
  useEffect(() => {
    if (type === 'textarea' && inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [value, type]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
    // Focus back on input after toggle for better UX
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isPassword = type === 'password';

  return (
    <div className={`relative mb-6 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`absolute left-4 top-2 text-gray-500 text-sm pointer-events-none transition-all duration-200
            ${
              value || placeholder
                ? 'text-xs top-0 text-blue-600 dark:text-blue-400'
                : 'top-2 text-gray-400 dark:text-gray-500'
            }
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          ref={inputRef}
          placeholder={placeholder || ' '}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          rows={1}
          className={`w-full px-4 pt-6 pb-2 border rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            dark:text-gray-200 dark:border-gray-600
          `}
          {...props}
        />
      ) : (
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          id={name}
          name={name}
          placeholder={placeholder || ' '}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          ref={inputRef}
          className={`w-full px-4 pt-6 pb-3 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            dark:text-gray-200 dark:border-gray-600
          `}
          {...props}
        />
      )}

      {isPassword && (
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
          onClick={toggleShowPassword}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleShowPassword();
            }
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
        </button>
      )}

      {(error || helperText) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'} dark:text-gray-400`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
