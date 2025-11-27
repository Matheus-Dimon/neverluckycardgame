import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Card from './Card';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen gradient-cinematic">
      <Header />
      <Hero />

      {/* Ornate Section Divider */}
      <div className="relative py-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4"></div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          <div className="flex justify-center">
            <div className="w-16 h-4 border-l-2 border-r-2 border-yellow-500 flex items-center justify-center">
              <div className="w-8 h-px bg-yellow-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Atmospheric Depth */}
      <section className="relative py-20">
        {/* Background layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-yellow-500/5 via-transparent to-red-500/5"></div>
        </div>

        {/* Atmospheric fog effects */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-900 rounded-full blur-3xl opacity-10 atmospheric-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-600 rounded-full blur-3xl opacity-8 atmospheric-pulse animation-delay-2000"></div>

        <div className="relative container mx-auto px-6">
          {/* Section Title with Cinematic Hierarchy */}
          <div className="text-center mb-16">
            <h2 className="gothic-title text-5xl md:text-6xl text-yellow-500 mb-6 drop-shadow-2xl glow-gold">
              Dark Features
            </h2>
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-red-500 via-yellow-500 to-transparent mx-auto mb-8"></div>
            <p className="gothic-body text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Unleash the power of forbidden knowledge and master the arcane arts in eternal battles
            </p>
          </div>

          {/* Cards Grid with Enhanced Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <Card
              title="Shadow Battles"
              image="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            >
              Engage in epic card duels within the abyss. Master forbidden strategies and unleash cursed powers that bend reality itself.
            </Card>
            <Card
              title="Cursed Decks"
              image="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            >
              Build decks infused with dark magic. Collect rare cards from forgotten realms, ancient tombs, and the whispers of eldritch beings.
            </Card>
            <Card
              title="Eternal Glory"
              image="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            >
              Climb the ranks in eternal tournaments. Your legend will be etched in the annals of darkness for eternity.
            </Card>
          </div>

          {/* Decorative Bottom Bar */}
          <div className="flex justify-center">
            <div className="w-96 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4"></div>
          </div>
          <div className="text-center gothic-body text-gray-400 text-sm">
            "In the heart of darkness, power awaits those brave enough to claim it"
          </div>
        </div>

        {/* Floating Spectral Elements */}
        <div className="absolute top-1/4 left-1/6 w-3 h-3 bg-spectral-accent rounded-full flicker opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-yellow-400 rounded-full atmospheric-pulse opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-red-500 rounded-full atmospheric-pulse opacity-50 animation-delay-1000"></div>
      </section>

      {/* Footer Section with Atmospheric Closure */}
      <footer className="relative py-12 glassmorphism-dark border-t border-ornate">
        <div className="container mx-auto px-6 text-center">
          <div className="gothic-title text-2xl text-yellow-500 mb-4 drop-shadow-lg">
            NeverLucky
          </div>
          <div className="gothic-body text-gray-400 text-sm mb-6">
            Descend into the eternal card game where darkness meets destiny
          </div>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
        </div>

        {/* Final atmospheric touches */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 border border-yellow-500 rounded-full opacity-30 atmospheric-pulse"></div>
      </footer>
    </div>
  );
};

export default Home;
