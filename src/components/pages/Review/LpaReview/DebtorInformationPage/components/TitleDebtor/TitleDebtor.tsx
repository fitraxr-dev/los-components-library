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
    checkBtn,
    isValidateSuccess,
    processModule,
    validateResult,
  } = useTitleDebtor();

  return (
    <>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <RowWrapper gap={2}>
          <Title title="Informasi Customer" />
          {isValidateSuccess && validateResult?.content?.invalid && (
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
        <RowWrapper>
          {checkBtn()?.length > 0 && checkBtn().map((el) => (
            <Button
              key={el.label}
              sx={{ ml: 2, px: 4, py: 1.5 }}
              startIcon={el?.iconName}
              onClick={el.onClick ?? null}
              isLoading={el.isLoading}
              {...(el.disabled && { disabled: true })}
              color={el.color}
            >
              {el.label}
            </Button>
          ))}
        </RowWrapper>
      </RowWrapper>

      {isValidateSuccess && validateResult?.content?.invalid && (
        <RowWrapper alignItems="center" gap={1}>
          <Icon iconName="information-shape" />
          <TextStyle variant="body7" color={theme.palette.primary.main}>
            Untuk mengubah Data Customer  silakan ke Maintenance Data
          </TextStyle>
        </RowWrapper>
      )}
    </>
  );
};

export default TitleDebtor;
