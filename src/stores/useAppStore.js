import { defineStore } from 'pinia';
import { ref } from 'vue';

// Configuração única e centralizada das categorias (Single Source of Truth)
export const CATEGORY_CONFIGS = {
  Garçom: {
    id: 'cat-garcom',
    name: 'Garçom',
    label: 'Garçom & Eventos',
    noun: 'garçom',
    plural: 'Garçons',
    headlineSuffix: 'para o seu evento',
    subtitle: 'Contrate garçons experientes, bartenders e mestres de salão com confirmação rápida.',
    desc: 'Garçons, bartenders e apoio de salão para festas e eventos.',
    icon: 'wine',
    defaultPrice: 200,
    defaultStart: '18:00',
    defaultEnd: '00:00',
    serviceTypeLabel: 'Tipo de evento',
    serviceTypes: ['Aniversário', 'Casamento', 'Churrasco', 'Corporativo', 'Jantar'],
    scopeLabel: 'Quantidade de profissionais',
    scopes: ['1 garçom', '2 garçons', '3 ou mais'],
    locationLabel: 'Local do evento',
    locationPlaceholder: 'Ex: Espaço Villa Real • Bairro Caçari',
    detailsLabel: 'Breve descrição do atendimento',
    detailsPlaceholder: 'Ex: Servir bebidas e salgados para 50 convidados, traje social preto',
    prices: [150, 200, 250, 320]
  },
  Eletricista: {
    id: 'cat-eletricista',
    name: 'Eletricista',
    label: 'Eletricista',
    noun: 'eletricista',
    plural: 'Eletricistas',
    headlineSuffix: 'para sua casa ou empresa',
    subtitle: 'Solucione curtos, instalações de disjuntores, chuveiros e iluminação com rapidez.',
    desc: 'Instalação de tomadas, chuveiros, disjuntores e luminárias.',
    icon: 'flash',
    defaultPrice: 150,
    defaultStart: '09:00',
    defaultEnd: '12:00',
    serviceTypeLabel: 'Qual o serviço elétrico?',
    serviceTypes: ['Curto / Disjuntor', 'Chuveiro Elétrico', 'Tomadas & LEDs', 'Instalação Geral'],
    scopeLabel: 'Porte do serviço',
    scopes: ['Reparo simples', 'Instalação média', 'Revisão completa'],
    locationLabel: 'Endereço do imóvel',
    locationPlaceholder: 'Ex: Rua das Palmeiras, 420 • Centro',
    detailsLabel: 'Breve descrição do problema',
    detailsPlaceholder: 'Ex: Disjuntor do chuveiro 220V desarmando após 5 minutos ligado',
    prices: [100, 150, 200, 280]
  },
  Diarista: {
    id: 'cat-diarista',
    name: 'Diarista',
    label: 'Diarista & Faxina',
    noun: 'diarista',
    plural: 'Diaristas',
    headlineSuffix: 'para deixar tudo impecável',
    subtitle: 'Profissionais de limpeza residencial e comercial com referências verificadas.',
    desc: 'Faxina completa, limpeza pós-obra e organização residencial.',
    icon: 'sparkles',
    defaultPrice: 160,
    defaultStart: '08:00',
    defaultEnd: '16:00',
    serviceTypeLabel: 'Tipo de limpeza',
    serviceTypes: ['Faxina Completa', 'Limpeza Leve', 'Pós-Obra', 'Passar Roupa'],
    scopeLabel: 'Tamanho do imóvel',
    scopes: ['1 a 2 quartos', '3 quartos', 'Casa grande / Empresa'],
    locationLabel: 'Endereço do imóvel',
    locationPlaceholder: 'Ex: Condomínio Parque das Águas • Paraviana',
    detailsLabel: 'Breve descrição da limpeza',
    detailsPlaceholder: 'Ex: Limpeza detalhada de cozinha, 2 banheiros e vidros da varanda',
    prices: [130, 160, 200, 240]
  },
  Encanador: {
    id: 'cat-encanador',
    name: 'Encanador',
    label: 'Encanador',
    noun: 'encanador',
    plural: 'Encanadores',
    headlineSuffix: 'para resolver vazamentos',
    subtitle: 'Desentupimentos, reparos de vazamentos em pias, registros e caixas d’água.',
    desc: 'Detecção de vazamentos, desentupimento e troca de torneiras.',
    icon: 'water',
    defaultPrice: 140,
    defaultStart: '14:00',
    defaultEnd: '17:00',
    serviceTypeLabel: 'Qual o problema hidráulico?',
    serviceTypes: ['Vazamento Pia / Vaso', 'Desentupimento', 'Troca de Torneira', 'Caixa d’Água'],
    scopeLabel: 'Urgência',
    scopes: ['Emergência hoje', 'Reparo simples', 'Manutenção'],
    locationLabel: 'Endereço do atendimento',
    locationPlaceholder: 'Ex: Av. Ville Roy, 850 • São Pedro',
    detailsLabel: 'Breve descrição do reparo',
    detailsPlaceholder: 'Ex: Sifão da pia da cozinha pingando e registro com pouca pressão',
    prices: [100, 140, 180, 250]
  },
  Reformas: {
    id: 'cat-reformas',
    name: 'Reformas',
    label: 'Consertos & Reparos',
    noun: 'profissional',
    plural: 'Profissionais',
    headlineSuffix: 'para consertos e reparos',
    subtitle: 'Instalação de suportes de TV, montagem de móveis, pintura e marido de aluguel.',
    desc: 'Suporte de TV, montagem de móveis, pintura e pequenos reparos.',
    icon: 'construct',
    defaultPrice: 130,
    defaultStart: '09:00',
    defaultEnd: '13:00',
    serviceTypeLabel: 'Qual reparo precisa?',
    serviceTypes: ['Suporte TV / Painel', 'Pintura', 'Fechaduras & Portas', 'Montagem de Móveis'],
    scopeLabel: 'Volume de tarefas',
    scopes: ['1 item rápido', '2 a 3 itens', 'Diária completa'],
    locationLabel: 'Endereço do atendimento',
    locationPlaceholder: 'Ex: Bairro Aparecida • Boa Vista - RR',
    detailsLabel: 'Breve descrição do serviço',
    detailsPlaceholder: 'Ex: Instalar suporte articulado de TV 55" em parede de alvenaria',
    prices: [100, 130, 170, 220]
  }
};

