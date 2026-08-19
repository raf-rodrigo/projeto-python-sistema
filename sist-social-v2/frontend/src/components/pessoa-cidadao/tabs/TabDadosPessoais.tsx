import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
  familia_codigo?: string;
}

interface TabDadosPessoaisProps {
  familiaDomicilio: string;
  setFamiliaDomicilio: (val: string) => void;
  lockFamiliaSelect: boolean;
  familias: TabelaBasicaItem[];
  nome: string;
  setNome: (val: string) => void;
  nomeSocial: string;
  setNomeSocial: (val: string) => void;
  nis: string;
  setNis: (val: string) => void;
  certidaoNascimentoData: string;
  setCertidaoNascimentoData: (val: string) => void;
  sexo: 'Masc' | 'Fem';
  setSexo: (val: 'Masc' | 'Fem') => void;
  raca: string;
  setRaca: (val: string) => void;
  orientacaoSexual: string;
  setOrientacaoSexual: (val: string) => void;
  orientacoesSexuais: TabelaBasicaItem[];
  racas: TabelaBasicaItem[];
  tipoEstadoCivil: string;
  setTipoEstadoCivil: (val: string) => void;
  estadosCivis: TabelaBasicaItem[];
  tipoParentesco: string;
  setTipoParentesco: (val: string) => void;
  parentescos: TabelaBasicaItem[];
  situacaoDeRua: 'Sim' | 'Não';
  setSituacaoDeRua: (val: 'Sim' | 'Não') => void;
  
  // Contatos (Se Não rua)
  telefone: string;
  setTelefone: (val: string) => void;
  celular: string;
  setCelular: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;

  // Situação de Rua Sub-Abas
  subTabRua: 'inicio' | 'dormir' | 'vulnerabilidade' | 'motivos' | 'atividade' | 'atendimento' | 'sustento' | 'observacoes';
  setSubTabRua: (val: any) => void;
  tempoViveNaRua: string;
  setTempoViveNaRua: (val: string) => void;
  temposRua: TabelaBasicaItem[];
  tempoMoraNaCidade: string;
  setTempoMoraNaCidade: (val: string) => void;
  temposCidade: TabelaBasicaItem[];
  viveComFamiliaRua: 'Sim' | 'Não';
  setViveComFamiliaRua: (val: 'Sim' | 'Não') => void;
  contatoParenteForaRua: string;
  setContatoParenteForaRua: (val: string) => void;
  contatosParentes: TabelaBasicaItem[];
  teveEmpregoCarteiraAssinada: 'Sim' | 'Não' | 'Não Sabe';
  setTeveEmpregoCarteiraAssinada: (val: 'Sim' | 'Não' | 'Não Sabe') => void;

  // Onde Dorme
  dormeRua: 'Sim' | 'Não';
  setDormeRua: (val: 'Sim' | 'Não') => void;
  tempoDormeRua: string;
  setTempoDormeRua: (val: string) => void;
  servicoAcolhimento: 'Sim' | 'Não';
  setServicoAcolhimento: (val: 'Sim' | 'Não') => void;
  tempoServicoAcolhimento: string;
  setTempoServicoAcolhimento: (val: string) => void;
  domicilioParticular: 'Sim' | 'Não';
  setDomicilioParticular: (val: 'Sim' | 'Não') => void;
  tempoDomicilioParticular: string;
  setTempoDomicilioParticular: (val: string) => void;
  outroDormir: 'Sim' | 'Não';
  setOutroDormir: (val: 'Sim' | 'Não') => void;
  tempoOutroDormir: string;
  setTempoOutroDormir: (val: string) => void;

  // Vulnerabilidades
  exploracaoInfantil: 'Sim' | 'Não';
  setExploracaoInfantil: (val: 'Sim' | 'Não') => void;
  exploracaoSexual: 'Sim' | 'Não';
  setExploracaoSexual: (val: 'Sim' | 'Não') => void;
  violenciaFisica: 'Sim' | 'Não';
  setViolenciaFisica: (val: 'Sim' | 'Não') => void;
  violenciaPsicologica: 'Sim' | 'Não';
  setViolenciaPsicologica: (val: 'Sim' | 'Não') => void;
  violenciaSexual: 'Sim' | 'Não';
  setViolenciaSexual: (val: 'Sim' | 'Não') => void;

