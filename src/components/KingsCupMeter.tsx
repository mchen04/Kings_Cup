type Props = {
  fill: number;
  kingsDrawn: number;
};

export default function KingsCupMeter({ fill, kingsDrawn }: Props) {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <div className="cup-wrap" aria-label={`King's Cup ${Math.round(pct)}% full, ${kingsDrawn} of 4 kings drawn`}>
      <div className="cup">
        <div className="cup-fill" style={{ height: `${pct}%` }} />
        <div className="cup-rim" />
      </div>
      <div className="cup-meta">
        <span className="cup-label">Kings</span>
        <div className="king-dots" role="group" aria-label="Kings drawn">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`king-dot ${i < kingsDrawn ? 'on' : ''}`}
              aria-hidden="true"
            >
              ♚
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
