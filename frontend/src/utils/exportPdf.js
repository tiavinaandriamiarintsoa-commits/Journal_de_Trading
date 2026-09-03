import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateHeure, formatMonnaie } from './format';

export function exporterJournalPDF({ trades, stats, periodeLabel }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Journal de Trading by Tiavina', 40, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Période : ${periodeLabel}  ·  Généré le ${new Date().toLocaleDateString('fr-FR')}`, 40, 60);

  // Synthèse
  doc.setFontSize(11);
  doc.setTextColor(20);
  const synthese = [
    `Trades : ${stats.nombreTrades}`,
    `Win rate : ${stats.winRate}%`,
    `Résultat net : ${formatMonnaie(stats.profitTotal)}`,
    `Profit moyen : ${formatMonnaie(stats.profitMoyen)}`,
    `RR moyen : ${stats.rrMoyen > 0 ? '+' : ''}${stats.rrMoyen}R`,
    `Discipline : ${stats.tauxDiscipline}%`,
  ];
  doc.text(synthese.join('    |    '), 40, 82);

  const lignes = trades.map((t) => [
    formatDateHeure(t.heure_cloture),
    t.symbole,
    t.type,
    t.volume,
    `${t.rr_realise > 0 ? '+' : ''}${t.rr_realise}R`,
    formatMonnaie(t.resultat_net),
    t.emotion,
    t.respect_plan ? 'Oui' : 'Non',
    t.commentaire || '',
  ]);

  autoTable(doc, {
    startY: 100,
    head: [['Clôture', 'Symbole', 'Type', 'Volume', 'RR', 'Résultat', 'Émotion', 'Plan respecté', 'Commentaire']],
    body: lignes,
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [28, 31, 39], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      8: { cellWidth: 160 },
    },
  });

  doc.save(`journal-trading-${new Date().toISOString().slice(0, 10)}.pdf`);
}
