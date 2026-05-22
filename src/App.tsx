import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { PlayerDetail } from './pages/PlayerDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;