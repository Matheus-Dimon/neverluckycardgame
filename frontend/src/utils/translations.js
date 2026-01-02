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
      next: "Próximo",
      finish: "Finalizar",
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
        title: "Basic Strategy",
        content: "Control the board with melee units, use ranged for safe damage, heal with clerics, and time your hero powers wisely."
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
        welcome: {
          title: "Bem-vindo ao NeverLucky!",
          message: "Este é um jogo de cartas onde você constrói seu exército e batalha contra seu oponente. Seu objetivo é reduzir os pontos de vida do herói inimigo a zero. Vamos aprender como jogar!"
        },
        interface: {
          title: "Vamos explorar a interface",
          message: "Veja as áreas principais do tabuleiro. Uma seta irá apontar para cada elemento importante."
        },
        hand: {
          title: "Sua Mão",
          message: "Estas são as cartas em sua mão. Cada carta mostra seu custo, ataque e defesa. Clique em uma carta para jogá-la!"
        },
        mana: {
          title: "Cristais de Mana",
          message: "Estes cristais brilhantes mostram sua mana. Você precisa de mana para jogar cartas. Você ganha 1 mais a cada turno, até 10!"
        },
        board: {
          title: "Campo de Batalha",
          message: "Unidades são colocadas em duas pistas: Corpo a corpo (combate próximo) e À distância (ataques longos). Unidades corpo a corpo podem atacar o herói inimigo se não houver unidades corpo a corpo inimigas bloqueando."
        },
        hero: {
          title: "Seu Herói",
          message: "Este é seu herói! Se seus pontos de vida chegarem a zero, você perde o jogo. Proteja-o com suas unidades!"
        },
        first_action: {
          title: "Sua Primeira Ação: Comprar Cartas",
          message: "No início de cada turno, você compra uma carta do seu deck. Isso dá mais opções para jogar!"
        },
        play_card: {
          title: "Jogando Sua Primeira Carta",
          message: "Clique em uma carta em sua mão que custe menos ou igual à sua mana atual. Assista ela aparecer no campo de batalha!"
        },
        card_costs: {
          title: "Entendendo Custos e Efeitos das Cartas",
          message: "Cada carta custa mana para jogar. Algumas cartas têm efeitos especiais quando jogadas, como causar dano ou curar aliados."
        },
        select_unit: {
          title: "Passo 1: Clique na Carta para Selecionar",
          message: "Clique em uma das suas unidades no campo de batalha para selecioná-la. Observe como ela fica destacada em azul quando selecionada!"
        },
        choose_target: {
          title: "Passo 2: Clique no Alvo para Atacar",
          message: "Agora clique em uma unidade inimiga ou no herói inimigo para executar o ataque. Sua unidade irá causar dano ao alvo selecionado!"
        },
        attack_execution: {
          title: "Ataque Executado!",
          message: "Excelente! Você completou seu primeiro ataque. As unidades podem atacar apenas uma vez por turno. Alguns inimigos podem contra-atacar!"
        },
        end_turn_guide: {
          title: "Passo 3: Clique em 'End Turn'",
          message: "Quando terminar suas ações, clique no botão 'End Turn' no canto inferior direito. Isso finaliza seu turno e deixa o oponente jogar!"
        },
        turn_flow: {
          title: "Fluxo Completo dos Turnos",
          message: "Cada turno: Compre uma carta, ganhe mana, jogue cartas, use poderes de herói, ataque com unidades, então clique 'End Turn'. O jogo flui de um lado para o outro!"
        },
        feedback: {
          title: "Muito Bem!",
          message: "Você está indo fantasticamente! Você aprendeu os conceitos básicos do NeverLucky. Continue praticando e você dominará o jogo em pouco tempo!"
        },
        next_steps: {
          title: "Pronto para Mais?",
          message: "Agora você sabe como jogar! Tente uma partida completa contra a IA, ou desafie um amigo. Lembre-se: estratégia, timing e posicionamento de unidades são chave para a vitória!"
        },
        hero_powers_guide: {
          title: "Poderes de Herói",
          message: "Clique no botão do poder do herói abaixo do seu herói. Cada herói tem poderes únicos como causar dano, curar ou efeitos especiais. Você pode usá-lo uma vez por turno se tiver mana suficiente!"
        },
        cleric_mechanics: {
          title: "Cura de Clérigos",
          message: "Unidades clérigos curam em vez de atacar! Quando você seleciona um clérigo e clica em um aliado (ou seu herói), ele restaura vida em vez de causar dano. Perfeito para manter sua equipe viva!"
        },
        special_effects: {
          title: "Efeitos Especiais das Cartas",
          message: "Algumas cartas têm efeitos especiais: Grito de Batalha (ativa ao ser jogada), Investida (ataca imediatamente), Provocação (deve ser atacado primeiro), ou Imune Primeiro Turno (não pode ser danificado no turno em que foi jogada)!"
        },
        counter_attacks: {
          title: "Contra-Ataques",
          message: "Quando unidades corpo a corpo atacam umas às outras, ambas causam dano! O atacante acerta primeiro, então o defensor contra-ataca. Planeje suas trocas com cuidado!"
        },
        armor_system: {
          title: "Proteção de Armadura",
          message: "Alguns poderes de herói dão armadura! A armadura absorve dano antes de atingir a vida do herói. É uma proteção temporária que ajuda você a sobreviver mais!"
        },
        advanced_targeting: {
          title: "Mirar Avançado",
          message: "Poderes de herói que requerem alvos irão destacar opções válidas. Clique em unidades inimigas para poderes de dano, ou suas próprias unidades/heróis para poderes de cura. Mirar é crucial para poderes de herói efetivos!"
        }
      }
    },

    // Game Log
    gamelog: {
      empty: "Nenhuma ação ainda...",
      entries: "entradas"
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
      next: "Next",
      finish: "Finish",
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
      }
    },

    // Game Log
    gamelog: {
      empty: "No actions yet...",
      entries: "entries"
    }
  }
};

export default translations;
