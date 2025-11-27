import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  image?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, image }) => {
  return (
    <div className={`relative glassmorphism-dark shadow-volumetric clip-gothic border-metallic overflow-hidden transition-all duration-300 hover:shadow-2xl hover:glow-gold hover:scale-105 hover:brightness-110 transform hover:-translate-y-2 ring-1 ring-yellow-500/20 hover:ring-2 ring-yellow-500/40 rounded-2xl ${className}`}>
      {/* Texture overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-30"></div>

      {/* Image with cinematic overlay */}
      {image && (
        <div className="relative w-full h-48 bg-cover bg-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <img src={image} alt={title} className="w-full h-full object-cover filter brightness-75 contrast-125" />
          {/* Spotlight effect */}
          <div className="absolute inset-0 gradient-spotlight opacity-70"></div>
        </div>
      )}

      {/* Ornate divider */}
      <div className="relative px-6 pt-6">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4"></div>
        {title && (
          <h3 className="gothic-title text-2xl text-yellow-500 mb-6 text-center drop-shadow-lg">{title}</h3>
        )}
        <div className="gothic-body text-gray-200 leading-relaxed">{children}</div>

        {/* Bottom ornament */}
        <div className="mt-6 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      </div>

      {/* Atmospheric particles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-500 rounded-full atmospheric-pulse opacity-60"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-red-500 rounded-full atmospheric-pulse opacity-40 animation-delay-1000"></div>
    </div>
  );
};

export default Card;
