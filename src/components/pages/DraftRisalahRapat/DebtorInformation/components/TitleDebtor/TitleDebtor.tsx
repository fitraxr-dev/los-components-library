import { Box, Tooltip } from '@mui/material';
import parse from 'html-react-parser';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title/Title';

import useTitleDebtor from './TitleDebtor.hook';


const TitleDebtor = () => {
  const {
    bucketDataIsLoading,
    handleRerouteViewMUP,
    isValidateSuccess,
    validateResult,
  } = useTitleDebtor();

  return (
    <RowWrapper sx={{ justifyContent: 'space-between' }}>
      <RowWrapper gap={2}>
        <Title title="Informasi Customer" />
        {isValidateSuccess && validateResult?.content.invalid && (
          <Tooltip
            title={
              <Box sx={{ margin: '-10px 0 -10px -10px' }}>
                <TextStyle variant="body6">
                  {parse(validateResult?.content?.result)}
                </TextStyle>
              </Box>
            }
            placement="right"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: 'primary.main',
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
      <Button
        startIcon="monitor"
        onClick={handleRerouteViewMUP}
        isLoading={bucketDataIsLoading}
      >
        View MUP
      </Button>
    </RowWrapper>
  );
};

export default TitleDebtor;
