export const cellDataKoven = [
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
    label: 'Produk',
  },
  {
    key: 'withdrawalPeriod',
    label: 'Masa Penarikan',
  },
  {
    flag: 'nominal',
    key: 'orderValue',
    label: 'Nominal Pembiayaan',
  },
  {
    key: 'exchangeRate',
    label: 'Exchange Rate',
  },
  {
    key: 'orderValueAfterExchangeRate',
    label: 'Nilai Pembiayaan (dalam Rp)',
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
  },
  {
    key: 'rates',
    label: 'Rate',
  },
  {
    key: 'gracePeriod',
    label: 'Masa Tenggang',
  },
  {
    key: 'financingObjectives',
    label: 'Tujuan Pembiayaan',
  },
  {
    key: 'governmentMandateLabel',
    label: 'Jaminan/Penugasan Pemerintah',
  },
  {
    key: 'remark',
    label: 'Keterangan',
  },
];

export const baseCellDataSyariah = [
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
    label: 'Skema Pembiayaan',
  },
  {
    key: 'financingObjectives',
    label: 'Tujuan Pembiayaan',
  },
  {
    key: 'debtorName',
    label: 'Mitra Syarik SMI',
  },
  {
    key: 'governmentMandateLabel',
    label: 'Jaminan/Penugasan pemerintah',
  },
  {
    key: 'remark',
    label: 'Keterangan',
  }
];

export const proyekCellDataSyariah = [
  {
    key: 'name',
    label: 'Nama Proyek',
  },
  {
    key: 'provinceLabel',
    label: 'Lokasi Proyek (Provinsi)',
  },
  {
    key: 'value',
    label: 'Nilai Proyek',
  },
  {
    key: 'cityLabel',
    label: 'Lokasi Proyek (Kota-Kabupaten)',
  },
  {
    key: 'districtLabel',
    label: 'Lokasi Proyek (Kecamatan)',
  },
];

export const proyekCellDataKoven = [
  {
    key: 'name',
    label: 'Nama Proyek',
  },
  {
    key: 'provinceLabel',
    label: 'Lokasi Proyek (Provinsi)',
  },
  {
    key: 'value',
    label: 'Nilai Proyek',
  },
  {
    key: 'cityLabel',
    label: 'Lokasi Proyek (Kota-Kabupaten)',
  },
  {
    key: 'sectorLabel',
    label: 'Sektor yang Dibiayai',
  },
  {
    key: 'districtLabel',
    label: 'Lokasi Proyek (Kecamatan)',
  },
];


export const cellDataAlIjarah = [
  {
    key: 'ijarah_object',
    label: 'Object Ijarah',
  },
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'ujroh_payment_period',
    label: 'Periode Pembayaran Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_type',
    label: 'Jenis Review Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_period',
    label: 'Masa Review Ujroh/Sewa',
  },
];

export const financingCellDataAlIjarah = [
  {
    flag: 'nominal',
    key: 'facility_value',
    label: 'Nilai Fasilitas Pembiayaan',
  },
  {
    flag: 'nominal',
    key: 'ujroh_value',
    label: 'Nilai Ujroh/Sewa',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_facility_value',
    label: 'Kurs Fasilitas Pembiayaan',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_ujroh',
    label: 'Kurs Ujroh/Sewa',
  },
  {
    flag: 'after_exchange_rate',
    key: 'facility_value_idr',
    label: 'Nilai Fasilitas Pembiayaan (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'ujroh_value_idr',
    label: 'Nilai Ujroh/Sewa (dalam Rp)',
  }
];

export const cellDataAlIstishna = [
  {
    key: 'istishna_object',
    label: 'Object Istishna',
  },
  {
    key: 'selling_price_payment_method',
    label: 'Metode Pembayaran Harga Jual',
  },
  {
    key: 'istishna_object_delivery_period',
    label: 'Masa Penyediaan Objek Istishna',
  },
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
];

