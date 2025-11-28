import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen gradient-cinematic flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cinematic background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 filter brightness-50 contrast-150 blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}></div>
        {/* Dramatic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
        {/* Spotlight effect */}
        <div className="absolute inset-0 gradient-spotlight"></div>
      </div>

      {/* Atmospheric fog particles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20 atmospheric-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-600 rounded-full blur-3xl opacity-15 atmospheric-pulse animation-delay-2000"></div>

      {/* Ornate decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 border-2 border-gold-aged rounded-full opacity-30 atmospheric-pulse flicker"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 border border-crimson rounded-full opacity-25 atmospheric-pulse animation-delay-1000"></div>

      {/* Side lighting effects */}
      <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-red-900 via-transparent to-transparent opacity-40"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Main title with cinematic hierarchy */}
        <h1 className="gothic-title text-6xl md:text-8xl mb-6 text-yellow-500 drop-shadow-2xl glow-gold">
          NeverLucky
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-8"></div>
        <h2 className="gothic-body text-2xl md:text-3xl mb-12 text-gray-200 font-medium tracking-wide drop-shadow-lg">
          Card Game - Enter the Eternal Shadows
        </h2>

        {/* Video with gothic frame */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="absolute inset-0 border-ornate rounded-2xl glow-gold opacity-50"></div>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-2xl shadow-volumetric border border-gray-700 relative z-10"
          ></iframe>
          {/* Corner ornaments */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-500"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-500"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-500"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-500"></div>
        </div>

        <Button onClick={() => navigate('/game')} size="lg" variant="accent">
          Game
        </Button>
      </div>

      {/* Atmospheric footer */}
      <div className="absolute bottom-8 text-center text-gray-400 gothic-body text-sm drop-shadow-md">
        <div className="mb-2 opacity-70">Prepare for the ultimate card battle in the depths of darkness</div>
        <div className="w-64 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto"></div>
      </div>

      {/* Floating spectral elements */}
      <div className="absolute top-1/3 right-1/6 w-2 h-2 bg-spectral-accent rounded-full flicker opacity-60"></div>
      <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-yellow-400 rounded-full atmospheric-pulse opacity-40"></div>
    </section>
  );
};

export default Hero;
