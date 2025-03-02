import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function Confetti({ colors = ['#8000FF', '#9933FF', '#6600CC', '#ffffff'] }) {
  const { width, height } = useWindowSize();
  
  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      gravity={0.2}
      colors={colors}
      tweenDuration={5000}
    />
  );
}