import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NovaOcorrencia from './pages/NovaOcorrencia';
import Desempenho from './pages/Desempenho';
import Chamada from './pages/Chamada';
import VisualizarFrequencia from './pages/VisualizarFrequencia';
import VisualizarBoletim from './pages/VisualizarBoletim';

function PrivateRoute({ children }) {
    const { signed, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{padding: '20px', textAlign: 'center'}}>Carregando sistema...</div>;
    }

    if (!signed) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/nova-ocorrencia" element={<PrivateRoute><NovaOcorrencia /></PrivateRoute>} />
                    <Route path="/desempenho" element={<PrivateRoute><Desempenho /></PrivateRoute>} />
                    <Route path="/chamada" element={<PrivateRoute><Chamada /></PrivateRoute>} />

                    <Route path="/frequencia/aluno/:alunoId" element={<PrivateRoute><VisualizarFrequencia /></PrivateRoute>} />
                    <Route path="/boletim/aluno/:alunoId" element={<PrivateRoute><VisualizarBoletim /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;