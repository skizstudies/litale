import { formatTime, formatTimeSpoken } from '../../utils/formatTime';

const STATUS_COPY = {
  idle: 'Pagong is ready to listen…',
  recording: 'Pagong is listening…',
  paused: 'Pagong is waiting for you…',
};

export default function RecordingStatus({ status, elapsedSeconds }) {
  return (
    <p className="text-center text-xl font-medium text-litale-ink">
      {STATUS_COPY[status]}{' '}
      <span
        role="timer"
        aria-label={`Recording time ${formatTimeSpoken(elapsedSeconds)}`}
        className="ml-1 font-semibold tabular-nums text-litale-forest"
      >
        {formatTime(elapsedSeconds)}
      </span>
    </p>
  );
}
