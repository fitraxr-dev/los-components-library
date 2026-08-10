const SyariahBaseForm = [
  {
    key: 'orderTypeLabel',
    label: 'Order Type',
  },
  {
    key: 'financingSegmentLabel',
    label: 'Segment Pembiayaan',
  },
  {
    key: 'productLabel',
    label: 'Skema Pembayaran',
  },
  {
    key: 'financingObjectives',
    label: 'Tujuan Pembiayaan',
  },
];

const FacilityFormData = {
  AlIjarah: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'ijarahObject',
      label: 'Objek Istishna',
    },
    {
      key: 'financing_period',
      label: 'Jangka Waktu Pembiayaan',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlIstishna: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'istishnaObject',
      label: 'Objek Istishna',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlMudharabah: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlMurabahah: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'murabahah_object',
      label: 'Objek Murabahah',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlMusyarakah: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlMusyarakahMutanaqisah: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'mmqObject',
      label: 'Objek MMQ',
    },
    {
      key: 'nisbahProfitSharingSMI',
      label: 'Nisbah Bagi Hasil SMI',
    },
    {
      key: 'nisbahProfitSharingCustomer',
      label: 'Nisbah Bagi Hasil Nasabah',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlQardh: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  Imbt: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'imbtObject',
      label: 'Objek IMBT',
    },
    {
      key: 'financing_period',
      label: 'Jangka Waktu Pembiayaan',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  Imfz: [
    ...SyariahBaseForm,
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'financing_period',
      label: 'Jangka Waktu Pembiayaan',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
};

export const cellDataFacility = {
  'IJARAH_FINANCING_DIRECT': FacilityFormData.AlIjarah,
  'IJARAH_MAUSHUFAH_FI_AL_ZIMMAH': FacilityFormData.Imfz,
  'IJARAH_MUNTAHIYAH_BITTAMLIK': FacilityFormData.Imbt,
  'ISTISNA_DIRECT': FacilityFormData.AlIstishna,
  'MMQ_LEASE_DIRECT': FacilityFormData.AlMusyarakahMutanaqisah,
  'MUDARABAH_DIRECT': FacilityFormData.AlMudharabah,
  'MURABAHAH_DIRECT': FacilityFormData.AlMurabahah,
  'MUSHARAKAH_DIRECT': FacilityFormData.AlMusyarakah,
  'QARDH_FINANCING': FacilityFormData.AlQardh,
};

const FinancingFormData = {
  AlIjarah: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'ijarahObject',
      label: 'Objek Istishna',
    },
    {
      key: 'financing_period',
      label: 'Jangka Waktu Pembiayaan',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlIstishna: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'istishnaObject',
      label: 'Objek Istishna',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlMudharabah: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlMurabahah: [
    {
      key: 'purchase_price',
      label: 'Harga Beli / Plafond Pembiayaan',
      sx: { gridColumn: 'span 2' },
    },
  ],
  AlMusyarakah: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlMusyarakahMutanaqisah: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'mmqObject',
      label: 'Objek MMQ',
    },
    {
      key: 'nisbahProfitSharingSMI',
      label: 'Nisbah Bagi Hasil SMI',
    },
    {
      key: 'nisbahProfitSharingCustomer',
      label: 'Nisbah Bagi Hasil Nasabah',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  AlQardh: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  Imbt: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'imbtObject',
      label: 'Objek IMBT',
    },
    {
      key: 'financing_period',
      label: 'Jangka Waktu Pembiayaan',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
  Imfz: [
    {
      key: 'debtorName',
      label: 'Mitra Syarik SMI',
    },
    {
      key: 'financing_period',
      label: 'Jangka Waktu Pembiayaan',
    },
    {
      key: 'profitSharingExpectations',
      label: 'Ekspektasi Imbal Hasil Setara Dengan',
    },
    {
      key: 'governmentMandateLabel',
      label: 'Jaminan / Penugasan Pemerintah',
    },
    {
      key: 'remark',
      label: 'Keterangan',
    },
  ],
};

export const cellDataFinancing = {
  'IJARAH_FINANCING_DIRECT': FinancingFormData.AlIjarah,
  'IJARAH_MAUSHUFAH_FI_AL_ZIMMAH': FinancingFormData.Imfz,
  'IJARAH_MUNTAHIYAH_BITTAMLIK': FinancingFormData.Imbt,
  'ISTISNA_DIRECT': FinancingFormData.AlIstishna,
  'MMQ_LEASE_DIRECT': FinancingFormData.AlMusyarakahMutanaqisah,
  'MUDARABAH_DIRECT': FinancingFormData.AlMudharabah,
  'MURABAHAH_DIRECT': FinancingFormData.AlMurabahah,
  'MUSHARAKAH_DIRECT': FinancingFormData.AlMusyarakah,
  'QARDH_FINANCING': FinancingFormData.AlQardh,
};
