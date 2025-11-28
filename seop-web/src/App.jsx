import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NovaOcorrencia from './pages/NovaOcorrencia';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/nova-ocorrencia" element={<NovaOcorrencia />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;