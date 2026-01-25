import React from 'react';
import { Link } from 'react-router-dom';

const SajuPage: React.FC = () => {
  return (
    <div>
      <nav>
        <Link to="/">홈으로</Link>
      </nav>
      <h1>사주 보기</h1>
      {/* Saju content will go here */}
    </div>
  );
};

export default SajuPage;