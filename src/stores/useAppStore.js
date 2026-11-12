import { defineStore } from 'pinia';
import { ref } from 'vue';

// Configuração única e centralizada das categorias (Single Source of Truth)
export const CATEGORY_CONFIGS = {
  Garçom: {
    id: 'cat-garcom',
    name: 'Garçom',
    group: 'Eventos',
    label: 'Garçom',
    noun: 'garçom',
    plural: 'Garçons',
    headlineSuffix: 'para seu evento',
    subtitle: 'Garçons experientes para festas e eventos com confirmação rápida.',
    desc: 'Garçons, bartenders e apoio de salão.',
    icon: 'restaurant',
    photoUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 200,
    defaultStart: '18:00',
    defaultEnd: '00:00',
    serviceTypeLabel: 'Tipo de evento',
    serviceTypes: ['Aniversário', 'Casamento', 'Churrasco', 'Corporativo', 'Jantar'],
    scopeLabel: 'Quantidade',
    scopes: ['1 garçom', '2 garçons', '3 ou mais'],
    locationLabel: 'Local',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Traje social, bebidas e salgados',
    prices: [150, 200, 250, 320]
  },
  Bartender: {
    id: 'cat-bartender',
    name: 'Bartender',
    group: 'Eventos',
    label: 'Bartender',
    noun: 'bartender',
    plural: 'Bartenders',
    headlineSuffix: 'para o seu evento',
    subtitle: 'Drinks clássicos e autorais com confirmação rápida.',
    desc: 'Preparo de drinks clássicos e coquetéis.',
    icon: 'wine',
    photoUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 240,
    defaultStart: '19:00',
    defaultEnd: '01:00',
    serviceTypeLabel: 'Formato do bar',
    serviceTypes: ['Festa / Aniversário', 'Casamento', 'Corporativo', 'Drinks & Caipirinhas'],
    scopeLabel: 'Quantidade',
    scopes: ['1 bartender', '2 bartenders', 'Equipe'],
    locationLabel: 'Local',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Cardápio de drinks clássicos',
    prices: [180, 240, 300, 380]
  },
  Churrasqueiro: {
    id: 'cat-churrasqueiro',
    name: 'Churrasqueiro',
    group: 'Eventos',
    label: 'Churrasqueiro',
    noun: 'churrasqueiro',
    plural: 'Churrasqueiros',
    headlineSuffix: 'para seu churrasco',
    subtitle: 'Mestres churrasqueiros no ponto certo.',
    desc: 'Cortes nobres e churrasco tradicional.',
    icon: 'flame',
    photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 220,
    defaultStart: '11:00',
    defaultEnd: '17:00',
    serviceTypeLabel: 'Ocasião',
    serviceTypes: ['Família', 'Confraternização', 'Aniversário', 'Parrilla'],
    scopeLabel: 'Convidados',
    scopes: ['Até 25 pessoas', '25 a 50 pessoas', '50+ pessoas'],
    locationLabel: 'Local',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Carnes na grelha e acompanhamentos',
    prices: [170, 220, 280, 350]
  },
  Eletricista: {
    id: 'cat-eletricista',
    name: 'Eletricista',
    group: 'Casa',
    label: 'Eletricista',
    noun: 'eletricista',
    plural: 'Eletricistas',
    headlineSuffix: 'para sua residência',
    subtitle: 'Instalações e reparos elétricos com segurança.',
    desc: 'Tomadas, chuveiros, disjuntores e iluminação.',
    icon: 'flash',
    photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 150,
    defaultStart: '09:00',
    defaultEnd: '12:00',
    serviceTypeLabel: 'Serviço',
    serviceTypes: ['Curto / Disjuntor', 'Chuveiro', 'Tomadas & LEDs', 'Instalação'],
    scopeLabel: 'Porte',
    scopes: ['Reparo simples', 'Médio porte', 'Revisão geral'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Chuveiro ou disjuntor desarmando',
    prices: [100, 150, 200, 280]
  },
  Encanador: {
    id: 'cat-encanador',
    name: 'Encanador',
    group: 'Casa',
    label: 'Encanador',
    noun: 'encanador',
    plural: 'Encanadores',
    headlineSuffix: 'para vazamentos e reparos',
    subtitle: 'Desentupimentos e reparos hidráulicos rápidos.',
    desc: 'Vazamentos, torneiras e desentupimentos.',
    icon: 'water',
    photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 140,
    defaultStart: '14:00',
    defaultEnd: '17:00',
    serviceTypeLabel: 'Serviço',
    serviceTypes: ['Vazamento', 'Desentupimento', 'Torneira / Registro', 'Caixa d’Água'],
    scopeLabel: 'Urgência',
    scopes: ['Urgente hoje', 'Reparo simples', 'Manutenção'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Vazamento de pia ou registro',
    prices: [100, 140, 180, 250]
  },
  Reformas: {
    id: 'cat-reformas',
    name: 'Reformas',
    group: 'Casa',
    label: 'Reformas & Reparos',
    noun: 'profissional',
    plural: 'Profissionais',
    headlineSuffix: 'para consertos em geral',
    subtitle: 'Pequenos reparos, pintura e montagem.',
    desc: 'Suporte de TV, montagem e pequenos reparos.',
    icon: 'construct',
    photoUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 130,
    defaultStart: '09:00',
    defaultEnd: '13:00',
    serviceTypeLabel: 'Serviço',
    serviceTypes: ['Suporte TV / Painel', 'Pintura', 'Portas / Fechaduras', 'Montagem'],
    scopeLabel: 'Volume',
    scopes: ['1 item rápido', '2 a 3 itens', 'Diária completa'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Instalar suporte de TV ou móvel',
    prices: [100, 130, 170, 220]
  },
  Diarista: {
    id: 'cat-diarista',
    name: 'Diarista',
    group: 'Limpeza',
    label: 'Diarista',
    noun: 'diarista',
    plural: 'Diaristas',
    headlineSuffix: 'para limpeza impecável',
    subtitle: 'Limpeza residencial com referências.',
    desc: 'Faxina completa e organização.',
    icon: 'sparkles',
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 160,
    defaultStart: '08:00',
    defaultEnd: '16:00',
    serviceTypeLabel: 'Tipo de faxina',
    serviceTypes: ['Completa', 'Leve / Manutenção', 'Armários', 'Vidros'],
    scopeLabel: 'Imóvel',
    scopes: ['1 a 2 quartos', '3 quartos', 'Casa grande'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Foco em cozinha e banheiros',
    prices: [130, 160, 200, 240]
  },
  'Pós-Obra': {
    id: 'cat-pos-obra',
    name: 'Pós-Obra',
    group: 'Limpeza',
    label: 'Pós-Obra',
    noun: 'especialista pós-obra',
    plural: 'Profissionais Pós-Obra',
    headlineSuffix: 'para limpeza pesada',
    subtitle: 'Remoção de poeira e resíduos de reforma.',
    desc: 'Limpeza pesada pós-reforma ou mudança.',
    icon: 'home',
    photoUrl: 'https://images.unsplash.com/photo-1527515637462-bg52b55f8b53?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 220,
    defaultStart: '08:00',
    defaultEnd: '17:00',
    serviceTypeLabel: 'Tipo de limpeza',
    serviceTypes: ['Pós-Reforma', 'Pré-Mudança', 'Comercial', 'Piso e Vidros'],
    scopeLabel: 'Porte',
    scopes: ['Compacto', 'Médio (3 qtos)', 'Amplo'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Poeira de gesso e pintura',
    prices: [180, 220, 280, 360]
  },
  Passadeira: {
    id: 'cat-passadeira',
    name: 'Passadeira',
    group: 'Limpeza',
    label: 'Passadeira',
    noun: 'passadeira',
    plural: 'Passadeiras',
    headlineSuffix: 'para passar suas roupas',
    subtitle: 'Roupas do dia a dia e peças delicadas.',
    desc: 'Passadoria de roupas e peças finas.',
    icon: 'shirt',
    photoUrl: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 140,
    defaultStart: '09:00',
    defaultEnd: '14:00',
    serviceTypeLabel: 'Peças',
    serviceTypes: ['Camisas Sociais', 'Dia a Dia', 'Cama & Mesa', 'Geral'],
    scopeLabel: 'Volume',
    scopes: ['Até 25 peças', '25 a 45 peças', '45+ peças'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Camisas sociais e roupas da semana',
    prices: [110, 140, 180, 220]
  },
  Segurança: {
    id: 'cat-seguranca',
    name: 'Segurança',
    group: 'Eventos',
    label: 'Segurança',
    noun: 'segurança',
    plural: 'Seguranças',
    headlineSuffix: 'para seu evento',
    subtitle: 'Controle de acesso, portaria e segurança privada.',
    desc: 'Segurança para festas, eventos e controle de acesso.',
    icon: 'shield',
    photoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 250,
    defaultStart: '19:00',
    defaultEnd: '03:00',
    serviceTypeLabel: 'Ocasião',
    serviceTypes: ['Festa Privada', 'Casamento / 15 anos', 'Portaria de Evento', 'Corporativo / Feira'],
    scopeLabel: 'Profissionais',
    scopes: ['1 segurança', '2 seguranças', 'Equipe 3+'],
    locationLabel: 'Local',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Traje preto/social, controle de lista na porta',
    prices: [180, 250, 320, 420]
  },
  Recepcionista: {
    id: 'cat-recepcionista',
    name: 'Recepcionista',
    group: 'Eventos',
    label: 'Recepcionista',
    noun: 'recepcionista',
    plural: 'Recepcionistas',
    headlineSuffix: 'para credenciamento e recepção',
    subtitle: 'Acolhimento de convidados, check-in e suporte ao evento.',
    desc: 'Recepção, credenciamento e orientação de convidados.',
    icon: 'id-card',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 180,
    defaultStart: '18:00',
    defaultEnd: '23:00',
    serviceTypeLabel: 'Tipo de evento',
    serviceTypes: ['Casamento', 'Aniversário', 'Congresso / Feira', 'Corporativo'],
    scopeLabel: 'Quantidade',
    scopes: ['1 recepcionista', '2 recepcionistas', '3 ou mais'],
    locationLabel: 'Local',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Entrega de lembrancinhas e conferência de nomes',
    prices: [140, 180, 230, 300]
  },
  Fotógrafo: {
    id: 'cat-fotografo',
    name: 'Fotógrafo',
    group: 'Eventos',
    label: 'Fotógrafo',
    noun: 'fotógrafo',
    plural: 'Fotógrafos',
    headlineSuffix: 'para eternizar momentos',
    subtitle: 'Cobertura fotográfica com edição e entrega em alta resolução.',
    desc: 'Fotografia de eventos, ensaios e festas.',
    icon: 'camera',
    photoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 350,
    defaultStart: '17:00',
    defaultEnd: '22:00',
    serviceTypeLabel: 'Tipo de cobertura',
    serviceTypes: ['Aniversário / Festa', 'Casamento', 'Ensaio Externo', 'Corporativo / Feira'],
    scopeLabel: 'Formato',
    scopes: ['Cobertura simples (3h)', 'Completa (5h)', 'Foto + Vídeo'],
    locationLabel: 'Local',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Festa infantil, entrega de fotos tratadas em nuvem',
    prices: [250, 350, 480, 650]
  },
  Pintor: {
    id: 'cat-pintor',
    name: 'Pintor',
    group: 'Casa',
    label: 'Pintor',
    noun: 'pintor',
    plural: 'Pintores',
    headlineSuffix: 'para pintura residencial',
    subtitle: 'Pintura imobiliária, texturas e acabamentos de alto padrão.',
    desc: 'Pintura de paredes, portas e acabamentos.',
    icon: 'color-palette',
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 180,
    defaultStart: '08:00',
    defaultEnd: '17:00',
    serviceTypeLabel: 'Tipo de pintura',
    serviceTypes: ['Cômodo Único', 'Apartamento Completo', 'Retoques e Massa', 'Fachada / Textura'],
    scopeLabel: 'Porte',
    scopes: ['1 cômodo', '2 a 3 cômodos', 'Imóvel completo'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Pintura látex branca em sala e quarto',
    prices: [140, 180, 260, 380]
  },
  Chaveiro: {
    id: 'cat-chaveiro',
    name: 'Chaveiro',
    group: 'Casa',
    label: 'Chaveiro',
    noun: 'chaveiro',
    plural: 'Chaveiros',
    headlineSuffix: 'para aberturas e trocas',
    subtitle: 'Abertura de portas, cópia de chaves e troca de fechaduras.',
    desc: 'Aberturas residenciais e cópia de chaves.',
    icon: 'key',
    photoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 120,
    defaultStart: '09:00',
    defaultEnd: '12:00',
    serviceTypeLabel: 'Serviço',
    serviceTypes: ['Abertura de Porta', 'Troca de Fechadura', 'Cópia de Chave', 'Fechadura Digital'],
    scopeLabel: 'Urgência',
    scopes: ['Urgente agora', 'Horário agendado', 'Manutenção'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Chave emperrada em porta principal',
    prices: [80, 120, 180, 250]
  },
  'Limpeza de Estofados': {
    id: 'cat-estofados',
    name: 'Limpeza de Estofados',
    group: 'Limpeza',
    label: 'Estofados',
    noun: 'especialista em estofados',
    plural: 'Especialistas em Estofados',
    headlineSuffix: 'para higienização profunda',
    subtitle: 'Higienização e impermeabilização de sofás, colchões e tapetes.',
    desc: 'Lavagem a seco e higienização profunda.',
    icon: 'sparkles',
    photoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 180,
    defaultStart: '09:00',
    defaultEnd: '13:00',
    serviceTypeLabel: 'Item',
    serviceTypes: ['Sofá 2/3 Lugares', 'Sofá Retrátil / L', 'Colchão Casal / Queen', 'Cadeiras / Poltronas'],
    scopeLabel: 'Quantidade',
    scopes: ['1 estofado', '2 estofados', 'Pacote completo'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Sofá retrátil 3 lugares com manchas',
    prices: [130, 180, 240, 320]
  },
  Jardineiro: {
    id: 'cat-jardineiro',
    name: 'Jardineiro',
    group: 'Limpeza',
    label: 'Jardineiro',
    noun: 'jardineiro',
    plural: 'Jardineiros',
    headlineSuffix: 'para manutenção do jardim',
    subtitle: 'Corte de grama, poda de árvores e paisagismo residencial.',
    desc: 'Corte de grama, poda e cuidados com plantas.',
    icon: 'leaf',
    photoUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a5c03b?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 150,
    defaultStart: '08:00',
    defaultEnd: '13:00',
    serviceTypeLabel: 'Serviço',
    serviceTypes: ['Corte de Grama', 'Poda de Árvores', 'Limpeza de Canteiros', 'Paisagismo'],
    scopeLabel: 'Área',
    scopes: ['Jardim pequeno', 'Jardim médio', 'Chácara / Área ampla'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Roçar gramado e recolher resíduos',
    prices: [110, 150, 210, 290]
  },
  'Personal Trainer': {
    id: 'cat-personal',
    name: 'Personal Trainer',
    group: 'Saúde e Bem-estar',
    label: 'Personal',
    noun: 'personal trainer',
    plural: 'Personal Trainers',
    headlineSuffix: 'para seus treinos',
    subtitle: 'Treinos personalizados de musculação, funcional e condicionamento.',
    desc: 'Aulas particulares de treino funcional e musculação.',
    icon: 'fitness',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 120,
    defaultStart: '07:00',
    defaultEnd: '08:00',
    serviceTypeLabel: 'Objetivo',
    serviceTypes: ['Hipertrofia / Musculação', 'Funcional / Emagrecimento', 'Condicionamento / Corrida', 'Alongamento / Postura'],
    scopeLabel: 'Formato',
    scopes: ['1 aula avulsa', 'Avaliação + Treino', 'Pacote 4 aulas'],
    locationLabel: 'Local',
    locationPlaceholder: 'Academia do prédio ou parque',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Foco em emagrecimento e treino funcional',
    prices: [80, 120, 160, 220]
  },
  Massoterapeuta: {
    id: 'cat-massoterapeuta',
    name: 'Massoterapeuta',
    group: 'Saúde e Bem-estar',
    label: 'Massagem',
    noun: 'massoterapeuta',
    plural: 'Massoterapeutas',
    headlineSuffix: 'para alívio e relaxamento',
    subtitle: 'Massagem relaxante, drenagem linfática e alívio de dores.',
    desc: 'Massoterapia relaxante e terapêutica em domicílio.',
    icon: 'fitness',
    photoUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 150,
    defaultStart: '15:00',
    defaultEnd: '16:30',
    serviceTypeLabel: 'Técnica',
    serviceTypes: ['Relaxante', 'Drenagem Linfática', 'Desportiva', 'Terapêutica / Ventosa'],
    scopeLabel: 'Duração',
    scopes: ['Sessão 50min', 'Sessão 1h20', 'Massagem Casal'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Foco em alívio de dor lombar e pescoço',
    prices: [110, 150, 200, 270]
  },
  Cabeleireiro: {
    id: 'cat-cabeleireiro',
    name: 'Cabeleireiro',
    group: 'Saúde e Bem-estar',
    label: 'Cabeleireiro',
    noun: 'cabeleireiro',
    plural: 'Cabeleireiros',
    headlineSuffix: 'em domicílio',
    subtitle: 'Cortes masculinos e femininos, escovas e tratamentos capilares.',
    desc: 'Cortes, escovas e penteados com atendimento em domicílio.',
    icon: 'cut',
    photoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 130,
    defaultStart: '10:00',
    defaultEnd: '12:00',
    serviceTypeLabel: 'Procedimento',
    serviceTypes: ['Corte Masculino / Barba', 'Corte Feminino & Escova', 'Hidratação & Penteado', 'Coloração'],
    scopeLabel: 'Pessoas',
    scopes: ['1 pessoa', '2 pessoas', 'Família'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Corte e escova para evento no mesmo dia',
    prices: [70, 130, 180, 250]
  },
  Manicure: {
    id: 'cat-manicure',
    name: 'Manicure',
    group: 'Saúde e Bem-estar',
    label: 'Manicure',
    noun: 'manicure',
    plural: 'Manicures',
    headlineSuffix: 'para cuidados com unhas',
    subtitle: 'Esmaltação tradicional, unhas em gel e spa dos pés.',
    desc: 'Manicure, pedicure e unhas em gel.',
    icon: 'sparkles',
    photoUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 90,
    defaultStart: '14:00',
    defaultEnd: '15:30',
    serviceTypeLabel: 'Serviço',
    serviceTypes: ['Pé e Mão Tradicional', 'Unhas em Gel / Fibra', 'Esmaltação em Gel', 'Spa dos Pés'],
    scopeLabel: 'Quantidade',
    scopes: ['1 pessoa', '2 pessoas', 'Com alongamento'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Esmaltação em gel com cuticulagem',
    prices: [60, 90, 130, 180]
  },
  Maquiadora: {
    id: 'cat-maquiadora',
    name: 'Maquiadora',
    group: 'Saúde e Bem-estar',
    label: 'Maquiadora',
    noun: 'maquiadora',
    plural: 'Maquiadoras',
    headlineSuffix: 'para ocasiões especiais',
    subtitle: 'Maquiagem social, noivas, formaturas e ensaios.',
    desc: 'Maquiagem profissional para festas e formaturas.',
    icon: 'color-palette',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 180,
    defaultStart: '15:00',
    defaultEnd: '17:00',
    serviceTypeLabel: 'Ocasião',
    serviceTypes: ['Festa / Formatura', 'Madrinha / Noiva', 'Ensaio Fotográfico', 'Social Leve'],
    scopeLabel: 'Pacote',
    scopes: ['1 maquiagem', 'Make + Cílios', 'Grupo (2+)'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Make festa com pele blindada e cílios inclusos',
    prices: [130, 180, 250, 340]
  },
  'Cuidador(a)': {
    id: 'cat-cuidador',
    name: 'Cuidador(a)',
    group: 'Saúde e Bem-estar',
    label: 'Cuidador(a)',
    noun: 'cuidador(a)',
    plural: 'Cuidadores',
    headlineSuffix: 'com carinho e atenção',
    subtitle: 'Acompanhamento de idosos, pós-operatório e cuidados diários.',
    desc: 'Acompanhamento dedicado para idosos e pós-operatório.',
    icon: 'heart',
    photoUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 170,
    defaultStart: '08:00',
    defaultEnd: '16:00',
    serviceTypeLabel: 'Tipo de cuidado',
    serviceTypes: ['Acompanhamento Idoso', 'Pós-Operatório', 'Auxílio Noturno', 'Acompanhamento em Consulta'],
    scopeLabel: 'Plantão',
    scopes: ['Turno 4h', 'Plantão 8h', 'Plantão 12h'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Acompanhar medicação e caminhada leve',
    prices: [120, 170, 240, 320]
  },
  'Reforço Escolar': {
    id: 'cat-reforco',
    name: 'Reforço Escolar',
    group: 'Aulas',
    label: 'Reforço',
    noun: 'professor(a)',
    plural: 'Professores de Reforço',
    headlineSuffix: 'para aprendizado garantido',
    subtitle: 'Aulas particulares de matemática, português, redação e ciências.',
    desc: 'Aulas particulares e reforço escolar para todas as idades.',
    icon: 'school',
    photoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 90,
    defaultStart: '14:00',
    defaultEnd: '15:30',
    serviceTypeLabel: 'Matéria',
    serviceTypes: ['Matemática', 'Português / Redação', 'Física / Química', 'Fundamental Completo'],
    scopeLabel: 'Carga',
    scopes: ['1 aula 1h', 'Pacote 4 aulas', 'Preparatório para prova'],
    locationLabel: 'Local',
    locationPlaceholder: 'Em domicílio ou online',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Dúvidas de matemática para prova do 9º ano',
    prices: [60, 90, 130, 180]
  },
  'Professor de Inglês': {
    id: 'cat-ingles',
    name: 'Professor de Inglês',
    group: 'Aulas',
    label: 'Inglês',
    noun: 'professor(a) de inglês',
    plural: 'Professores de Inglês',
    headlineSuffix: 'para fluência no idioma',
    subtitle: 'Inglês para conversação, viagens, negócios e exames.',
    desc: 'Aulas de inglês para conversação e negócios.',
    icon: 'school',
    photoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 100,
    defaultStart: '19:00',
    defaultEnd: '20:00',
    serviceTypeLabel: 'Nível',
    serviceTypes: ['Conversação', 'Iniciante / Básico', 'Inglês para Negócios', 'Preparatório TOEFL/IELTS'],
    scopeLabel: 'Modalidade',
    scopes: ['1 aula avulsa', 'Mensal (2x semana)', 'Intensivo'],
    locationLabel: 'Local',
    locationPlaceholder: 'Em domicílio ou online',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Foco em conversação para viagem',
    prices: [70, 100, 140, 200]
  },
  'Aulas de Música': {
    id: 'cat-musica',
    name: 'Aulas de Música',
    group: 'Aulas',
    label: 'Música',
    noun: 'professor(a) de música',
    plural: 'Professores de Música',
    headlineSuffix: 'para tocar seu instrumento favorito',
    subtitle: 'Aulas de violão, teclado, canto e bateria com metodologia prática.',
    desc: 'Aulas particulares de violão, teclado e canto.',
    icon: 'musical-notes',
    photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 95,
    defaultStart: '16:00',
    defaultEnd: '17:00',
    serviceTypeLabel: 'Instrumento',
    serviceTypes: ['Violão', 'Teclado / Piano', 'Canto / Técnica Vocal', 'Guitarra / Baixo'],
    scopeLabel: 'Frequência',
    scopes: ['1 aula experimental', 'Pacote 4 aulas', 'Iniciação infantil'],
    locationLabel: 'Local',
    locationPlaceholder: 'Em domicílio ou estúdio',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Violão para iniciante do zero',
    prices: [70, 95, 130, 180]
  },
  'Técnico de Informática': {
    id: 'cat-ti',
    name: 'Técnico de Informática',
    group: 'Tecnologia',
    label: 'Informática',
    noun: 'técnico(a)',
    plural: 'Técnicos de Informática',
    headlineSuffix: 'para computadores e notebooks',
    subtitle: 'Formatação, troca de peças, limpeza e remoção de vírus.',
    desc: 'Suporte técnico para notebooks, PCs e instalação de softwares.',
    icon: 'laptop',
    photoUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 140,
    defaultStart: '10:00',
    defaultEnd: '13:00',
    serviceTypeLabel: 'Serviço',
    serviceTypes: ['Formatação & Backup', 'Notebook Lento / SSD', 'Limpeza Interna & Pasta Térmica', 'Vírus & Erros do Windows'],
    scopeLabel: 'Aparelhos',
    scopes: ['1 computador', '2 computadores', 'Visita + diagnóstico'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Trocar HD por SSD e instalar Windows 11',
    prices: [90, 140, 190, 260]
  },
  'Conserto de Celular': {
    id: 'cat-celular',
    name: 'Conserto de Celular',
    group: 'Tecnologia',
    label: 'Celular',
    noun: 'técnico(a) de celular',
    plural: 'Técnicos de Celular',
    headlineSuffix: 'com peças de qualidade',
    subtitle: 'Troca de tela, bateria, conector de carga e reparos rápidos.',
    desc: 'Troca de tela, bateria e reparo de celulares.',
    icon: 'phone-portrait',
    photoUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 150,
    defaultStart: '11:00',
    defaultEnd: '14:00',
    serviceTypeLabel: 'Reparo',
    serviceTypes: ['Troca de Tela', 'Troca de Bateria', 'Conector de Carga', 'Câmera / Som'],
    scopeLabel: 'Aparelho',
    scopes: ['iPhone', 'Samsung / Motorola', 'Xiaomi / Outros'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Tela trincada iPhone 11',
    prices: [100, 150, 220, 310]
  },
  'CFTV & Wi-Fi': {
    id: 'cat-cftv',
    name: 'CFTV & Wi-Fi',
    group: 'Tecnologia',
    label: 'CFTV',
    noun: 'instalador(a)',
    plural: 'Instaladores CFTV e Redes',
    headlineSuffix: 'para segurança e conectividade',
    subtitle: 'Instalação de câmeras Wi-Fi, CFTV, roteadores e rede mesh.',
    desc: 'Câmeras de segurança, roteadores e cabeamento de rede.',
    icon: 'laptop',
    photoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    defaultPrice: 160,
    defaultStart: '09:00',
    defaultEnd: '14:00',
    serviceTypeLabel: 'Instalação',
    serviceTypes: ['Câmeras Wi-Fi / CFTV', 'Roteador Mesh / Ampliação Wi-Fi', 'Cabeamento de Rede', 'Fechadura Digital / Interfone'],
    scopeLabel: 'Pontos',
    scopes: ['Até 2 pontos', '3 a 6 pontos', 'Projeto completo'],
    locationLabel: 'Endereço',
    locationPlaceholder: 'Bairro ou endereço',
    detailsLabel: 'Observações (opcional)',
    detailsPlaceholder: 'Ex: Instalar 3 câmeras IP externas e configurar no app',
    prices: [110, 160, 230, 330]
  }
};

// Agrupamento hierárquico fiel ao layout do app (Eventos | Casa | Limpeza | Saúde e Bem-estar | Aulas | Tecnologia)
export const PROFESSION_GROUPS = [
  {
    id: 'Eventos',
    label: 'Eventos',
    items: ['Garçom', 'Bartender', 'Churrasqueiro', 'Segurança', 'Recepcionista', 'Fotógrafo']
  },
  {
    id: 'Casa',
    label: 'Casa',
    items: ['Eletricista', 'Encanador', 'Reformas', 'Pintor', 'Chaveiro']
  },
  {
    id: 'Limpeza',
    label: 'Limpeza',
    items: ['Diarista', 'Pós-Obra', 'Passadeira', 'Limpeza de Estofados', 'Jardineiro']
  },
  {
    id: 'Saúde e Bem-estar',
    label: 'Saúde e Bem-estar',
    items: ['Personal Trainer', 'Massoterapeuta', 'Cabeleireiro', 'Manicure', 'Maquiadora', 'Cuidador(a)']
  },
  {
    id: 'Aulas',
    label: 'Aulas',
    items: ['Reforço Escolar', 'Professor de Inglês', 'Aulas de Música']
  },
  {
    id: 'Tecnologia',
    label: 'Tecnologia',
    items: ['Técnico de Informática', 'Conserto de Celular', 'CFTV & Wi-Fi']
  }
];

export const useAppStore = defineStore('app', () => {
  const role = ref('CLIENT'); // 'CLIENT' | 'PROVIDER'
  const providerTab = ref('servicos'); // 'servicos' | 'carteira' | 'perfil'
  const boostModalOpen = ref(false);
  const activeBoost = ref({
    id: 'b-2',
    name: 'Impulso Turbo Pro',
    multiplier: '3.8x',
    duration: '7 dias'
  });
  const chatModalOpen = ref(false);
  const ratingModalOpen = ref(false);
  const ordersModalOpen = ref(false);
  const profileMenuModalOpen = ref(false);
  const proDetailModalOpen = ref(false);
  const activeModalPro = ref(null);
  const activeRequest = ref(null);
  const selectedProfessional = ref(null);
  const selectedCategory = ref('Garçom');

  const categoriesList = ref([
    CATEGORY_CONFIGS.Garçom,
    CATEGORY_CONFIGS.Eletricista,
    CATEGORY_CONFIGS.Diarista,
    CATEGORY_CONFIGS.Encanador,
    CATEGORY_CONFIGS.Reformas
  ]);

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
      agendaMode: 'WEEKENDS_AND_FRIDAYS',
      busyDates: ['2026-11-06'],
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
      agendaMode: 'ALL_FREE',
      busyDates: ['2026-11-06', '2026-11-07'],
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
      agendaMode: 'WEEKENDS_AND_FRIDAYS',
      busyDates: [],
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
    },
    {
      id: 16,
      nome: 'Henrique Bastos',
      categoria: 'Bartender',
      especialidade: 'Coquetelaria Clássica & Drinks Autorais',
      bio: 'Bartender profissional com kit completo de bar, especialista em casamentos e eventos.',
      nota: '5,0',
      servicos: 58,
      exp: '6 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 240,
      tags: ['Bartender', 'Drinks', 'Eventos'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80',
      badges: ['Mixologista', 'Kit Próprio'],
      reviews: [
        { author: 'Renata S.', rating: 5, comment: 'Drinks maravilhosos e apresentação impecável!' }
      ]
    },
    {
      id: 17,
      nome: 'Gustavo Nogueira',
      categoria: 'Churrasqueiro',
      especialidade: 'Mestre Churrasqueiro & Cortes Nobres',
      bio: 'Domínio de grelha, espeto e parrilla. Ponto perfeito, organização e limpeza da churrasqueira.',
      nota: '4,9',
      servicos: 49,
      exp: '8 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 220,
      tags: ['Churrasqueiro', 'Cortes Nobres', 'Festas'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
      badges: ['Mestre da Brasa', 'Super Pontual'],
      reviews: [
        { author: 'Fábio T.', rating: 5, comment: 'Carne no ponto exato a festa inteira!' }
      ]
    },
    {
      id: 18,
      nome: 'Cláudia Rocha',
      categoria: 'Pós-Obra',
      especialidade: 'Limpeza Técnica Pós-Reforma e Mudança',
      bio: 'Especialista em remoção de respingos de tinta, rejunte, gesso e higienização pesada.',
      nota: '4,9',
      servicos: 44,
      exp: '6 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 220,
      tags: ['Pós-Obra', 'Limpeza Pesada', 'Vidros'],
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=350&q=80',
      badges: ['Limpeza Técnica', 'Equipamento Próprio'],
      reviews: [
        { author: 'Marcelo A.', rating: 5, comment: 'Tirou toda a poeira fina da obra, ficou pronto para mudar.' }
      ]
    },
    {
      id: 19,
      nome: 'Helena Martins',
      categoria: 'Passadeira',
      especialidade: 'Passadoria de Camisas Sociais e Roupas Finas',
      bio: 'Cuidado especial com linho, algodão egípcio, ternos e organização de cabides.',
      nota: '5,0',
      servicos: 67,
      exp: '9 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 140,
      tags: ['Passadeira', 'Camisas Sociais', 'Organização'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=80',
      badges: ['Roupas Delicadas', 'Nota Máxima'],
      reviews: [
        { author: 'Beatriz L.', rating: 5, comment: 'Camisas perfeitamente passadas e dobradas.' }
      ]
    },
    {
      id: 20,
      nome: 'Felipe Ramos',
      categoria: 'Reformas',
      especialidade: 'Suportes de TV, Montagem e Reparos Gerais',
      bio: 'Marido de aluguel completo com furadeira industrial, nível a laser e ferramentas próprias.',
      nota: '4,9',
      servicos: 61,
      exp: '6 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 130,
      tags: ['Reformas', 'Suporte TV', 'Reparos'],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=350&q=80',
      badges: ['Ferramental Completo', 'Pontual'],
      reviews: [
        { author: 'Patrícia M.', rating: 5, comment: 'Instalou os suportes e prateleiras com perfeição.' }
      ]
    },
    {
      id: 21,
      nome: 'Marcos Silva',
      categoria: 'Segurança',
      especialidade: 'Segurança Privada & Controle de Acesso',
      bio: 'Profissional com curso de vigilante, postura firme, discreta e terno alinhado para eventos.',
      nota: '5,0',
      servicos: 53,
      exp: '7 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 250,
      tags: ['Segurança', 'Eventos', 'Portaria'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&q=80',
      badges: ['Credenciado', 'Postura Impecável'],
      reviews: [
        { author: 'Eduardo M.', rating: 5, comment: 'Passou total tranquilidade para a nossa festa!' }
      ]
    },
    {
      id: 22,
      nome: 'Camila Duarte',
      categoria: 'Recepcionista',
      especialidade: 'Recepção, Credenciamento e Lista VIP',
      bio: 'Experiência em casamentos, feiras corporativas e recepção de convidados com simpatia e agilidade.',
      nota: '4,9',
      servicos: 38,
      exp: '4 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 180,
      tags: ['Recepcionista', 'Check-in', 'Eventos'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=350&q=80',
      badges: ['Comunicação', 'Pontualidade'],
      reviews: [
        { author: 'Vanessa C.', rating: 5, comment: 'Muito educada, organizou a entrada perfeitamente.' }
      ]
    },
    {
      id: 23,
      nome: 'Rodrigo Vasconcelos',
      categoria: 'Fotógrafo',
      especialidade: 'Fotografia de Eventos Sociais e Ensaios',
      bio: 'Equipamento full-frame profissional, lentes claras e entrega rápida com galeria digital.',
      nota: '5,0',
      servicos: 72,
      exp: '8 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 350,
      tags: ['Fotógrafo', 'Alta Resolução', 'Eventos'],
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=350&q=80',
      badges: ['Equipamento Pro', 'Edição Rápida'],
      reviews: [
        { author: 'Larissa B.', rating: 5, comment: 'As fotos do meu aniversário ficaram espetaculares!' }
      ]
    },
    {
      id: 24,
      nome: 'Anderson Lima',
      categoria: 'Pintor',
      especialidade: 'Pintura Residencial e Texturas',
      bio: 'Pintura fina com proteção de rodapés e piso. Rapidez, limpeza e acabamento impecável.',
      nota: '4,8',
      servicos: 55,
      exp: '6 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 180,
      tags: ['Pintor', 'Acabamento Fino', 'Casa'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
      badges: ['Limpeza Total', 'Caprichoso'],
      reviews: [
        { author: 'Ricardo S.', rating: 5, comment: 'Deixou o apartamento novo, sem respingo no chão.' }
      ]
    },
    {
      id: 25,
      nome: 'Gabriel Torres',
      categoria: 'Personal Trainer',
      especialidade: 'Musculação e Treinamento Funcional',
      bio: 'Graduado em Educação Física (CREF ativo), foco em resultados, saúde postural e perda de peso.',
      nota: '5,0',
      servicos: 60,
      exp: '5 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 120,
      tags: ['Personal Trainer', 'CREF Ativo', 'Funcional'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80',
      badges: ['CREF Ativo', 'Motivador'],
      reviews: [
        { author: 'André F.', rating: 5, comment: 'Treino muito bem estruturado e motivador!' }
      ]
    },
    {
      id: 26,
      nome: 'Igor Farias',
      categoria: 'Técnico de Informática',
      especialidade: 'Manutenção de PCs, Notebooks e SSD',
      bio: 'Atendimento a domicílio para formatação, upgrades de SSD/RAM e limpeza preventiva.',
      nota: '4,9',
      servicos: 82,
      exp: '7 anos',
      local: 'Boa Vista - RR',
      disponivel: true,
      valorBase: 140,
      tags: ['Informática', 'Hardware', 'Rápido'],
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=350&q=80',
      badges: ['Diagnóstico Rápido', 'Garantia'],
      reviews: [
        { author: 'Fernanda M.', rating: 5, comment: 'Meu notebook estava travando e agora parece novo!' }
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
        valorBase: fallback.valorBase,
        agendaMode: fallback.agendaMode || 'WEEKENDS_AND_FRIDAYS',
        busyDates: fallback.busyDates || []
      };
    }
    return {
      ...pro,
      name: pro.name || pro.nome || 'Profissional +SERVE',
      nome: pro.nome || pro.name || 'Profissional +SERVE',
      rating: pro.rating || pro.nota || '5,0',
      nota: pro.nota || pro.rating || '5,0',
      agendaMode: pro.agendaMode || 'WEEKENDS_AND_FRIDAYS',
      busyDates: pro.busyDates || []
    };
  }

  function isProfessionalFreeOnDate(pro, isoDate = null) {
    if (!pro) return true;
    const rawDate = isoDate || eventForm.value.data;
    if (!rawDate || !rawDate.includes('-')) return true;

    if (pro.busyDates && Array.isArray(pro.busyDates) && pro.busyDates.includes(rawDate)) {
      return false;
    }
    if (pro.freeDates && Array.isArray(pro.freeDates) && pro.freeDates.includes(rawDate)) {
      return true;
    }

    const [y, m, d] = rawDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const weekday = dateObj.getDay();

    const mode = pro.agendaMode || 'WEEKENDS_AND_FRIDAYS';
    if (mode === 'WEEKENDS_ONLY') {
      return weekday === 0 || weekday === 6;
    }
    if (mode === 'WEEKENDS_AND_FRIDAYS') {
      return weekday === 0 || weekday === 5 || weekday === 6;
    }
    if (mode === 'WEEKDAYS_ONLY') {
      return weekday >= 1 && weekday <= 5;
    }
    return true;
  }

  function getProfessionalScheduleCells(pro, year = 2026, month = 10) {
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ key: `empty-${year}-${month}-${i}`, empty: true });
    }

    for (let day = 1; day <= totalDays; day++) {
      const dObj = new Date(year, month, day);
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const iso = `${year}-${mm}-${dd}`;
      const isPast = dObj < today;

      let status = 'FREE';
      if (isPast) {
        status = 'PAST';
      } else {
        const free = isProfessionalFreeOnDate(pro, iso);
        status = free ? 'FREE' : 'BUSY';
      }

      cells.push({
        key: iso,
        empty: false,
        day,
        iso,
        isToday: dObj.getTime() === today.getTime(),
        status
      });
    }

    return cells;
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
      providerAccepted: orderContext?.providerAccepted ?? false,
      clientAccepted: orderContext?.clientAccepted ?? true, // Cliente que contrata já inicia aceitando a proposta
      serviceCompleted: orderContext?.status === 'COMPLETED',
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
      statusLabel: 'Aguardando Atendimento',
      providerAccepted: false,
      clientAccepted: true,
      serviceCompleted: false,
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
      providerAccepted: false,
      clientAccepted: true,
      photoUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
    });

    return newOrd;
  }

  // Confirmação pelo Prestador no Chat: "Aceito o serviço"
  function setProviderAccepted(orderId) {
    if (activeRequest.value) {
      activeRequest.value.providerAccepted = true;
    }
    const ord = ordersList.value.find(o => o.id === orderId);
    if (ord) {
      ord.providerAccepted = true;
      ord.statusLabel = 'Serviço Aceito por Ambos';
    }
    const job = acceptedJobs.value.find(j => j.id === orderId || j.orderId === orderId);
    if (job) {
      job.providerAccepted = true;
    }
  }

  // Confirmação pelo Contratante no Chat: "Aceito a proposta"
  function setClientAccepted(orderId) {
    if (activeRequest.value) {
      activeRequest.value.clientAccepted = true;
    }
    const ord = ordersList.value.find(o => o.id === orderId);
    if (ord) {
      ord.clientAccepted = true;
    }
  }

  // Concluir pedido pelo Cliente: O Contratante confirma que o "Serviço foi feito"
  // Debita a comissão da plataforma (10%) do Saldo do prestador (Modelo inDrive)
  function completeRequest(orderId, ratingStars = 5, comment = '') {
    const ord = ordersList.value.find(o => o.id === orderId) || activeRequest.value;
    if (ord) {
      ord.status = 'COMPLETED';
      ord.statusLabel = 'Concluído';
      ord.rated = true;
      ord.userRating = ratingStars;
      ord.serviceCompleted = true;

      const targetOrder = ordersList.value.find(o => o.id === ord.id);
      if (targetOrder) {
        targetOrder.status = 'COMPLETED';
        targetOrder.statusLabel = 'Concluído';
        targetOrder.rated = true;
        targetOrder.userRating = ratingStars;
        targetOrder.serviceCompleted = true;
      }

      // Cálculo da Taxa da Plataforma (10% sobre o valor do serviço)
      const serviceVal = Number(ord.budget || ord.price) || 150;
      const fee = Math.round(serviceVal * 0.10);

      // Debita a taxa do Saldo do prestador
      walletBalance.value = Math.max(0, walletBalance.value - fee);
      workerProfile.value.completedJobs += 1;
      workerProfile.value.xp = Math.min(workerProfile.value.nextLevelXp, workerProfile.value.xp + 250);

      transactions.value.unshift({
        id: `tx-fee-${Date.now()}`,
        type: 'DEBIT',
        title: `Taxa de serviço da plataforma (10% de R$ ${serviceVal})`,
        amount: -fee,
        date: 'Agora mesmo'
      });

      // Remove dos serviços em andamento do prestador
      acceptedJobs.value = acceptedJobs.value.filter(j => j.id !== orderId && j.orderId !== orderId);

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

  // Cancelar pedido pelo Cliente ou Prestador
  function cancelOrder(orderId, reason = 'Cancelado pelo usuário') {
    const ord = ordersList.value.find(o => o.id === orderId);
    if (ord) {
      ord.status = 'CANCELLED';
      ord.statusLabel = 'Cancelado';
      ord.cancelReason = reason;
    }
    if (activeRequest.value?.id === orderId) {
      activeRequest.value.status = 'CANCELLED';
      activeRequest.value.statusLabel = 'Cancelado';
      activeRequest.value.cancelReason = reason;
    }
    acceptedJobs.value = acceptedJobs.value.filter(j => j.id !== orderId && j.orderId !== orderId);
    jobLeads.value = jobLeads.value.filter(j => j.id !== orderId && j.orderId !== orderId);
  }

  // Recusar / Negar proposta pelo Prestador (através da lista ou do chat)
  function rejectJobLead(jobId, reason = 'Recusado pelo prestador') {
    jobLeads.value = jobLeads.value.filter(j => j.id !== jobId && j.orderId !== jobId);
    acceptedJobs.value = acceptedJobs.value.filter(j => j.id !== jobId && j.orderId !== jobId);
    const ord = ordersList.value.find(o => o.id === jobId || o.id === `ord-${jobId}`);
    if (ord) {
      ord.status = 'REJECTED';
      ord.statusLabel = 'Proposta Recusada';
      ord.cancelReason = reason;
    }
    if (activeRequest.value?.id === jobId || activeRequest.value?.orderId === jobId) {
      activeRequest.value.status = 'REJECTED';
      activeRequest.value.statusLabel = 'Proposta Recusada';
      activeRequest.value.cancelReason = reason;
    }
  }

  // Fazer Contraproposta pelo Prestador (altera valor e envia status pendente de aprovação do cliente)
  function submitCounterOffer(orderId, newAmount, note = '') {
    const val = Number(newAmount) || 0;
    if (val <= 0) return false;

    if (activeRequest.value) {
      activeRequest.value.counterOffer = {
        amount: val,
        note: note || 'Novo valor proposto pelo prestador',
        status: 'PENDING'
      };
      activeRequest.value.providerAccepted = true;
      activeRequest.value.clientAccepted = false; // Cliente precisa aceitar o novo valor
      activeRequest.value.statusLabel = `Contraproposta: R$ ${val}`;
    }

    const ord = ordersList.value.find(o => o.id === orderId);
    if (ord) {
      ord.counterOffer = {
        amount: val,
        note: note || 'Novo valor proposto pelo prestador',
        status: 'PENDING'
      };
      ord.providerAccepted = true;
      ord.clientAccepted = false;
      ord.statusLabel = `Contraproposta: R$ ${val}`;
    }

    const job = jobLeads.value.find(j => j.id === orderId || j.orderId === orderId);
    if (job) {
      job.counterOffer = { amount: val, note };
      job.budget = val;
    }

    const accepted = acceptedJobs.value.find(j => j.id === orderId || j.orderId === orderId);
    if (accepted) {
      accepted.counterOffer = { amount: val, note };
      accepted.budget = val;
    }

    return true;
  }

  // Cliente aceita a contraproposta do prestador
  function acceptCounterOffer(orderId) {
    if (activeRequest.value && activeRequest.value.counterOffer) {
      activeRequest.value.budget = activeRequest.value.counterOffer.amount;
      activeRequest.value.counterOffer.status = 'ACCEPTED';
      activeRequest.value.clientAccepted = true;
      activeRequest.value.providerAccepted = true;
      activeRequest.value.statusLabel = 'Acordo Fechado';
    }

    const ord = ordersList.value.find(o => o.id === orderId);
    if (ord && ord.counterOffer) {
      ord.budget = ord.counterOffer.amount;
      ord.price = ord.counterOffer.amount;
      ord.counterOffer.status = 'ACCEPTED';
      ord.clientAccepted = true;
      ord.providerAccepted = true;
      ord.statusLabel = 'Acordo Fechado';
    }

    const job = acceptedJobs.value.find(j => j.id === orderId || j.orderId === orderId);
    if (job && job.counterOffer) {
      job.budget = job.counterOffer.amount;
      job.counterOffer.status = 'ACCEPTED';
    }
    return true;
  }

  // Cliente recusa a contraproposta do prestador
  function declineCounterOffer(orderId) {
    if (activeRequest.value && activeRequest.value.counterOffer) {
      activeRequest.value.counterOffer.status = 'DECLINED';
      activeRequest.value.clientAccepted = false;
      activeRequest.value.statusLabel = 'Contraproposta Recusada';
    }

    const ord = ordersList.value.find(o => o.id === orderId);
    if (ord && ord.counterOffer) {
      ord.counterOffer.status = 'DECLINED';
      ord.clientAccepted = false;
      ord.statusLabel = 'Contraproposta Recusada';
    }
    return true;
  }

  // Aceitar serviço pelo Prestador (através da lista de oportunidades)
  function acceptJobLead(job) {
    const activeJob = {
      ...job,
      acceptedAt: 'Agora mesmo',
      providerAccepted: true,
      clientAccepted: true,
      status: 'ACCEPTED'
    };
    acceptedJobs.value.unshift(activeJob);
    jobLeads.value = jobLeads.value.filter(j => j.id !== job.id);
    return activeJob;
  }

  // Concluir serviço pelo Prestador (sinaliza que foi realizado)
  function completeWorkerJob(jobId) {
    const idx = acceptedJobs.value.findIndex(j => j.id === jobId);
    if (idx === -1) return null;

    const job = acceptedJobs.value[idx];
    const fee = Math.round(job.budget * 0.10);

    // Debita a taxa de 10% da plataforma do Saldo do prestador (Modelo inDrive)
    walletBalance.value = Math.max(0, walletBalance.value - fee);
    workerProfile.value.completedJobs += 1;
    workerProfile.value.xp = Math.min(workerProfile.value.nextLevelXp, workerProfile.value.xp + 250);

    transactions.value.unshift({
      id: `tx-fee-${Date.now()}`,
      type: 'DEBIT',
      title: `Taxa da plataforma (10% de R$ ${job.budget})`,
      amount: -fee,
      date: 'Agora mesmo'
    });

    acceptedJobs.value.splice(idx, 1);
    return { job, fee };
  }

  // Sem saque: apenas recarga de Saldo (como inDrive)
  function rechargeWallet(amount, method = 'PIX') {
    const val = Number(amount) || 0;
    if (val <= 0) return false;
    walletBalance.value += val;
    const methodLabel = method === 'DEBITO' ? 'Depósito de Saldo via Débito' : 'Depósito de Saldo via PIX';
    transactions.value.unshift({
      id: `tx-rec-${Date.now()}`,
      type: 'RECHARGE',
      title: methodLabel,
      amount: val,
      date: 'Agora mesmo'
    });
    return true;
  }

  function activateBoostPlan(plan) {
    if (!plan) return { ok: false, reason: 'INVALID' };
    const cost = Number(plan.price) || 0;
    if (walletBalance.value < cost) {
      return { ok: false, reason: 'INSUFFICIENT_FUNDS' };
    }
    walletBalance.value -= cost;
    activeBoost.value = {
      id: plan.id,
      name: plan.name,
      multiplier: plan.multiplier,
      duration: plan.duration
    };
    transactions.value.unshift({
      id: `tx-boost-${Date.now()}`,
      type: 'DEBIT',
      title: `Ativação: ${plan.name} (${plan.duration})`,
      amount: -cost,
      date: 'Agora mesmo'
    });
    return { ok: true };
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
    boostModalOpen.value = false;
    activeBoost.value = {
      id: 'b-2',
      name: 'Impulso Turbo Pro',
      multiplier: '3.8x',
      duration: '7 dias'
    };
    providerTab.value = 'servicos';
  }

  return {
    role,
    providerTab,
    boostModalOpen,
    activeBoost,
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
    isProfessionalFreeOnDate,
    getProfessionalScheduleCells,
    openProDetail,
    openChatWithPro,
    createNewOrder,
    completeRequest,
    cancelOrder,
    rejectJobLead,
    submitCounterOffer,
    acceptCounterOffer,
    declineCounterOffer,
    acceptJobLead,
    skipJobLead,
    completeWorkerJob,
    rechargeWallet,
    setProviderAccepted,
    setClientAccepted,
    activateBoostPlan,
    resetJobLeads,
    resetPresentation
  };
});
