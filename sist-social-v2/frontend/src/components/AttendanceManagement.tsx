import { useState, useEffect } from 'react';
import SearchableSelect from './SearchableSelect';
import AttendanceTable from './attendance/AttendanceTable';
import AttendanceActionsDrawer from './attendance/AttendanceActionsDrawer';
import InternalReferralModal from './attendance/InternalReferralModal';
import { 
  Users, 
  PlusCircle, 
  FileText,
} from 'lucide-react';

import type {
  Atendimento,
  AttendanceManagementProps,
  ModalidadeAtendimento,
  Pessoa,
  Profissional,
  TabelaBasicaItem,
  UnidadeResumo
} from './attendance/AttendanceManagementTypes';

export default function AttendanceManagement({ 

  triggerNovo = false, 
  unidadeId: activeUnidadeId = '',
  currentUser
}: AttendanceManagementProps) {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  
  // Auto-abrir modal se triggerNovo estiver ativo
  useEffect(() => {
    if (triggerNovo) {
      abrirNovoModal();
    }
  }, [triggerNovo]);
  
  // Apoio para filtros baseados em modalidade e pesquisa na V1
  const [motivosAtendimentos, setMotivosAtendimentos] = useState<TabelaBasicaItem[]>([]);
  const [tiposAtendimentos, setTiposAtendimentos] = useState<TabelaBasicaItem[]>([]);
  const [unidades, setUnidades] = useState<UnidadeResumo[]>([]);
  
  const [familias, setFamilias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  // Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDecisaoAberto, setModalDecisaoAberto] = useState(false);
  const [modalNovaPessoaAberto, setModalNovaPessoaAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [errorPessoaMsg, setErrorPessoaMsg] = useState<string | null>(null);

  // Filtro de Munícipe no Select (Searchable)
  const [termoBuscaMunicipe, setTermoBuscaMunicipe] = useState('');

  // Form Fields - Atendimento
  const [modalidade, setModalidade] = useState<ModalidadeAtendimento>('Simplificado');
  const [status, setStatus] = useState<any>('Aberto');
  
  // Controle de Ações / Success Overlay
  const [showAcoesOverlay, setShowAcoesOverlay] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<number | null>(null);
  const [dataAtendimento, setDataAtendimento] = useState(() => new Date().toISOString().split('T')[0]);
  const [pessoaId, setPessoaId] = useState('');
  
  // Campos somente leitura auto-preenchidos a partir da pessoa selecionada
  const [familiaLabel, setFamiliaLabel] = useState('');
  const [prontuarioLabel, setProntuarioLabel] = useState('');
  
  const [unidadeId, setUnidadeId] = useState('');
  const [motivoAtendimentoId, setMotivoAtendimentoId] = useState('');
  const [tipoAtendimentoId, setTipoAtendimentoId] = useState('');
  
  // Informações do Atendimento Inicial (Sanfona 1)
  const [descricaoSumaria, setDescricaoSumaria] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Informações do Atendimento Técnico (Sanfona 2 - opcional se Tecnico)
  const [descricaoTecnico, setDescricaoTecnico] = useState('');

  // Form Fields - Nova Pessoa Rápido
  const [novaPessoaNome, setNovaPessoaNome] = useState('');
  const [novaPessoaCpf, setNovaPessoaCpf] = useState('');
  const [novaPessoaNascimento, setNovaPessoaNascimento] = useState('');
  const [novaPessoaSexo, setNovaPessoaSexo] = useState<'Masc' | 'Fem'>('Fem');
  const [novaPessoaFamiliaOpcao, setNovaPessoaFamiliaOpcao] = useState<'com_familia' | 'sem_familia'>('sem_familia');
  const [novaPessoaFamiliaId, setNovaPessoaFamiliaId] = useState('');
  
  // Controle de validação específica por campo
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [modalEncaminhamentoAberto, setModalEncaminhamentoAberto] = useState(false);
  const [motivoEncaminhamento, setMotivoEncaminhamento] = useState('');
  const [dataEncaminhamento, setDataEncaminhamento] = useState(() => new Date().toISOString().split('T')[0]);
  const [profissionalEncaminhamentoId, setProfissionalEncaminhamentoId] = useState('');
  const [erroEncaminhamento, setErroEncaminhamento] = useState('');
  const [salvandoEncaminhamento, setSalvandoEncaminhamento] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');
  
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const urlAtendimentos = `${API_URL}/api/atendimentos_sociais/?search=${encodeURIComponent(busca)}` + 
                             (filtroTipo ? `&modalidade=${filtroTipo}` : '');
      const resAtendimentos = await fetch(urlAtendimentos, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resAtendimentos.ok) {
        const resJson = await resAtendimentos.json();
        setAtendimentos(resJson.results || resJson || []);
      }

      // Carregar cidadãos
      const resPessoas = await fetch(`${API_URL}/api/pessoas/?page_size=2000`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resPessoas.ok) {
        const resJson = await resPessoas.json();
        setPessoas(resJson.results || resJson || []);
      }

      // Carregar unidades
      const resUnidades = await fetch(`${API_URL}/api/unidades/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resUnidades.ok) {
        const resJson = await resUnidades.json();
        setUnidades(resJson.results || resJson || []);
      }

      const resProfissionais = await fetch(`${API_URL}/api/usuarios/?page_size=2000`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resProfissionais.ok) {
        const resJson = await resProfissionais.json();
        setProfissionais(resJson.results || resJson || []);
      }

      // Carrega motivos (Forma de Acesso)
      const resMotivos = await fetch(`${API_URL}/api/motivo_atendimento/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resMotivos.ok) {
        const resJson = await resMotivos.json();
        setMotivosAtendimentos(resJson.results || resJson || []);
      }

      // Carrega famílias
      const resFamilias = await fetch(`${API_URL}/api/familias_domicilios/?page_size=2000`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resFamilias.ok) {
        const resJson = await resFamilias.json();
        setFamilias(resJson.results || resJson || []);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // Carrega dinamicamente a classificação (Tipos de Atendimento) filtrada pela modalidade
  const carregarClassificacoes = async (mod: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tipos_atendimentos/?modalidade=${mod}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        const resJson = await res.json();
        setTiposAtendimentos(resJson.results || resJson || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca, filtroTipo]);

  useEffect(() => {
    // Para classificação do tipo de atendimento, filtramos pela modalidade adequada
    let modalidadeFiltro = 'Simplificado';
    if (modalidade === 'Tecnico' || modalidade === 'Encaminhamento Interno' || modalidade === 'Referencia' || modalidade === 'ContraReferencia') {
      modalidadeFiltro = 'Tecnico';
    }
    carregarClassificacoes(modalidadeFiltro);

    // Se selecionado Simplificado, força data de hoje e a unidade logada do operador
    if (modalidade === 'Simplificado') {
      setDataAtendimento(new Date().toISOString().split('T')[0]);
      setUnidadeId(activeUnidadeId);
    }
  }, [modalidade, activeUnidadeId]);

  // Atualizar dados de família e prontuário ao selecionar o munícipe
  useEffect(() => {
    if (pessoaId) {
      const match = pessoas.find(p => p.id.toString() === pessoaId);
      if (match) {
        setFamiliaLabel(match.familia_details?.familia_codigo || 'Sem vínculo');
        setProntuarioLabel(match.prontuario || 'Nenhum');
      } else {
        setFamiliaLabel('');
        setProntuarioLabel('');
      }
    } else {
      setFamiliaLabel('');
      setProntuarioLabel('');
    }
  }, [pessoaId, pessoas]);

  const abrirNovoModal = () => {
    setEditandoId(null);
    setModalidade('Simplificado');
    setStatus('Aberto');
    setDataAtendimento(new Date().toISOString().split('T')[0]);
    setPessoaId('');
    setUnidadeId(activeUnidadeId);
    setMotivoAtendimentoId('');
    setTipoAtendimentoId('');
    setDescricaoSumaria('');
    setObservacoes('');
    setDescricaoTecnico('');
    setTermoBuscaMunicipe('');
    setShowAcoesOverlay(false);
    setShowSuccessMessage(false);
    setLastCreatedId(null);
    setValidationErrors({});
    setModalAberto(true);
  };

  const abrirEditarModal = (a: Atendimento) => {
    setEditandoId(a.id);
    setLastCreatedId(a.id);
    setShowAcoesOverlay(a.status === 'Aberto');
    setModalidade(a.modalidade);
    setStatus(a.status);
    setDataAtendimento(a.data_atendimento);
    setPessoaId(a.pessoa.toString());
    setUnidadeId(a.unidade_atendimento_social?.toString() || '');
    setMotivoAtendimentoId(a.motivo_atendimento?.toString() || '');
    setTipoAtendimentoId(a.tipo_atendimento?.toString() || '');
    setDescricaoSumaria(a.descricao_sumaria_atendimento || '');
    setObservacoes(a.observacoes || '');
    setDescricaoTecnico(a.descricao_atendimento_tecnico || '');
    setTermoBuscaMunicipe('');
    setValidationErrors({});
    setModalAberto(true);
  };

  const salvarAtendimento = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!pessoaId) {
      errors.pessoa = 'Obrigatório selecionar o munícipe.';
    }

    if (modalidade === 'Simplificado' && !motivoAtendimentoId) {
      errors.motivo = 'Obrigatório selecionar a forma de acesso.';
    }

    if (!tipoAtendimentoId) {
      errors.tipo = 'Obrigatório selecionar o tipo de atendimento.';
    }

    if (modalidade === 'Simplificado') {
      if (!descricaoSumaria.trim()) {
        errors.descricaoSumaria = 'Obrigatório preencher a descrição inicial.';
      } else if (descricaoSumaria.trim().length < 10) {
        errors.descricaoSumaria = 'A descrição inicial deve conter mais de 10 caracteres.';
      }
    }

    if (modalidade === 'Tecnico') {
      if (!descricaoTecnico.trim()) {
        errors.descricaoTecnico = 'Obrigatório preencher a descrição do atendimento técnico.';
      } else if (descricaoTecnico.trim().length < 20) {
        errors.descricaoTecnico = 'A descrição do atendimento técnico deve conter mais de 20 caracteres.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      
      // Auto-focar o primeiro elemento com erro
      setTimeout(() => {
        if (errors.pessoa) {
          const el = document.querySelector('[placeholder="Selecione o munícipe na lista..."] input');
          if (el) (el as HTMLElement).focus();
        } else if (errors.motivo) {
          const el = document.querySelector('[placeholder="Selecione um motivo..."] input');
          if (el) (el as HTMLElement).focus();
        } else if (errors.tipo) {
          const el = document.querySelector('[placeholder="Selecione o tipo..."] input');
          if (el) (el as HTMLElement).focus();
        } else if (errors.descricaoSumaria) {
          const el = document.querySelector('textarea[placeholder="Descreva a demanda inicial relatada pelo munícipe..."]');
          if (el) (el as HTMLElement).focus();
        } else if (errors.descricaoTecnico) {
          const el = document.querySelector('textarea[placeholder="Descreva as orientações, procedimentos e parecer técnico realizado no acompanhamento..."]');
          if (el) (el as HTMLElement).focus();
        }
      }, 50);
      return;
    }

    setValidationErrors({});

    const payload = {
      modalidade,
      status,
      data_atendimento: dataAtendimento,
      pessoa: parseInt(pessoaId),
      unidade_atendimento_social: unidadeId ? parseInt(unidadeId) : null,
      motivo_atendimento: motivoAtendimentoId ? parseInt(motivoAtendimentoId) : null,
      tipo_atendimento: tipoAtendimentoId ? parseInt(tipoAtendimentoId) : null,
      descricao_sumaria_atendimento: descricaoSumaria,
      descricao_atendimento_tecnico: modalidade === 'Tecnico' ? descricaoTecnico : null,
      observacoes
    };

    try {
      const url = editandoId ? `${API_URL}/api/atendimentos_sociais/${editandoId}/` : `${API_URL}/api/atendimentos_sociais/`;
      const method = editandoId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const novoAtendimento = await res.json();
        setLastCreatedId(novoAtendimento.id);
        setEditandoId(novoAtendimento.id);
        setShowSuccessMessage(true);
        setShowAcoesOverlay(true);
        carregarDados();
      } else {
        const errJson = await res.json();
        alert(errJson.detail || 'Erro ao registrar atendimento.');
      }
    } catch (err) {
      alert('Erro de conexão com a API.');
    }
  };
  const abrirEncaminhamentoInterno = () => {
    setMotivoEncaminhamento('');
    setDataEncaminhamento(new Date().toISOString().split('T')[0]);
    setProfissionalEncaminhamentoId('');
    setErroEncaminhamento('');
    setModalEncaminhamentoAberto(true);
  };

  const salvarEncaminhamentoInterno = async (e: React.FormEvent) => {
    e.preventDefault();
    const atendimentoId = editandoId || lastCreatedId;
    const motivo = motivoEncaminhamento.trim();

    if (!atendimentoId) return;
    if (motivo.length < 21) {
      setErroEncaminhamento('O motivo deve conter no mínimo 21 caracteres.');
      return;
    }
    if (/(.)\1{3,}/.test(motivo)) {
      setErroEncaminhamento('O motivo não pode conter o mesmo caractere repetido quatro vezes ou mais.');
      return;
    }
    if (!dataEncaminhamento || !profissionalEncaminhamentoId) {
      setErroEncaminhamento('Informe a data e selecione o profissional de destino.');
      return;
    }

    setSalvandoEncaminhamento(true);
    setErroEncaminhamento('');
    try {
      const res = await fetch(API_URL + '/api/atendimentos_sociais/' + atendimentoId + '/encaminhar-interno/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
        body: JSON.stringify({
          motivo,
          data_atendimento: dataEncaminhamento,
          profissional: Number(profissionalEncaminhamentoId)
        })
      });
      if (!res.ok) {
        const erro = await res.json();
        const mensagem = erro.detail || erro.motivo || erro.data_atendimento || erro.profissional || 'Não foi possível realizar o encaminhamento.';
        setErroEncaminhamento(Array.isArray(mensagem) ? mensagem[0] : mensagem);
        return;
      }

      setStatus('Encaminhado');
      setModalEncaminhamentoAberto(false);
      setShowAcoesOverlay(false);
      setShowSuccessMessage(true);
      carregarDados();
    } catch (err) {
      setErroEncaminhamento('Erro de conexão ao realizar o encaminhamento.');
    } finally {
      setSalvandoEncaminhamento(false);
    }
  };

  const encerrarAtendimento = async () => {
    const atendimentoId = editandoId || lastCreatedId;
    if (!atendimentoId) return;

    try {
      const res = await fetch(`${API_URL}/api/atendimentos_sociais/${atendimentoId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ status: 'Finalizado' })
      });

      if (!res.ok) {
        const erro = await res.json();
        alert(erro.detail || 'Não foi possível encerrar o atendimento.');
        return;
      }

      setStatus('Finalizado');
      setShowAcoesOverlay(false);
      setModalAberto(false);
      carregarDados();
    } catch (err) {
      alert('Erro de conexão ao encerrar o atendimento.');
    }
  };


  // Salvar Pessoa Rápido no Modal Secundário
  const salvarPessoaRapido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaPessoaNome.trim() || !novaPessoaCpf.trim() || !novaPessoaNascimento) {
      setErrorPessoaMsg('Preencha os campos obrigatórios (*).');
      return;
    }

    const payload = {
      nome: novaPessoaNome,
      cpf: novaPessoaCpf,
      certidao_nascimento_data: novaPessoaNascimento,
      sexo: novaPessoaSexo,
      situacao_de_rua: 'Não',
      familia_domicilio: novaPessoaFamiliaOpcao === 'com_familia' && novaPessoaFamiliaId ? parseInt(novaPessoaFamiliaId) : null
    };

    try {
      const res = await fetch(`${API_URL}/api/pessoas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const novaPessoa = await res.json();
        // Recarrega lista
        const resPessoas = await fetch(`${API_URL}/api/pessoas/?page_size=2000`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (resPessoas.ok) {
          const resJson = await resPessoas.json();
          const listaAtualizada = resJson.results || resJson || [];
          setPessoas(listaAtualizada);
        }
        
        // Seleciona a pessoa recém-cadastrada no formulário do atendimento
        setPessoaId(novaPessoa.id.toString());
        setModalNovaPessoaAberto(false);
        // Limpar campos
        setNovaPessoaNome('');
        setNovaPessoaCpf('');
        setNovaPessoaNascimento('');
      } else {
        const errJson = await res.json();
        setErrorPessoaMsg(errJson.detail || 'Erro ao cadastrar cidadão rápido. Verifique os dados (ex: CPF único).');
      }
    } catch (err) {
      setErrorPessoaMsg('Erro de conexão com o servidor.');
    }
  };

  const deletarAtendimento = async (id: number) => {
    if (!window.confirm('Excluir logicamente este atendimento?')) return;
    try {
      const res = await fetch(`${API_URL}/api/atendimentos_sociais/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) carregarDados();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtragem dinâmica de munícipes para o select com busca (nome, nome_social, nis ou cpf)
  const pessoasFiltradas = pessoas.filter(p => 
    (p.nome && p.nome.toLowerCase().includes(termoBuscaMunicipe.toLowerCase())) || 
    (p.nome_social && p.nome_social.toLowerCase().includes(termoBuscaMunicipe.toLowerCase())) || 
    (p.nis && p.nis.includes(termoBuscaMunicipe)) || 
    (p.cpf && p.cpf.includes(termoBuscaMunicipe))
  );


  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText className="text-conecta" size={28} />
            Registro de Atendimentos
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Efetue o registro de atendimentos simplificados ou acompanhamentos técnicos da V1.</p>
        </div>
        <button onClick={abrirNovoModal} className="btn-primary-action">
          <PlusCircle size={18} />
          Registrar Atendimento
        </button>
      </div>

      {/* Busca e Filtros */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Pesquisar relato, técnico ou munícipe..."
          className="form-control"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ maxWidth: '350px', flex: 1 }}
        />
        <select
          className="form-control"
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">Todos os tipos</option>
          <option value="Simplificado">Atendimento Simples</option>
          <option value="Tecnico">Atendimento Técnico</option>
          <option value="Encaminhamento Interno">Encaminhamento Interno</option>
          <option value="Referencia">Referência</option>
          <option value="ContraReferencia">Contrarreferência</option>
        </select>
      </div>

      <AttendanceTable
        atendimentos={atendimentos}
        carregando={carregando}
        onEdit={abrirEditarModal}
        onDelete={deletarAtendimento}
      />

      {/* MODAL PRINCIPAL REGISTRO DE ATENDIMENTO */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', overflow: 'hidden' }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            width: '100%', 
            maxWidth: showAcoesOverlay ? '1180px' : '850px', 
            borderRadius: '16px', 
            display: 'grid', 
            gridTemplateColumns: showAcoesOverlay ? '1fr 300px' : '1fr',
            height: 'calc(100vh - 40px)',
            transition: 'max-width 0.3s ease-in-out',
            overflow: 'hidden'
          }}>
            
            {/* Bloco da Esquerda: Formulário de Registro */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', borderRight: showAcoesOverlay ? '1px solid #e2e8f0' : 'none' }}>
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  {editandoId ? `Editar Atendimento ${lastCreatedId ? `Nº ${lastCreatedId}` : ''}` : `Registrar Novo Atendimento - Registro ${lastCreatedId ? `Nº ${lastCreatedId}` : ''}`}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {modalidade === 'Simplificado' && status === 'Aberto' && Boolean(editandoId || lastCreatedId) && (
                    <button
                      type="button"
                      onClick={() => setShowAcoesOverlay(aberto => !aberto)}
                      style={{ border: '1px solid #cbd5e1', backgroundColor: showAcoesOverlay ? '#e2e8f0' : '#ffffff', color: '#334155', padding: '7px 12px', borderRadius: '7px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {showAcoesOverlay ? 'Fechar Ações' : 'Abrir Ações'}
                    </button>
                  )}
                  <button type="button" onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={salvarAtendimento} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px', gap: '16px' }}>

              {/* CARD: DADOS PESSOAIS */}
              <div style={{ border: validationErrors.pessoa ? '1.5px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '12px', padding: '18px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} /> Dados Pessoais
                </h4>
                
                {/* Pessoa Atendida Searchable */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pessoa Atendida (Pesquisar ou Selecionar) *</label>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      <input 
                        type="text" 
                        placeholder="🔍 Digite para buscar munícipe por Nome, Nome Social, NIS ou CPF..." 
                        className="form-control"
                        value={termoBuscaMunicipe}
                        onChange={e => setTermoBuscaMunicipe(e.target.value)}
                        style={{ fontSize: '13px', padding: '8px', border: validationErrors.pessoa ? '1.5px solid #ef4444' : '1px solid #cbd5e1' }}
                      />
                      {pessoasFiltradas.length === 0 && termoBuscaMunicipe.trim() !== '' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 14px', borderRadius: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#b45309', fontWeight: 500 }}>Nenhum munícipe encontrado com este termo.</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              if (!/\d/.test(termoBuscaMunicipe)) {
                                setNovaPessoaNome(termoBuscaMunicipe);
                              } else {
                                setNovaPessoaCpf(termoBuscaMunicipe);
                              }
                              setModalDecisaoAberto(true);
                            }}
                            style={{ padding: '6px 12px', backgroundColor: '#d97706', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Cadastrar nova pessoa
                          </button>
                        </div>
                      )}
                      <SearchableSelect 
                        options={pessoasFiltradas.slice(0, 150).map(p => ({ id: p.id, label: `${p.nome} (CPF: ${p.cpf})` }))} 
                        value={pessoaId} 
                        onChange={val => setPessoaId(val.toString())} 
                        placeholder="Selecione o munícipe na lista..." 
                        required 
                        isError={!!validationErrors.pessoa}
                      />
                      {validationErrors.pessoa && (
                        <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>{validationErrors.pessoa}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Família e Prontuário Somente Leitura */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Família</label>
                    <input type="text" className="form-control" value={familiaLabel} disabled style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Prontuário</label>
                    <input type="text" className="form-control" value={prontuarioLabel} disabled style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                  </div>
                </div>
              </div>

              {/* CARD: DADOS DO ATENDIMENTO */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> Dados do Atendimento
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: (editandoId || lastCreatedId) ? '180px 1fr' : '1fr', gap: '16px', marginBottom: '14px' }}>
                  {(editandoId || lastCreatedId) && (
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>ID do Atendimento</label>
                      <input type="text" className="form-control" value={editandoId || lastCreatedId || ''} readOnly style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Modalidade</label>
                    <select className="form-control" value={modalidade} onChange={e => setModalidade(e.target.value as any)} disabled={Boolean(editandoId || lastCreatedId)} style={{ backgroundColor: (editandoId || lastCreatedId) ? '#e2e8f0' : '#ffffff', color: '#475569' }}>
                      <option value="Simplificado">Simplificado (Recepção/Rápido)</option>
                      <option value="Tecnico">Técnico (Acompanhamento)</option>
                    </select>
                  </div>
                </div>

                {modalidade === 'Simplificado' ? (
                  <>
                    {/* Linha 1 (Simplificado): Unidade e Data */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade</label>
                        <SearchableSelect 
                          options={unidades.map(u => ({ id: u.id, label: u.nome_conhecido }))} 
                          value={unidadeId} 
                          onChange={val => setUnidadeId(val.toString())} 
                          placeholder="Selecione a unidade..." 
                          disabled={true}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Atendimento</label>
                        <input type="date" className="form-control" value={dataAtendimento} onChange={e => setDataAtendimento(e.target.value)} disabled style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                      </div>
                    </div>

                    {/* Linha 2 (Simplificado): Forma de Acesso e Tipo de Atendimento */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Forma de Acesso/Motivo do Atendimento *</label>
                        <SearchableSelect 
                          options={motivosAtendimentos.map(m => ({ id: m.id, label: m.nome }))} 
                          value={motivoAtendimentoId} 
                          onChange={val => setMotivoAtendimentoId(val.toString())} 
                          placeholder="Selecione um motivo..." 
                          required 
                          disabled={status === 'Finalizado'}
                          isError={!!validationErrors.motivo}
                        />
                        {validationErrors.motivo && (
                          <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>{validationErrors.motivo}</span>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo Atendimento *</label>
                        <SearchableSelect 
                          options={tiposAtendimentos.map(t => ({ id: t.id, label: t.nome }))} 
                          value={tipoAtendimentoId} 
                          onChange={val => setTipoAtendimentoId(val.toString())} 
                          placeholder="Selecione o tipo..." 
                          required 
                          disabled={status === 'Finalizado'}
                          isError={!!validationErrors.tipo}
                        />
                        {validationErrors.tipo && (
                          <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>{validationErrors.tipo}</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Linha 1 (Técnico): Unidade e Num Atendimento */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade</label>
                        <SearchableSelect 
                          options={unidades.map(u => ({ id: u.id, label: u.nome_conhecido }))} 
                          value={unidadeId} 
                          onChange={val => setUnidadeId(val.toString())} 
                          placeholder="Selecione a unidade..." 
                          disabled={true}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Num. Atendimento</label>
                        <input type="text" className="form-control" placeholder="Gerado automaticamente" disabled style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                      </div>
                    </div>

                    {/* Linha 2 (Técnico): Data e Tipo de Atendimento */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Atendimento</label>
                        <input type="date" className="form-control" value={dataAtendimento} onChange={e => setDataAtendimento(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo Atendimento *</label>
                        <SearchableSelect 
                          options={tiposAtendimentos.map(t => ({ id: t.id, label: t.nome }))} 
                          value={tipoAtendimentoId} 
                          onChange={val => setTipoAtendimentoId(val.toString())} 
                          placeholder="Selecione o tipo..." 
                          required 
                          disabled={status === 'Finalizado'}
                          isError={!!validationErrors.tipo}
                        />
                        {validationErrors.tipo && (
                          <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>{validationErrors.tipo}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* CARD SANFONA: INFORMAÇÕES DO ATENDIMENTO INICIAL (Sempre visível para relato principal se Simplificado) */}
              {modalidade === 'Simplificado' && (
                <div style={{ border: validationErrors.descricaoSumaria ? '1.5px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
                  <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>
                    Informações do Atendimento Inicial
                  </h4>
                  
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Observações Atendimento Inicial *</label>
                    <textarea 
                      className="form-control" 
                      rows={4} 
                      value={descricaoSumaria} 
                      onChange={e => setDescricaoSumaria(e.target.value)}
                      readOnly={status === 'Finalizado'}
                      placeholder="Descreva a demanda inicial relatada pelo munícipe..."
                      style={{ border: validationErrors.descricaoSumaria ? '1.5px solid #ef4444' : '1px solid #cbd5e1' }}
                    />
                    {validationErrors.descricaoSumaria && (
                      <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600, display: 'block', marginTop: '4px' }}>{validationErrors.descricaoSumaria}</span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Técnico Responsável</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={currentUser ? ([currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') || currentUser.username || 'Operador') : 'Operador'}
                        disabled 
                        style={{ backgroundColor: '#e2e8f0', color: '#475569' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Função do Técnico</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={currentUser?.groups && currentUser.groups.length > 0 ? (currentUser.groups[0] || 'Operador') : 'Operador'}
                        disabled 
                        style={{ backgroundColor: '#e2e8f0', color: '#475569' }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CARD SANFONA: INFORMAÇÕES DO ATENDIMENTO TÉCNICO (Somente se modalidade === Tecnico) */}
              {modalidade === 'Tecnico' && (
                <div style={{ border: validationErrors.descricaoTecnico ? '1.5px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '12px', padding: '18px', backgroundColor: '#fdfbf7' }}>
                  <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', fontWeight: 700, color: '#b45309' }}>
                    Informações do Atendimento Técnico
                  </h4>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Descrição do Atendimento Técnico</label>
                    <textarea 
                      className="form-control" 
                      rows={4} 
                      value={descricaoTecnico} 
                      onChange={e => setDescricaoTecnico(e.target.value)}
                      readOnly={status === 'Finalizado'}
                      placeholder="Descreva as orientações, procedures e parecer técnico realizado no acompanhamento..."
                      style={{ border: validationErrors.descricaoTecnico ? '1.5px solid #ef4444' : '1px solid #cbd5e1' }}
                    />
                    {validationErrors.descricaoTecnico && (
                      <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600, display: 'block', marginTop: '4px' }}>{validationErrors.descricaoTecnico}</span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Responsável Atendimento Técnico</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={currentUser ? ([currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') || currentUser.username || 'Operador') : 'Operador'}
                        disabled 
                        style={{ backgroundColor: '#e2e8f0', color: '#475569' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Função</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={currentUser?.groups && currentUser.groups.length > 0 ? (currentUser.groups[0] || 'Operador') : 'Operador'}
                        disabled 
                        style={{ backgroundColor: '#e2e8f0', color: '#475569' }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  Cancelar
                </button>
                {status === 'Aberto' && (
                  <button type="submit" className="btn-primary-action">
                    Salvar Registro
                  </button>
                )}
              </div>
            </form>
          </div>

            {showAcoesOverlay && (
              <AttendanceActionsDrawer
                atendimentoId={lastCreatedId || editandoId}
                apiUrl={API_URL}
                onClose={() => setShowAcoesOverlay(false)}
                onFinish={encerrarAtendimento}
                onInternalReferral={abrirEncaminhamentoInterno}
              />
            )}
          </div>
        </div>
      )}

      <InternalReferralModal
        open={modalEncaminhamentoAberto}
        familyLabel={familiaLabel}
        recordLabel={prontuarioLabel}
        person={pessoas.find(pessoa => pessoa.id.toString() === pessoaId)}
        reason={motivoEncaminhamento}
        date={dataEncaminhamento}
        professionalId={profissionalEncaminhamentoId}
        professionals={profissionais}
        units={unidades}
        error={erroEncaminhamento}
        saving={salvandoEncaminhamento}
        onReasonChange={setMotivoEncaminhamento}
        onDateChange={setDataEncaminhamento}
        onProfessionalChange={setProfissionalEncaminhamentoId}
        onClose={() => setModalEncaminhamentoAberto(false)}
        onSubmit={salvarEncaminhamentoInterno}
      />

      {/* AVISO DE SUCESSO DO ATENDIMENTO REGISTRADO */}
      {showSuccessMessage && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 2000, minWidth: '320px', animation: 'slideIn 0.3s ease-out' }}>
          <div style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Sucesso!</div>
              <div style={{ fontSize: '12px', marginTop: '2px', opacity: 0.9 }}>Atendimento registrado com sucesso no sistema.</div>
            </div>
            <button onClick={() => setShowSuccessMessage(false)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer', marginLeft: '12px', fontWeight: 700 }}>&times;</button>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR PESSOA RÁPIDO */}
      {modalNovaPessoaAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '500px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Cadastro Rápido de Munícipe</h3>
              <button onClick={() => setModalNovaPessoaAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={salvarPessoaRapido} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {errorPessoaMsg && (
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  {errorPessoaMsg}
                </div>
              )}

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo *</label>
                <input type="text" className="form-control" value={novaPessoaNome} onChange={e => setNovaPessoaNome(e.target.value)} required />
              </div>
              
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CPF *</label>
                <input type="text" className="form-control" placeholder="Apenas números ou formato padrão" value={novaPessoaCpf} onChange={e => setNovaPessoaCpf(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nascimento *</label>
                  <input type="date" className="form-control" value={novaPessoaNascimento} onChange={e => setNovaPessoaNascimento(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sexo *</label>
                  <select className="form-control" value={novaPessoaSexo} onChange={e => setNovaPessoaSexo(e.target.value as any)}>
                    <option value="Fem">Feminino</option>
                    <option value="Masc">Masculino</option>
                  </select>
                </div>
              </div>

              {/* Input escondido/vinculado conforme escolha do modal de decisão */}
              {novaPessoaFamiliaOpcao === 'com_familia' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Selecionar Família Domicílio *</label>
                  <select 
                    className="form-control" 
                    value={novaPessoaFamiliaId} 
                    onChange={e => setNovaPessoaFamiliaId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma família...</option>
                    {familias.map(f => (
                      <option key={f.id} value={f.id}>{f.nome} (Código: {f.codigo || f.id})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button type="button" onClick={() => setModalNovaPessoaAberto(false)} style={{ padding: '8px 14px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '8px 14px', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INTERMEDIÁRIO DE DECISÃO (Mockup V1) */}
      {modalDecisaoAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '12px', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            
            {/* Ícone Exclamação Grande */}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #fbcfe8', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#db2777' }}>
              <span style={{ fontSize: '3rem', fontWeight: 300, lineHeight: 1 }}>!</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: '#1e293b' }}>
                Pessoa não Encontrada.<br />Deseja cadastrá-la?
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                Aconselha-se rever critérios de Pesquisa<br />Antes de Prosseguir
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '8px' }}>
              {/* Botão 1: Cadastrar Grupo Familiar (Redireciona para aba de Família/Domicílio) */}
              <button 
                type="button" 
                onClick={() => {
                  setModalDecisaoAberto(false);
                  setModalAberto(false);
                  // Redireciona via hash da URL para carregar o componente de Famílias
                  window.location.hash = 'familias';
                  window.location.reload();
                }}
                style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                Cadastrar Grupo Familiar
              </button>

              {/* Botão 2: Incluir em Grupo Familiar (Abre o modal rápido de Munícipe associado à família) */}
              <button 
                type="button" 
                onClick={() => {
                  setNovaPessoaFamiliaOpcao('com_familia');
                  setModalDecisaoAberto(false);
                  setModalNovaPessoaAberto(true);
                }}
                style={{ width: '100%', padding: '12px', backgroundColor: '#0284c7', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                Incluir em Grupo Familiar
              </button>

              {/* Botão 3: Cancelar */}
              <button 
                type="button" 
                onClick={() => setModalDecisaoAberto(false)}
                style={{ width: '100%', padding: '12px', backgroundColor: '#dc2626', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
