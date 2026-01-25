export interface TarotCard {
  name: string;
  imageUrl: string;
  meaning: string;
}

export const tarotDeck: TarotCard[] = [
  {
    name: '바보 (The Fool)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg',
    meaning: '새로운 시작, 순수함, 자유로운 영혼. 예측할 수 없는 여정이 기다리고 있지만, 긍정적인 마음으로 첫 발을 내딛으세요.',
  },
  {
    name: '마법사 (The Magician)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
    meaning: '창조, 재능, 힘, 영감. 당신은 원하는 것을 이룰 모든 자원을 가지고 있습니다. 지금 바로 행동에 옮기세요.',
  },
  {
    name: '여사제 (The High Priestess)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
    meaning: '직관, 신성한 지식, 내면의 목소리. 지금은 행동하기보다, 당신의 내면의 목소리에 귀를 기울여야 할 때입니다.',
  },
];
