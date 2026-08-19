import React from 'react';
import SearchableSelect from '../SearchableSelect';
import { TabInicio } from './tabs/TabInicio';
import { TabComposicaoFamiliar } from './tabs/TabComposicaoFamiliar';
import { TabEndereco } from './tabs/TabEndereco';
import { TabHistoricoTransferencia } from './tabs/TabHistoricoTransferencia';
import { TabCondicoesHabitacionais } from './tabs/TabCondicoesHabitacionais';
import { TabEtnia } from './tabs/TabEtnia';
import { TabDespesas } from './tabs/TabDespesas';

interface FamilyEditModalProps {
  editandoId: number | null;
  codigoFamiliaExibicao: string;
  responsavelFamiliarNome: string;
  activeEditTab: string;
  setActiveEditTab: (tab: string) => void;
  setModalAberto: (val: boolean) => void;
  salvarFamilia: (e: React.FormEvent) => void;
  errorMsg: string | null;
  
  // States necessários para Início
  unidades: any[];
  origensCadastro: any[];
  tipoUnidadeAtendimentoId: string;
  origemCadastroId: string;
  dataCadastro: string;
  codigoCadUnico: string;
  dataUltAtualizacao: string;
  unidadeCadastroLabel: string;
  responsavelCadastroLabel: string;
  familias: any[];
  setTipoUnidadeAtendimentoId: (val: string) => void;
  setOrigemCadastroId: (val: string) => void;
  setDataCadastro: (val: string) => void;
  setCodigoCadUnico: (val: string) => void;
  setUnidadeOrigemNomeExibicao: (val: string) => void;
  setUnidadeDestinoPendente: (val: string) => void;
  setJustificativaTransferencia: (val: string) => void;
  setTransferenciaModalAberto: (val: boolean) => void;

  // States necessários para Composição Familiar
  membrosFamilia: any[];
  token: string | null;
  API_URL: string;
  setMembrosFamilia: React.Dispatch<React.SetStateAction<any[]>>;
  carregarDados: () => void;
  setModalEscolhaInclusao: (val: boolean) => void;
  setPessoaSelecionadaPendente: (val: any) => void;
  setNovoParentescoId: (val: string) => void;
  setMotivoTransferenciaPessoa: (val: string) => void;
  setObservacoesTransferenciaPessoa: (val: string) => void;
  setModalTransferirPessoa: (val: boolean) => void;

  // States necessários para Endereço
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento: string;
  mapCoords: [number, number];
  latitudeVal: string;
  longitudeVal: string;
  tempoMoradiaAnos: string;
  tempoMoradiaMeses: string;
  setCep: (val: string) => void;
  setLogradouro: (val: string) => void;
  setNumero: (val: string) => void;
  setBairro: (val: string) => void;
  setCidade: (val: string) => void;
  setUf: (val: string) => void;
  setComplemento: (val: string) => void;
  setTempoMoradiaAnos: (val: string) => void;
  setTempoMoradiaMeses: (val: string) => void;

  // States necessários para Criação / Box 2
  localizacaoDomicilio: 'Urbana' | 'Rural';
  setLocalizacaoDomicilio: (val: 'Urbana' | 'Rural') => void;
  areaRisco: 'Sim' | 'Não';
  setAreaRisco: (val: 'Sim' | 'Não') => void;
  areaConflito: 'Sim' | 'Não';
  setAreaConflito: (val: 'Sim' | 'Não') => void;
  beneficioBolsaFamilia: 'Sim' | 'Não';
  setBeneficioBolsaFamilia: (val: 'Sim' | 'Não') => void;

  // Listas aux
  especiesDomicilio: any[];
  tiposResidencia: any[];
  tiposPiso: any[];
  tiposConstrucao: any[];
  tiposIluminacao: any[];
  tiposAbastecimentoAgua: any[];
  tiposEscoamentoSanitario: any[];
  tiposColetaLixo: any[];
  tiposAcessibilidade: any[];
  tiposAnimais: any[];

