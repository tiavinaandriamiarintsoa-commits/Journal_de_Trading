/**
 * Jauge arquée : élément signature du design.
 * Un arc de 270° en or sourd, rempli proportionnellement au taux de discipline.
 * Le reste de l'interface reste volontairement sobre autour de cet élément.
 */
export default function JaugeDiscipline({ valeur = 0, taille = 200 }) {
  const rayon = taille / 2 - 14;
  const centre = taille / 2;
  const angleDepart = 135; // degrés
  const angleTotal = 270;
  const angleValeur = (Math.min(Math.max(valeur, 0), 100) / 100) * angleTotal;

  const polaireVersCartesien = (angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: centre + rayon * Math.cos(angleRad),
      y: centre + rayon * Math.sin(angleRad),
    };
  };

  const decrireArc = (angleDebut, angleFin) => {
    const debut = polaireVersCartesien(angleFin);
    const fin = polaireVersCartesien(angleDebut);
    const grandArc = angleFin - angleDebut <= 180 ? 0 : 1;
    return `M ${debut.x} ${debut.y} A ${rayon} ${rayon} 0 ${grandArc} 0 ${fin.x} ${fin.y}`;
  };

  const arcFond = decrireArc(angleDepart, angleDepart + angleTotal);
  const arcValeur = decrireArc(angleDepart, angleDepart + angleValeur);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: taille, height: taille }}>
      <svg width={taille} height={taille} viewBox={`0 0 ${taille} ${taille}`}>
        <path
          d={arcFond}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {valeur > 0 && (
          <path
            d={arcValeur}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl text-ivory tabular-nums">{Math.round(valeur)}%</span>
        <span className="text-xs text-slate mt-1 tracking-wide">Discipline</span>
      </div>
    </div>
  );
}
