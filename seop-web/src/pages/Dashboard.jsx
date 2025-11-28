import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
    const [alunos, setAlunos] = useState([]);
    const [ocorrencias, setOcorrencias] = useState([]);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const respAlunos = await api.get('/alunos');
            const respOcorrencias = await api.get('/ocorrencias');
            setAlunos(respAlunos.data);
            setOcorrencias(respOcorrencias.data);
        } catch (erro) {
            console.error("Erro de conexão:", erro);
        }
    }

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

            {/* Navbar Superior */}
            <div style={styles.navbar}>
                <div style={styles.containerNav}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>SEOP - Sistema Escolar</h2>
                    <Link to="/nova-ocorrencia">
                        <button style={styles.btnPrimary}>Nova Ocorrência</button>
                    </Link>
                </div>
            </div>

            <div style={styles.containerBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>

                    {/* Coluna Esquerda: Lista de Alunos */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Alunos Cadastrados</h3>
                            <span style={styles.counterBadge}>{alunos.length}</span>
                        </div>
                        <ul style={styles.list}>
                            {alunos.map(aluno => (
                                <li key={aluno.id} style={styles.itemAluno}>
                                    <div style={{ fontWeight: '500', color: '#333' }}>{aluno.nome}</div>
                                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>{aluno.turma}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna Direita: Ocorrências */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Últimas Ocorrências</h3>
                        </div>

                        {ocorrencias.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                Nenhum registro encontrado no sistema.
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
                                        <div style={styles.dataFooter}>Registrado recentemente</div>
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

    badge: (tipo) => {
        let bg = '#17a2b8'; // Padrão (Azul)
        if (tipo === 'AGRESSAO') bg = '#dc3545'; // Vermelho
        if (tipo === 'COMPORTAMENTO') bg = '#ffc107'; // Amarelo
        if (tipo === 'TAREFA') bg = '#6c757d'; // Cinza

        return {
            background: bg,
            color: tipo === 'COMPORTAMENTO' ? '#212529' : 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        };
    }
};

export default Dashboard;