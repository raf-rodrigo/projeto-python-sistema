export interface TabelaBasicaItem {
  id: number;
  nome: string;
}

export interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  nome_social?: string;
  nis?: string;
  familia_details?: { id: number; familia_codigo?: string };
  prontuario?: string;
}

export type ModalidadeAtendimento = 'Simplificado' | 'Tecnico' | 'Encaminhamento Interno' | 'Referencia' | 'ContraReferencia';
export type StatusAtendimento = 'Aberto' | 'Finalizado' | 'Encaminhado' | 'Esperando para ser aberto' | 'Encaminhamento Tecnico' | 'Encaminhamento Interno';

export interface UsuarioResumo {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface Atendimento {
  id: number;
  codigo_atendimento?: string;
  origem_atendimento?: number;
  origem_atendimento_details?: {
    id: number;
    codigo_atendimento?: string;
    data_atendimento: string;
    descricao_sumaria_atendimento?: string;
    observacoes?: string;
    prontuario?: string;
    unidade?: { id: number; nome_conhecido: string };
    motivo_atendimento?: TabelaBasicaItem;
    tipo_atendimento?: TabelaBasicaItem;
    tecnico_responsavel?: UsuarioResumo;
    funcao_tecnico_responsavel?: string;
  };
  modalidade: ModalidadeAtendimento;
  status: StatusAtendimento;
  data_atendimento: string;
  descricao_sumaria_atendimento: string;
  descricao_atendimento_tecnico?: string;
  pessoa: number;
  pessoa_details?: { id: number; nome: string; cpf: string };
  familia?: number;
  familia_details?: { id: number; familia_codigo?: string };
  prontuario?: string;
  unidade_atendimento_social?: number;
  unidade_details?: { id: number; nome_conhecido: string };
  tecnico_responsavel_inicial?: number;
  tecnico_responsavel_inicial_details?: UsuarioResumo;
  tecnico_responsavel_tecnico?: number;
  tecnico_responsavel_tecnico_details?: UsuarioResumo;
  funcao_tecnico_responsavel_inicial?: string;
  funcao_tecnico_responsavel_tecnico?: string;
  motivo_atendimento?: number;
  motivo_atendimento_details?: TabelaBasicaItem;
  tipo_atendimento?: number;
  tipo_atendimento_details?: TabelaBasicaItem;
  observacoes?: string;
  informacoes?: string;
}

export interface Profissional extends UsuarioResumo {
  perfil?: { unidades?: number[]; funcao?: string };
}

export interface UnidadeResumo {
  id: number;
  nome_conhecido: string;
}

export interface AttendanceManagementProps {
  userPermissions?: string[];
  triggerNovo?: boolean;
  unidadeId?: string;
  currentUser?: {
    username: string;
    first_name?: string;
    last_name?: string;
    groups?: string[];
  };
}
