import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

function Dashboard() {
    const [alunos, setAlunos] = useState([]);
    const [ocorrencias, setOcorrencias] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [busca, setBusca] = useState(''); // Estado da busca

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setLoading(true); // Começou a carregar
        try {
            const [respAlunos, respOcorrencias] = await Promise.all([
                api.get('/alunos'),
                api.get('/ocorrencias')
            ]);
            setAlunos(respAlunos.data);
            setOcorrencias(respOcorrencias.data);
        } catch (erro) {
            toast.error("Erro ao carregar dados do servidor.");
        } finally {
            setLoading(false); // Terminou (com erro ou sucesso)
        }
    }

    // Lógica de filtro: Se tiver busca, filtra a lista. Se não, mostra tudo.
    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9', flexDirection: 'column' }}>
                <div style={styles.spinner}></div>
                <p style={{ color: '#666', marginTop: '10px' }}>Carregando sistema...</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Navbar */}
            <div style={styles.navbar}>
                <div style={styles.containerNav}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>SEOP - Gestão Escolar</h2>
                    <Link to="/nova-ocorrencia">
                        <button style={styles.btnPrimary}>+ Nova Ocorrência</button>
                    </Link>
                </div>
            </div>

            <div style={styles.containerBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>

                    {/* Coluna Esquerda: Alunos + Busca */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Alunos</h3>
                            <span style={styles.counterBadge}>{alunos.length}</span>
                        </div>

                        {/* Campo de Busca Novo */}
                        <div style={{ padding: '15px' }}>
                            <input
                                type="text"
                                placeholder="🔍 Buscar aluno..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                style={styles.inputBusca}
                            />
                        </div>

                        <ul style={styles.list}>
                            {alunosFiltrados.length > 0 ? (
                                alunosFiltrados.map(aluno => (
                                    <li key={aluno.id} style={styles.itemAluno}>
                                        <div style={{ fontWeight: '500', color: '#333' }}>{aluno.nome}</div>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>{aluno.turma}</div>
                                    </li>
                                ))
                            ) : (
                                <li style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                                    Nenhum aluno encontrado.
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Coluna Direita: Ocorrências */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Últimas Ocorrências</h3>
                        </div>

                        {ocorrencias.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                Nenhum registro encontrado.
                            </div>
                        ) : (
                            <ul style={styles.list}>
                                {ocorrencias.map(oc => (
                                    <li key={oc.id} style={styles.itemOcorrencia}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div>
                                                <span style={styles.alunoName}>{oc.aluno?.nome}</span>
                                                <span style={styles.turmaTag}>{oc.aluno?.turma}</span>
                                            </div>
                                            <span style={styles.badge(oc.tipo)}>{oc.tipo}</span>
                                        </div>
                                        <p style={styles.descricaoTexto}>{oc.descricao}</p>
                                        <div style={styles.dataFooter}>
                                            {/* Formatação de Data simples */}
                                            {new Date(oc.dataCriacao).toLocaleDateString('pt-BR')} às {new Date(oc.dataCriacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

const styles = {
    // ... (Mantenha os estilos anteriores, adicionei apenas o spinner e o inputBusca abaixo)
    navbar: { background: '#003366', color: 'white', padding: '15px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    containerNav: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    containerBody: { maxWidth: '1100px', margin: '30px auto', padding: '0 20px' },
    card: { background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', height: 'fit-content' },
    cardHeader: { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
    cardTitle: { margin: 0, fontSize: '16px', color: '#495057', fontWeight: 'bold' },
    counterBadge: { background: '#e9ecef', color: '#495057', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },
    list: { listStyle: 'none', padding: 0, margin: 0 },
    itemAluno: { padding: '12px 20px', borderBottom: '1px solid #f1f3f5' },
    itemOcorrencia: { padding: '20px', borderBottom: '1px solid #f1f3f5' },
    alunoName: { fontWeight: '600', color: '#212529', marginRight: '8px' },
    turmaTag: { fontSize: '12px', color: '#868e96', background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px', border: '1px solid #dee2e6' },
    descricaoTexto: { margin: 0, color: '#495057', lineHeight: '1.5', fontSize: '14px' },
    dataFooter: { fontSize: '11px', color: '#adb5bd', marginTop: '10px' },
    btnPrimary: { background: '#0056b3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },

    // NOVOS ESTILOS
    inputBusca: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box' },
    spinner: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #003366',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite'
    },

    badge: (tipo) => {
        let bg = '#17a2b8';
        if (tipo === 'AGRESSAO') bg = '#dc3545';
        if (tipo === 'COMPORTAMENTO') bg = '#ffc107';
        if (tipo === 'TAREFA') bg = '#6c757d';
        return {
            background: bg,
            color: tipo === 'COMPORTAMENTO' ? '#212529' : 'white',
            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase'
        };
    }
};
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);

export default Dashboard;