import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Dashboard() {
    const { user, signOut } = useContext(AuthContext);

    const [alunos, setAlunos] = useState([]);
    const [ocorrencias, setOcorrencias] = useState([]);
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados de navegação (Apenas para Admin)
    const [abaAtiva, setAbaAtiva] = useState('pesquisa');
    const [busca, setBusca] = useState('');
    const [turmaAberta, setTurmaAberta] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setLoading(true);
        try {
            const [respAlunos, respOcorrencias, respNotas] = await Promise.all([
                api.get('/alunos'),
                api.get('/ocorrencias'),
                api.get('/notas')
            ]);
            setAlunos(respAlunos.data || []);
            setOcorrencias(respOcorrencias.data || []);
            setNotas(respNotas.data || []);
        } catch (erro) {
            console.error("Erro ao carregar dados:", erro);
        } finally {
            setLoading(false);
        }
    }

    const isAdmin = user?.role === 'ADMIN';
    const isParent = user?.role === 'RESPONSAVEL';

    const totalAlunos = alunos.length;
    const hoje = new Date().toISOString().split('T')[0];
    const ocorrenciasHoje = ocorrencias.filter(o => o.dataCriacao && new Date(o.dataCriacao).toISOString().split('T')[0] === hoje).length;
    const mediaGeral = notas.length > 0
        ? (notas.reduce((acc, n) => acc + (Number(n.valor) || 0), 0) / notas.length).toFixed(1)
        : "0.0";

    const alunosFiltradosAdmin = alunos.filter(aluno =>
        aluno.nome && aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const turmasAgrupadas = alunos.reduce((grupo, aluno) => {
        const turma = aluno.turma || "Sem Turma";
        if (!grupo[turma]) grupo[turma] = [];
        grupo[turma].push(aluno);
        return grupo;
    }, {});
    const listaDeTurmas = Object.keys(turmasAgrupadas).sort();

    const meusFilhos = alunos.filter(a => a.nome.includes("João Silva") || a.nome.includes("Maria Oliveira"));

    const LinhaAluno = ({ aluno }) => (
        <li style={styles.itemLista}>
            <div style={styles.itemAlunoContent}>
                <div>
                    <div style={{ fontWeight: '700', color: '#333', fontSize: '14px' }}>{aluno.nome}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        <span style={{fontWeight:'bold'}}>Turma:</span> {aluno.turma} • <span style={{fontWeight:'bold'}}>Matrícula:</span> {aluno.matricula}
                    </div>
                </div>

                <div style={{display: 'flex', gap: '8px'}}>
                    <Link to={`/boletim/aluno/${aluno.id}`}>
                        <button style={styles.btnBoletim}>📄 BOLETIM</button>
                    </Link>
                    <Link to={`/frequencia/aluno/${aluno.id}`}>
                        <button style={styles.btnFrequencia}>📅 FREQUÊNCIA</button>
                    </Link>
                </div>
            </div>
        </li>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9', flexDirection: 'column' }}>
                <div style={styles.spinner}></div>
                <p style={{ color: '#666', marginTop: '10px' }}>Carregando EduSync...</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>

            <div style={styles.navbar}>
                <div style={styles.containerNav}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>EduSync</h2>
                        {user && (
                            <span style={{fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '15px', fontWeight: '500'}}>
                  Olá, {user.login} <small>({user.role})</small>
               </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {isAdmin && (
                            <>
                                <Link to="/chamada"><button style={{...styles.btnPrimary, background: '#6610f2'}}>📅 Chamada</button></Link>
                                <Link to="/desempenho"><button style={{...styles.btnPrimary, background: '#17a2b8'}}>📊 Notas</button></Link>
                                <Link to="/nova-ocorrencia"><button style={{...styles.btnPrimary}}>+ Ocorrência</button></Link>
                            </>
                        )}
                        <button onClick={signOut} style={{...styles.btnPrimary, background: '#dc3545', padding: '8px 12px'}}>Sair</button>
                    </div>
                </div>
            </div>

            <div style={styles.containerBody}>

                {/* --- CARDS DE GESTÃO (APENAS PARA ADMIN) --- */}
                {isAdmin && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div style={{...styles.kpiCard, borderLeft: '5px solid #0056b3'}}>
                            <div style={styles.kpiTitle}>Total de Alunos</div>
                            <div style={{...styles.kpiValue, color: '#0056b3'}}>{totalAlunos}</div>
                            <div style={styles.kpiDesc}>Matriculados</div>
                        </div>
                        <div style={{...styles.kpiCard, borderLeft: '5px solid #dc3545'}}>
                            <div style={styles.kpiTitle}>Ocorrências Hoje</div>
                            <div style={{...styles.kpiValue, color: '#dc3545'}}>{ocorrenciasHoje}</div>
                            <div style={styles.kpiDesc}>Registros disciplinares</div>
                        </div>
                        <div style={{...styles.kpiCard, borderLeft: '5px solid #28a745'}}>
                            <div style={styles.kpiTitle}>Média Geral</div>
                            <div style={{...styles.kpiValue, color: '#28a745'}}>{mediaGeral}</div>
                            <div style={styles.kpiDesc}>Desempenho Acadêmico</div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '400px 1fr' : '1fr', gap: '24px' }}>

                    <div style={styles.card}>

                        {isAdmin ? (
                            <div style={styles.tabsContainer}>
                                <button style={abaAtiva === 'pesquisa' ? styles.tabActive : styles.tabInactive} onClick={() => setAbaAtiva('pesquisa')}>🔍 Pesquisa</button>
                                <button style={abaAtiva === 'turmas' ? styles.tabActive : styles.tabInactive} onClick={() => setAbaAtiva('turmas')}>📚 Turmas</button>
                            </div>
                        ) : (
                            <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                                <h3 style={{ margin: 0, color: '#003366', fontSize: '16px' }}>👨‍👩‍👧‍👦 Meus Filhos (Estudantes Matriculados)</h3>
                            </div>
                        )}

                        {isAdmin && abaAtiva === 'pesquisa' && (
                            <div style={{ padding: '15px' }}>
                                <input type="text" placeholder="Digite o nome..." value={busca} onChange={(e) => setBusca(e.target.value)} style={styles.inputBusca} />
                                <ul style={styles.list}>
                                    {alunosFiltradosAdmin.length > 0 ? (
                                        alunosFiltradosAdmin.map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />)
                                    ) : <li style={styles.emptyState}>Nenhum aluno encontrado.</li>}
                                </ul>
                            </div>
                        )}

                        {isAdmin && abaAtiva === 'turmas' && (
                            <div style={{ padding: '0' }}>
                                {listaDeTurmas.map(turma => (
                                    <div key={turma}>
                                        <div onClick={() => setTurmaAberta(turmaAberta === turma ? null : turma)} style={{...styles.turmaHeader, background: turmaAberta === turma ? '#e9ecef' : 'white'}}>
                                            <span style={{fontWeight:'bold', color: '#003366'}}>{turma}</span>
                                            <span style={{fontSize: '12px', color: '#666'}}>{turmasAgrupadas[turma].length} alunos {turmaAberta === turma ? '▲' : '▼'}</span>
                                        </div>
                                        {turmaAberta === turma && (
                                            <ul style={{...styles.list, background: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
                                                {turmasAgrupadas[turma].map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {isParent && (
                            <div style={{ padding: '0' }}>
                                <ul style={styles.list}>
                                    {meusFilhos.length > 0 ? (
                                        meusFilhos.map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />)
                                    ) : (
                                        <li style={styles.emptyState}>Nenhum estudante vinculado.</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {isAdmin && (
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Últimas Ocorrências</h3>
                            </div>
                            {ocorrencias.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Nenhum registro encontrado.</div>
                            ) : (
                                <ul style={styles.list}>
                                    {ocorrencias.map(oc => (
                                        <li key={oc.id} style={{padding: '15px', borderBottom: '1px solid #f1f3f5'}}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{fontWeight:'bold', fontSize:'12px', color:'#333'}}>{oc.aluno?.nome}</span>
                                                <span style={styles.badge(oc.tipo)}>{oc.tipo}</span>
                                            </div>
                                            <p style={styles.descricaoTexto}>{oc.descricao}</p>
                                            <div style={styles.dataFooter}>
                                                {new Date(oc.dataCriacao).toLocaleDateString('pt-BR')}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

const styles = {
    navbar: { background: '#003366', color: 'white', padding: '15px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    containerNav: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    containerBody: { maxWidth: '1200px', margin: '30px auto', padding: '0 20px' },
    card: { background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', height: 'fit-content', minHeight: '300px' },
    cardHeader: { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
    cardTitle: { margin: 0, fontSize: '16px', color: '#495057', fontWeight: 'bold' },
    tabsContainer: { display: 'flex', borderBottom: '1px solid #eee' },
    tabActive: { flex: 1, padding: '15px', background: 'white', border: 'none', borderBottom: '3px solid #003366', fontWeight: 'bold', color: '#003366', cursor: 'pointer' },
    tabInactive: { flex: 1, padding: '15px', background: '#f8f9fa', border: 'none', borderBottom: '3px solid transparent', color: '#6c757d', cursor: 'pointer' },
    turmaHeader: { padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    inputBusca: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box', marginBottom: '10px' },
    emptyState: { padding: '30px 10px', textAlign: 'center', color: '#adb5bd', fontSize: '14px' },
    list: { listStyle: 'none', padding: 0, margin: 0 },

    itemLista: { borderBottom: '1px solid #eee' },
    itemAlunoContent: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

    btnBoletim: { padding: '8px 20px', background: '#337ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', boxShadow: '0 2px 2px rgba(0,0,0,0.1)' },
    btnFrequencia: { padding: '8px 20px', background: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', boxShadow: '0 2px 2px rgba(0,0,0,0.1)' },

    descricaoTexto: { margin: 0, color: '#495057', lineHeight: '1.4', fontSize: '13px' },
    dataFooter: { fontSize: '11px', color: '#adb5bd', marginTop: '5px' },
    btnPrimary: { background: '#0056b3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    spinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #003366', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
    kpiCard: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    kpiTitle: { fontSize: '13px', textTransform: 'uppercase', color: '#6c757d', fontWeight: 'bold', marginBottom: '5px' },
    kpiValue: { fontSize: '32px', fontWeight: 'bold', lineHeight: '1' },
    kpiDesc: { fontSize: '12px', color: '#adb5bd', marginTop: '5px' },
    badge: (tipo) => {
        let bg = '#17a2b8';
        if (tipo === 'AGRESSAO') bg = '#dc3545';
        if (tipo === 'COMPORTAMENTO') bg = '#ffc107';
        return { background: bg, color: tipo === 'COMPORTAMENTO' ? '#212529' : 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' };
    }
};

export default Dashboard;