export const financingCellDataAlIstishna = [
  {
    flag: 'nominal',
    key: 'purchase_price',
    label: 'Harga Beli/Plafond Pembiayaan',
  },
  {
    flag: 'nominal',
    key: 'down_payment',
    label: 'Uang Muka (Urbun)',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_purchase_price',
    label: 'Kurs Harga Beli/Plafond Pembiayaan',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_down_payment',
    label: 'Kurs Uang Muka (Urbun)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'purchase_price_idr',
    label: 'Harga Beli/Plafond Pembiayaan (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'down_payment_idr',
    label: 'Uang Muka (Urbun) (dalam Rp)',
  },
  {
    flag: 'nominal',
    key: 'istishna_margin',
    label: 'Margin Istishna',
  },
  {
    flag: 'nominal',
    key: 'selling_price',
    label: 'Harga Jual',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_istishna_margin',
    label: 'Kurs Margin Istishna',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_selling_price',
    label: 'Kurs Harga Jual',
  },
  {
    flag: 'after_exchange_rate',
    key: 'istishna_margin_idr',
    label: 'Margin Istishna (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'selling_price_idr',
    label: 'Harga Jual (dalam Rp)',
  },
  {
    flag: 'nominal',
    key: 'istishna_installment',
    label: 'Nilai Angsuran Istishna',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_istishna_installment',
    label: 'Kurs Nilai Angsuran Istishna',
  },
  {
    flag: 'after_exchange_rate',
    key: 'istishna_installment_idr',
    label: 'Nilai Angsuran Istishna (dalam Rp)',
  }
];
export const cellDataAlMudharabah = [
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'profit_share_smi',
    label: 'Nisbah Bagi Hasil SMI (%)',
  },
  {
    key: 'profit_share_customer',
    label: 'Nisbah Bagi Hasil Nasabah (%)',
  },
  {
    key: 'profit_share_type',
    label: 'Jenis Nisbah Bagi Hasil',
  },
  {
    key: 'profit_share_review',
    label: 'Review Nisbah Bagi Hasil',
  },
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
  {
    key: 'mudharabah_fund_usage_purpose',
    label: 'Tujuan Penggunaan Dana Mudharabah',
  },
];

export const financingCellDataAlMudharabah = [
  {
    flag: 'nominal',
    key: 'mudharabah_fund',
    label: 'Total Dana Mudharabah',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_mudharabah_fund',
    label: 'Kurs Total Dana Mudharabah',
  },
  {
    flag: 'after_exchange_rate',
    key: 'mudharabah_fund_idr',
    label: 'Total Dana Mudharabah (dalam Rp)',
  }
];


export const cellDataAlMurabahah = [
  {
    flag: 'nominal',
    key: 'murabahah_object',
    label: 'Object Murabahah',
  },
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
];

export const financingCellDataAlMurabahah = [
  {
    flag: 'nominal',
    key: 'purchase_price',
    label: 'Harga Beli/Plafond Pembiayaan',
  },
  {
    flag: 'nominal',
    key: 'down_payment',
    label: 'Uang Muka (Urbun)',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_purchase_price',
    label: 'Kurs Harga Beli/Plafond Pembiayaan',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_down_payment',
    label: 'Kurs Uang Muka (Urbun)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'purchase_price_idr',
    label: 'Harga Beli/Plafond Pembiayaan (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'down_payment_idr',
    label: 'Uang Muka (Urbun) (dalam Rp)',
  },
  {
    flag: 'nominal',
    key: 'murabahah_margin',
    label: 'Margin Murabahah',
  },
  {
    flag: 'nominal',
    key: 'selling_price',
    label: 'Harga Jual',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_murabahah_margin',
    label: 'Kurs Margin Murabahah',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_selling_price',
    label: 'Kurs Harga Jual',
  },
  {
    flag: 'after_exchange_rate',
    key: 'murabahah_margin_idr',
    label: 'Margin Murabahah (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'selling_price_idr',
    label: 'Harga Jual (dalam Rp)',
  },
  {
    flag: 'nominal',
    key: 'murabahah_installment',
    label: 'Nilai Angsuran Murabahah',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_murabahah_installment',
    label: 'Kurs Nilai Angsuran Murabahah',
  },
  {
    flag: 'after_exchange_rate',
    key: 'murabahah_installment_idr',
    label: 'Nilai Angsuran Murabahah (dalam Rp)',
  }
];

export const cellDataAlMusyarakah = [
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'profit_share_smi',
    label: 'Nisbah Bagi Hasil SMI (%)',
  },
  {
    key: 'profit_share_customer',
    label: 'Nisbah Bagi Hasil Nasabah (%)',
  },
  {
    key: 'profit_share_type',
    label: 'Jenis Nisbah Bagi Hasil',
  },
  {
    key: 'profit_share_review',
    label: 'Review Nisbah Bagi Hasil',
  },
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
  {
    key: 'fund_usage_purpose',
    label: 'Tujuan Penggunaan Dana Musyarakah',
  },
];

export const financingCellDataAlMusyarakah = [
  {
    flag: 'nominal',
    key: 'partnership_smi',
    label: 'Syirkah SMI',
  },
  {
    flag: 'nominal',
    key: 'partnership_customer',
    label: 'Syirkah Nasabah',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_partnership_smi',
    label: 'Kurs Syirkah SMI',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_partnership_customer',
    label: 'Kurs Syirkah Nasabah',
  },
  {
    flag: 'after_exchange_rate',
    key: 'partnership_smi_idr',
    label: 'Syirkah SMI (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'partnership_customer_idr',
    label: 'Syirkah Nasabah (dalam Rp)',
  },
  {
    flag: 'total',
    key: 'total_partnership',
    label: 'Total Syirkah',
  }
];

