import React from 'react';
import styles from './MemoryGameCard.module.css';

interface MemoryCard {
  id: number;
  value: string;
  type: 'word' | 'image';
  image?: string;
  isMatched: boolean;
  isSelected: boolean;
}

interface MemoryGameCardProps {
  card: MemoryCard;
  onClick: (clickedCard: MemoryCard) => void;
}

const MemoryGameCard: React.FC<MemoryGameCardProps> = ({ card, onClick }) => {
  if (card.isMatched) return null; 

  return (
    <div
      className={`${styles.card} ${
        card.isSelected ? styles.selected : ''
      }`}
      onClick={() => onClick(card)}
    >
      {card.type === 'word' && <span>{card.value}</span>}
      {card.type === 'image' && card.image && (
        <img
          src={card.image}
          alt={card.value}
          className="max-w-[80%] max-h-[80%] object-contain"
        />
      )}
    </div>
  );
};

export default MemoryGameCard;
