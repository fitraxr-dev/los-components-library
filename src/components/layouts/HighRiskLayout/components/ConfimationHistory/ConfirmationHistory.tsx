import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useConfirmationHistory from './ConfirmationHistory.hook';


const ConfirmationHistory = () => {
  const {
    confirmationResult,
    handleConfirmHistory,
    isLoading,
  } = useConfirmationHistory();

  if (confirmationResult !== null) {
    return (
      <RowWrapper
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        mb={2}
        sx={{ backgroundColor: '#fffce4', padding: 2 }}
      >
        <RowWrapper gap={1}>
          <Icon
            textVariant="body1"
            iconName="warning-2"
          />
          <TextStyle>
            Data bisnis telah mengalami perubahan. Apakah Anda ingin mengambil perubahan terbaru? Mohon konfirmasi.
          </TextStyle>
        </RowWrapper>
        <RowWrapper gap={1}>
          <Button
            variant="outlined"
            sx={{ padding: 1 }}
            onClick={() => handleConfirmHistory(false)}
            isLoading={isLoading}
          >
            Tidak
          </Button>
          <Button
            sx={{ padding: 1 }}
            onClick={() => handleConfirmHistory(true)}
            isLoading={isLoading}
          >
            Ya
          </Button>
        </RowWrapper>
      </RowWrapper>
    );
  }

  return null;
};

export default ConfirmationHistory;
