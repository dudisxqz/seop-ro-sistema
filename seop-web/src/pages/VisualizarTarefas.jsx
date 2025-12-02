import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ArrowLeft, BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react';

function VisualizarTarefas() {
    const { alunoId } = useParams();
    const [aluno, setAluno] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                const resAlunos = await api.get('/alunos');
                const alunoEncontrado = resAlunos.data.find(a => a.id === Number(alunoId));
                setAluno(alunoEncontrado);

                if (alunoEncontrado && alunoEncontrado.turma) {
                    const resTarefas = await api.get(`/tarefas/turma/${encodeURIComponent(alunoEncontrado.turma)}`);
                    setTarefas(resTarefas.data || []);
                }
            } catch (error) {
                console.error("Erro ao carregar tarefas:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [alunoId]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Carregando agenda...</div>;
    if (!aluno) return <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500">Aluno não encontrado.</div>;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">

                {/* HEADER */}
                <header className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 text-yellow-700 rounded-xl shadow-sm">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Minhas Tarefas</h1>
                            <p className="text-gray-500 text-sm">Agenda de atividades da turma {aluno.turma}.</p>
                        </div>
                    </div>
                    <Link to="/">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </Link>
                </header>

                <div className="max-w-4xl mx-auto">
                    {tarefas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="bg-gray-50 p-4 rounded-full mb-4"><CheckCircle size={40} className="text-green-500 opacity-50"/></div>
                            <p className="text-lg font-bold text-gray-600">Tudo em dia!</p>
                            <p className="text-sm">Nenhuma tarefa pendente para entregar.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {tarefas.map(tarefa => {
                                const isLate = new Date(tarefa.dataEntrega) < new Date();
                                return (
                                    <div key={tarefa.id} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md flex flex-col md:flex-row gap-6 ${isLate ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-yellow-400'}`}>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-gray-800">{tarefa.titulo}</h3>
                                                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase border border-blue-100">
                                            {tarefa.materia}
                                        </span>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-50">
                                                {tarefa.descricao}
                                            </p>
                                        </div>

                                        <div className="md:w-48 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Data de Entrega</p>
                                                <div className={`flex items-center justify-end gap-2 font-bold text-sm ${isLate ? 'text-red-600' : 'text-gray-700'}`}>
                                                    <Clock size={16} />
                                                    {new Date(tarefa.dataEntrega).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            {isLate && <span className="mt-2 text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">ATRASADO</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default VisualizarTarefas;