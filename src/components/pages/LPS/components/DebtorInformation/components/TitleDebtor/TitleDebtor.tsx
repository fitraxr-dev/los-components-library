import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title/Title';

import useTitleDebtor from './TitleDebtor.hook';


type TitleDebtorProps = {
  process: TypeProcess;
}

const TitleDebtor = (
  { process }: TitleDebtorProps
) => {
  const theme = useTheme();
  const {
    handleRouteMaintenanceDebitor,
    isValidateSuccess,
    validateResult,
  } = useTitleDebtor(process);
  return (
    <RowWrapper sx={{ justifyContent: 'space-between' }}>
      <Box>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <RowWrapper gap={2}>
            <Title title="Informasi Customer" />
            {isValidateSuccess && validateResult?.content.invalid && (
              <Tooltip
                title={
                  <Box
                    sx={{
                      margin: '-10px 0 -10px -10px',
                    }}
                  >
                    <TextStyle variant="body6">
                      {parse(validateResult?.content?.result || '')}
                    </TextStyle>
                  </Box>
                }
                placement="right"
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                    },
                  },
                }}
              >
                <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                  <Icon iconName="new-info" />
                </Box>
              </Tooltip>
            )}
          </RowWrapper>
        </RowWrapper>

        {isValidateSuccess && validateResult?.content.invalid && (
          <RowWrapper alignItems="center" gap={1}>
            <Icon iconName="information-shape" />
            <TextStyle
              variant="body7"
              color={theme.palette.primary.main}
              weight={600}
            >
              Untuk mengubah Data Customer silahkan ke Maintenance Data
            </TextStyle>
          </RowWrapper>
        )}
      </Box>
      {(process === TypeProcess.LPS_CORE || process === TypeProcess.LPS_BAST) && (
        <Button startIcon="monitoring" onClick={handleRouteMaintenanceDebitor}>
          Go to Maintenance Customer
        </Button>
      )}
    </RowWrapper>
  );
};

export default TitleDebtor;
