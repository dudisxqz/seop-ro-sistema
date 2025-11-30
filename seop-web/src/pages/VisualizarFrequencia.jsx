import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function VisualizarFrequencia() {
    const { alunoId } = useParams();
    const [frequencias, setFrequencias] = useState([]);
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                console.log("🔍 Buscando dados para aluno ID:", alunoId);

                const respAlunos = await api.get('/alunos');
                const alunoEncontrado = respAlunos.data.find(a => a.id === Number(alunoId));

                if (!alunoEncontrado) {
                    setErro("Aluno não encontrado.");
                    return;
                }
                setAluno(alunoEncontrado);

                const respFreq = await api.get(`/frequencias/aluno/${alunoId}`);
                console.log("📅 Frequências encontradas:", respFreq.data);
                setFrequencias(respFreq.data || []);

            } catch (err) {
                console.error("❌ Erro ao carregar:", err);
                setErro("Erro de conexão ao buscar dados.");
            } finally {
                setLoading(false);
            }
        }

        if (alunoId) {
            carregarDados();
        }
    }, [alunoId]);

    const getStatusDia = (dia) => {
        try {
            // Formata data YYYY-MM-DD
            const mesFormatado = String(mesSelecionado + 1).padStart(2, '0');
            const diaFormatado = String(dia).padStart(2, '0');
            const dataString = `${anoSelecionado}-${mesFormatado}-${diaFormatado}`;

            const registro = (frequencias || []).find(f => f.data === dataString);

            if (!registro) return null;
            return registro.presente ? 'P' : 'F';
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            return null;
        }
    };

    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>⌛ Carregando dados...</div>;
    if (erro) return <div style={{padding:'40px', textAlign:'center', color:'red'}}>⚠️ {erro} <br/><Link to="/">Voltar</Link></div>;
    if (!aluno) return null;

    const diasNoMes = new Date(anoSelecionado, mesSelecionado + 1, 0).getDate();
    const listaDias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', padding: '20px', fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#003366', margin: 0 }}>📅 Frequência Escolar</h2>
                    <Link to="/"><button style={styles.btnVoltar}>Voltar</button></Link>
                </div>

                <div style={styles.cardInfo}>
                    <h3 style={{margin: '0 0 10px 0', color: '#333'}}>{aluno.nome}</h3>
                    <p style={{margin: 0, color: '#666'}}>Turma: {aluno.turma} | Matrícula: {aluno.matricula}</p>
                </div>

                <div style={styles.card}>
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div>
                            <label style={styles.label}>MÊS:</label>
                            <select value={mesSelecionado} onChange={e => setMesSelecionado(parseInt(e.target.value))} style={styles.select}>
                                {nomesMeses.map((nome, index) => (
                                    <option key={index} value={index}>{nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={styles.label}>ANO:</label>
                            <input type="number" value={anoSelecionado} onChange={e => setAnoSelecionado(parseInt(e.target.value))} style={{...styles.select, width: '80px'}} />
                        </div>
                    </div>

                    <div style={styles.calendarioContainer}>
                        <h4 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', margin: '0 0 15px 0', color: '#555'}}>Visualização Mensal</h4>

                        <div style={styles.gridDias}>
                            {listaDias.map(dia => {
                                const status = getStatusDia(dia);
                                return (
                                    <div key={dia} style={styles.diaBox}>
                                        <span style={styles.numeroDia}>{dia}</span>
                                        {status === 'P' && <div style={styles.badgeP}>P</div>}
                                        {status === 'F' && <div style={styles.badgeF}>F</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{marginTop: '20px', fontSize: '12px', display: 'flex', gap: '15px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}><div style={styles.badgeP}>P</div> Presente</div>
                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}><div style={styles.badgeF}>F</div> Falta</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const styles = {
    cardInfo: { background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #003366', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    card: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    select: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px' },
    label: { fontWeight: 'bold', marginRight: '5px', fontSize: '12px', color: '#666' },
    btnVoltar: { padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    calendarioContainer: { border: '1px solid #ddd', padding: '15px', borderRadius: '5px' },
    gridDias: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '10px' },
    diaBox: { border: '1px solid #eee', borderRadius: '5px', height: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa' },
    numeroDia: { fontSize: '10px', color: '#999', marginBottom: '2px' },
    badgeP: { width: '18px', height: '18px', background: '#28a745', color: 'white', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px' },
    badgeF: { width: '18px', height: '18px', background: '#dc3545', color: 'white', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px' }
};

export default VisualizarFrequencia;