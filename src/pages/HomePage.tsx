import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import AdFit from '../components/AdFit'; // AdFit 컴포넌트 임포트

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div>
      <img src="/duck.png" alt="오리 마스코트" className="duck-image" />
      <h1>오리 운세집</h1>

      {currentUser ? (
        <>
          <p>{currentUser.email}님, 환영합니다!</p>
          <div className="nav-buttons">
            <Link to="/tarot">타로 보기</Link>
            <Link to="/saju">사주 보기</Link>
          </div>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </>
      ) : (
        <>
          <p>오리가 당신의 운세를 봐드립니다! 먼저 로그인해주세요.</p>
          <div className="nav-buttons">
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        </>
      )}

      {/* 카카오 애드핏 광고 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <AdFit adUnit="DAN-123456789" adWidth="300" adHeight="100" />
      </div>
    </div>
  );
};

export default HomePage;
