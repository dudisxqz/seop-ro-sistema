import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { FileSignature, FileText, GraduationCap } from 'lucide-react';

function MeusDocumentos() {
    const { user } = useContext(AuthContext);
    const [meusAlunos, setMeusAlunos] = useState([]);

    useEffect(() => {
        api.get('/alunos').then(res => {
            const filhos = res.data.filter(a => a.nome.includes("João") || a.nome.includes("Maria"));
            setMeusAlunos(filhos);
        });
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-gray-800">Emissão de Documentos</h1>
                    <p className="text-gray-500 mt-2">Selecione o documento que deseja emitir.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meusAlunos.map(aluno => (
                        <div key={aluno.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><GraduationCap size={20}/></div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{aluno.nome}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase">{aluno.matricula}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link to={`/declaracao/aluno/${aluno.id}`} className="block">
                                    <button className="w-full flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition border border-orange-100 group">
                                        <div className="flex items-center gap-2 font-bold text-sm"><FileSignature size={16}/> Declaração de Matrícula</div>
                                        <span className="text-orange-400 group-hover:translate-x-1 transition">→</span>
                                    </button>
                                </Link>

                                {/* Futuro: Declaração de Frequência (Pode reutilizar a lógica ou criar nova página) */}
                                <button className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-100 group opacity-50 cursor-not-allowed" title="Em breve">
                                    <div className="flex items-center gap-2 font-bold text-sm"><FileText size={16}/> Declaração de Frequência</div>
                                    <span className="text-[10px] bg-white px-2 rounded border border-green-200">Em breve</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default MeusDocumentos;