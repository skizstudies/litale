import { useEffect, useRef } from 'react';

// Fixed drawing resolution; CSS scales it to fit. Strokes are stored in these
// units, so artwork survives resizes and switching scenes.
const WIDTH = 1000;
const HEIGHT = 750;

/** Draw one stroke with midpoint curves so lines look smooth, not jagged. */
function drawStroke(ctx, { color, size, points }) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (points.length === 1) {
    const [x, y] = points[0];
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
  }
  const [lx, ly] = points[points.length - 1];
  ctx.lineTo(lx, ly);
  ctx.stroke();
}

/**
 * Freehand drawing surface (mouse, touch, or stylus).
 *
 * Props
 *  - strokes: [{ color, size, points: [[x, y], …] }] already saved
 *  - onAddStroke(stroke): called when a finger/pen lifts
 *  - enabled: when false the canvas only displays and lets clicks pass through
 */
export default function StrokeCanvas({ strokes, onAddStroke, color, size, enabled = true, label, className = '' }) {
  const canvasRef = useRef(null);
  const baseRef = useRef(null); // offscreen copy of saved strokes
  const currentRef = useRef(null); // stroke being drawn right now
  const frameRef = useRef(0);

  const getBase = () => {
    if (!baseRef.current) {
      baseRef.current = document.createElement('canvas');
      baseRef.current.width = WIDTH;
      baseRef.current.height = HEIGHT;
    }
    return baseRef.current;
  };

  const render = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(getBase(), 0, 0);
    if (currentRef.current) drawStroke(ctx, currentRef.current);
  };

  const scheduleRender = () => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      render();
    });
  };

  useEffect(() => {
    const base = getBase();
    const ctx = base.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    strokes.forEach((stroke) => drawStroke(ctx, stroke));
    render();
  }, [strokes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const toPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return [
      r1(((event.clientX - rect.left) / rect.width) * WIDTH),
      r1(((event.clientY - rect.top) / rect.height) * HEIGHT),
    ];
  };

  const handlePointerDown = (event) => {
    if (!enabled || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    currentRef.current = { color, size, points: [toPoint(event)] };
    scheduleRender();
  };

  const handlePointerMove = (event) => {
    if (!currentRef.current) return;
    const coalesced = event.nativeEvent.getCoalescedEvents?.() ?? [];
    (coalesced.length ? coalesced : [event.nativeEvent]).forEach((e) => currentRef.current.points.push(toPoint(e)));
    scheduleRender();
  };

  const finishStroke = () => {
    const stroke = currentRef.current;
    if (!stroke) return;
    currentRef.current = null;
    drawStroke(getBase().getContext('2d'), stroke); // keep it visible until the parent re-renders
    onAddStroke(stroke);
  };

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishStroke}
      onPointerCancel={finishStroke}
      onLostPointerCapture={finishStroke}
      className={`touch-none ${enabled ? 'cursor-crosshair' : 'pointer-events-none'} ${className}`}
    />
  );
}

const r1 = (n) => Math.round(n * 10) / 10;
