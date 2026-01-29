import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const SajuPage: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownBirthTime, setUnknownBirthTime] = useState(false);
  const [fortune, setFortune] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFortuneTell = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFortune('');

    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }
    if (!birthTime && !unknownBirthTime) {
      setError('태어난 시간을 입력하거나 "시간 모름"을 선택해주세요.');
      return;
    }

    const fullBirthDate = unknownBirthTime ? `${birthDate} 시간 모름` : `${birthDate} ${birthTime}`;
    const apiUrl = 'https://duck-fortune-teller-production.up.railway.app/api/getSajuFortune';

    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl, { birthDate: fullBirthDate });
      setFortune(response.data.fortune);
    } catch (err: any) {
      console.error('운세 불러오기 실패:', err);
      setError('운세덕이 잠시 꽥꽥 졸고 있나봐... 잠시 후 다시 시도해줘! 🦆');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>🦆 운세덕 사주점</h1>
      <p>생년월일과 태어난 시간을 알려주시면, 오리가 오늘의 운세를 꽥 알려드려요!</p>
      
      <form onSubmit={handleFortuneTell} className="auth-form" style={{ marginTop: '2rem' }}>
        <div className="form-group">
          <label htmlFor="birthDate">생년월일</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthTime">태어난 시간</label>
          <input
            type="time"
            id="birthTime"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            disabled={unknownBirthTime}
            required={!unknownBirthTime}
          />
        </div>

        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.8rem' }}>
          <input
            type="checkbox"
            id="unknownTime"
            checked={unknownBirthTime}
            onChange={(e) => {
              setUnknownBirthTime(e.target.checked);
              if (e.target.checked) setBirthTime('');
            }}
          />
          <label htmlFor="unknownTime" style={{ margin: 0, cursor: 'pointer' }}>
            태어난 시간 모름
          </label>
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? '운세덕이 꽥꽥 생각중...' : '운세 보기 🦆'}
        </button>
      </form>

      {error && <p className="error-message" style={{ marginTop: '2rem' }}>{error}</p>}

      {fortune && (
        <div className="fortune-result" style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#fffbe6',
          borderRadius: '16px',
          border: '3px solid #ffc107',
          boxShadow: '0 4px 20px rgba(255, 193, 7, 0.3)'
        }}>
          <p style={{ fontSize: '1.7rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            🦆 운세덕의 오늘 운세
          </p>
          <p style={{ fontSize: '1.35rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {fortune}
          </p>
        </div>
      )}
      
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <Link to="/">🏠 홈으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default SajuPage;