  // Estados
  especieDomicilioId: string;
  tipoResidenciaId: string;
  tipoConstrucaoId: string;
  tipoPisoId: string;
  tipoIluminacaoId: string;
  acessibilidadeId: string;
  animalId: string;
  aguaCanalizada: string;
  abastecimentoAguaId: string;
  possuiBanheiro: string;
  escoamentoSanitarioId: string;
  coletaLixoId: string;
  calcamentoFrente: string;
  dificilAcesso: string;
  numeroComodos: string;
  numeroDormitorios: string;
  pessoasDormitorio: string;
  totalPessoas: string;
  totalFamilias: string;
  pessoas0a17: string;
  pessoas18a64: string;
  pessoas65mais: string;

  // Setters
  setEspecieDomicilioId: (val: string) => void;
  setTipoResidenciaId: (val: string) => void;
  setTipoConstrucaoId: (val: string) => void;
  setTipoPisoId: (val: string) => void;
  setTipoIluminacaoId: (val: string) => void;
  setAcessibilidadeId: (val: string) => void;
  setAnimalId: (val: string) => void;
  setAguaCanalizada: (val: string) => void;
  setAbastecimentoAguaId: (val: string) => void;
  setPossuiBanheiro: (val: string) => void;
  setEscoamentoSanitarioId: (val: string) => void;
  setColetaLixoId: (val: string) => void;
  setCalcamentoFrente: (val: string) => void;
  setDificilAcesso: (val: string) => void;
  setNumeroComodos: (val: string) => void;
  setNumeroDormitorios: (val: string) => void;
  setPessoasDormitorio: (val: string) => void;
  setTotalPessoas: (val: string) => void;
  setTotalFamilias: (val: string) => void;
  setPessoas0a17: (val: string) => void;
  setPessoas18a64: (val: string) => void;
  setPessoas65mais: (val: string) => void;
  // Etnia
  codigoPovoIndigena: string;
  povoIndigena: string;
  codigoReservaIndigena: string;
  reservaIndigena: string;
  codigoComunidadeQuilombola: string;
  comunidadeQuilombola: string;
  setCodigoPovoIndigena: (val: string) => void;
  setPovoIndigena: (val: string) => void;
  setCodigoReservaIndigena: (val: string) => void;
  setReservaIndigena: (val: string) => void;
  setCodigoComunidadeQuilombola: (val: string) => void;
  setComunidadeQuilombola: (val: string) => void;  // Despesas
  despesaEnergiaEletrica: string;
  despesaAguaEsgoto: string;
  despesaGasCarvaoLenha: string;
  despesaAlimentacaoHigieneLimpeza: string;
  despesaTransporte: string;
  despesaAluguel: string;
  despesaMedicamentoUsoRegular: string;
  despesaCombustivel: string;
  despesaFinanciamentoImovel: string;
  despesaFinanciamentoVeiculo: string;
  despesaCelular: string;
  despesaAssinaturaTv: string;
  despesaTelefoneFixo: string;
  despesaEmprestimo: string;
  despesaSaude: string;
  despesaEducacao: string;
  setDespesaEnergiaEletrica: (val: string) => void;
  setDespesaAguaEsgoto: (val: string) => void;
  setDespesaGasCarvaoLenha: (val: string) => void;
  setDespesaAlimentacaoHigieneLimpeza: (val: string) => void;
  setDespesaTransporte: (val: string) => void;
  setDespesaAluguel: (val: string) => void;
  setDespesaMedicamentoUsoRegular: (val: string) => void;
  setDespesaCombustivel: (val: string) => void;
  setDespesaFinanciamentoImovel: (val: string) => void;
  setDespesaFinanciamentoVeiculo: (val: string) => void;
  setDespesaCelular: (val: string) => void;
  setDespesaAssinaturaTv: (val: string) => void;
  setDespesaTelefoneFixo: (val: string) => void;
  setDespesaEmprestimo: (val: string) => void;
  setDespesaSaude: (val: string) => void;
  setDespesaEducacao: (val: string) => void;

