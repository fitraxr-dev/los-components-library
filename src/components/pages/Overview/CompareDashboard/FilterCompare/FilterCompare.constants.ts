export interface DivisionOption {
  id: string;
  name: string;
}

export const direktoratOptionsBisnis: DivisionOption[] = [
  { id: 'bisnis-1', name: 'Bisnis Konsumer' },
  { id: 'bisnis-2', name: 'Bisnis Korporat' },
];

export const divisiOptionsBisnis: Record<string, DivisionOption[]> = {
  'bisnis-1': [
    { id: 'pembiayaan-berkelanjutan', name: 'Pembiayaan Berkelanjutan' },
    { id: 'pengembangan-proyek', name: 'Pengembangan Proyek' },
    { id: 'pembiayaan-otomotif', name: 'Pembiayaan Otomotif' },
  ],
  'bisnis-2': [
    { id: 'pembiayaan-infrastruktur', name: 'Pembiayaan Infrastruktur' },
    { id: 'pembiayaan-energi', name: 'Pembiayaan Energi' },
    { id: 'investasi-strategis', name: 'Investasi Strategis' },
  ],
};

export const direktoratOptionsNonBisnis: DivisionOption[] = [
  { id: 'non-bisnis-dpop', name: 'Non-Bisnis DPOP' },
  { id: 'non-bisnis-depi', name: 'Non-Bisnis DEPI' },
];

export const divisiOptionsNonBisnis: Record<string, DivisionOption[]> = {
  'non-bisnis-depi': [
    { id: 'depi-1', name: 'DEPI - Unit 1' },
    { id: 'depi-2', name: 'DEPI - Unit 2' },
    { id: 'depi-3', name: 'DEPI - Unit 3' },
  ],
  'non-bisnis-dpop': [
    { id: 'dpop-1', name: 'DPOP - Unit 1' },
    { id: 'dpop-2', name: 'DPOP - Unit 2' },
    { id: 'dpop-3', name: 'DPOP - Unit 3' },
  ],
};
