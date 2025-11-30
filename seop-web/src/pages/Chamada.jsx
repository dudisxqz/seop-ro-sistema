import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Chamada() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [turmas, setTurmas] = useState([]);

    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [dataChamada, setDataChamada] = useState(new Date().toISOString().split('T')[0]);
    const [presencas, setPresencas] = useState({});

    useEffect(() => {
        async function carregarAlunos() {
            try {
                const resp = await api.get('/alunos');
                setAlunos(resp.data);
                const listaTurmas = [...new Set(resp.data.map(a => a.turma))].sort();
                setTurmas(listaTurmas);
            } catch (e) {
                console.error(e);
            }
        }
        carregarAlunos();
    }, []);

    const alunosDaTurma = alunos.filter(a => a.turma === turmaSelecionada);

    useEffect(() => {
        if (alunosDaTurma.length > 0) {
            const inicial = {};
            alunosDaTurma.forEach(a => {
                inicial[a.id] = true;
            });
            setPresencas(inicial);
        }
    }, [turmaSelecionada]);

    function togglePresenca(id) {
        setPresencas(prev => ({ ...prev, [id]: !prev[id] }));
    }

    async function handleSalvarChamada() {
        if (!turmaSelecionada) return alert("Selecione uma turma!");

        const payload = alunosDaTurma.map(aluno => ({
            alunoId: aluno.id,
            data: dataChamada,
            presente: presencas[aluno.id]
        }));

        try {
            await api.post('/frequencias/lote', payload);
            alert(`✅ Chamada registrada!`);
            navigate('/');
        } catch (erro) {
            console.error(erro);
            alert("Erro ao salvar chamada.");
        }
    }

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', padding: '20px', fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#003366', margin: 0 }}>📅 Registro de Frequência</h2>
                    <Link to="/"><button style={styles.btnVoltar}>Voltar</button></Link>
                </div>

                <div style={styles.card}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Turma</label>
                            <select value={turmaSelecionada} onChange={e => setTurmaSelecionada(e.target.value)} style={styles.select}>
                                <option value="">-- Selecione --</option>
                                {turmas.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Data</label>
                            <input type="date" value={dataChamada} onChange={e => setDataChamada(e.target.value)} style={styles.input} />
                        </div>
                    </div>

                    {turmaSelecionada ? (
                        <>
                            <div style={styles.listaContainer}>
                                {alunosDaTurma.map(aluno => (
                                    <div key={aluno.id} onClick={() => togglePresenca(aluno.id)} style={{
                                        ...styles.itemChamada,
                                        background: presencas[aluno.id] ? 'white' : '#ffeef0',
                                        borderLeft: presencas[aluno.id] ? '4px solid #28a745' : '4px solid #dc3545'
                                    }}>
                                        <div style={{ fontWeight: '500' }}>{aluno.nome}</div>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: presencas[aluno.id] ? '#28a745' : '#dc3545' }}>
                                            {presencas[aluno.id] ? 'PRESENTE' : 'AUSENTE'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button onClick={handleSalvarChamada} style={styles.btnSalvar}>💾 Salvar Chamada</button>
                            </div>
                        </>
                    ) : <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Selecione uma turma.</div>}
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
    select: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    input: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
    btnVoltar: { padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnSalvar: { padding: '12px 30px', background: '#003366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    listaContainer: { border: '1px solid #eee', borderRadius: '5px', maxHeight: '400px', overflowY: 'auto' },
    itemChamada: { padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }
};

export default Chamada;