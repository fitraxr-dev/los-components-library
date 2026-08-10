import { cellDataFacility, cellDataFinancing } from './SyariahForm.constant';

import type SyariahFormProps from './SyariahForm.type';


type TCurrencyObject = {
  value: string;
  currency: string;
  idr: string;
}

const useSyariahForm = (props: SyariahFormProps) => {
  const { paymentScheme, financingFacilityData } = props;


  const calculateTotalSyirkah = (smi: TCurrencyObject, client: TCurrencyObject) => {
    const smiValue = isUSD(smi);
    const clientValue = isUSD(client);

    if (smiValue.currency === 'USD' && clientValue.currency === 'USD') {
      return {
        currency_total_partnership: 'USD',
        total_partnership: smiValue.value + clientValue.value,
        total_partnership_idr: smiValue.value_idr + clientValue.value_idr,
      };
    } else if (smiValue.currency === 'IDR' && clientValue.currency === 'IDR') {
      return {
        currency_total_partnership: 'IDR',
        total_partnership: smiValue.value + clientValue.value,
        total_partnership_idr: null,
      };
    } else if (smiValue.currency === 'IDR' && clientValue.currency === 'USD') {
      return {
        currency_total_partnership: null,
        total_partnership: null,
        total_partnership_idr: smiValue.value + clientValue.value_idr,

      };
    } else {
      return {
        currency_total_partnership: null,
        total_partnership: null,
        total_partnership_idr: smiValue.value_idr + clientValue.value,
      };
    }
  };

  const isUSD = (payload: TCurrencyObject) => {
    const { currency } = payload;

    switch (currency) {
      case 'USD':
        return {
          currency: 'USD',
          value: +payload.value,
          value_idr: +payload.idr.split(',').join(''),
        };
        break;

      default:
        return {
          currency: 'IDR',
          value: +payload.value,
          value_idr: null,
        };
    }
  };

  const mapCellData = (data: any, cellData: any[]) => {
    const result = cellData.map((item) => {
      let value = data?.[item.key];

      if (item.label === 'Harga Beli / Plafond Pembiayaan') {
        value = (data?.currency_purchase_price ? data?.currency_purchase_price : 'IDR') + ' ' + data?.purchase_price;
      }

      if (item.label === 'Jumlah / Nilai Pinjaman Al Qardh') {
        value = (data?.currency_al_qardh_loan_amount ? data?.currency_al_qardh_loan_amount : 'IDR') + ' ' + data?.al_qardh_loan_amount;
      }

      if (item.label === 'Syirkah SMI / Nilai Fasilitas Pembiayaan') {
        value = (data?.syirkahSmiCurrency ? data?.syirkahSmiCurrency : 'IDR') + ' ' + data?.syirkahSmiValue;
      }

      if (item.label === 'Syirkah Nasabah / Mitra Syarik SMI') {
        value = (data?.syirkahNasabahCurrency ? data?.syirkahNasabahCurrency : 'IDR') + ' ' + data?.syirkahNasabahValue;
      }

      if (item.label === 'Nilai Fasilitas Pembiayaan') {
        value = (data?.currencyOrderValue ? data?.currencyOrderValue : 'IDR') + ' ' + data?.orderValue;
      }

      if (item.label === 'Total Dana Mudharabah / Plafond Penyediaan ') {
        value = (data?.mudharabahFundCurrency ? data?.mudharabahFundCurrency : 'IDR') + ' ' + data?.mudharabahFundValue;
      }

      if (value === null || value === undefined) {
        value = '-';
      }

      if (item.label === '') {
        value = '';
      }
      return { ...item, value };
    });


    if (data?.currency_purchase_price === 'USD') {
      const exchangeRateCell = {
        key: 'exchange_rate_purchase_price',
        label: 'Kurs',
        value: 'IDR' + ' ' + data['exchange_rate_purchase_price'].value,
      };

      const valueAfterExchangeRate = {
        key: 'purchase_price_idr',
        label: 'Harga Beli / Plafond Pembiayaan (dalam Rp)',
        value: 'IDR' + ' ' + data['purchase_price_idr'].value,
      };

      const currencyIndex = result.findIndex((item) => item.key === 'purchase_price');
      result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
    }

    if (data?.currency_al_qardh_loan_amount === 'USD') {
      const exchangeRateCell = {
        key: 'exchange_rate_al_qardh_loan',
        label: 'Kurs',
        value: 'IDR' + ' ' + data['exchange_rate_al_qardh_loan'].value,
      };

      const valueAfterExchangeRate = {
        key: 'al_qardh_loan_amount_idr',
        label: 'Jumlah / Nilai Pinjaman Al Qardh (dalam Rp)',
        value: 'IDR' + ' ' + data['al_qardh_loan_amount_idr'].value,
      };

      const currencyIndex = result.findIndex((item) => item.key === 'al_qardh_loan_amount');
      result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
    }

    if (data?.syirkahSmiCurrency === 'USD') {
      const exchangeRateCell = {
        key: 'syirkahSmiRate',
        label: 'Kurs',
        value: 'IDR' + ' ' + data['syirkahSmiRate'].value,
      };

      const valueAfterExchangeRate = {
        key: 'syirkahSmiIdr',
        label: 'Syirkah SMI / Nilai Fasilitas Pembiayaan (dalam Rp)',
        value: 'IDR' + ' ' + data['syirkahSmiIdr'].value,
      };

      const currencyIndex = result.findIndex((item) => item.key === 'syirkahSmiValue');
      result.splice(currencyIndex + 1, 1, exchangeRateCell, valueAfterExchangeRate);
    }

    if (data?.syirkahNasabahCurrency === 'USD') {
      const exchangeRateCell = {
        key: 'syirkahNasabahRate',
        label: 'Kurs',
        value: 'IDR' + ' ' + data['syirkahNasabahRate'].value,
      };

      const valueAfterExchangeRate = {
        key: 'syirkahNasabahIdr',
        label: 'Syirkah Nasabah / Nilai Fasilitas Pembiayaan (dalam Rp)',
        value: 'IDR' + ' ' + data['syirkahNasabahIdr'].value,
      };

      const currencyIndex = result.findIndex((item) => item.key === 'syirkahNasabahValue');
      result.splice(currencyIndex + 1, 1, exchangeRateCell, valueAfterExchangeRate);
    }

    if (data?.currencyOrderValue === 'USD') {
      const exchangeRateCell = {
        key: 'exchangeRate',
        label: 'Kurs',
        value: 'IDR' + ' ' + data['exchangeRate'].value,
      };

      const valueAfterExchangeRate = {
        key: 'orderValueinRp',
        label: 'Nominal Pengajuan (dalam Rp)',
        value: 'IDR' + ' ' + data['orderValueinRp'].value,
      };

      const currencyIndex = result.findIndex((item) => item.key === 'orderValue');
      result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
    }

    if (data?.mudharabahFundCurrency === 'USD') {
      const exchangeRateCell = {
        key: 'mudharabahFundRate',
        label: 'Kurs',
        value: 'IDR' + ' ' + data['mudharabahFundRate'].value,
      };

      const valueAfterExchangeRate = {
        key: 'mudharabahFundValueIdr',
        label: 'Nominal Pengajuan (dalam Rp)',
        value: 'IDR' + ' ' + data['mudharabahFundValueIdr'].value,
      };

      const currencyIndex = result.findIndex((item) => item.key === 'mudharabahFundValue');
      result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
    }
    return result;
  };

  const facilityData = mapCellData(financingFacilityData, cellDataFacility[paymentScheme]);
  //   const additionalData = mapCellData(financingFacilityData, cellDataAdditional[paymentScheme]);
  const financingData = mapCellData(financingFacilityData, cellDataFinancing[paymentScheme]);

  return {
    // additionalData,
    calculateTotalSyirkah,
    facilityData,
    financingData,
    isUSD,
  };
};


export default useSyariahForm;
