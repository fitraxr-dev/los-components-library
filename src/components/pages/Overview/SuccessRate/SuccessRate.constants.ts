export const STATUS_COLORS = {
  APPROVE: '#65789B',
  DECLINE: '#FF9D4D',
  EFEKTIF_PEMBIAYAAN: '#7262fd',
  IN_PROGRESS: '#61DDAA',
  PARTIAL_EFEKTIF: '#F6BD16',
  PIPELINE: '#5B8FF9',
};

export const CHART_LABELS = [
  { color: STATUS_COLORS.PIPELINE, label: 'Pipeline' },
  { color: STATUS_COLORS.IN_PROGRESS, label: 'In Progress' },
  { color: STATUS_COLORS.APPROVE, label: 'Approve' },
  { color: STATUS_COLORS.PARTIAL_EFEKTIF, label: 'Partial Efektif' },
  { color: STATUS_COLORS.EFEKTIF_PEMBIAYAAN, label: 'Efektif Pembiayaan' },
  { color: STATUS_COLORS.DECLINE, label: 'Decline' },
];

export const LEGEND_COLORS = {
  APPROVE: '#92C4E0',
  DECLINE: '#F18264',
  EFEKTIF_PEMBIAYAAN: '#E4E4E4',
  IN_PROGRESS: '#5E8DB8',
  PARTIAL_EFEKTIF: '#B8B8B8',
  PIPELINE: '#395A7F',
};

export const LEGEND_LABELS = [
  { color: LEGEND_COLORS.PIPELINE, description: 'Pengajuan baru dibuat dan masuk ke tahap awal proses.', label: 'Pipeline' },
  { color: LEGEND_COLORS.IN_PROGRESS, description: 'Pengajuan sedang dalam proses analisis atau review, termasuk proses MIP / Fast Track sebelum Komite.', label: 'In Progress' },
  { color: LEGEND_COLORS.APPROVE, description: 'Pengajuan dalam proses persetujuan Komite Pembiayaan sebelum PK efektif.', label: 'Approve' },
  { color: LEGEND_COLORS.PARTIAL_EFEKTIF, description: 'Sebagian PK telah efektif, namun belum seluruhnya.', label: 'Partial Efektif' },
  { color: LEGEND_COLORS.EFEKTIF_PEMBIAYAAN, description: 'Seluruh PK telah efektif.', label: 'Efektif Pembiayaan' },
  { color: LEGEND_COLORS.DECLINE, description: 'Pengajuan ditolak atau dibatalkan sehingga proses tidak dilanjutkan.', label: 'Decline' },
];

export const modal = {
  SUCCESS_RATE_FILTER_MODAL: 'SUCCESS_RATE_FILTER_MODAL',
};
