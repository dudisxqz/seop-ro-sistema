import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Boletim } from '../components/Boletim';

function Desempenho() {
    const [alunos, setAlunos] = useState([]);
    const [notas, setNotas] = useState([]);

    const [alunoId, setAlunoId] = useState('');
    const [materia, setMateria] = useState('MATEMATICA');
    const [valor, setValor] = useState('');
    const [bimestre, setBimestre] = useState('1');

    const [relatorioIA, setRelatorioIA] = useState('');
    const [loadingRelatorio, setLoadingRelatorio] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const respAlunos = await api.get('/alunos');
            const respNotas = await api.get('/notas');
            setAlunos(respAlunos.data);
            setNotas(respNotas.data);
        } catch (e) { console.error(e); }
    }

    async function handleLancarNota(e) {
        e.preventDefault();
        try {
            await api.post('/notas', { alunoId, materia, valor: parseFloat(valor), bimestre: parseInt(bimestre), faltas: 0 });
            alert("✅ Nota lançada!");
            carregarDados(); setValor('');
        } catch (erro) { alert(erro.response?.data?.message || "Erro ao lançar."); }
    }

    async function handleGerarRelatorio() {
        if (!alunoId) return;
        setLoadingRelatorio(true);
        setRelatorioIA('');
        try {
            const resp = await api.get(`/relatorios/gerar/${alunoId}`);
            setRelatorioIA(resp.data);
        } catch (erro) { alert("Erro ao gerar relatório."); }
        finally { setLoadingRelatorio(false); }
    }

    const handlePrint = () => {
        window.print();
    };

    const objAlunoSelecionado = alunos.find(a => a.id == alunoId);
    const turmaDoAluno = objAlunoSelecionado ? objAlunoSelecionado.turma : null;

    const dadosGrafico = notas
        .filter(n => n.aluno && n.aluno.id == alunoId)
        .map(notaDoAluno => {
            const notasDaMesmaTurma = notas.filter(n => n.materia === notaDoAluno.materia && n.aluno && n.aluno.turma === turmaDoAluno);
            const total = notasDaMesmaTurma.reduce((acc, cur) => acc + cur.valor, 0);
            const media = total / notasDaMesmaTurma.length;
            return { name: `${notaDoAluno.materia}`, Aluno: notaDoAluno.valor, MediaTurma: parseFloat(media.toFixed(1)) };
        });

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>

            <style>{`
        @media print {
          /* Esconde tudo que não é boletim */
          body * { visibility: hidden; }
          
          /* Mostra e posiciona o boletim */
          #area-do-boletim, #area-do-boletim * { visibility: visible; }
          
          #area-do-boletim {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white;
            z-index: 9999;
          }

          /* FORÇA A FOLHA DEITADA (PAISAGEM) E TIRA MARGENS */
          @page { 
            size: A4 landscape; 
            margin: 5mm; /* Margem pequena de 5mm */
          }
        }
      `}</style>

            {/* --- CONTEÚDO DO SITE (Visível na tela) --- */}
            <div className="no-print" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#003366' }}>📊 Controle Acadêmico</h2>
                    <Link to="/"><button style={styles.btnVoltar}>Voltar</button></Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Card Esquerda */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Lançar Nota</h3>
                        <form onSubmit={handleLancarNota} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <select value={alunoId} onChange={e => setAlunoId(e.target.value)} required style={styles.input}>
                                <option value="">Selecione o Aluno...</option>
                                {alunos.map(a => <option key={a.id} value={a.id}>{a.nome} - {a.turma}</option>)}
                            </select>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select value={materia} onChange={e => setMateria(e.target.value)} style={styles.input}><option value="MATEMATICA">Matemática</option><option value="PORTUGUES">Português</option><option value="HISTORIA">História</option><option value="GEOGRAFIA">Geografia</option><option value="CIENCIAS">Ciências</option></select>
                                <select value={bimestre} onChange={e => setBimestre(e.target.value)} style={styles.input}><option value="1">1º Bim</option><option value="2">2º Bim</option><option value="3">3º Bim</option><option value="4">4º Bim</option></select>
                            </div>
                            <input type="number" placeholder="Nota" value={valor} onChange={e => setValor(e.target.value)} step="0.1" max="10" required style={styles.input} />
                            <button type="submit" style={styles.btnSalvar}>Salvar</button>
                        </form>
                    </div>

                    {/* Card Direita */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Gráfico</h3>
                        {alunoId ? (
                            <div style={{width:'100%', overflowX:'auto'}}>
                                <BarChart width={400} height={250} data={dadosGrafico}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" fontSize={10} /><YAxis domain={[0,10]}/><Tooltip/><Legend/><Bar dataKey="Aluno" fill="#0056b3"/><Bar dataKey="MediaTurma" fill="#adb5bd"/></BarChart>
                            </div>
                        ) : <p style={{color:'#999'}}>Selecione um aluno.</p>}
                    </div>
                </div>

                {/* Rodapé IA e Impressão */}
                <div style={{ marginTop: '30px', background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: '#003366' }}>🤖 Parecer IA</h3>

                        <div style={{display:'flex', gap:'10px'}}>
                            <button onClick={handleGerarRelatorio} disabled={!alunoId || loadingRelatorio} style={styles.btnIA}>
                                {loadingRelatorio ? 'Analisando...' : '📄 Gerar Parecer'}
                            </button>

                            {/* BOTÃO AGORA FORA DA CONDIÇÃO (Sempre visível se tiver aluno) */}
                            <button
                                onClick={handlePrint}
                                disabled={!alunoId}
                                style={{
                                    ...styles.btnPrint,
                                    opacity: !alunoId ? 0.5 : 1,
                                    cursor: !alunoId ? 'not-allowed' : 'pointer'
                                }}
                            >
                                🖨️ Imprimir Boletim
                            </button>
                        </div>
                    </div>
                    {relatorioIA && <div style={{marginTop:'15px', padding:'15px', background:'#f8f9fa', borderRadius:'5px', lineHeight:'1.5'}}>{relatorioIA}</div>}
                </div>
            </div>

            {/* --- BOLETIM (ESCONDIDO NA TELA / VISÍVEL NA IMPRESSÃO) --- */}
            {/* O style inline aqui esconde da tela normal, mas o @media print lá em cima resgata ele com !important */}
            <div id="area-do-boletim" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <Boletim
                    aluno={objAlunoSelecionado}
                    notas={notas}
                    relatorioIA={relatorioIA}
                />
            </div>

        </div>
    );
}

const styles = {
    card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    input: { padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '5px', boxSizing:'border-box' },
    cardTitle: { marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' },
    btnSalvar: { padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
    btnVoltar: { padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnIA: { padding: '10px 20px', background: 'linear-gradient(45deg, #FF512F, #DD2476)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' },
    btnPrint: { padding: '10px 20px', background: '#003366', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 'bold' }
};

export default Desempenho;