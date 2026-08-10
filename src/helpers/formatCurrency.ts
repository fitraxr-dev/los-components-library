export function formatCurrency(inputValue: string = '', options?: {maxDecimal?: number; maxLength?: number }) {
  if (!inputValue) return inputValue;

  const maxLength = options?.maxLength ?? 0;
  const maxDecimal = options?.maxDecimal ?? 2;

  let valueToProcess = inputValue;
  const rawValue = inputValue.replace(/,/g, '');
  if (rawValue.toLowerCase().includes('e')) {
    const numValue = Number(rawValue);
    if (!Number.isNaN(numValue)) {
      valueToProcess = numValue.toFixed(maxDecimal);
    }
  }

  const inputNumber = valueToProcess.replace(/[^\d.]|(\.(?=.*\.))/g, '');
  let [wholePart, decimalPart = ''] = inputNumber.split('.');

  if (maxLength && wholePart.length > maxLength) {
    wholePart = wholePart.substring(0, maxLength);
  }

  if (decimalPart.length > maxDecimal) {
    decimalPart = decimalPart.substring(0, maxDecimal);
  }

  const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedValue = /\./.test(inputNumber) ? `${formattedWholePart}.${decimalPart}` : `${formattedWholePart}.${'0'.repeat(maxDecimal)}`;

  return formattedValue;
}


export const formatCurrencyID = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
};
