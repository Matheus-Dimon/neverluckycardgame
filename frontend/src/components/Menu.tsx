import React, { useState } from 'react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center atmospheric-pulse">
      {/* Dark overlay with atmospheric effect */}
      <div className="absolute inset-0 gradient-cinematic opacity-80"></div>

      {/* Main menu container */}
      <div className="relative glassmorphism-dark border-ornate rounded-2xl p-8 w-96 shadow-volumetric clip-gothic overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-900/10 to-transparent"></div>

        {/* Close button with ornate design */}
        <button onClick={onClose} className="absolute top-4 right-4 text-yellow-500 hover:text-red-400 gothic-title text-2xl transition-all duration-300 hover:scale-110 glow-gold">
          ✕
        </button>

        {/* Menu title */}
        <div className="text-center mb-8">
          <h2 className="gothic-title text-3xl text-yellow-500 mb-4 drop-shadow-lg">The Abyss Calls</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
        </div>

        {/* Navigation links with immersive effects */}
        <nav className="flex flex-col space-y-6 text-center relative z-10">
          <a
            href="#home"
            className="gothic-body text-gray-200 hover:text-yellow-400 transition-all duration-300 text-xl py-3 px-6 rounded-2xl border-metallic hover:border-ornate hover:shadow-2xl hover:glow-gold hover:brightness-110 transform hover:scale-105 hover:-translate-y-1 ring-1 ring-transparent hover:ring-2 ring-yellow-500/20 relative group"
            onClick={onClose}
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </a>
          <a
            href="#game"
            className="gothic-body text-gray-200 hover:text-yellow-400 transition-all duration-300 text-xl py-3 px-6 rounded-2xl border-metallic hover:border-ornate hover:shadow-2xl hover:glow-gold hover:brightness-110 transform hover:scale-105 hover:-translate-y-1 ring-1 ring-transparent hover:ring-2 ring-yellow-500/20 relative group"
            onClick={onClose}
          >
            <span className="relative z-10">Game</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </a>
          <a
            href="#about"
            className="gothic-body text-gray-200 hover:text-yellow-400 transition-all duration-300 text-xl py-3 px-6 rounded-2xl border-metallic hover:border-ornate hover:shadow-2xl hover:glow-gold hover:brightness-110 transform hover:scale-105 hover:-translate-y-1 ring-1 ring-transparent hover:ring-2 ring-yellow-500/20 relative group"
            onClick={onClose}
          >
            <span className="relative z-10">About</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </a>
        </nav>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border border-yellow-500 rounded-full opacity-20 atmospheric-pulse"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border border-red-500 rounded-full opacity-15 atmospheric-pulse animation-delay-1000"></div>

        {/* Spectral particles */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-spectral-accent rounded-full flicker opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full atmospheric-pulse opacity-40"></div>
      </div>
    </div>
  );
};

export default Menu;
