import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Menu from './Menu';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      <header className="relative glassmorphism-dark border-b border-ornate shadow-volumetric backdrop-blur-md">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-80"></div>

        {/* Ornate top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 via-red-500 to-transparent"></div>

        <div className="relative container mx-auto px-6 py-6 flex justify-between items-center">
          {/* Logo with ornate styling */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border border-yellow-500 rounded-full flex items-center justify-center glow-gold">
              <div className="w-4 h-4 border border-red-500 rounded-full"></div>
            </div>
            <div className="gothic-title text-yellow-500 text-3xl tracking-widest drop-shadow-lg">
              NeverLucky
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#home"
              className="gothic-body text-gray-200 hover:text-yellow-400 transition-all duration-300 py-2 px-4 rounded-2xl border-transparent hover:border-metallic hover:glow-gold hover:shadow-2xl hover:brightness-110 ring-1 ring-transparent hover:ring-2 ring-yellow-500/20 relative group"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </a>
            <button
              onClick={() => navigate('/game')}
              className="gothic-body text-gray-200 hover:text-yellow-400 transition-all duration-300 py-2 px-4 rounded-2xl border-transparent hover:border-metallic hover:glow-gold hover:shadow-2xl hover:brightness-110 ring-1 ring-transparent hover:ring-2 ring-yellow-500/20 relative group cursor-pointer"
            >
              <span className="relative z-10">Game</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            <a
              href="#about"
              className="gothic-body text-gray-200 hover:text-yellow-400 transition-all duration-300 py-2 px-4 rounded-2xl border-transparent hover:border-metallic hover:glow-gold hover:shadow-2xl hover:brightness-110 ring-1 ring-transparent hover:ring-2 ring-yellow-500/20 relative group"
            >
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button onClick={() => { logout(); navigate('/login'); }} size="sm" variant="secondary">
              Logout
            </Button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden gothic-title text-yellow-500 hover:text-red-400 text-2xl transition-all duration-300 hover:scale-110 glow-gold p-2"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Decorative bottom elements */}
        <div className="absolute bottom-2 left-1/4 w-2 h-2 bg-yellow-500 rounded-full atmospheric-pulse opacity-60"></div>
        <div className="absolute bottom-2 right-1/4 w-1 h-1 bg-red-500 rounded-full atmospheric-pulse opacity-40 animation-delay-1000"></div>

        {/* Metallic accent lines */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
      </header>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
