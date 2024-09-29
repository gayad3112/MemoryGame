
export interface Props {
  image: string;
  isFlipped: boolean;
  isPaired: boolean;
  id: number;
  onClick: (id: number) => void;
}

export const Card = (card: Props) => {
  return (
    <div onClick={card.isPaired ? undefined : () => card.onClick(card.id)} className={`memory-card${card.isFlipped ? ' flip' : ''}`}>
      <div className="front-face">
        <img src={card.image} alt="Front face" />
      </div>
      <div className="back-face">
        <img src="/backImage.svg" alt="Back face" />
      </div>
    </div>
  );
};
