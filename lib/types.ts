export type UserType = 'user' | 'driver';
export type StatusMotorista = 'pendente' | 'aprovado' | 'rejeitado' | 'suspenso';
export type StatusSolicitacao =
  | 'pendente'
  | 'confirmada'
  | 'em_andamento'
  | 'finalizada'
  | 'concluida'
  | 'cancelada';
export type StatusPagamento = 'PENDING' | 'EXPIRED' | 'CANCELLED' | 'PAID' | 'REFUNDED';

export interface Profile {
  id: string;
  name: string | null;
  cpf: string | null;
  email?: string;
  user_type: UserType;
  telefone?: string;
  foto_perfil_url?: string;
  data_nascimento?: string;
  cnh_numero?: string;
  cnh_validade?: string;
  cnh_categoria?: string;
  cnh_foto_url?: string;
  verificado: boolean;
  status_motorista?: StatusMotorista;
  data_aprovacao?: string;
  motivo_rejeicao?: string;
  created_at?: string;
}

export interface Solicitacao {
  id: string;
  usuario_id: string;
  motorista_id?: string;
  tipo_solicitacao: 'motorista' | 'motorista_carro';
  data_servico: string;
  horario_inicio: string;
  horario_fim: string;
  duracao_horas: number;
  observacoes?: string;
  status: StatusSolicitacao;
  preco_total?: number;
  preco_motorista?: number;
  taxa_por_hora?: number;
  confirmada_em?: string;
  iniciada_em?: string;
  finalizada_em?: string;
  concluida_em?: string;
  cancelado_por?: string;
  motivo_cancelamento?: string;
  cancelado_em?: string;
  created_at: string;
  profiles?: { name?: string; cpf?: string } | null;
  motorista?: { name?: string } | null;
}

export interface Veiculo {
  id: string;
  motorista_id: string;
  placa: string;
  modelo: string;
  marca?: string;
  ano: number;
  cor: string;
  categoria: string;
  ativo: boolean;
  created_at: string;
}

export interface Pagamento {
  id: string;
  solicitacao_id: string;
  abacatepay_billing_id: string;
  url_pagamento: string;
  valor_centavos: number;
  status: StatusPagamento;
  pago_em?: string;
  created_at: string;
}

export interface DocumentoMotorista {
  id: string;
  motorista_id: string;
  tipo_documento: string;
  nome_documento: string;
  arquivo_url: string;
  status_verificacao: 'pendente' | 'aprovado' | 'rejeitado';
  observacoes?: string;
  data_upload: string;
}
