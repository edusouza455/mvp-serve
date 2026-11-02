import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // State
  const role = ref('CLIENT'); // 'CLIENT' | 'PROVIDER'
  const walletBalance = ref(20.00);
  const activeRequest = ref(null);
  const chatModalOpen = ref(false);

  // Usuário mockado simulando sessão ativa (Cliente)
  const currentUser = ref({
    name: 'Eduardo M.',
    email: 'eduardo@exemplo.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  });

  // Perfil do Prestador de Serviço (Gamificado)
  const providerProfile = ref({
    name: 'Carlos Oliveira',
    title: 'Eletricista Residencial e Comercial',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    phone: '(11) 98765-4321',
    bio: 'Profissional certificado com mais de 8 anos de experiência em manutenções, quadros elétricos e iluminação de alto padrão.',
    category: 'Eletricista',
    rating: 4.9,
    completedJobs: 28,
    level: 3,
    levelName: 'Especialista Ouro',
    xp: 2850,
    nextLevelXp: 3500,
    badges: [
      { id: 'b1', name: 'Super Pontual', icon: 'flash', desc: 'Chegou no horário em 98% dos chamados' },
      { id: 'b2', name: 'Nota Máxima', icon: 'star', desc: 'Mais de 25 avaliações 5 estrelas' },
      { id: 'b3', name: 'Documento Verificado', icon: 'shield-checkmark', desc: 'Identidade e antecedentes validados' }
    ]
  });

  // Histórico Financeiro da Carteira do Prestador
  const walletTransactions = ref([
    {
      id: 'tx-1',
      type: 'EARNING', // Ganho de trabalho feito
      title: 'Instalação Elétrica - Residencial Jardins',
      amount: 180.00,
      date: 'Hoje, às 11:20',
      status: 'Concluído'
    },
    {
      id: 'tx-2',
      type: 'DEBIT', // Taxa da plataforma
      title: 'Taxa de conexão da plataforma (5%)',
      amount: -9.00,
      date: 'Hoje, às 11:20',
      status: 'Debitado'
    },
    {
      id: 'tx-3',
      type: 'EARNING',
      title: 'Troca de Disjuntores e Quadro - Bela Vista',
      amount: 220.00,
      date: 'Ontem',
      status: 'Concluído'
    },
    {
      id: 'tx-4',
      type: 'RECHARGE',
      title: 'Recarga de Saldo via PIX',
      amount: 20.00,
      date: '28 Out',
      status: 'Aprovado'
    }
  ]);

  // Planos de Impulsos (Gamificado / Estratégia de Preço)
  const boostPlans = ref([
    {
      id: 'boost-basic',
      name: 'Impulso Básico',
      tag: 'Pouco vantajoso',
      price: 9.90,
      duration: '24 horas',
      multiplier: '1.2x',
      desc: 'Destaque sutil na lista. Indicado apenas para quem atende poucos bairros.',
      isPopular: false
    },
    {
      id: 'boost-ideal',
      name: 'Impulso Turbo Pro',
      tag: 'Mais Escolhido • Ideal',
      price: 24.90,
      duration: '7 dias',
      multiplier: '3.5x',
      desc: 'Prioridade máxima no raio de 15km, selo Turbo Ouro e notificações prioritárias.',
      isPopular: true
    },
    {
      id: 'boost-premium',
      name: 'Impulso Ilimitado Vip',
      tag: 'Alta Performance',
      price: 79.90,
      duration: '30 dias',
      multiplier: '5.0x',
      desc: 'Exposição no topo para toda a cidade, consultor dedicado e relatórios de demanda.',
      isPopular: false
    }
  ]);

  // Mock de Profissionais
  const professionals = ref([
    {
      id: 'p1',
      name: 'Carlos Oliveira',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: 4.9,
      description: 'Especialista em instalações elétricas e reparos rápidos com 8 anos de experiência.'
    },
    {
      id: 'p2',
      name: 'Mariana Santos',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      rating: 4.8,
      description: 'Diarista e higienização residencial com atendimento detalhista e materiais inclusos.'
    },
    {
      id: 'p3',
      name: 'Lucas Ferreira',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      rating: 5.0,
      description: 'Garçom profissional para eventos sociais e corporativos, com postura e agilidade.'
    }
  ]);

  // Mock inicial de eventos
  const initialRequests = [
    {
      id: 'req-mock-1',
      category: 'Eletricista',
      date: '2026-11-03',
      time: '14:30',
      location: 'Av. Paulista, 1000 - Apto 42',
      budget: 120,
      description: 'Instalação de duas luminárias pendentes e troca de disjuntor principal.',
      status: 'PENDING',
      isExpanded: true,
      createdAt: new Date().toISOString(),
      offers: [
        {
          id: 'offer-mock-1-1',
          requestId: 'req-mock-1',
          professional: professionals.value[0],
          price: 120,
          message: 'Posso chegar no horário combinado com as ferramentas adequadas.'
        },
        {
          id: 'offer-mock-1-2',
          requestId: 'req-mock-1',
          professional: professionals.value[1],
          price: 135,
          message: 'Disponibilidade imediata e garantia de acabamento limpo.'
        }
      ]
    },
    {
      id: 'req-mock-2',
      category: 'Diarista',
      date: '2026-10-28',
      time: '09:00',
      location: 'Rua Augusta, 450 - Consolação',
      budget: 160,
      description: 'Faxina completa de apartamento de 2 quartos com foco na cozinha e banheiros.',
      status: 'COMPLETED',
      isExpanded: false,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      selectedOffer: {
        id: 'offer-mock-2-1',
        requestId: 'req-mock-2',
        professional: professionals.value[1],
        price: 160,
        message: 'Serviço executado com sucesso e produtos de limpeza profissionais inclusos.'
      },
      offers: []
    }
  ];

  const requests = ref([...initialRequests]);
  activeRequest.value = requests.value[0];

  // Actions
  function toggleRole() {
    role.value = role.value === 'CLIENT' ? 'PROVIDER' : 'CLIENT';
  }

  function setRole(newRole) {
    role.value = newRole;
  }

  function updateProviderProfile(updatedData) {
    providerProfile.value = {
      ...providerProfile.value,
      ...updatedData
    };
  }

  function addWalletFunds(amount, method = 'PIX') {
    const val = Number(amount);
    if (val <= 0) return;
    walletBalance.value += val;
    walletTransactions.value.unshift({
      id: `tx-${Date.now()}`,
      type: 'RECHARGE',
      title: `Recarga de Saldo via ${method}`,
      amount: val,
      date: 'Agora mesmo',
      status: 'Aprovado'
    });
  }

  function buyBoost(plan, method = 'PIX') {
    walletTransactions.value.unshift({
      id: `boost-${Date.now()}`,
      type: 'DEBIT',
      title: `Aquisição: ${plan.name} (${method})`,
      amount: -plan.price,
      date: 'Agora mesmo',
      status: 'Ativo'
    });
    // Gamificação: adiciona XP ao profissional
    providerProfile.value.xp += 150;
  }

  function createRequest(requestData) {
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const newReq = {
      ...requestData,
      id,
      status: 'PENDING',
      offers: [],
      selectedOffer: null,
      isExpanded: true,
      createdAt: new Date().toISOString()
    };

    requests.value.unshift(newReq);
    activeRequest.value = newReq;

    setTimeout(() => {
      const targetReq = requests.value.find((r) => r.id === id);
      if (!targetReq || targetReq.status === 'COMPLETED') return;

      const baseBudget = Number(targetReq.budget) || 100;

      const offer1 = {
        id: `offer-${id}-1`,
        requestId: id,
        professional: professionals.value[0],
        price: baseBudget,
        message: 'Posso realizar o serviço com qualidade e pontualidade hoje mesmo.'
      };

      const offer2 = {
        id: `offer-${id}-2`,
        requestId: id,
        professional: professionals.value[1],
        price: Math.round(baseBudget * 1.1),
        message: 'Disponível com garantia total e materiais inclusos.'
      };

      targetReq.offers = [offer1, offer2];
    }, 1000);

    return newReq;
  }

  function toggleExpandRequest(requestId) {
    const req = requests.value.find((r) => r.id === requestId);
    if (req) {
      req.isExpanded = !req.isExpanded;
    }
  }

  function acceptProfessional(offer, reqId) {
    if (!offer || !offer.price) {
      throw new Error('Oferta inválida');
    }

    const targetReq = requests.value.find((r) => r.id === (reqId || offer.requestId)) || activeRequest.value;
    if (targetReq) {
      targetReq.status = 'IN_PROGRESS';
      targetReq.selectedOffer = offer;
      activeRequest.value = targetReq;
    }

    chatModalOpen.value = true;
  }

  function completeRequest(requestId) {
    const targetReq = requests.value.find((r) => r.id === requestId) || activeRequest.value;
    if (targetReq) {
      targetReq.status = 'COMPLETED';
    }
    chatModalOpen.value = false;
  }

  function resetDemo() {
    role.value = 'CLIENT';
    walletBalance.value = 20.00;
    requests.value = [...initialRequests];
    activeRequest.value = requests.value[0];
    chatModalOpen.value = false;
  }

  return {
    role,
    walletBalance,
    currentUser,
    providerProfile,
    walletTransactions,
    boostPlans,
    requests,
    activeRequest,
    chatModalOpen,
    professionals,
    toggleRole,
    setRole,
    updateProviderProfile,
    addWalletFunds,
    buyBoost,
    createRequest,
    toggleExpandRequest,
    acceptProfessional,
    completeRequest,
    resetDemo
  };
});
