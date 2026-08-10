import { Box, Tooltip, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title/Title';

import useTitleDebtor from './TitleDebtor.hook';


const TitleDebtor = () => {
  const theme = useTheme();

  const {
    handleRerouteViewMIP,
    handleRerouteViewMIPReview,
    isFetching,
    isValidateSuccess,
    isShowMipReview,
    validateResult,
  } = useTitleDebtor();

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
          <RowWrapper alignItems="center" gap={1} sx={{ mt: 1 }}>
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
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          startIcon="monitor"
          onClick={handleRerouteViewMIP}
          disabled={isFetching}
          isLoading={isFetching}
        >
          View MIP
        </Button>
        {isShowMipReview &&
          <Button
            startIcon="monitor"
            onClick={handleRerouteViewMIPReview}
            disabled={isFetching}
            isLoading={isFetching}
          >
            View MIP Review
          </Button>
        }
      </Box>
    </RowWrapper>
  );
};

export default TitleDebtor;