  // Razões Rua
  respondeuMotivo: 'Sim' | 'Não';
  setRespondeuMotivo: (val: 'Sim' | 'Não') => void;
  naoSabeMotivo: 'Sim' | 'Não';
  setNaoSabeMotivo: (val: 'Sim' | 'Não') => void;
  perdaMoradia: 'Sim' | 'Não';
  setPerdaMoradia: (val: 'Sim' | 'Não') => void;
  ameaca: 'Sim' | 'Não';
  setAmeaca: (val: 'Sim' | 'Não') => void;
  problemasFamilia: 'Sim' | 'Não';
  setProblemasFamilia: (val: 'Sim' | 'Não') => void;
  alcoolismoDroga: 'Sim' | 'Não';
  setAlcoolismoDroga: (val: 'Sim' | 'Não') => void;
  desemprego: 'Sim' | 'Não';
  setDesemprego: (val: 'Sim' | 'Não') => void;
  trabalhoMotivo: 'Sim' | 'Não';
  setTrabalhoMotivo: (val: 'Sim' | 'Não') => void;
  saudeMotivo: 'Sim' | 'Não';
  setSaudeMotivo: (val: 'Sim' | 'Não') => void;
  preferenciaMotivo: 'Sim' | 'Não';
  setPreferenciaMotivo: (val: 'Sim' | 'Não') => void;
  egresso: string;
  setEgresso: (val: string) => void;
  outroMotivo: 'Sim' | 'Não';
  setOutroMotivo: (val: 'Sim' | 'Não') => void;

  // Atividade Comunitária
  respondeuAtividade: 'Sim' | 'Não';
  setRespondeuAtividade: (val: 'Sim' | 'Não') => void;
  atividadeEscola: 'Sim' | 'Não';
  setAtividadeEscola: (val: 'Sim' | 'Não') => void;
  atividadeCooperativa: 'Sim' | 'Não';
  setAtividadeCooperativa: (val: 'Sim' | 'Não') => void;
  atividadeMovimentoSocial: 'Sim' | 'Não';
  setAtividadeMovimentoSocial: (val: 'Sim' | 'Não') => void;
  naoSabeAtividade: 'Sim' | 'Não';
  setNaoSabeAtividade: (val: 'Sim' | 'Não') => void;

  // Atendimento e Saúde
  atendidoCras: 'Sim' | 'Não';
  setAtendidoCras: (val: 'Sim' | 'Não') => void;
  atendidoCreas: 'Sim' | 'Não';
  setAtendidoCreas: (val: 'Sim' | 'Não') => void;
  atendidoCentroPop: 'Sim' | 'Não';
  setAtendidoCentroPop: (val: 'Sim' | 'Não') => void;
  atendidoInstGov: 'Sim' | 'Não';
  setAtendidoInstGov: (val: 'Sim' | 'Não') => void;
  atendidoInstNaoGov: 'Sim' | 'Não';
  setAtendidoInstNaoGov: (val: 'Sim' | 'Não') => void;
  atendidoHospitalGeral: 'Sim' | 'Não';
  setAtendidoHospitalGeral: (val: 'Sim' | 'Não') => void;
  naoAtendido: 'Sim' | 'Não';
  setNaoAtendido: (val: 'Sim' | 'Não') => void;


  // Sustento
  respondeuSustento: 'Sim' | 'Não';
  setRespondeuSustento: (val: 'Sim' | 'Não') => void;
  sustentoConstrucaoCivil: 'Sim' | 'Não';
  setSustentoConstrucaoCivil: (val: 'Sim' | 'Não') => void;
  sustentoGuardadorCarro: 'Sim' | 'Não';
  setSustentoGuardadorCarro: (val: 'Sim' | 'Não') => void;
  sustentoCarregador: 'Sim' | 'Não';
  setSustentoCarregador: (val: 'Sim' | 'Não') => void;
  sustentoCatador: 'Sim' | 'Não';
  setSustentoCatador: (val: 'Sim' | 'Não') => void;
  sustentoServicosGerais: 'Sim' | 'Não';
  setSustentoServicosGerais: (val: 'Sim' | 'Não') => void;
  sustentoPedeDinheiro: 'Sim' | 'Não';
  setSustentoPedeDinheiro: (val: 'Sim' | 'Não') => void;
  sustentoVendas: 'Sim' | 'Não';
  setSustentoVendas: (val: 'Sim' | 'Não') => void;
  sustentoOutro: 'Sim' | 'Não';
  setSustentoOutro: (val: 'Sim' | 'Não') => void;

