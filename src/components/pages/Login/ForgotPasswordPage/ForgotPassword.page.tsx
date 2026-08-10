'use client';

import { useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import { ControlledInput } from '../CreatePasswordPage/CreatePassword.page';

import useForgotPassword from './ForgotPassword.hook';
import { LogoImg, styBaseContainer, styRowWrapper } from './ForgotPassword.styles';


const ForgotPasswordPage = () => {
  const theme = useTheme();
  const params = useSearchParams();
  const {
    methods,
    isPending,
    onSubmit,
  } = useForgotPassword({ token: params.get('accessToken') });


  // watch validation for react-hook-form rerender

  console.log('methods', methods.formState.errors);

  return (
    <BaseContainer sx={styBaseContainer}>
      <ColumnWrapper
        sx={{ zIndex: 2 }}
        justifyContent="center"
      >
        <RowWrapper >
          <BackButton handleClick={() => {}} />
        </RowWrapper>
        <BaseContainer
          sx={{ borderRadius: theme.spacing(2.5),
            paddingBottom: theme.spacing(6),
            paddingLeft: theme.spacing(6),
            paddingRight: theme.spacing(6),
            paddingTop: theme.spacing(6),
          }}
        >
          <ColumnWrapper >
            <RowWrapper sx={{ }} justifyContent="center" alignItems="center">
              <Title title="Lupa Password" />
            </RowWrapper>

            <TextStyle sx={{ textAlign: 'center' }}>
              Email digunakan untuk konfirmasi reset Password
            </TextStyle>

            <ControlledInput
              control={methods.control}
              name="email"
              containerSx={{ marginTop: theme.spacing(4.5) }}
              type="text"
              label="Username"
              placeholder="example@email.com"
            />
            <Button
              id="forgot-password-button"
              disabled={!methods.formState.isValid}
              data-testid="forgot-password-button"
              isLoading={isPending}
              onClick={methods.handleSubmit(onSubmit)}
              sx={{
                '&': {
                  marginTop: theme.spacing(3),
                },
              }}
            >
              Submit
            </Button>
          </ColumnWrapper>
        </BaseContainer>
      </ColumnWrapper>
    </BaseContainer>
  );
};

export default ForgotPasswordPage;