export const cellDataAlMusyarakahMuntanaqisah = [
  {
    key: 'mmq_object',
    label: 'Object MMQ',
  },
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'profit_share_smi',
    label: 'Nisbah Bagi Hasil SMI (%)',
  },
  {
    key: 'profit_share_customer',
    label: 'Nisbah Bagi Hasil Nasabah (%)',
  },
  {
    key: 'profit_share_type',
    label: 'Jenis Nisbah Bagi Hasil',
  },
  {
    key: 'profit_share_review',
    label: 'Review Nisbah Bagi Hasil',
  },
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
  {
    key: 'ujroh_payment_period',
    label: 'Periode Pembayaran Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_type',
    label: 'Jenis Review Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_period',
    label: 'Masa Review Ujroh/Sewa',
  },
];

export const financingCellDataAlMusyarakahMuntanaqisah = [
  {
    flag: 'nominal',
    key: 'partnership_smi_facility',
    label: 'Syirkah SMI',
  },
  {
    flag: 'nominal',
    key: 'partnership_customer',
    label: 'Syirkah Nasabah',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_partnership_smi_facility',
    label: 'Kurs Syirkah SMI',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_partnership_customer',
    label: 'Kurs Syirkah Nasabah',
  },
  {
    flag: 'after_exchange_rate',
    key: 'partnership_smi_facility_idr',
    label: 'Syirkah SMI (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'partnership_customer_idr',
    label: 'Syirkah Nasabah (dalam Rp)',
  },
  {
    flag: 'nominal',
    key: 'hishshah_value',
    label: 'Nilai Hishshah',
  },
  {
    flag: 'nominal',
    key: 'ujroh_value',
    label: 'Nilai Ujroh/Sewa',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_hishshah',
    label: 'Kurs Hishshah',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_ujroh',
    label: 'Kurs Ujroh/Sewa',
  },
  {
    flag: 'after_exchange_rate',
    key: 'hishshah_value_idr',
    label: 'Nilai Hishshah (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'ujroh_value_idr',
    label: 'Nilai Ujroh/Sewa (dalam Rp)',
  },
  {
    flag: 'total',
    key: 'total_partnership',
    label: 'Total Syirkah',
  }
];
export const cellDataAlQardh = [
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
  {
    key: 'loan_payment_method',
    label: 'Cara Bayar Pinjaman',
  },
];

export const financingCellDataAlQardh = [
  {
    flag: 'nominal',
    key: 'al_qardh_loan_amount',
    label: 'Jumlah/Nilai Pinjaman Al Qardh',
  },
  {
    flag: 'nominal',
    key: 'administration_fee',
    label: 'Biaya Administrasi',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_al_qardh_loan',
    label: 'Kurs Jumlah/Nilai Pinjaman Al Qardh',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_administration_fee',
    label: 'Kurs Biaya Administrasi',
  },
  {
    flag: 'after_exchange_rate',
    key: 'al_qardh_loan_amount_idr',
    label: 'Jumlah/Nilai Pinjaman Al Qardh (dalam Rp)',
  },
  {
    flag: 'after_exchange_rate',
    key: 'administration_fee_idr',
    label: 'Biaya Administrasi (dalam Rp)',
  },
  {
    flag: 'nominal',
    key: 'installment_value',
    label: 'Nilai Angsuran',
  },
  {
    flag: 'exchange_rate',
    key: 'exchange_rate_installment_value',
    label: 'Kurs Nilai Angsuran',
  },
  {
    flag: 'after_exchange_rate',
    key: 'installment_value_idr',
    label: 'Nilai Angsuran (dalam Rp)',
  }
];
export const cellDataImbtForm = [
  {
    key: 'imbt_object',
    label: 'Object Imbt',
  },
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'ujroh_payment_period',
    label: 'Periode Pembayaran Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_type',
    label: 'Jenis Review Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_period',
    label: 'Masa Review Ujroh/Sewa',
  },
  {
    key: 'imbt_object_transfer_agreement',
    label: 'Akad Pengalihan Objek IMBT',
  },
];

export const cellDataImfzForm = [
  {
    key: 'financing_period',
    label: 'Jangka Waktu Pembiayaan',
  },
  {
    key: 'expected_profit_share',
    label: 'Ekspektasi Imbal Hasil',
  },
  {
    key: 'ujroh_payment_period',
    label: 'Periode Pembayaran Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_type',
    label: 'Jenis Review Ujroh/Sewa',
  },
  {
    key: 'ujroh_review_period',
    label: 'Masa Review Ujroh/Sewa',
  },
  {
    key: 'ijarah_object_delivery_period',
    label: 'Masa Penyediaan Objek Ijarah/Sewa',
  },
];
