export default function WinRateRing({ valeur = 0, taille = 120 }) {
  const rayon = taille / 2 - 8;
  const circonference = 2 * Math.PI * rayon;
  const decalage = circonference - (Math.min(valeur, 100) / 100) * circonference;
  const centre = taille / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: taille, height: taille }}>
      <svg width={taille} height={taille}>
        <circle cx={centre} cy={centre} r={rayon} fill="none" stroke="var(--color-line)" strokeWidth="8" />
        <circle
          cx={centre}
          cy={centre}
          r={rayon}
          fill="none"
          stroke="var(--color-ivory)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circonference}
          strokeDashoffset={decalage}
          transform={`rotate(-90 ${centre} ${centre})`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-xl text-ivory">{valeur}%</span>
      </div>
    </div>
  );
}
