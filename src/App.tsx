import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TarotPage from './pages/TarotPage';
import SajuPage from './pages/SajuPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/tarot"
          element={
            <ProtectedRoute>
              <TarotPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saju"
          element={
            <ProtectedRoute>
              <SajuPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
