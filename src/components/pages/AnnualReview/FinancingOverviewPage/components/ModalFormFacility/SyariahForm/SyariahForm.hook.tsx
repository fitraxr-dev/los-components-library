type TCurrencyObject = {
  value: string;
  currency: string;
  idr: string;
};

const useSyariahForm = () => {
  const parseCurrency = (payload: TCurrencyObject) => {
    const { currency, value, idr } = payload;

    return {
      currency,
      value: Number(value),
      value_idr: idr ? Number(idr.replace(/,/g, '')) : null,
    };
  };

  const calculateTotalSyirkah = (...currencies: TCurrencyObject[]) => {
    if (currencies.length === 0) return null;

    const parsedCurrencies = currencies.map(parseCurrency);
    const uniqueCurrencies = new Set(parsedCurrencies.map((c) => c.currency));

    if (uniqueCurrencies.size === 1) {
      const commonCurrency = parsedCurrencies[0].currency;

      // Case 1: Both currencies are IDR
      if (commonCurrency === 'IDR') {
        return {
          currency_total_partnership: 'IDR',
          total_partnership: parsedCurrencies.reduce((acc, c) => acc + c.value, 0),
          total_partnership_idr: null,
        };
      }

      // Case 2: Both currencies are the same but not IDR
      return {
        currency_total_partnership: commonCurrency,
        total_partnership: parsedCurrencies.reduce((acc, c) => acc + c.value, 0),
        total_partnership_idr: parsedCurrencies.reduce((acc, c) => acc + (c.value_idr || 0), 0),
      };
    }

    // Case 3: Mixed currencies, calculate both USD and IDR totals
    const totalIdr = parsedCurrencies.reduce(
      (acc, c) => acc + (c.currency === 'IDR' ? c.value : c.value_idr || 0),
      0
    );

    const usdCurrencies = parsedCurrencies.filter((c) => c.currency === 'USD');
    const idrCurrencies = parsedCurrencies.filter((c) => c.currency === 'IDR');

    let totalUsd = 0;
    if (usdCurrencies.length > 0) {
      totalUsd += usdCurrencies.reduce((acc, c) => acc + c.value, 0);

      if (idrCurrencies.length > 0 && usdCurrencies[0].value_idr) {
        const exchangeRate = usdCurrencies[0].value_idr / usdCurrencies[0].value;
        const idrInUsd = idrCurrencies.reduce((acc, c) => acc + c.value, 0) / exchangeRate;
        totalUsd += idrInUsd;
      }
    }

    return {
      currency_total_partnership: 'USD',
      total_partnership: totalUsd,
      total_partnership_idr: totalIdr,
    };
  };

  return {
    calculateTotalSyirkah,
    parseCurrency,
  };
};

export default useSyariahForm;
