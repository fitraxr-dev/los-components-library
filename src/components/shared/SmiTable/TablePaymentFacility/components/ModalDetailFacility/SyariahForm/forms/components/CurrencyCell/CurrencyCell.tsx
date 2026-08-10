import { Box, Checkbox, useTheme } from '@mui/material';

import Cell from '@/components/shared/Cell';


const CurrencyCell = (props) => {
  const {
    value, currency, rate, idrValue,
    valueTitle, rateTitle, totalTitle,
    type = 'default',
    checkboxChecked,
  } = props;

  const theme = useTheme();

  switch (type) {
    case 'total':
      return (
        <>
          {value && <Cell title={valueTitle} value={currency + ' ' + value} />}
          {currency !== 'IDR' &&
            <>
              {rate && <Cell title={rateTitle} value={'IDR' + ' ' + rate} />}
              {idrValue && <Cell title={totalTitle} value={'IDR' + ' ' + idrValue} />}
            </>
          }
        </>
      );

    default:
      return (
        <>
          <Cell
            title={valueTitle}
            value={
              checkboxChecked === undefined ?
                (currency !== null ? currency + ' ' + value : '-') :
                (
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                    <Checkbox
                      checked={Boolean(checkboxChecked)}
                      disabled
                      sx={{
                        '&.Mui-checked.Mui-disabled': {
                          color: theme.palette.grey[400],
                        },
                        '&.Mui-disabled': {
                          color: theme.palette.grey[400],
                        },
                      }}
                    />
                    <span>{currency !== null ? currency + ' ' + value : '-'}</span>
                  </Box>
                )
            }
          />
          {currency !== 'IDR' &&
            <>
              {rate && <Cell title={rateTitle} value={rate !== null ? 'IDR' + ' ' + rate : null} />}
              {totalTitle && <Cell title={totalTitle} value={idrValue !== null ? 'IDR' + ' ' + idrValue : null} />}
            </>
          }
        </>
      );
  }

};

export default CurrencyCell;
