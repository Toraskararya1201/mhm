import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl',
    outline: 'bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
