import React from 'react';

export const Boletim = React.forwardRef(({ aluno, notas, relatorioIA }, ref) => {

    const dadosAluno = aluno || { nome: "", matricula: "", turma: "", id: 0 };
    const materias = ["PORTUGUES", "MATEMATICA", "HISTORIA", "GEOGRAFIA", "CIENCIAS", "INGLES", "EDUCACAO_FISICA", "ARTE"];
    const safeNotas = notas || [];

    const getNota = (materia, bim) => {
        const notaEncontrada = safeNotas.find(n => n.aluno?.id === dadosAluno.id && n.materia === materia && n.bimestre === bim);
        return notaEncontrada ? notaEncontrada.valor.toFixed(1) : "-";
    };

    const getFaltas = (materia, bim) => {
        const notaEncontrada = safeNotas.find(n => n.aluno?.id === dadosAluno.id && n.materia === materia && n.bimestre === bim);
        return notaEncontrada ? notaEncontrada.faltas : "-";
    };

    const getMediaFinal = (materia) => {
        const notasDaMateria = safeNotas.filter(n => n.aluno?.id === dadosAluno.id && n.materia === materia);
        if (notasDaMateria.length === 0) return "-";
        const total = notasDaMateria.reduce((acc, n) => acc + n.valor, 0);
        return (total / notasDaMateria.length).toFixed(1);
    };

    return (
        <div ref={ref} style={styles.page}>

            <div style={styles.header}>
                <div style={{fontSize:'10px', fontWeight:'bold', textTransform:'uppercase'}}>Secretaria de Estado da Educação</div>
                <h1 style={{margin: '5px 0', fontSize: '16px', color: '#003366', textTransform:'uppercase'}}>Governo do Estado de Rondônia</h1>
                <div style={{fontSize:'12px', borderTop:'1px solid #000', borderBottom:'1px solid #000', padding:'5px', marginTop:'10px'}}>
                    BOLETIM ESCOLAR - ANO LETIVO 2025
                </div>
            </div>

            <div style={styles.infoBox}>
                <div style={styles.row}>
                    <div style={styles.col}><strong>Escola:</strong> EEEM MAJOR GUAPINDAIA</div>
                    <div style={styles.col}><strong>INEP:</strong> 11002484</div>
                    <div style={styles.col}><strong>Município:</strong> PORTO VELHO</div>
                    <div style={styles.col}><strong>UF:</strong> RO</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.col}><strong>Nome:</strong> {dadosAluno.nome}</div>
                    <div style={styles.col}><strong>Nascimento:</strong> 16/10/2008</div>
                    <div style={styles.col}><strong>ID Estudante:</strong> {dadosAluno.id}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.col}><strong>Turma:</strong> {dadosAluno.turma}</div>
                    <div style={styles.col}><strong>Matrícula:</strong> {dadosAluno.matricula}</div>
                    <div style={styles.col}><strong>Turno:</strong> INTEGRAL</div>
                </div>
            </div>

            <table style={styles.table}>
                <thead>
                <tr style={{background: '#f0f0f0'}}>
                    <th style={{...styles.th, width: '200px'}}>Componente Curricular</th>
                    <th style={styles.th}>C.H.</th>
                    <th style={styles.th}>1ºB</th>
                    <th style={styles.th}>F.1</th>
                    <th style={styles.th}>2ºB</th>
                    <th style={styles.th}>F.2</th>
                    <th style={styles.th}>3ºB</th>
                    <th style={styles.th}>F.3</th>
                    <th style={styles.th}>4ºB</th>
                    <th style={styles.th}>F.4</th>
                    <th style={styles.th}>M.A.</th>
                    <th style={styles.th}>Total F.</th>
                    <th style={styles.th}>M.F.</th>
                </tr>
                </thead>
                <tbody>
                {materias.map(mat => (
                    <tr key={mat}>
                        <td style={{...styles.td, textAlign: 'left', paddingLeft:'5px'}}>{mat}</td>
                        <td style={styles.td}>80</td>
                        <td style={styles.td}>{getNota(mat, 1)}</td>
                        <td style={styles.td}>{getFaltas(mat, 1)}</td>
                        <td style={styles.td}>{getNota(mat, 2)}</td>
                        <td style={styles.td}>{getFaltas(mat, 2)}</td>
                        <td style={styles.td}>{getNota(mat, 3)}</td>
                        <td style={styles.td}>{getFaltas(mat, 3)}</td>
                        <td style={styles.td}>{getNota(mat, 4)}</td>
                        <td style={styles.td}>{getFaltas(mat, 4)}</td>
                        <td style={{...styles.td, fontWeight:'bold', background:'#e9ecef'}}>{getMediaFinal(mat)}</td>
                        <td style={styles.td}>0</td>
                        <td style={{...styles.td, fontWeight:'bold', color: getMediaFinal(mat) < 6 && getMediaFinal(mat) !== '-' ? 'red' : 'black'}}>
                            {getMediaFinal(mat)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{marginTop:'10px', border:'1px solid #999', padding:'5px', display:'flex', justifyContent:'space-between', fontSize:'11px', fontWeight:'bold'}}>
                <div>Situação da Turma: FECHADA</div>
                <div>Total Faltas: 0</div>
                <div>Situação do Estudante: <span style={{color:'green'}}>CURSANDO</span></div>
            </div>

            {relatorioIA && (
                <div style={{marginTop: '30px', borderTop:'2px dashed #ccc', paddingTop:'20px'}}>
                    <h4 style={{margin:0, fontSize:'14px', textTransform:'uppercase'}}>Observações Pedagógicas (IA)</h4>
                    <div style={{fontSize:'12px', textAlign:'justify', marginTop:'10px', lineHeight:'1.4'}}>
                        {relatorioIA}
                    </div>
                </div>
            )}

            <div style={{marginTop:'50px', textAlign:'center', fontSize:'10px'}}>
                Documento gerado digitalmente pelo sistema EduSync em {new Date().toLocaleDateString()}.
            </div>

        </div>
    );
});

const styles = {
    page: { padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000', background: 'white', width: '100%', boxSizing: 'border-box' },
    header: { textAlign: 'center', marginBottom: '10px' },
    infoBox: { border: '1px solid #999', padding: '5px', marginBottom: '10px', fontSize: '10px' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '2px' },
    col: { flex: 1 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '9px', textAlign: 'center' },
    th: { border: '1px solid #666', padding: '3px', background: '#ddd', fontWeight: 'bold' },
    td: { border: '1px solid #666', padding: '3px' },
    parecerBox: { border: '1px solid #ddd', padding: '10px', background: '#f9f9f9', borderRadius: '5px', textAlign: 'justify', fontSize: '10px' },
    footer: { marginTop: '30px', display: 'flex', justifyContent: 'space-around', textAlign: 'center', fontSize: '10px' },
    assinatura: { marginTop: '10px', borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }
};