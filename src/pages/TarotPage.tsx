import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tarotDeck, TarotCard } from '../data/tarot-data';
import './TarotPage.css';

const TarotPage: React.FC = () => {
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);

  const handleDrawCard = () => {
    const randomIndex = Math.floor(Math.random() * tarotDeck.length);
    setDrawnCard(tarotDeck[randomIndex]);
  };

  return (
    <div className="tarot-page-container">
      <nav>
        <Link to="/">홈으로</Link>
      </nav>
      <h1>오늘의 타로</h1>

      {drawnCard ? (
        <div className="tarot-result">
          <h2>{drawnCard.name}</h2>
          <img src={drawnCard.imageUrl} alt={drawnCard.name} className="tarot-card-image" />
          <p className="tarot-meaning">{drawnCard.meaning}</p>
          <button onClick={handleDrawCard} className="draw-button">
            다시 뽑기
          </button>
        </div>
      ) : (
        <div className="tarot-init">
          <p>마음을 가다듬고 아래 버튼을 눌러 카드를 뽑아보세요.</p>
          <button onClick={handleDrawCard} className="draw-button">
            카드 뽑기
          </button>
        </div>
      )}
    </div>
  );
};

export default TarotPage;