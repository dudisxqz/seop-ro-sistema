import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { QrCode } from 'lucide-react';

function MinhaCarteirinha() {
    const { user } = useContext(AuthContext);
    const [meusAlunos, setMeusAlunos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                const res = await api.get('/alunos');
                // Filtra os filhos (Simulação)
                const filhos = res.data.filter(a => a.nome.includes("João") || a.nome.includes("Maria"));
                setMeusAlunos(filhos);
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [user]);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full flex flex-col items-center justify-start bg-gray-100">
                <h2 className="text-3xl font-black text-gray-800 mb-10 tracking-tight text-center mt-10">
                    Carteirinhas Digitais
                </h2>

                {loading ? (
                    <div className="text-gray-500 animate-pulse">Carregando...</div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-10">
                        {meusAlunos.map(aluno => (
                            <div key={aluno.id} className="transform transition hover:scale-105 duration-300">
                                {/* CARTÃO DIGITAL (Reuso do código anterior) */}
                                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-[300px] border border-gray-200 relative">
                                    <div className="bg-[#003366] p-6 text-center relative h-36">
                                        <div className="absolute inset-0 opacity-10 bg-white"></div>
                                        <h2 className="text-white font-bold text-lg tracking-widest relative z-10">EduSync</h2>
                                        <p className="text-blue-200 text-[10px] uppercase tracking-[0.3em] mt-1 relative z-10">Estudante</p>
                                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 p-1 bg-white rounded-full shadow-md">
                                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 border-2 border-white">
                                                {aluno.nome.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-12 pb-6 px-6 text-center">
                                        <h3 className="font-bold text-xl text-gray-800 leading-tight mb-1">{aluno.nome}</h3>
                                        <p className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-full uppercase">{aluno.turma}</p>
                                        <div className="mt-6 space-y-2 text-left bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                                            <div className="flex justify-between"><span className="text-gray-400 font-bold">MATRÍCULA</span><span className="font-mono font-bold text-gray-700">{aluno.matricula}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-400 font-bold">VALIDADE</span><span className="font-bold text-green-600">12/2025</span></div>
                                        </div>
                                        <div className="mt-6 flex justify-center"><QrCode size={48} className="text-gray-800" /></div>
                                    </div>
                                    <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default MinhaCarteirinha;