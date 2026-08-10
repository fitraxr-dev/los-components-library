export type PopupFormSubmitProps = {
  exchangeRatePengajuan: {currency: string; value: string};
  exchangeRateProyek: {currency: string; value: string};
  kecamatan: string;
  keterangan: string;
  kota: string;
  namaProyek: string;
  nilaiPengajuanIDR: {currency: string; value: string};
  nilaiProyek: {currency: string; value: string};
  nilaiProyekIDR: {currency: string; value: string};
  nominalPengajuan: {currency: string; value: string};
  orderType: string;
  produk: string;
  provinsi: string;
  segmenPembiayaan: string;
}

export type PopupFormPaymentFacilityNewProps = {
  id: number;
  debtorId: number;
}