export const useAppStore = defineStore('app', () => {
  const role = ref('CLIENT'); // 'CLIENT' | 'PROVIDER'
  const chatModalOpen = ref(false);
  const ratingModalOpen = ref(false);
  const ordersModalOpen = ref(false);
  const profileMenuModalOpen = ref(false);
  const proDetailModalOpen = ref(false);
  const activeModalPro = ref(null);
  const activeRequest = ref(null);
  const selectedProfessional = ref(null);
  const selectedCategory = ref('Garçom');

  const categoriesList = ref(Object.values(CATEGORY_CONFIGS));

  // Formulário dinâmico do cliente
  const eventForm = ref({
    categoria: 'Garçom',
    data: new Date().toISOString().split('T')[0],
    horarioInicio: '18:00',
    horarioFim: '00:00',
    qtdProfissionais: '2 garçons',
    tipoEvento: 'Aniversário',
    local: '',
    descricao: '',
    valorOferecido: 200
  });

  // Profissionais em Destaque da Semana (Multicategoria)
  const highlightedProfessionals = ref([
    {
      id: 1,
      nome: 'João Silva',
      categoria: 'Garçom',
      especialidade: 'Garçom para Casamentos e Eventos Sociais',
      bio: 'Mais de 8 anos de experiência em alta gastronomia e eventos sociais. Postura exemplar, uniforme completo e pontualidade.',
      nota: '5,0',
      servicos: 63,
      verificado: true,
      valorBase: 220,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
      badges: ['Super Pontual', 'Nota Máxima', 'Identidade Verificada'],
      reviews: [
        { author: 'Camila S.', rating: 5, comment: 'Impecável no nosso casamento! Todos elogiaram.' },
        { author: 'Rodrigo M.', rating: 5, comment: 'Chegou antes do horário combinado e trabalhou super bem.' }
      ]
    },
    {
      id: 2,
      nome: 'Marcos Lima',
      categoria: 'Garçom',
      especialidade: 'Garçom & Atendimento de Alto Padrão',
      bio: 'Vivência em jantares intimistas, banquetes e eventos empresariais. Discrição, agilidade e simpatia.',
      nota: '4,9',
      servicos: 51,
      verificado: true,
      valorBase: 200,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&q=80',
      badges: ['Recomendado', 'Banquetes', 'Uniforme Impecável'],
      reviews: [
        { author: 'Juliana P.', rating: 5, comment: 'Marcos foi super prestativo e cordial com todos.' }
      ]
    },
    {
      id: 3,
      nome: 'André Costa',
      categoria: 'Garçom',
      especialidade: 'Maitre & Chefe de Salão',
      bio: 'Coordenação de equipes de garçons, organização de buffet e serviço à inglesa para festas.',
      nota: '4,9',
      servicos: 46,
      verificado: true,
      valorBase: 230,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=350&q=80',
      badges: ['Chefe de Salão', 'Liderança', 'Verificado'],
      reviews: [
        { author: 'Luciana R.', rating: 5, comment: 'Coordenou nossa festa perfeitamente!' }
      ]
    },
    {
      id: 8,
      nome: 'Carlos Oliveira',
      categoria: 'Eletricista',
      especialidade: 'Eletricista Residencial e Comercial',
      bio: 'Técnico credenciado com CREA ativo. Especialista em quadros de distribuição, iluminação em LED e chuveiros.',
      nota: '5,0',
      servicos: 78,
      verificado: true,
      valorBase: 150,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=350&q=80',
      badges: ['Certificado CREA', 'Garantia de 90 dias', 'Rapidez'],
      reviews: [
        { author: 'Fernanda L.', rating: 5, comment: 'Identificou o curto no disjuntor em 10 minutos.' }
      ]
    },
    {
      id: 9,
      nome: 'Mariana Santos',
      categoria: 'Diarista',
      especialidade: 'Higienização e Faxina Residencial',
      bio: 'Especialista em limpeza detalhada, organização de armários e higienização completa.',
      nota: '5,0',
      servicos: 92,
      verificado: true,
      valorBase: 160,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=350&q=80',
      badges: ['Super Recomendada', 'Produtos Inclusos', 'Confiabilidade'],
      reviews: [
        { author: 'Ana Paula T.', rating: 5, comment: 'Apartamento ficou impecável! Muito atenciosa.' }
      ]
    },
    {
      id: 7,
      nome: 'Roberto Dias',
      categoria: 'Encanador',
      especialidade: 'Detecção de Vazamentos e Desentupimentos',
      bio: 'Encanador com ferramentas eletrônicas para localização de vazamentos sem quebrar parede.',
      nota: '4,9',
      servicos: 54,
      verificado: true,
      valorBase: 140,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=350&q=80',
      badges: ['Geofone Próprio', 'Garantia de Serviço'],
      reviews: [
        { author: 'Bruno C.', rating: 5, comment: 'Resolveu o vazamento sem danificar a parede.' }
      ]
    },
    {
      id: 10,
      nome: 'Felipe Ramos',
      categoria: 'Reformas',
      especialidade: 'Pintura, Montagem e Pequenos Reparos',
      bio: 'Marido de aluguel completo: instalação de suportes de TV, fechaduras, cortinas e reparos.',
      nota: '4,9',
      servicos: 61,
      verificado: true,
      valorBase: 130,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=350&q=80',
      badges: ['Pontualidade', 'Capricho'],
      reviews: [
        { author: 'Patrícia M.', rating: 5, comment: 'Serviço rápido e com muita limpeza.' }
      ]
    }
  ]);

  // Profissionais Disponíveis
  const availableProfessionals = ref([
    {
      id: 4,
      nome: 'Lucas Almeida',
      categoria: 'Garçom',
      especialidade: 'Garçom & Bartender para Eventos',
      bio: 'Especialista em atendimento de salão, coquetelaria clássica e serviço volante.',
      nota: '4,9',
      servicos: 47,
      exp: '5 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 200,
      tags: ['Garçom', 'Eventos', 'Restaurantes'],
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=350&q=80',
      badges: ['Bartender Pro', 'Atendimento Rápido'],
      reviews: [
        { author: 'Eduardo G.', rating: 5, comment: 'Excelente! Fez os drinks da festa e serviu super bem.' }
      ]
    },
    {
      id: 5,
      nome: 'Carlos Mendes',
      categoria: 'Garçom',
      especialidade: 'Garçom para Festas e Eventos Sociais',
      bio: 'Ampla bagagem em casamentos, formaturas e confraternizações.',
      nota: '4,8',
      servicos: 32,
      exp: '4 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 190,
      tags: ['Garçom', 'Eventos sociais'],
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=350&q=80',
      badges: ['Pontualidade', 'Atencioso'],
      reviews: [
        { author: 'Marcos V.', rating: 5, comment: 'Muito solícito e educado com todos os convidados.' }
      ]
    },
    {
      id: 6,
      nome: 'Rafael Souza',
      categoria: 'Garçom',
      especialidade: 'Garçom para Festas, Churrascos e Eventos',
      bio: 'Atendimento dinâmico com experiência em churrascos e festas de família.',
      nota: '4,7',
      servicos: 28,
      exp: '3 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 180,
      tags: ['Garçom', 'Festas e eventos'],
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=350&q=80',
      badges: ['Simpático', 'Dinâmico'],
      reviews: [
        { author: 'Juliana R.', rating: 5, comment: 'Super rápido na entrega e muito gentil.' }
      ]
    },
    {
      id: 13,
      nome: 'Leonardo Prado',
      categoria: 'Eletricista',
      especialidade: 'Instalação de Padrão e Painéis',
      bio: 'Eletrotécnico experiente em cabeamento residencial, tomadas 20A e disjuntores.',
      nota: '4,9',
      servicos: 64,
      exp: '5 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 150,
      tags: ['Eletricista', 'Disjuntores', 'Iluminação'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
      badges: ['CREA Ativo', 'Atendimento Rápido'],
      reviews: [
        { author: 'Valéria F.', rating: 5, comment: 'Resolveu a queda de energia muito rápido.' }
      ]
    },
    {
      id: 14,
      nome: 'Solange Ferreira',
      categoria: 'Diarista',
      especialidade: 'Faxina Residencial Completa',
      bio: 'Diarista detalhista com referências verificadas. Foco em cozinha e banheiros.',
      nota: '4,9',
      servicos: 73,
      exp: '7 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 160,
      tags: ['Diarista', 'Faxina Geral', 'Cozinha'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=80',
      badges: ['Super Avaliada', 'Caprichosa'],
      reviews: [
        { author: 'Paula M.', rating: 5, comment: 'Casa cheirosa e impecável!' }
      ]
    },
    {
      id: 15,
      nome: 'Marcos Paulo',
      categoria: 'Encanador',
      especialidade: 'Conserto de Válvulas e Tubulações',
      bio: 'Instalação de registros, reparo de caixas acopladas, sifões e torneiras.',
      nota: '4,8',
      servicos: 41,
      exp: '4 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 140,
      tags: ['Encanador', 'Registros', 'Sifões'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&q=80',
      badges: ['Pontualidade', 'Garantia'],
      reviews: [
        { author: 'Diego S.', rating: 5, comment: 'Trocou a válvula rapidamente e sem sujeira.' }
      ]
    }
  ]);

  // Pedidos do Cliente (Meus Pedidos)
  const initialOrdersList = [
    {
      id: 'ord-101',
      categoria: 'Garçom',
      title: 'Garçom • Casamento (2 garçons)',
      date: '15/08/2026',
      time: '17:00 às 00:00',
      location: 'Espaço Villa Real • Boa Vista - RR',
      budget: 220,
      price: 220,
      status: 'IN_PROGRESS',
      statusLabel: 'Em andamento',
      rated: false,
      professional: {
        id: 1,
        name: 'João Silva',
        nome: 'João Silva',
        categoria: 'Garçom',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: '5,0'
      }
    },
    {
      id: 'ord-102',
      categoria: 'Eletricista',
      title: 'Eletricista • Curto / Disjuntor',
      date: '28/10/2026',
      time: '14:00',
      location: 'Centro • Boa Vista - RR',
      budget: 150,
      price: 150,
      status: 'COMPLETED',
      statusLabel: 'Concluído',
      rated: true,
      userRating: 5,
      professional: {
        id: 8,
        name: 'Carlos Oliveira',
        nome: 'Carlos Oliveira',
        categoria: 'Eletricista',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating: '5,0'
      }
    }
  ];

  const ordersList = ref(JSON.parse(JSON.stringify(initialOrdersList)));

  // ================= ESTADO DO TRABALHADOR (PROVIDER) =================
  const walletBalance = ref(180.00);

  const initialWorkerProfile = {
    name: 'Carlos Oliveira',
    categoria: 'Garçom & Multiserviços',
    category: 'Garçom',
    pixKey: 'carlos.oliveira@pix.com.br',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    level: 4,
    levelName: 'Profissional Ouro • Verificado',
    rating: '4,9',
    completedJobs: 42,
    xp: 3100,
    nextLevelXp: 4000,
    activeBoost: null
  };

  const workerProfile = ref({ ...initialWorkerProfile });

  const initialJobLeads = [
    {
      id: 'job-1',
      category: 'Garçom',
      title: 'Casamento no Espaço Villa Real',
      clientName: 'Fernanda Costa',
      clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      budget: 250,
      date: 'Hoje',
      time: '18:00',
      endTime: '00:00',
      scope: '2 garçons • 120 convidados',
      location: 'Boa Vista - RR • Centro',
      description: 'Serviço de coquetel volante e apoio de buffet. Traje social preto.',
      photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'job-2',
      category: 'Eletricista',
      title: 'Troca de Disjuntor e Chuveiro 220V',
      clientName: 'Roberto Almeida',
      clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      budget: 160,
      date: 'Hoje',
      time: '15:00',
      endTime: '17:00',
      scope: 'Reparo simples • Residencial',
      location: 'Boa Vista - RR • Caçari',
      description: 'Disjuntor do banheiro desarmando ao ligar o chuveiro novo.',
      photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'job-3',
      category: 'Diarista',
      title: 'Faxina Completa em Apartamento',
      clientName: 'Juliana Mendes',
      clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      budget: 170,
      date: 'Amanhã',
      time: '08:00',
      endTime: '15:00',
      scope: '2 quartos • Produtos no local',
      location: 'Boa Vista - RR • Paraviana',
      description: 'Limpeza geral de sala, cozinha, 2 quartos e varanda.',
      photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const jobLeads = ref([...initialJobLeads]);
  const acceptedJobs = ref([]);

  const initialTransactions = [
    {
      id: 'tx-1',
      type: 'EARNING',
      title: 'Casamento Espaço Jardins',
      amount: 220.00,
      date: 'Hoje, 14:10'
    },
    {
      id: 'tx-2',
      type: 'DEBIT',
      title: 'Taxa da plataforma (5%)',
      amount: -11.00,
      date: 'Hoje, 14:10'
    },
    {
      id: 'tx-3',
      type: 'EARNING',
      title: 'Instalação de Luminárias LED',
      amount: 180.00,
      date: 'Ontem'
    }
  ];

  const transactions = ref(JSON.parse(JSON.stringify(initialTransactions)));

  // ================= ACTIONS UNIFICADAS =================
  function normalizePro(pro) {
    if (!pro) {
      const fallback = highlightedProfessionals.value[0];
      return {
        id: fallback.id,
        name: fallback.nome,
        nome: fallback.nome,
        categoria: fallback.categoria,
        avatar: fallback.avatar,
        rating: fallback.nota,
        nota: fallback.nota,
        valorBase: fallback.valorBase
      };
    }
    return {
      ...pro,
      name: pro.name || pro.nome || 'Profissional +SERVE',
      nome: pro.nome || pro.name || 'Profissional +SERVE',
      rating: pro.rating || pro.nota || '5,0',
      nota: pro.nota || pro.rating || '5,0'
    };
  }

  function selectProfessional(pro) {
    selectedProfessional.value = pro ? normalizePro(pro) : null;
    if (pro) {
      if (pro.categoria) eventForm.value.categoria = pro.categoria;
      if (pro.valorBase) eventForm.value.valorOferecido = pro.valorBase;
    }
  }

  function clearSelectedProfessional() {
    selectedProfessional.value = null;
  }

  function openChatWithPro(pro, orderContext = null) {
    const normalized = normalizePro(pro);
    activeRequest.value = {
      id: orderContext?.id || `req-${Date.now()}`,
      category: orderContext?.categoria || normalized.categoria || eventForm.value.categoria,
      title: orderContext?.title || `${normalized.categoria || 'Serviço'} • ${eventForm.value.tipoEvento}`,
      date: orderContext?.date || eventForm.value.data,
      time: orderContext?.time || eventForm.value.horarioInicio,
      location: orderContext?.location || eventForm.value.descricao || 'Boa Vista - RR',
      budget: orderContext?.budget || normalized.valorBase || eventForm.value.valorOferecido,
      status: orderContext?.status || 'IN_PROGRESS',
      professional: normalized,
      selectedOffer: {
        professional: normalized
      }
    };
    chatModalOpen.value = true;
  }

  function openProDetail(pro) {
    activeModalPro.value = normalizePro(pro);
    proDetailModalOpen.value = true;
  }

  function createNewOrder(proOrData = null) {
    const isDirectPro = proOrData && (proOrData.nome || proOrData.name || proOrData.especialidade);
    const rawPro = isDirectPro ? proOrData : (proOrData?.professional || selectedProfessional.value || highlightedProfessionals.value[0]);
    const pro = normalizePro(rawPro);
    const cat = (!isDirectPro && proOrData?.categoria) || eventForm.value.categoria;
    const tipo = (!isDirectPro && proOrData?.tipoEvento) || eventForm.value.tipoEvento;
    const escopo = (!isDirectPro && proOrData?.qtdProfissionais) || eventForm.value.qtdProfissionais;
    const priceVal = Number((!isDirectPro && proOrData?.valorOferecido) || eventForm.value.valorOferecido) || 150;

    const startTime = (!isDirectPro && proOrData?.horarioInicio) || eventForm.value.horarioInicio || '18:00';
    const endTime = (!isDirectPro && proOrData?.horarioFim) || eventForm.value.horarioFim || '00:00';
    const locText = (!isDirectPro && proOrData?.local) || eventForm.value.local || 'Boa Vista - RR';
    const descText = (!isDirectPro && proOrData?.descricao) || eventForm.value.descricao || `Atendimento de ${cat.toLowerCase()} (${tipo.toLowerCase()}).`;

    const newOrd = {
      id: `ord-${Date.now()}`,
      categoria: cat,
      title: `${cat} • ${tipo} (${escopo})`,
      date: (!isDirectPro && proOrData?.data) || eventForm.value.data,
      time: `${startTime} às ${endTime}`,
      location: locText,
      description: descText,
      budget: priceVal,
      price: priceVal,
      status: 'IN_PROGRESS',
      statusLabel: 'Profissional Confirmado',
      rated: false,
      professional: pro
    };

    ordersList.value.unshift(newOrd);
    activeRequest.value = {
      ...newOrd,
      selectedOffer: { professional: pro }
    };

    // Também adiciona como oportunidade no painel do Trabalhador para manter o MVP 100% conectado
    jobLeads.value.unshift({
      id: `job-${Date.now()}`,
      orderId: newOrd.id,
      category: cat,
      subType: tipo,
      title: `${tipo} (${escopo})`,
      clientName: 'Cliente +SERVE (Você)',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      budget: newOrd.budget,
      date: newOrd.date,
      time: startTime,
      endTime: endTime,
      proCount: escopo,
      scope: escopo,
      location: locText,
      description: descText,
      photoUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
    });

    return newOrd;
  }

  // Concluir pedido pelo Cliente (com nota e avaliação)
  function completeRequest(orderId, ratingStars = 5, comment = '') {
    const ord = ordersList.value.find(o => o.id === orderId) || activeRequest.value;
    if (ord) {
      ord.status = 'COMPLETED';
      ord.statusLabel = 'Concluído';
      ord.rated = true;
      ord.userRating = ratingStars;

      const targetOrder = ordersList.value.find(o => o.id === ord.id);
      if (targetOrder) {
        targetOrder.status = 'COMPLETED';
        targetOrder.statusLabel = 'Concluído';
        targetOrder.rated = true;
        targetOrder.userRating = ratingStars;
      }

      // Adiciona a avaliação ao perfil do profissional se houver comentário
      const proId = ord.professional?.id;
      const allPros = [...highlightedProfessionals.value, ...availableProfessionals.value];
      const foundPro = allPros.find(p => p.id === proId || p.nome === ord.professional?.name);
      if (foundPro) {
        foundPro.servicos = (Number(foundPro.servicos) || 40) + 1;
        if (comment.trim()) {
          foundPro.reviews = foundPro.reviews || [];
          foundPro.reviews.unshift({
            author: 'Você (Cliente)',
            rating: ratingStars,
            comment: comment.trim()
          });
        }
      }
    }
    chatModalOpen.value = false;
    ratingModalOpen.value = false;
  }

  function cancelOrder(orderId) {
    ordersList.value = ordersList.value.filter(o => o.id !== orderId);
    if (activeRequest.value?.id === orderId) {
      activeRequest.value = null;
    }
  }

  // Aceitar serviço pelo Trabalhador
  function acceptJobLead(job) {
    const activeJob = {
      ...job,
      acceptedAt: 'Agora mesmo',
      status: 'ACCEPTED'
    };
    acceptedJobs.value.unshift(activeJob);
    jobLeads.value = jobLeads.value.filter(j => j.id !== job.id);
    return activeJob;
  }

  // Finalizar serviço pelo Trabalhador e receber pagamento na carteira
  function completeWorkerJob(jobId) {
    const idx = acceptedJobs.value.findIndex(j => j.id === jobId);
    if (idx === -1) return null;

    const job = acceptedJobs.value[idx];
    const fee = Math.round(job.budget * 0.05);
    const netAmount = job.budget - fee;

    walletBalance.value += netAmount;
    workerProfile.value.completedJobs += 1;
    workerProfile.value.xp = Math.min(workerProfile.value.nextLevelXp, workerProfile.value.xp + 250);

    transactions.value.unshift(
      {
        id: `tx-earn-${Date.now()}`,
        type: 'EARNING',
        title: `Serviço Concluído: ${job.title}`,
        amount: job.budget,
        date: 'Agora mesmo'
      },
      {
        id: `tx-fee-${Date.now() + 1}`,
        type: 'DEBIT',
        title: `Taxa da plataforma (5%)`,
        amount: -fee,
        date: 'Agora mesmo'
      }
    );

    acceptedJobs.value.splice(idx, 1);
    return { job, netAmount, fee };
  }

  function withdrawPix(amount, pixKey) {
    const val = Number(amount) || 0;
    if (val <= 0 || val > walletBalance.value) return false;
    walletBalance.value -= val;
    if (pixKey) workerProfile.value.pixKey = pixKey;
    transactions.value.unshift({
      id: `tx-pix-${Date.now()}`,
      type: 'DEBIT',
      title: `Saque PIX enviado (${workerProfile.value.pixKey})`,
      amount: -val,
      date: 'Agora mesmo'
    });
    return true;
  }

  function rechargeWallet(amount) {
    const val = Number(amount) || 0;
    if (val <= 0) return false;
    walletBalance.value += val;
    transactions.value.unshift({
      id: `tx-rec-${Date.now()}`,
      type: 'RECHARGE',
      title: 'Recarga via PIX',
      amount: val,
      date: 'Agora mesmo'
    });
    return true;
  }

  function skipJobLead(jobId) {
    jobLeads.value = jobLeads.value.filter(j => j.id !== jobId);
  }

  function resetJobLeads() {
    jobLeads.value = JSON.parse(JSON.stringify(initialJobLeads));
  }

  // Restaura todos os estados da aplicação para o início da apresentação (Demo Reset)
  function resetPresentation() {
    ordersList.value = JSON.parse(JSON.stringify(initialOrdersList));
    jobLeads.value = JSON.parse(JSON.stringify(initialJobLeads));
    acceptedJobs.value = [];
    walletBalance.value = 180.00;
    workerProfile.value = { ...initialWorkerProfile };
    transactions.value = JSON.parse(JSON.stringify(initialTransactions));
    selectedProfessional.value = null;
    activeRequest.value = null;
    selectedCategory.value = 'Garçom';
    eventForm.value = {
      categoria: 'Garçom',
      data: new Date().toISOString().split('T')[0],
      horarioInicio: '18:00',
      horarioFim: '00:00',
      qtdProfissionais: '2 garçons',
      tipoEvento: 'Aniversário',
      local: '',
      descricao: '',
      valorOferecido: 200
    };
    chatModalOpen.value = false;
    ratingModalOpen.value = false;
    ordersModalOpen.value = false;
    profileMenuModalOpen.value = false;
    proDetailModalOpen.value = false;
  }

  return {
    role,
    chatModalOpen,
    ratingModalOpen,
    ordersModalOpen,
    profileMenuModalOpen,
    proDetailModalOpen,
    activeModalPro,
    activeRequest,
    selectedProfessional,
    selectedCategory,
    categoriesList,
    eventForm,
    highlightedProfessionals,
    availableProfessionals,
    ordersList,
    walletBalance,
    workerProfile,
    jobLeads,
    acceptedJobs,
    transactions,
    selectProfessional,
    clearSelectedProfessional,
    openProDetail,
    openChatWithPro,
    createNewOrder,
    completeRequest,
    cancelOrder,
    acceptJobLead,
    skipJobLead,
    completeWorkerJob,
    withdrawPix,
    rechargeWallet,
    resetJobLeads,
    resetPresentation
  };
});
