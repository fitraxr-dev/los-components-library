export const formData: MasintonForm = {

  availableMarker: {
    error: false,
    errorMessage: '',
    value: '',
  },

  baruPerpanjang: {
    error: false,
    errorMessage: '',
    value: false,
  },


  cabangPembukaan: {
    error: false,
    errorMessage: '',
    value: '',
  },

  catatan: {
    error: false,
    errorMessage: '',
    value: '',
  },

  cifKelompok: {
    error: false,
    errorMessage: '',
    value: '',
  },

  cifParent: {
    error: false,
    errorMessage: '',
    value: '',
  },

  countryOfRisk: {
    error: false,
    errorMessage: '',
    value: '',
  },

  countryPercent: {
    error: false,
    errorMessage: '',
    value: 100,
  },

  dateFrekuensiReview: {
    error: false,
    errorMessage: '',
    value: '',
  },

  datiLokasiProyek: {
    error: false,
    errorMessage: '',
    value: '',
  },

  debtorId: {
    error: false,
    errorMessage: '',
    value: '',
  },

  frekuensiReview: {
    error: false,
    errorMessage: '',
    value: '',
  },

  golonganKredit: {
    error: false,
    errorMessage: '',
    value: '',
  },

  idLimit: {
    error: false,
    errorMessage: '',
    value: '',
  },

  idPipeline: {
    error: false,
    errorMessage: '',
    value: '',
  },

  intervalFrekuensiReview: {
    error: false,
    errorMessage: '',
    value: '',
  },

  jenisPenggunaan: {
    error: false,
    errorMessage: '',
    value: '',
  },

  keteranganBMPK: {
    error: false,
    errorMessage: '',
    value: '',
  },

  liabilityNumber: {
    error: false,
    errorMessage: '',
    value: '',
  },

  limitId: {
    error: false,
    errorMessage: '',
    value: '',
  },

  maksimalPenggunaan: {
    error: false,
    errorMessage: '',
    value: '0',
  },

  mataUang: {
    error: false,
    errorMessage: '',
    value: '',
  },

  nilaiFasilitasOnline: {
    error: false,
    errorMessage: '',
    value: '',
  },

  nilaiKelonggaranTarik: {
    error: false,
    errorMessage: '',
    value: '',
  },

  nominalFasilitasLimit: {
    error: false,
    errorMessage: '',
    value: '0',
  },
  nominalFasilitasLimitInIDR: {
    error: false,
    errorMessage: '',
    value: 0,
  },

  onlineUpdate: {
    error: false,
    errorMessage: '',
    value: false,
  },

  onlyDateFrekuensiReview: {
    error: false,
    errorMessage: '',
    value: '',
  },

  orientasiPenggunaan: {
    error: false,
    errorMessage: '',
    value: '',
  },
  penandaBMPK: {
    error: false,
    errorMessage: '',
    value: false,
  },
  sebelumRestrukturisasi: {
    error: false,
    errorMessage: '',
    value: '',
  },
  sifatPiutang: {
    error: false,
    errorMessage: '',
    value: '',
  },
  tanggalBerakhir: {
    error: false,
    errorMessage: '',
    value: '',
  },
  tanggalBerlaku: {
    error: false,
    errorMessage: '',
    value: '',
  },
  tanggalInputLimit: {
    error: false,
    errorMessage: '',
    value: '',
  },
  totalOutstanding: {
    error: false,
    errorMessage: '',
    value: '',
  },
  tracerId: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const validation: MasintonValidation = {
  cabangPembukaan: [
    {
      errorMessage: 'Cabang Pembukaan tidak boleh kosong',
      rule: /\S/,
    },
  ],
  idPipeline: [
    {
      errorMessage: 'ID Pipeline tidak boleh kosong',
      rule: /\S/,
    },
  ],
  maksimalPenggunaan: [
    {
      errorMessage: 'Maksimal Penggunaan tidak boleh kosong',
      rule: /\S/,
    },
  ],
  mataUang: [
    {
      errorMessage: 'Mata Uang tidak boleh kosong',
      rule: /\S/,
    },
  ],
  nominalFasilitasLimit: [
    {
      errorMessage: 'Nominal Fasilitas Limit tidak boleh kosong',
      rule: /\S/,
    },
  ],
  tanggalBerakhir: [
    {
      errorMessage: 'Tanggal Berakhir tidak boleh kosong',
      rule: /.+/,
    },
  ],
  tanggalBerlaku: [
    {
      errorMessage: 'Tanggal Berlaku tidak boleh kosong',
      rule: /.+/,
    },
  ],
  tanggalInputLimit: [
    {
      errorMessage: 'Tanggal Input Limit tidak boleh kosong',
      rule: /.+/,
    },
  ],
};