  // States necessários para Histórico Transferência
  localTransferencias: any[];
}

export const FamilyEditModal: React.FC<FamilyEditModalProps> = ({
  editandoId,
  codigoFamiliaExibicao,
  responsavelFamiliarNome,
  activeEditTab,
  setActiveEditTab,
  setModalAberto,
  salvarFamilia,
  errorMsg,
  unidades,
  origensCadastro,
  tipoUnidadeAtendimentoId,
  origemCadastroId,
  dataCadastro,
  codigoCadUnico,
  dataUltAtualizacao,
  unidadeCadastroLabel,
  responsavelCadastroLabel,
  familias,
  setTipoUnidadeAtendimentoId,
  setOrigemCadastroId,
  setDataCadastro,
  setCodigoCadUnico,
  setUnidadeOrigemNomeExibicao,
  setUnidadeDestinoPendente,
  setJustificativaTransferencia,
  setTransferenciaModalAberto,
  membrosFamilia,
  token,
  API_URL,
  setMembrosFamilia,
  carregarDados,
  setModalEscolhaInclusao,
  setPessoaSelecionadaPendente,
  setNovoParentescoId,
  setMotivoTransferenciaPessoa,
  setObservacoesTransferenciaPessoa,
  setModalTransferirPessoa,
  cep,
  logradouro,
  numero,
  bairro,
  cidade,
  uf,
  complemento,
  mapCoords,
  latitudeVal,
  longitudeVal,
  tempoMoradiaAnos,
  tempoMoradiaMeses,
  setCep,
  setLogradouro,
  setNumero,
  setBairro,
  setCidade,
  setUf,
  setComplemento,
  setTempoMoradiaAnos,
  setTempoMoradiaMeses,
  localizacaoDomicilio,
  setLocalizacaoDomicilio,
  areaRisco,
  setAreaRisco,
  areaConflito,
  setAreaConflito,
  beneficioBolsaFamilia,
  setBeneficioBolsaFamilia,
  localTransferencias,
  especiesDomicilio,
  tiposResidencia,
  tiposPiso,
  tiposConstrucao,
  tiposIluminacao,
  tiposAbastecimentoAgua,
  tiposEscoamentoSanitario,
  tiposColetaLixo,
  tiposAcessibilidade,
  tiposAnimais,
  especieDomicilioId,
  tipoResidenciaId,
  tipoConstrucaoId,
  tipoPisoId,
  tipoIluminacaoId,
  acessibilidadeId,
  animalId,
  aguaCanalizada,
  abastecimentoAguaId,
  possuiBanheiro,
  escoamentoSanitarioId,
  coletaLixoId,
  calcamentoFrente,
  dificilAcesso,
  numeroComodos,
  numeroDormitorios,
  pessoasDormitorio,
  totalPessoas,
  totalFamilias,
  pessoas0a17,
  pessoas18a64,
  pessoas65mais,
  setEspecieDomicilioId,
  setTipoResidenciaId,
  setTipoConstrucaoId,
  setTipoPisoId,
  setTipoIluminacaoId,
  setAcessibilidadeId,
  setAnimalId,
  setAguaCanalizada,
  setAbastecimentoAguaId,
  setPossuiBanheiro,
  setEscoamentoSanitarioId,
  setColetaLixoId,
  setCalcamentoFrente,
  setDificilAcesso,
  setNumeroComodos,
  setNumeroDormitorios,
  setPessoasDormitorio,
  setTotalPessoas,
  setTotalFamilias,
  setPessoas0a17,
  setPessoas18a64,
  setPessoas65mais,
  codigoPovoIndigena,
  povoIndigena,
  codigoReservaIndigena,
  reservaIndigena,
  codigoComunidadeQuilombola,
  comunidadeQuilombola,
  setCodigoPovoIndigena,
  setPovoIndigena,
  setCodigoReservaIndigena,
  setReservaIndigena,
  setCodigoComunidadeQuilombola,
  setComunidadeQuilombola,
  despesaEnergiaEletrica,
  despesaAguaEsgoto,
  despesaGasCarvaoLenha,
  despesaAlimentacaoHigieneLimpeza,
  despesaTransporte,
  despesaAluguel,
  despesaMedicamentoUsoRegular,
  despesaCombustivel,
  despesaFinanciamentoImovel,
  despesaFinanciamentoVeiculo,
  despesaCelular,
  despesaAssinaturaTv,
  despesaTelefoneFixo,
  despesaEmprestimo,
  despesaSaude,
  despesaEducacao,
  setDespesaEnergiaEletrica,
  setDespesaAguaEsgoto,
  setDespesaGasCarvaoLenha,
  setDespesaAlimentacaoHigieneLimpeza,
  setDespesaTransporte,
  setDespesaAluguel,
  setDespesaMedicamentoUsoRegular,
  setDespesaCombustivel,
  setDespesaFinanciamentoImovel,
  setDespesaFinanciamentoVeiculo,
  setDespesaCelular,
  setDespesaAssinaturaTv,
  setDespesaTelefoneFixo,
  setDespesaEmprestimo,
  setDespesaSaude,
  setDespesaEducacao
}) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '1100px', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '95vh', overflow: 'hidden' }}>
        
        {/* Header com Código Família, RF e Ações */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Família Domicilio
              </h3>
              {editandoId && (
                <div style={{ fontSize: '13px', color: '#475569', display: 'flex', gap: '16px' }}>
                  <span><strong>Código Família:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>{codigoFamiliaExibicao}</span></span>
                  <span><strong>RF:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>{responsavelFamiliarNome}</span></span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {editandoId && (
                <>
                  <button type="button" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    👁️ Visualizar Documentos
                  </button>
                  <button type="button" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🖨️ Imprimir Ficha
                  </button>
                </>
              )}
              <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer', marginLeft: '10px' }}>&times;</button>
            </div>
          </div>

          {/* Barra de 11 Abas da Família em Duas Linhas */}
          {editandoId && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingBottom: '4px', borderBottom: '1px solid #e2e8f0' }}>
              {[
                { id: 'inicio', label: '➡ Início' },
                { id: 'composicao', label: '👥 Composição Familiar' },
                { id: 'endereco', label: '🗺 Endereço' },
                { id: 'habitacionais', label: '🏠 Condições Habitacionais' },
                { id: 'etnia', label: '🎨 Etnia do Grupo Familiar' },
                { id: 'despesas', label: '💵 Despesas' },
                { id: 'socioassistenciais', label: '🤝 Condições Socioassistenciais' },
                { id: 'observacoes', label: '📝 Observações' },
                { id: 'historico_atendimento', label: '📋 Histórico de Atendimento' },
                { id: 'historico_transferencia', label: '🔄 Histórico de Transferência' },
                { id: 'beneficios', label: '🤝 Benefícios Recebidos' },
              ].map(tab => {
                const isSelected = activeEditTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveEditTab(tab.id)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? '#10b981' : '#f3f4f6',
                      color: isSelected ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={salvarFamilia} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '24px', gap: '20px' }}>
          {errorMsg && (
            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Aba 1: Início */}
          {(editandoId && activeEditTab === 'inicio') && (
            <TabInicio 
              editandoId={editandoId}
              unidades={unidades}
              origensCadastro={origensCadastro}
              tipoUnidadeAtendimentoId={tipoUnidadeAtendimentoId}
              origemCadastroId={origemCadastroId}
              dataCadastro={dataCadastro}
              codigoCadUnico={codigoCadUnico}
              dataUltAtualizacao={dataUltAtualizacao}
              unidadeCadastroLabel={unidadeCadastroLabel}
              responsavelCadastroLabel={responsavelCadastroLabel}
              familias={familias}
              setTipoUnidadeAtendimentoId={setTipoUnidadeAtendimentoId}
              setOrigemCadastroId={setOrigemCadastroId}
              setDataCadastro={setDataCadastro}
              setCodigoCadUnico={setCodigoCadUnico}
              setUnidadeOrigemNomeExibicao={setUnidadeOrigemNomeExibicao}
              setUnidadeDestinoPendente={setUnidadeDestinoPendente}
              setJustificativaTransferencia={setJustificativaTransferencia}
              setTransferenciaModalAberto={setTransferenciaModalAberto}
            />
          )}

          {/* Aba 2: Composição Familiar */}
          {editandoId && activeEditTab === 'composicao' && (
            <TabComposicaoFamiliar 
              editandoId={editandoId}
              membrosFamilia={membrosFamilia}
              token={token}
              API_URL={API_URL}
              setMembrosFamilia={setMembrosFamilia}
              carregarDados={carregarDados}
              setModalEscolhaInclusao={setModalEscolhaInclusao}
              setPessoaSelecionadaPendente={setPessoaSelecionadaPendente}
              setNovoParentescoId={setNovoParentescoId}
              setMotivoTransferenciaPessoa={setMotivoTransferenciaPessoa}
              setObservacoesTransferenciaPessoa={setObservacoesTransferenciaPessoa}
              setModalTransferirPessoa={setModalTransferirPessoa}
            />
          )}

          {/* Aba 3: Endereço */}
          {(!editandoId || activeEditTab === 'endereco') && (
            <TabEndereco 
              cep={cep}
              logradouro={logradouro}
              numero={numero}
              bairro={bairro}
              cidade={cidade}
              uf={uf}
              complemento={complemento}
              mapCoords={mapCoords}
              latitudeVal={latitudeVal}
              longitudeVal={longitudeVal}
              tempoMoradiaAnos={tempoMoradiaAnos}
              tempoMoradiaMeses={tempoMoradiaMeses}
              setCep={setCep}
              setLogradouro={setLogradouro}
              setNumero={setNumero}
              setBairro={setBairro}
              setCidade={setCidade}
              setUf={setUf}
              setComplemento={setComplemento}
              setTempoMoradiaAnos={setTempoMoradiaAnos}
              setTempoMoradiaMeses={setTempoMoradiaMeses}
            />
          )}

          {/* Box 2: Indicadores e Dados Socioassistenciais */}
          {!editandoId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Localização do Domicílio</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="localizacaoDomicilio" checked={localizacaoDomicilio === 'Urbana'} onChange={() => setLocalizacaoDomicilio('Urbana')} /> Urbana
                    </label>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="localizacaoDomicilio" checked={localizacaoDomicilio === 'Rural'} onChange={() => setLocalizacaoDomicilio('Rural')} /> Rural
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Área de Risco</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="areaRisco" checked={areaRisco === 'Sim'} onChange={() => setAreaRisco('Sim')} /> Sim
                    </label>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="areaRisco" checked={areaRisco === 'Não'} onChange={() => setAreaRisco('Não')} /> Não
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Área Conflito / Violência</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="areaConflito" checked={areaConflito === 'Sim'} onChange={() => setAreaConflito('Sim')} /> Sim
                    </label>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="areaConflito" checked={areaConflito === 'Não'} onChange={() => setAreaConflito('Não')} /> Não
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade Atendimento da Família: *</label>
                  <SearchableSelect 
                    options={unidades.map(u => ({ id: u.id, label: u.nome_conhecido }))} 
                    value={tipoUnidadeAtendimentoId} 
                    onChange={val => setTipoUnidadeAtendimentoId(val.toString())} 
                    placeholder="Selecione a Unidade..." 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Benef. Bolsa Família</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="beneficioBolsaFamilia" checked={beneficioBolsaFamilia === 'Sim'} onChange={() => setBeneficioBolsaFamilia('Sim')} /> Sim
                    </label>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input type="radio" name="beneficioBolsaFamilia" checked={beneficioBolsaFamilia === 'Não'} onChange={() => setBeneficioBolsaFamilia('Não')} /> Não
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Cadastro: *</label>
                  <input type="date" className="form-control" value={dataCadastro} onChange={e => setDataCadastro(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Origem do Cadastro: *</label>
                  <SearchableSelect 
                    options={origensCadastro.map(o => ({ id: o.id, label: o.nome }))} 
                    value={origemCadastroId} 
                    onChange={val => setOrigemCadastroId(val.toString())} 
                    placeholder="Selecione a Origem..." 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade Cadastro:</label>
                  <input type="text" className="form-control" value={unidadeCadastroLabel} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Responsável pelo Cadastro:</label>
                  <input type="text" className="form-control" value={responsavelCadastroLabel} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                </div>
              </div>
            </div>
          )}

          {/* Aba 10: Histórico de Transferência */}
          {editandoId && activeEditTab === 'historico_transferencia' && (
            <TabHistoricoTransferencia localTransferencias={localTransferencias} />
          )}

          {/* Aba: Condições Habitacionais */}
          {editandoId && activeEditTab === 'habitacionais' && (
            <TabCondicoesHabitacionais 
              especiesDomicilio={especiesDomicilio}
              tiposResidencia={tiposResidencia}
              tiposPiso={tiposPiso}
              tiposConstrucao={tiposConstrucao}
              tiposIluminacao={tiposIluminacao}
              tiposAbastecimentoAgua={tiposAbastecimentoAgua}
              tiposEscoamentoSanitario={tiposEscoamentoSanitario}
              tiposColetaLixo={tiposColetaLixo}
              tiposAcessibilidade={tiposAcessibilidade}
              tiposAnimais={tiposAnimais}
              especieDomicilioId={especieDomicilioId}
              tipoResidenciaId={tipoResidenciaId}
              tipoConstrucaoId={tipoConstrucaoId}
              tipoPisoId={tipoPisoId}
              tipoIluminacaoId={tipoIluminacaoId}
              acessibilidadeId={acessibilidadeId}
              animalId={animalId}
              aguaCanalizada={aguaCanalizada}
              abastecimentoAguaId={abastecimentoAguaId}
              possuiBanheiro={possuiBanheiro}
              escoamentoSanitarioId={escoamentoSanitarioId}
              coletaLixoId={coletaLixoId}
              calcamentoFrente={calcamentoFrente}
              dificilAcesso={dificilAcesso}
              numeroComodos={numeroComodos}
              numeroDormitorios={numeroDormitorios}
              pessoasDormitorio={pessoasDormitorio}
              totalPessoas={totalPessoas}
              totalFamilias={totalFamilias}
              pessoas0a17={pessoas0a17}
              pessoas18a64={pessoas18a64}
              pessoas65mais={pessoas65mais}
              setEspecieDomicilioId={setEspecieDomicilioId}
              setTipoResidenciaId={setTipoResidenciaId}
              setTipoConstrucaoId={setTipoConstrucaoId}
              setTipoPisoId={setTipoPisoId}
              setTipoIluminacaoId={setTipoIluminacaoId}
              setAcessibilidadeId={setAcessibilidadeId}
              setAnimalId={setAnimalId}
              setAguaCanalizada={setAguaCanalizada}
              setAbastecimentoAguaId={setAbastecimentoAguaId}
              setPossuiBanheiro={setPossuiBanheiro}
              setEscoamentoSanitarioId={setEscoamentoSanitarioId}
              setColetaLixoId={setColetaLixoId}
              setCalcamentoFrente={setCalcamentoFrente}
              setDificilAcesso={setDificilAcesso}
              setNumeroComodos={setNumeroComodos}
              setNumeroDormitorios={setNumeroDormitorios}
              setPessoasDormitorio={setPessoasDormitorio}
              setTotalPessoas={setTotalPessoas}
              setTotalFamilias={setTotalFamilias}
              setPessoas0a17={setPessoas0a17}
              setPessoas18a64={setPessoas18a64}
              setPessoas65mais={setPessoas65mais}
              membrosFamilia={membrosFamilia}
              familias={familias}
              editandoId={editandoId}
              cep={cep}
              logradouro={logradouro}
              numero={numero}
            />
          )}

          {/* Aba: Etnia do Grupo Familiar */}
          {editandoId && activeEditTab === 'etnia' && (
            <TabEtnia 
              codigoPovoIndigena={codigoPovoIndigena}
              povoIndigena={povoIndigena}
              codigoReservaIndigena={codigoReservaIndigena}
              reservaIndigena={reservaIndigena}
              codigoComunidadeQuilombola={codigoComunidadeQuilombola}
              comunidadeQuilombola={comunidadeQuilombola}
              setCodigoPovoIndigena={setCodigoPovoIndigena}
              setPovoIndigena={setPovoIndigena}
              setCodigoReservaIndigena={setCodigoReservaIndigena}
              setReservaIndigena={setReservaIndigena}
              setCodigoComunidadeQuilombola={setCodigoComunidadeQuilombola}
              setComunidadeQuilombola={setComunidadeQuilombola}
            />
          )}

          {/* Aba: Despesas */}
          {editandoId && activeEditTab === 'despesas' && (
            <TabDespesas 
              despesaEnergiaEletrica={despesaEnergiaEletrica}
              despesaAguaEsgoto={despesaAguaEsgoto}
              despesaGasCarvaoLenha={despesaGasCarvaoLenha}
              despesaAlimentacaoHigieneLimpeza={despesaAlimentacaoHigieneLimpeza}
              despesaTransporte={despesaTransporte}
              despesaAluguel={despesaAluguel}
              despesaMedicamentoUsoRegular={despesaMedicamentoUsoRegular}
              despesaCombustivel={despesaCombustivel}
              despesaFinanciamentoImovel={despesaFinanciamentoImovel}
              despesaFinanciamentoVeiculo={despesaFinanciamentoVeiculo}
              despesaCelular={despesaCelular}
              despesaAssinaturaTv={despesaAssinaturaTv}
              despesaTelefoneFixo={despesaTelefoneFixo}
              despesaEmprestimo={despesaEmprestimo}
              despesaSaude={despesaSaude}
              despesaEducacao={despesaEducacao}
              setDespesaEnergiaEletrica={setDespesaEnergiaEletrica}
              setDespesaAguaEsgoto={setDespesaAguaEsgoto}
              setDespesaGasCarvaoLenha={setDespesaGasCarvaoLenha}
              setDespesaAlimentacaoHigieneLimpeza={setDespesaAlimentacaoHigieneLimpeza}
              setDespesaTransporte={setDespesaTransporte}
              setDespesaAluguel={setDespesaAluguel}
              setDespesaMedicamentoUsoRegular={setDespesaMedicamentoUsoRegular}
              setDespesaCombustivel={setDespesaCombustivel}
              setDespesaFinanciamentoImovel={setDespesaFinanciamentoImovel}
              setDespesaFinanciamentoVeiculo={setDespesaFinanciamentoVeiculo}
              setDespesaCelular={setDespesaCelular}
              setDespesaAssinaturaTv={setDespesaAssinaturaTv}
              setDespesaTelefoneFixo={setDespesaTelefoneFixo}
              setDespesaEmprestimo={setDespesaEmprestimo}
              setDespesaSaude={setDespesaSaude}
              setDespesaEducacao={setDespesaEducacao}
            />
          )}

          {/* Botões de Ação */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            {editandoId ? (
              <>
                <button 
                  type="button" 
                  onClick={() => setModalAberto(false)} 
                  style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #f97316', borderRadius: '6px', color: '#f97316', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  ↩ Voltar
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  ✔ Salvar
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '4px', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '4px', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Salvar
                </button>
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
