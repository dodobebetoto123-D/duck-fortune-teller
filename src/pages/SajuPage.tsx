import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // Re-use styles for the form

const SajuPage: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownBirthTime, setUnknownBirthTime] = useState(false); // New state for unknown birth time
  const [fortune, setFortune] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFortuneTell = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }
    if (!birthTime && !unknownBirthTime) {
      setError('태어난 시간을 입력하거나 "시간 모름"을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setFortune(''); // Clear previous fortune

    const fullBirthDate = unknownBirthTime ? `${birthDate} 시간 모름` : `${birthDate} ${birthTime}`;
    const apiUrl = 'https://duck-fortune-teller.vercel.app/api/getSajuFortune';

    try {
      const response = await axios.post(apiUrl, { birthDate: fullBirthDate });
      setFortune(response.data.fortune);
    } catch (err: any) {
      setError('운세를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>사주 보기</h1>
      <p>생년월일과 태어난 시간을 알려주시면, 오리가 오늘의 운세를 알려드려요!</p>
      
      <form onSubmit={handleFortuneTell} className="auth-form" style={{marginTop: '2rem'}}>
        <div className="form-group">
          <label htmlFor="birthDate">생년월일</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            style={{ fontFamily: 'sans-serif' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthTime">태어난 시간</label>
          <input
            type="time"
            id="birthTime"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            required={!unknownBirthTime} // Required only if not unknown
            disabled={unknownBirthTime} // Disable if unknown
            style={{ fontFamily: 'sans-serif' }}
          />
        </div>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="unknownTime"
            checked={unknownBirthTime}
            onChange={(e) => {
              setUnknownBirthTime(e.target.checked);
              if (e.target.checked) {
                setBirthTime(''); // Clear birth time if unknown is checked
              }
            }}
            style={{ width: 'auto', marginBottom: '0' }}
          />
          <label htmlFor="unknownTime" style={{ marginBottom: '0', fontSize: '1rem', fontWeight: 'normal' }}>태어난 시간 모름</label>
        </div>
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? '운세 보는 중...' : '운세 보기'}
        </button>
      </form>

      {error && <p className="error-message" style={{marginTop: '2rem'}}>{error}</p>}

      {fortune && (
        <div className="fortune-result" style={{marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fffbe6', borderRadius: '10px', border: '2px solid #ffc107'}}>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>오리의 운세:</p>
            <p style={{fontSize: '1.3rem', whiteSpace: 'pre-wrap'}}>{fortune}</p>
        </div>
      )}
      
      <div style={{ marginTop: '3rem' }}>
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default SajuPage;
