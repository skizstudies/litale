import Card from '../ui/Card';
import PagongMascot from './PagongMascot';
import SpeechBubble from './SpeechBubble';

export default function MascotCard({ message, possibleMessages }) {
  return (
    <Card aria-label="Pagong the turtle" className="flex flex-col items-center">
      <PagongMascot className="h-44 w-44 sm:h-48 sm:w-48" />
      <SpeechBubble sizeTo={possibleMessages}>{message}</SpeechBubble>
    </Card>
  );
}
