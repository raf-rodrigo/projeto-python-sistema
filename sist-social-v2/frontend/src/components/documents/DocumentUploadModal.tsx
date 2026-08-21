import { useCallback, useEffect, useState } from 'react';

type EntityType = 'atendimento' | 'pessoa' | 'familia';

interface DocumentUploadModalProps {
  open: boolean;
  entityType: EntityType;
  entityId: number | null;
  entityLabel: string;
  onClose: () => void;
}

interface DocumentoAnexo {
  id: number;
  nome_original: string;
  tipo_mime: string;
  tamanho: number;
  categoria: string;
  descricao: string;
  data_documento: string | null;
  enviado_por_nome: string;
  criado_em: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const categorias = ['Documento pessoal', 'Relatório', 'Comprovante', 'Termo', 'Imagem', 'Outro'];

export default function DocumentUploadModal({ open, entityType, entityId, entityLabel, onClose }: DocumentUploadModalProps) {
  const [documentos, setDocumentos] = useState<DocumentoAnexo[]>([]);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [categoria, setCategoria] = useState('Outro');
  const [descricao, setDescricao] = useState('');
  const [dataDocumento, setDataDocumento] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const token = localStorage.getItem('token');

  const carregar = useCallback(async () => {
    if (!open || !entityId) return;
    setCarregando(true);
    setMensagem('');
    try {
      const response = await fetch(`${API_URL}/api/documentos/?tipo_entidade=${entityType}&entidade_id=${entityId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) throw new Error('Não foi possível carregar os documentos.');
      const data = await response.json();
      setDocumentos(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Erro ao carregar documentos.');
    } finally {
      setCarregando(false);
    }
  }, [open, entityId, entityType, token]);

  useEffect(() => { void carregar(); }, [carregar]);

  const enviar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!arquivo || !entityId) return setMensagem('Selecione um arquivo.');
    const dados = new FormData();
    dados.append('arquivo', arquivo);
    dados.append('tipo_entidade', entityType);
    dados.append('entidade_id', String(entityId));
    dados.append('categoria', categoria);
    dados.append('descricao', descricao);
    if (dataDocumento) dados.append('data_documento', dataDocumento);
    setSalvando(true);
    setMensagem('');
    try {
      const response = await fetch(`${API_URL}/api/documentos/`, {
        method: 'POST', headers: { Authorization: `Token ${token}` }, body: dados,
      });
      if (!response.ok) {
        const erro = await response.json().catch(() => ({}));
        throw new Error(Object.values(erro).flat().join(' ') || 'Não foi possível enviar o documento.');
      }
      setArquivo(null); setDescricao(''); setDataDocumento(''); setCategoria('Outro');
      setMensagem('Documento enviado com sucesso.');
      const input = document.getElementById('documento-anexo-arquivo') as HTMLInputElement | null;
      if (input) input.value = '';
      await carregar();
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Erro ao enviar documento.');
    } finally { setSalvando(false); }
  };

  const baixar = async (documento: DocumentoAnexo) => {
    const response = await fetch(`${API_URL}/api/documentos/${documento.id}/download/`, { headers: { Authorization: `Token ${token}` } });
    if (!response.ok) return setMensagem('Não foi possível baixar o documento.');
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a'); link.href = url; link.download = documento.nome_original; link.click();
    URL.revokeObjectURL(url);
  };

  const excluir = async (documento: DocumentoAnexo) => {
    if (!window.confirm(`Remover o documento “${documento.nome_original}”?`)) return;
    const response = await fetch(`${API_URL}/api/documentos/${documento.id}/`, { method: 'DELETE', headers: { Authorization: `Token ${token}` } });
    if (!response.ok) return setMensagem('Não foi possível remover o documento.');
    setMensagem('Documento removido.'); await carregar();
  };

  if (!open) return null;
  const campo = { width: '100%', padding: '9px 10px', border: '1px solid #cbd5e1', borderRadius: '7px', boxSizing: 'border-box' as const };
  return <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(15,23,42,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ width: 'min(900px, 100%)', maxHeight: '92vh', overflow: 'auto', background: '#fff', borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,.25)' }}>
      <header style={{ padding: '18px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
        <div><h3 style={{ margin: 0, color: '#0f172a' }}>Documentos anexados</h3><small style={{ color: '#64748b' }}>{entityLabel}</small></div>
        <button type="button" onClick={onClose} style={{ border: 0, background: 'none', fontSize: 24, cursor: 'pointer' }}>&times;</button>
      </header>
      <form onSubmit={enviar} style={{ padding: 22, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Arquivo *<input id="documento-anexo-arquivo" type="file" required onChange={e => setArquivo(e.target.files?.[0] || null)} style={campo} /></label>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Categoria<select value={categoria} onChange={e => setCategoria(e.target.value)} style={campo}>{categorias.map(item => <option key={item}>{item}</option>)}</select></label>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Data do documento<input type="date" value={dataDocumento} onChange={e => setDataDocumento(e.target.value)} style={campo} /></label>
        </div>
        <label style={{ display: 'block', marginTop: 12, fontSize: 12, fontWeight: 600 }}>Descrição<textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} style={{ ...campo, resize: 'vertical' }} /></label>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><small style={{ color: '#64748b' }}>PDF, imagens, textos e planilhas; máximo 10 MB.</small><button disabled={salvando} style={{ padding: '9px 16px', border: 0, borderRadius: 7, color: '#fff', background: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>{salvando ? 'Enviando...' : 'Enviar documento'}</button></div>
      </form>
      {mensagem && <div style={{ margin: '14px 22px 0', padding: 10, borderRadius: 7, background: '#eff6ff', color: '#1d4ed8' }}>{mensagem}</div>}
      <section style={{ padding: 22 }}>
        {carregando ? <p>Carregando...</p> : documentos.length === 0 ? <p style={{ color: '#64748b', textAlign: 'center' }}>Nenhum documento anexado.</p> : documentos.map(documento => <div key={documento.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '13px 0', borderBottom: '1px solid #e2e8f0' }}>
          <div><strong style={{ color: '#0f172a' }}>{documento.nome_original}</strong><div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{documento.categoria} · {(documento.tamanho / 1024).toFixed(1)} KB · enviado por {documento.enviado_por_nome}</div>{documento.descricao && <div style={{ fontSize: 13, marginTop: 5 }}>{documento.descricao}</div>}</div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}><button type="button" onClick={() => void baixar(documento)} style={{ padding: '7px 10px', cursor: 'pointer' }}>Baixar</button><button type="button" onClick={() => void excluir(documento)} style={{ padding: '7px 10px', color: '#dc2626', cursor: 'pointer' }}>Remover</button></div>
        </div>)}
      </section>
    </div>
  </div>;
}