  // Obs & Cadastro Rua
  historicoPessoal: string;
  setHistoricoPessoal: (val: string) => void;
  dataCadastroRua: string;
  setDataCadastroRua: (val: string) => void;
  user: any;
}

export const TabDadosPessoais: React.FC<TabDadosPessoaisProps> = ({
  familiaDomicilio,
  setFamiliaDomicilio,
  lockFamiliaSelect,
  familias,
  nome,
  setNome,
  nomeSocial,
  setNomeSocial,
  nis,
  setNis,
  certidaoNascimentoData,
  setCertidaoNascimentoData,
  sexo,
  setSexo,
  raca,
  setRaca,
  orientacaoSexual,
  setOrientacaoSexual,
  orientacoesSexuais,
  racas,
  tipoEstadoCivil,
  setTipoEstadoCivil,
  estadosCivis,
  tipoParentesco,
  setTipoParentesco,
  parentescos,
  situacaoDeRua,
  setSituacaoDeRua,
  telefone,
  setTelefone,
  celular,
  setCelular,
  email,
  setEmail,
  subTabRua,
  setSubTabRua,
  tempoViveNaRua,
  setTempoViveNaRua,
  temposRua,
  tempoMoraNaCidade,
  setTempoMoraNaCidade,
  temposCidade,
  viveComFamiliaRua,
  setViveComFamiliaRua,
  contatoParenteForaRua,
  setContatoParenteForaRua,
  contatosParentes,
  teveEmpregoCarteiraAssinada,
  setTeveEmpregoCarteiraAssinada,
  dormeRua,
  setDormeRua,
  tempoDormeRua,
  setTempoDormeRua,
  servicoAcolhimento,
  setServicoAcolhimento,
  tempoServicoAcolhimento,
  setTempoServicoAcolhimento,
  domicilioParticular,
  setDomicilioParticular,
  tempoDomicilioParticular,
  setTempoDomicilioParticular,
  outroDormir,
  setOutroDormir,
  tempoOutroDormir,
  setTempoOutroDormir,
  exploracaoInfantil,
  setExploracaoInfantil,
  exploracaoSexual,
  setExploracaoSexual,
  violenciaFisica,
  setViolenciaFisica,
  violenciaPsicologica,
  setViolenciaPsicologica,
  violenciaSexual,
  setViolenciaSexual,
  respondeuMotivo,
  setRespondeuMotivo,
  naoSabeMotivo,
  setNaoSabeMotivo,
  perdaMoradia,
  setPerdaMoradia,
  ameaca,
  setAmeaca,
  problemasFamilia,
  setProblemasFamilia,
  alcoolismoDroga,
  setAlcoolismoDroga,
  desemprego,
  setDesemprego,
  trabalhoMotivo,
  setTrabalhoMotivo,
  saudeMotivo,
  setSaudeMotivo,
  preferenciaMotivo,
  setPreferenciaMotivo,
  egresso,
  setEgresso,
  outroMotivo,
  setOutroMotivo,
  respondeuAtividade,
  setRespondeuAtividade,
  atividadeEscola,
  setAtividadeEscola,
  atividadeCooperativa,
  setAtividadeCooperativa,
  atividadeMovimentoSocial,
  setAtividadeMovimentoSocial,
  naoSabeAtividade,
  setNaoSabeAtividade,
  atendidoCras,
  setAtendidoCras,
  atendidoCreas,
  setAtendidoCreas,
  atendidoCentroPop,
  setAtendidoCentroPop,
  atendidoInstGov,
  setAtendidoInstGov,
  atendidoInstNaoGov,
  setAtendidoInstNaoGov,
  atendidoHospitalGeral,
  setAtendidoHospitalGeral,
  naoAtendido,
  setNaoAtendido,

  respondeuSustento,
  setRespondeuSustento,
  sustentoConstrucaoCivil,
  setSustentoConstrucaoCivil,
  sustentoGuardadorCarro,
  setSustentoGuardadorCarro,
  sustentoCarregador,
  setSustentoCarregador,
  sustentoCatador,
  setSustentoCatador,
  sustentoServicosGerais,
  setSustentoServicosGerais,
  sustentoPedeDinheiro,
  setSustentoPedeDinheiro,
  sustentoVendas,
  setSustentoVendas,
  sustentoOutro,
  setSustentoOutro,
  historicoPessoal,
  setHistoricoPessoal,
  dataCadastroRua,
  setDataCadastroRua,
  user
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Situação de Rua?</label>
          <select className="form-control" value={situacaoDeRua} onChange={e => setSituacaoDeRua(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Família</label>
          <select className="form-control" value={familiaDomicilio} onChange={e => setFamiliaDomicilio(e.target.value)} disabled={lockFamiliaSelect}>
            <option value="">Selecione...</option>
            {familias.map(f => (
              <option key={f.id} value={f.id}>
                {f.familia_codigo || `FAM-${f.id}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo *</label>
          <input type="text" id="input-nome" className="form-control" value={nome} onChange={e => setNome(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Social</label>
          <input type="text" className="form-control" value={nomeSocial} onChange={e => setNomeSocial(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>NIS</label>
          <input type="text" className="form-control" value={nis} onChange={e => setNis(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Nascimento *</label>
          <input type="date" id="input-nascimento" className="form-control" value={certidaoNascimentoData} onChange={e => setCertidaoNascimentoData(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sexo *</label>
          <select className="form-control" value={sexo} onChange={e => setSexo(e.target.value as any)}>
            <option value="Fem">Feminino</option>
            <option value="Masc">Masculino</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Raça/Cor</label>
          <select className="form-control" value={raca} onChange={e => setRaca(e.target.value)}>
            <option value="">Selecione...</option>
            {racas.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Orientação Sexual</label>
          <select className="form-control" value={orientacaoSexual} onChange={e => setOrientacaoSexual(e.target.value)}>
            <option value="">Selecione...</option>
            {orientacoesSexuais.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Estado Civil</label>
          <select className="form-control" value={tipoEstadoCivil} onChange={e => setTipoEstadoCivil(e.target.value)}>
            <option value="">Selecione...</option>
            {estadosCivis.map(ec => <option key={ec.id} value={ec.id}>{ec.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Parentesco</label>
          <select className="form-control" value={tipoParentesco} onChange={e => setTipoParentesco(e.target.value)}>
            <option value="">Selecione...</option>
            {parentescos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      </div>


      {situacaoDeRua === 'Não' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Telefone</label>
            <input type="text" className="form-control" value={telefone} onChange={e => setTelefone(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Celular</label>
            <input type="text" className="form-control" value={celular} onChange={e => setCelular(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>E-mail</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-Abas Secundárias de Rua */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 8px', overflowX: 'auto', whiteSpace: 'nowrap', gap: '4px' }}>
            {[
              { id: 'inicio', label: 'Início' },
              { id: 'dormir', label: 'Onde Dorme' },
              { id: 'vulnerabilidade', label: 'Vulnerabilidades' },
              { id: 'motivos', label: 'Razões de Rua' },
              { id: 'atividade', label: 'Atividade Comunitária' },
              { id: 'atendimento', label: 'Atendimento & Saúde' },
              { id: 'sustento', label: 'Como se Sustenta' },
              { id: 'observacoes', label: 'Obs & Cadastro' }
            ].map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSubTabRua(st.id as any)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  background: 'none',
                  borderBottom: subTabRua === st.id ? '2px solid #1e3a8a' : '2px solid transparent',
                  color: subTabRua === st.id ? '#1e3a8a' : '#64748b',
                  fontWeight: subTabRua === st.id ? 600 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Conteúdos das Sub-abas */}
          {subTabRua === 'inicio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tempo que vive na rua *</label>
                  <select className="form-control" value={tempoViveNaRua} onChange={e => setTempoViveNaRua(e.target.value)}>
                    <option value="">Selecione...</option>
                    {temposRua.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tempo que mora na cidade *</label>
                  <select className="form-control" value={tempoMoraNaCidade} onChange={e => setTempoMoraNaCidade(e.target.value)}>
                    <option value="">Selecione...</option>
                    {temposCidade.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Vive com a família na rua? *</label>
                  <select className="form-control" value={viveComFamiliaRua} onChange={e => setViveComFamiliaRua(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Contato com parente fora de rua? *</label>
                  <select className="form-control" value={contatoParenteForaRua} onChange={e => setContatoParenteForaRua(e.target.value)}>
                    <option value="">Selecione...</option>
                    {contatosParentes.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Teve emprego com carteira assinada? *</label>
                  <select className="form-control" value={teveEmpregoCarteiraAssinada} onChange={e => setTeveEmpregoCarteiraAssinada(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                    <option value="Não Sabe">Não Sabe</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {subTabRua === 'dormir' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Dorme na rua?</label>
                  <select className="form-control" value={dormeRua} onChange={e => setDormeRua(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                  {dormeRua === 'Sim' && (
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                      <input type="number" min="0" max="7" className="form-control" value={tempoDormeRua} onChange={e => setTempoDormeRua(e.target.value)} />
                    </div>
                  )}
                </div>
                <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Serviço de Acolhimento / Casa Passagem?</label>
                  <select className="form-control" value={servicoAcolhimento} onChange={e => setServicoAcolhimento(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                  {servicoAcolhimento === 'Sim' && (
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                      <input type="number" min="0" max="7" className="form-control" value={tempoServicoAcolhimento} onChange={e => setTempoServicoAcolhimento(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Dorme em domicílio particular?</label>
                  <select className="form-control" value={domicilioParticular} onChange={e => setDomicilioParticular(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                  {domicilioParticular === 'Sim' && (
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                      <input type="number" min="0" max="7" className="form-control" value={tempoDomicilioParticular} onChange={e => setTempoDomicilioParticular(e.target.value)} />
                    </div>
                  )}
                </div>
                <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Outra forma de dormir?</label>
                  <select className="form-control" value={outroDormir} onChange={e => setOutroDormir(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                  {outroDormir === 'Sim' && (
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                      <input type="number" min="0" max="7" className="form-control" value={tempoOutroDormir} onChange={e => setTempoOutroDormir(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {subTabRua === 'vulnerabilidade' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Exploração Infantil?</label>
                <select className="form-control" value={exploracaoInfantil} onChange={e => setExploracaoInfantil(e.target.value as any)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Exploração Sexual?</label>
                <select className="form-control" value={exploracaoSexual} onChange={e => setExploracaoSexual(e.target.value as any)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Violência Física?</label>
                <select className="form-control" value={violenciaFisica} onChange={e => setViolenciaFisica(e.target.value as any)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Violência Psicológica?</label>
                <select className="form-control" value={violenciaPsicologica} onChange={e => setViolenciaPsicologica(e.target.value as any)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Violência Sexual?</label>
                <select className="form-control" value={violenciaSexual} onChange={e => setViolenciaSexual(e.target.value as any)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
            </div>
          )}

          {subTabRua === 'motivos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', display: 'block', marginBottom: '4px' }}>Respondeu sobre os motivos? *</label>
                  <select className="form-control" value={respondeuMotivo} onChange={e => setRespondeuMotivo(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                {respondeuMotivo === 'Sim' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Não Sabe os motivos?</label>
                    <select className="form-control" value={naoSabeMotivo} onChange={e => setNaoSabeMotivo(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                )}
              </div>

              {respondeuMotivo === 'Sim' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Perda de moradia?</label>
                    <select className="form-control" value={perdaMoradia} onChange={e => setPerdaMoradia(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Ameaças / Violência?</label>
                    <select className="form-control" value={ameaca} onChange={e => setAmeaca(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Problemas com familiares?</label>
                    <select className="form-control" value={problemasFamilia} onChange={e => setProblemasFamilia(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Alcoolismo / Uso drogas?</label>
                    <select className="form-control" value={alcoolismoDroga} onChange={e => setAlcoolismoDroga(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Desemprego?</label>
                    <select className="form-control" value={desemprego} onChange={e => setDesemprego(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Fator relacionado ao Trabalho?</label>
                    <select className="form-control" value={trabalhoMotivo} onChange={e => setTrabalhoMotivo(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tratamento de Saúde?</label>
                    <select className="form-control" value={saudeMotivo} onChange={e => setSaudeMotivo(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Opção / Preferência?</label>
                    <select className="form-control" value={preferenciaMotivo} onChange={e => setPreferenciaMotivo(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Outros motivos?</label>
                    <select className="form-control" value={outroMotivo} onChange={e => setOutroMotivo(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Egresso do sistema prisional / internação?</label>
                    <input type="text" className="form-control" value={egresso} onChange={e => setEgresso(e.target.value)} placeholder="Ex: Sim, penitenciária X..." />
                  </div>
                </div>
              )}
            </div>
          )}

          {subTabRua === 'atividade' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', display: 'block', marginBottom: '4px' }}>Respondeu sobre atividades? *</label>
                  <select className="form-control" value={respondeuAtividade} onChange={e => setRespondeuAtividade(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                {respondeuAtividade === 'Sim' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Não sabe se frequentou?</label>
                    <select className="form-control" value={naoSabeAtividade} onChange={e => setNaoSabeAtividade(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                )}
              </div>

              {respondeuAtividade === 'Sim' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Participa em Escola?</label>
                    <select className="form-control" value={atividadeEscola} onChange={e => setAtividadeEscola(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Participa em Cooperativa?</label>
                    <select className="form-control" value={atividadeCooperativa} onChange={e => setAtividadeCooperativa(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Participa em Movimento Social?</label>
                    <select className="form-control" value={atividadeMovimentoSocial} onChange={e => setAtividadeMovimentoSocial(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {subTabRua === 'atendimento' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Atendido por CRAS?</label>
                  <select className="form-control" value={atendidoCras} onChange={e => setAtendidoCras(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Atendido por CREAS?</label>
                  <select className="form-control" value={atendidoCreas} onChange={e => setAtendidoCreas(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Atendido Centro POP?</label>
                  <select className="form-control" value={atendidoCentroPop} onChange={e => setAtendidoCentroPop(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Local Governamental?</label>
                  <select className="form-control" value={atendidoInstGov} onChange={e => setAtendidoInstGov(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Organização Não Gov?</label>
                  <select className="form-control" value={atendidoInstNaoGov} onChange={e => setAtendidoInstNaoGov(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Hospital Geral?</label>
                  <select className="form-control" value={atendidoHospitalGeral} onChange={e => setAtendidoHospitalGeral(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Não foi atendido?</label>
                  <select className="form-control" value={naoAtendido} onChange={e => setNaoAtendido(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {subTabRua === 'sustento' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', display: 'block', marginBottom: '4px' }}>Respondeu sobre meios de sustento? *</label>
                  <select className="form-control" value={respondeuSustento} onChange={e => setRespondeuSustento(e.target.value as any)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
              </div>

              {respondeuSustento === 'Sim' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Construção Civil?</label>
                    <select className="form-control" value={sustentoConstrucaoCivil} onChange={e => setSustentoConstrucaoCivil(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Guardador de carro?</label>
                    <select className="form-control" value={sustentoGuardadorCarro} onChange={e => setSustentoGuardadorCarro(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Carregador / Carreto?</label>
                    <select className="form-control" value={sustentoCarregador} onChange={e => setSustentoCarregador(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Catador mat. reciclável?</label>
                    <select className="form-control" value={sustentoCatador} onChange={e => setSustentoCatador(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Serviços Gerais / Limpeza?</label>
                    <select className="form-control" value={sustentoServicosGerais} onChange={e => setSustentoServicosGerais(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pede Dinheiro / Esmolas?</label>
                    <select className="form-control" value={sustentoPedeDinheiro} onChange={e => setSustentoPedeDinheiro(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Vendas informais?</label>
                    <select className="form-control" value={sustentoVendas} onChange={e => setSustentoVendas(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Outro meio de sustento?</label>
                    <select className="form-control" value={sustentoOutro} onChange={e => setSustentoOutro(e.target.value as any)}>
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {subTabRua === 'observacoes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Histórico Pessoal / Observações</label>
                <textarea className="form-control" rows={3} value={historicoPessoal} onChange={e => setHistoricoPessoal(e.target.value)} placeholder="Digite o histórico pessoal ou observações adicionais..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Cadastro na Situação de Rua *</label>
                  <input type="date" className="form-control" value={dataCadastroRua} onChange={e => setDataCadastroRua(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Profissional Responsável</label>
                  <input type="text" className="form-control" value={user?.first_name ? `${user.first_name} (${user.username})` : user?.username || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
