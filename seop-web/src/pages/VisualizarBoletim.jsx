import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Boletim } from '../components/Boletim';

function VisualizarBoletim() {
    const { alunoId } = useParams();
    const [aluno, setAluno] = useState(null);
    const [notas, setNotas] = useState([]);
    const [relatorioIA, setRelatorioIA] = useState('');
    const [loadingIA, setLoadingIA] = useState(false);

    const componentRef = useRef();

    useEffect(() => {
        api.get('/alunos').then(res => {
            const encontrado = res.data.find(a => a.id == alunoId);
            setAluno(encontrado);
        });
        api.get('/notas').then(res => setNotas(res.data));
    }, [alunoId]);

    const handlePrint = () => {
        setTimeout(() => {
            window.print();
        }, 20);
    };

    async function gerarParecer() {
        setLoadingIA(true);
        try {
            const resp = await api.get(`/relatorios/gerar/${alunoId}`);
            setRelatorioIA(resp.data);
        } catch (erro) {
            alert("Erro ao gerar parecer.");
        } finally {
            setLoadingIA(false);
        }
    }

    if (!aluno) return <div style={{padding:'20px'}}>Carregando boletim...</div>;

    return (
        <div style={{ background: '#525659', minHeight: '100vh', padding: '20px', fontFamily: "'Segoe UI', sans-serif" }}>

            <style>{`
        @media print {
          /* FORÇA O ESCONDIMENTO DA BARRA DE COMANDOS */
          .no-print { 
            display: none !important; 
            visibility: hidden !important;
          }
          
          /* Garante que o documento comece no topo da página */
          #area-do-boletim {
            position: fixed !important;
            top: 0 !important; 
            left: 0 !important; 
            width: 100% !important;
            height: auto !important;
            margin: 0 !important; 
            padding: 0 !important;
          }
          body * { visibility: hidden; }
          #area-do-boletim, #area-do-boletim * { visibility: visible; }
          @page { margin: 0; size: auto; }
        }
      `}</style>

            <div style={styles.toolbar} className="no-print">
                <div style={{color: 'white', fontWeight: 'bold'}}>
                    📄 Visualizando Boletim: {aluno.nome}
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <Link to="/">
                        <button style={styles.btnVoltar}>Voltar</button>
                    </Link>

                    <button
                        onClick={gerarParecer}
                        disabled={loadingIA || relatorioIA}
                        style={{...styles.btnIA, opacity: relatorioIA ? 0.5 : 1}}
                    >
                        {loadingIA ? '🤖 Gerando...' : relatorioIA ? '✅ IA OK' : '✨ Gerar Parecer IA'}
                    </button>

                    <button onClick={handlePrint} style={styles.btnPrint}>
                        🖨️ Imprimir / Baixar PDF
                    </button>
                </div>
            </div>

            <div style={styles.paperContainer}>
                <div id="area-do-boletim" style={styles.paper} ref={componentRef}>
                    <Boletim
                        aluno={aluno}
                        notas={notas}
                        relatorioIA={relatorioIA}
                    />
                </div>
            </div>

        </div>
    );
}

const styles = {
    toolbar: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', background: '#333', padding: '15px 20px', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    },
    paperContainer: { display: 'flex', justifyContent: 'center' },
    paper: {
        background: 'white',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        width: '210mm',
        minHeight: '297mm',
        padding: '0'
    },
    btnVoltar: { padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnIA: { padding: '10px 20px', background: 'linear-gradient(45deg, #FF512F, #DD2476)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnPrint: { padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default VisualizarBoletim;