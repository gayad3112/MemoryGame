import { useEffect, useState } from "react";
import { Card, Props } from "./Card";

const shuffle = (array: Props[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

export const Board = () => {
  const cardImages = [
    "/card-images/zebra.svg",
    "/card-images/croc.svg",
    "/card-images/bunny.svg",
    "/card-images/jelly.svg",
    "/card-images/fox.svg",
    "/card-images/shrimp.svg",
    "/card-images/hedgehog.svg",
    "/card-images/raccoon.svg",
    "/card-images/crab.svg"
  ];
  

  const generateCards = () => {
    return shuffle(
      cardImages.flatMap((image, index) => [
        { image, isFlipped: false, isPaired: false, id: index * 2 + 1, onClick: () => {} },
        { image, isFlipped: false, isPaired: false, id: index * 2 + 2, onClick: () => {} },
      ])
    );
  };

  const [cards, setCards] = useState(generateCards);
  const [firstCard, setFirstCard] = useState<Props>();
  const [moves, setMoves] = useState(0);
  const [isWinner, setIsWinner] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  
  useEffect(() => {
    const savedBestScore = localStorage.getItem("bestScore");
    if (savedBestScore) {
      setBestScore(Number(savedBestScore));
    }
  }, []);

  const handleCardClick = (id: number) =>  {
    if (cards.filter(card => card.isFlipped && !card.isPaired).length === 0) {
      setCards(cards.map(card =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      ));
      setFirstCard(cards.find(card => card.id === id));
    } 
    else if (cards.filter(card => card.isFlipped && !card.isPaired).length === 1 && id !== firstCard?.id) {
      setCards(cards.map(card =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      ));
      const secondCard = cards.find(card => card.id === id);
      setTimeout(() => {
        setCards(prevCards => {
          const updatedCards = prevCards.map(card => {
            if (card.id === firstCard?.id || card.id === secondCard?.id) {
              return firstCard?.image === secondCard?.image
                ? { ...card, isPaired: true }
                : { ...card, isFlipped: false };
            }
            return card;
          });

            const allPaired = updatedCards.every(card => card.isPaired);
            if (allPaired) {
              setIsWinner(true); 
              if (bestScore === null || moves < bestScore) {
                setBestScore(moves+1);
                localStorage.setItem("bestScore", String(moves));
              }
            }
          return updatedCards;
        });
        setFirstCard(undefined);
      }, 1000);
      setMoves(x=>x+1);
    }

  };

    
    const handleRestart = () => {
      setCards(generateCards()); 
      setMoves(0); 
      setIsWinner(false); 
      setFirstCard(undefined); 
    };

  return (
    <div className="memory-game">
      {cards.map((card) => (
        <Card
          key={card.id}
          image={card.image}
          isFlipped={card.isFlipped}
          isPaired={card.isPaired}
          id={card.id}
          onClick={() => handleCardClick(card.id)}
        />
      ))}

<div className="moves-counter">
      <h3>Number of moves: {moves}</h3>
    </div>
     {isWinner && <div className="winner" > <h3>you won!</h3> </div>}
     <div className="best-score">
        <h3>Best Score: {bestScore !== null ? bestScore : "No score yet"}</h3>
      </div>
     <button onClick={handleRestart}>restart</button>
    </div>
    
    
  );
};
