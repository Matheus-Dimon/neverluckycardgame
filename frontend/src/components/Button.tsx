import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'relative gothic-title uppercase tracking-widest transition-all duration-300 shadow-volumetric hover:shadow-2xl hover:scale-105 hover:brightness-110 clip-gothic border-metallic glassmorphism-dark hover:glow-crimson transform hover:-translate-y-1 ring-1 hover:ring-2 rounded-2xl';

  const variantClasses = {
    primary: 'bg-gradient-to-br from-red-900 to-red-800 text-gray-100 border-red-700 hover:from-red-800 hover:to-red-700 ring-red-500/20 hover:ring-red-500/40',
    secondary: 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 border-gray-600 hover:from-gray-700 hover:to-gray-600 ring-gray-500/20 hover:ring-gray-500/40',
    accent: 'bg-gradient-to-br from-yellow-700 to-yellow-600 text-black border-yellow-500 hover:from-yellow-600 hover:to-yellow-500 glow-gold ring-yellow-500/20 hover:ring-yellow-500/40',
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-xl',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {/* Ornate border overlay */}
      <div className="absolute inset-0 border-ornate rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      {/* Subtle metallic lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
