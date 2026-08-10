export const PerformanceOverviewColor = {
  approve: '#69B1FF',
  decline: '#FA541C',
  efektifPembiayaan: '#E8E8E8',
  inProgress: '#1E6BB8',
  partialEfektif: '#BFBFBF',
  pipeline: '#002D62',
};

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
