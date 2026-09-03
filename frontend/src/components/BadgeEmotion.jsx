const COULEURS_EMOTION = {
  Calme: '#4F9D69',
  Confiant: '#4F9D69',
  Impatient: '#C9A227',
  Frustré: '#C1544A',
  Peur: '#C1544A',
  Euphorique: '#C9A227',
  Déçu: '#8B8F98',
};

export default function BadgeEmotion({ emotion }) {
  const couleur = COULEURS_EMOTION[emotion] || '#8B8F98';
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ivory">
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: couleur }} />
      {emotion}
    </span>
  );
}
