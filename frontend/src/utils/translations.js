const translations = {
  pt: {
    // HomePage
    gameTitle: "NeverLucky Card Game",
    gameDescription: "Um jogo de cartas estratégico onde você constrói seu deck, seleciona poderes de herói e enfrenta adversários em batalhas épicas.",
    loginButton: "Entrar",
    registerButton: "Cadastrar",
    features: {
      decks: {
        title: "🃏 Decks Personalizados",
        description: "Monte seu deck com cartas únicas de guerreiros, arqueiros e clérigos."
      },
      heroPowers: {
        title: "⚔️ Poderes de Herói",
        description: "Escolha poderes especiais que definem seu estilo de jogo."
      },
      battles: {
        title: "🎯 Batalhas Estratégicas",
        description: "Posicione suas unidades em linhas melee e ranged para controlar o campo de batalha."
      }
    },

    // LoginPage
    loginTitle: "Entrar no Jogo",
    usernameLabel: "Nome de Usuário",
    passwordLabel: "Senha",
    usernamePlaceholder: "Digite seu nome de usuário",
    passwordPlaceholder: "Digite sua senha",
    loginButtonText: "Entrar",
    loggingIn: "Entrando...",
    noAccount: "Não tem conta? Cadastre-se",
    backToHome: "Voltar ao início",
    loginError: "Nome de usuário ou senha incorretos",
    connectionError: "Erro de conexão. Verifique se o servidor está rodando.",

    // RegisterPage
    registerTitle: "Cadastrar Jogador",
    confirmPasswordLabel: "Confirmar Senha",
    confirmPasswordPlaceholder: "Confirme sua senha",
    registerButtonText: "Cadastrar",
    registering: "Cadastrando...",
    hasAccount: "Já tem conta? Faça login",
    allFieldsRequired: "Todos os campos são obrigatórios",
    passwordsDontMatch: "As senhas não coincidem",
    passwordTooShort: "A senha deve ter pelo menos 6 caracteres",
    registrationSuccess: "Cadastro realizado com sucesso! Faça o login para continuar.",
    registrationError: "Erro ao cadastrar usuário",

    // Language
    switchToEnglish: "Switch to English",
    switchToPortuguese: "Mudar para Português",

    // Tutorial
    tutorial: {
      start: "Iniciar Tutorial",
      previous: "Anterior",
      next: "Continuar",
      finish: "Voltar para Menu",
      skip: "Pular Tutorial",
      game: {
        welcome: {
          title: "Bem-vindo ao NeverLucky!",
          message: "Vamos aprender jogando! Você começa com cartas na mão. Clique em uma carta para jogá-la no campo."
        },
        mana: {
          title: "Mana",
          message: "Cada carta custa mana. Você ganha 1 cristal de mana por turno (até 10). Verifique o custo antes de jogar!"
        },
        board: {
          title: "Campo de Batalha",
          message: "As unidades são colocadas em duas pistas: Corpo a corpo (esquerda) e À distância (direita). Clique em uma unidade para atacá-la."
        },
        heroPower: {
          title: "Poder do Herói",
          message: "Cada herói tem poderes únicos! Clique no botão do poder do herói para usá-lo (uma vez por turno)."
        },
        endTurn: {
          title: "Finalizar Turno",
          message: "Quando terminar suas ações, clique em 'End Turn' para passar o turno. O oponente jogará automaticamente!"
        }
      },
      welcome: {
        title: "Bem-vindo ao NeverLucky!",
        content: "Este tutorial irá ensinar os conceitos básicos do jogo. Vamos começar!"
      },
      objective: {
        title: "Objetivo do Jogo",
        content: "O objetivo é reduzir os pontos de vida do herói inimigo a 0. Você vence atacando o herói inimigo ou usando habilidades especiais."
      },
      board: {
        title: "O Campo de Batalha",
        content: "As unidades são colocadas em duas fileiras: Corpo a corpo (ataque próximo) e À distância (ataques longos). Unidades corpo a corpo podem atacar o herói inimigo se não houver unidades corpo a corpo inimigas."
      },
      units: {
        title: "Tipos de Unidade",
        content: "Existem três tipos de unidade: Guerreiros (corpo a corpo), Arqueiros (à distância) e Clérigos (curandeiros). Cada um tem habilidades e estilos de jogo únicos."
      },
      mana: {
        title: "Sistema de Mana",
        content: "Você ganha 1 cristal de mana a cada turno (máximo 10). Use mana para jogar cartas e ativar poderes de herói. Sua mana é renovada a cada turno!"
      },
      heroPowers: {
        title: "Poderes de Herói",
        content: "Cada herói tem poderes únicos que você pode usar uma vez por turno. Eles custam mana e podem causar dano, curar ou fornecer efeitos especiais."
      },
      cardEffects: {
        title: "Efeitos das Cartas",
        content: "As cartas têm efeitos especiais como Investida (ataca imediatamente), Provocação (deve ser atacado primeiro) ou Grito de Batalha (efeito ao ser jogada)."
      },
      turns: {
        title: "Estrutura dos Turnos",
        content: "Cada turno: Compre uma carta, jogue cartas, use poder de herói, ataque com unidades, então termine o turno. Planeje seus movimentos estrategicamente!"
      },
      strategy: {
        title: "Estratégia Básica",
        content: "Controle o campo com unidades melee, use ranged para dano seguro, cure com clérigos, e tempo seus poderes de herói sabiamente."
      },
      dynamic: {
        card_played: {
          title: "Carta Jogada!",
          message: "Você colocou uma unidade no campo! Agora ela pode atacar no próximo turno."
        },
        attack: {
          title: "Ataque Realizado!",
          message: "Sua unidade atacou! Cada unidade pode atacar apenas uma vez por turno."
        },
        hero_power: {
          title: "Poder do Herói Usado!",
          message: "Você ativou o poder do herói! Pode usar apenas uma vez por turno."
        },
        turn_start: {
          title: "Novo Turno!",
          message: "Seu turno começou! Você ganhou mana e uma carta. Planeje suas ações!"
        },
        heal: {
          title: "Cura Aplicada!",
          message: "Sua unidade curou um aliado! Clérigos podem curar em vez de atacar."
        }
      },
      immersive_tutorial: {
        interface_overview: {
          title: "Compreendendo a Interface",
          message: "Bem-vindo ao NeverLucky! Vamos explorar a interface do jogo. Estas são as áreas principais que você usará: sua mão, o campo de batalha, seu herói e contadores de recursos."
        },
        play_card: {
          title: "Jogando uma Carta",
          message: "Selecione uma carta da sua mão e coloque-a no campo de batalha. Clique na carta para selecioná-la, então arraste-a para uma zona de colocação válida no campo de batalha."
        },
        target_selection: {
          title: "Seleção de Alvo",
          message: "Clique na unidade inimiga que aparece. Um alvo é qualquer carta inimiga ou jogador inimigo que você deseja afetar."
        },
        turn_flow: {
          title: "Fluxo dos Turnos",
          message: "Clique em 'End Turn' para completar seu turno. Cada turno segue esta ordem: comprar cartas, ganhar mana, jogar cartas, atacar, então finalizar o turno."
        },
        reinforcement_attack: {
          title: "Atacando",
          message: "Clique na carta no campo de batalha e selecione o alvo para atacar."
        },
        tutorial_complete: {
          title: "Tutorial Completo",
          message: "Perfeito! Você completou todas as ações básicas. Agora derrote seu oponente para finalizar o tutorial!"
        }
      }
    },

    // Game Log
    gamelog: {
      empty: "Nenhuma ação ainda...",
      entries: "entradas"
    },

    // Game UI
    gameUI: {
      endTurn: "Finalizar Turno",
      player: "Jogador",
      enemy: "Inimigo"
    },

    // Targeting
    targeting: {
      select_target: "Selecione um alvo para {{powerName}}",
      select_heal_target: "Selecione um alvo para curar",
      cancel: "Cancelar"
    },

    // Gameboard Lanes
    lanes: {
      melee: "CORPO A CORPO",
      ranged: "LONGA DISTÂNCIA"
    },

    // Instructions Panel
    instructions: {
      title: "📜 Como Jogar",
      toggleOpen: "📖 ▼",
      toggleClosed: "📖 ►",
      sections: {
        combat: {
          title: "⚔️ Combate",
          melee: "Melee: Ataca corpo a corpo. Recebe dano ao atacar melee.",
          ranged: "Ranged: Ataca à distância. Não recebe dano ao atacar.",
          meleeVsRanged: "Melee pode atacar ranged se não houver melee inimigo."
        },
        cardEffects: {
          title: "✨ Efeitos das Cartas",
          charge: "⚡ Charge: Ataca imediatamente",
          taunt: "🛡️ Taunt: Deve ser atacado primeiro",
          immuneFirstTurn: "✨ Imune 1ª Rodada: Não recebe dano no turno jogado",
          lifesteal: "💉 Lifesteal: Cura o herói ao atacar",
          battlecry: "💥 Battlecry: Efeito ao ser jogada",
          deathrattle: "🎲 Deathrattle: Efeito ao morrer"
        },
        resources: {
          title: "💎 Recursos",
          manaGain: "Ganhe +1 mana máxima por turno (máx. 10)",
          cardDraw: "Compre 1 carta no início do turno",
          heroPower: "Use poderes de herói (1x por turno)"
        },
        strategy: {
          title: "🎯 Estratégia",
          controlBoard: "Controle o campo com unidades melee",
          rangedThreats: "Use ranged para eliminar ameaças",
          clerics: "Clérigos curam além de 30 HP",
          planAhead: "Planeje seus turnos com antecedência"
        }
      }
    }
  },
  en: {
    // HomePage
    gameTitle: "NeverLucky Card Game",
    gameDescription: "A strategic card game where you build your deck, select hero powers, and face opponents in epic battles.",
    loginButton: "Login",
    registerButton: "Register",
    features: {
      decks: {
        title: "🃏 Custom Decks",
        description: "Build your deck with unique cards of warriors, archers, and clerics."
      },
      heroPowers: {
        title: "⚔️ Hero Powers",
        description: "Choose special powers that define your playstyle."
      },
      battles: {
        title: "🎯 Strategic Battles",
        description: "Position your units in melee and ranged lines to control the battlefield."
      }
    },

    // LoginPage
    loginTitle: "Login to Game",
    usernameLabel: "Username",
    passwordLabel: "Password",
    usernamePlaceholder: "Enter your username",
    passwordPlaceholder: "Enter your password",
    loginButtonText: "Login",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account? Register",
    backToHome: "Back to Home",
    loginError: "Invalid username or password",
    connectionError: "Connection error. Check if the server is running.",

    // RegisterPage
    registerTitle: "Register Player",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    registerButtonText: "Register",
    registering: "Registering...",
    hasAccount: "Already have an account? Login",
    allFieldsRequired: "All fields are required",
    passwordsDontMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    registrationSuccess: "Registration successful! Please login to continue.",
    registrationError: "Error registering user",

    // Language
    switchToEnglish: "Switch to English",
    switchToPortuguese: "Mudar para Português",

    // Tutorial
    tutorial: {
      start: "Start Tutorial",
      previous: "Previous",
      next: "Continue",
      finish: "Return to Menu",
      skip: "Skip Tutorial",
      game: {
        welcome: {
          title: "Welcome to NeverLucky!",
          message: "Let's learn by playing! You start with cards in your hand. Click a card to play it on the field."
        },
        mana: {
          title: "Mana",
          message: "Each card costs mana. You gain 1 mana crystal per turn (up to 10). Check the cost before playing!"
        },
        board: {
          title: "Battlefield",
          message: "Units are placed in two lanes: Melee (left) and Ranged (right). Click a unit to attack it."
        },
        heroPower: {
          title: "Hero Power",
          message: "Each hero has unique powers! Click the hero power button to use it (once per turn)."
        },
        endTurn: {
          title: "End Turn",
          message: "When you finish your actions, click 'End Turn' to pass the turn. The opponent will play automatically!"
        }
      },
      welcome: {
        title: "Welcome to NeverLucky!",
        content: "This tutorial will teach you the basic concepts of the game. Let's get started!"
      },
      objective: {
        title: "Game Objective",
        content: "The goal is to reduce your opponent's hero HP to 0. You win by attacking their hero or using special abilities."
      },
      board: {
        title: "The Battlefield",
        content: "Units are placed in two lanes: Melee (close combat) and Ranged (distance attacks). Melee units can attack the enemy hero if no enemy melee units are present."
      },
      units: {
        title: "Unit Types",
        content: "There are three unit types: Warriors (melee), Archers (ranged), and Clerics (healers). Each has unique abilities and playstyles."
      },
      mana: {
        title: "Mana System",
        content: "You gain 1 mana crystal each turn (maximum 10). Use mana to play cards and activate hero powers. Your mana refreshes each turn!"
      },
      heroPowers: {
        title: "Hero Powers",
        content: "Each hero has unique powers you can use once per turn. They cost mana and can deal damage, heal, or provide special effects."
      },
      cardEffects: {
        title: "Card Effects",
        content: "Cards have special effects like Charge (attack immediately), Taunt (must be attacked first), or Battlecry (effect when played)."
      },
      turns: {
        title: "Turn Structure",
        content: "Each turn: Draw a card, play cards, use hero power, attack with units, then end turn. Plan your moves strategically!"
      },
      strategy: {
        title: "Basic Strategy",
        content: "Control the board with melee units, use ranged for safe damage, heal with clerics, and time your hero powers wisely."
      },
      dynamic: {
        card_played: {
          title: "Card Played!",
          message: "You placed a unit on the field! It can now attack on the next turn."
        },
        attack: {
          title: "Attack Executed!",
          message: "Your unit attacked! Each unit can attack only once per turn."
        },
        hero_power: {
          title: "Hero Power Used!",
          message: "You activated the hero power! It can be used only once per turn."
        },
        turn_start: {
          title: "New Turn!",
          message: "Your turn has started! You gained mana and a card. Plan your actions!"
        },
        heal: {
          title: "Heal Applied!",
          message: "Your unit healed an ally! Clerics can heal instead of attacking."
        }
      },
      immersive_tutorial: {
        interface_overview: {
          title: "Understanding the Interface",
          message: "Welcome to NeverLucky! Let's explore the game interface. These are the key areas you'll use: your hand, the battlefield, your hero, and resource counters."
        },
        play_card: {
          title: "Playing a Card",
          message: "Select a card from your hand and place it on the battlefield. Click on the card to select it, then drag it to a valid placement zone on the battlefield."
        },
        target_selection: {
          title: "Target Selection",
          message: "Click on the enemy unit that appears. A target is any enemy card or enemy player you want to affect."
        },
        turn_flow: {
          title: "Turn Flow",
          message: "Click 'End Turn' to complete your turn. Each turn follows this order: draw cards, gain mana, play cards, attack, then end turn."
        },
        reinforcement_attack: {
          title: "Attacking",
          message: "Click on the card in the battlefield and select the target to attack."
        },
        tutorial_complete: {
          title: "Tutorial Complete",
          message: "Perfect! You've completed all the basic actions. Now defeat your opponent to finish the tutorial!"
        }
      }
    },

    // Game Log
    gamelog: {
      empty: "No actions yet...",
      entries: "entries"
    },

    // Game UI
    gameUI: {
      endTurn: "End Turn",
      player: "Player",
      enemy: "Enemy"
    },

    // Targeting
    targeting: {
      select_target: "Select a target for {{powerName}}",
      select_heal_target: "Select a target to heal",
      cancel: "Cancel"
    },

    // Gameboard Lanes
    lanes: {
      melee: "MELEE",
      ranged: "RANGED"
    },

    // Instructions Panel
    instructions: {
      title: "📜 How to Play",
      toggleOpen: "📖 ▼",
      toggleClosed: "📖 ►",
      sections: {
        combat: {
          title: "⚔️ Combat",
          melee: "Melee: Attacks in close combat. Takes damage when attacking melee units.",
          ranged: "Ranged: Attacks from distance. Takes no damage when attacking.",
          meleeVsRanged: "Melee can attack ranged if no enemy melee units are present."
        },
        cardEffects: {
          title: "✨ Card Effects",
          charge: "⚡ Charge: Attacks immediately when played",
          taunt: "🛡️ Taunt: Must be attacked first",
          immuneFirstTurn: "✨ Immune First Turn: Takes no damage the turn it's played",
          lifesteal: "💉 Lifesteal: Heals your hero when attacking",
          battlecry: "💥 Battlecry: Effect when played",
          deathrattle: "🎲 Deathrattle: Effect when dying"
        },
        resources: {
          title: "💎 Resources",
          manaGain: "Gain +1 max mana per turn (max 10)",
          cardDraw: "Draw 1 card at the start of your turn",
          heroPower: "Use hero powers (once per turn)"
        },
        strategy: {
          title: "🎯 Strategy",
          controlBoard: "Control the board with melee units",
          rangedThreats: "Use ranged units to eliminate threats safely",
          clerics: "Clerics can heal beyond 30 HP",
          planAhead: "Plan your turns in advance"
        }
      }
    }
  }
};

export default translations;
