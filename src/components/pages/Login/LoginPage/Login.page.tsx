'use client';
import React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { alpha, useTheme } from '@mui/material';

import { PASSWORD_PAGE } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';
import Logo from '@/public/images/logo.png';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { CreatePasswordModal } from './components/createPassword/CreatePassword.modal';
import { OtpModal } from './components/otp/Otp.modal';
import { MODAL } from './login.constants';
import useLogin from './Login.hook';
import { LogoImg, styBaseContainer, styRowWrapper } from './Login.styles';


const LoginPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const inputColor = theme.palette.common.white;
  const {
    handleLogin,
    masintonChange,
    masintonForm,
    showPasswordField,
    isLoading,
    resetEmail,
  } = useLogin();

  const hideOffScreen = {
    bottom: 0,
    height: '0 !important',
    opacity: 0,
    overflow: 'hidden',
    position: 'fixed',
    right: 0,
    width: '0 !important',
  };

  const {
    username: { value: usernameValue },
    password: { value: passwordValue },
  } = masintonForm;
  console.log('syncprod : 250929-eb52bf724-002');
  return (
    <BaseContainer sx={styBaseContainer}>
      <RowWrapper sx={styRowWrapper}>
        <ColumnWrapper
          sx={{ zIndex: 2 }}
          justifyContent="center"
          p={10}
          gap={3}
        >
          <RowWrapper sx={{ alignItems: 'center', gap: '0.4rem' }}>
            <LogoImg src={Logo.src} alt="Logo" />
            <TextStyle variant="display2" weight={700} color={theme.palette.common.white} sx={{ ml: theme.spacing(3) }}>
              NEW LOS
            </TextStyle>
          </RowWrapper>

          <ColumnWrapper gap={1}>
            <TextStyle variant="title1" weight={300} color={theme.palette.common.white}>
              Welcome To
            </TextStyle>
            <TextStyle variant="display1" weight={700} color={theme.palette.common.white}>
              Loan Origination System
            </TextStyle>
            <TextStyle variant="title1" weight={300} color={theme.palette.common.white}>
              PT Sarana Multi Infrastruktur (Persero)
            </TextStyle>
          </ColumnWrapper>

          <ColumnWrapper gap={2}>
            <Input
              type="text"
              label="Username"
              placeholder="Username"
              topComponent={showPasswordField ?
                <Text
                  labelProps={{ style: { color: theme.palette.custom.lightYellow, cursor: 'pointer' } }}
                  onClick={resetEmail}
                >Change email
                </Text> : null
              }
              value={usernameValue}
              disabled={showPasswordField}
              onChange={(val) => masintonChange('username', val)}
              color={theme.palette.common.white}
              labelProps={{ style: { color: inputColor } }}
              inputProps={showPasswordField ?
                { style: { backgroundColor: alpha(theme.palette.common.white, 0.2) } } : {}
              }
              id="input-username"
              data-testid="input-username"
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') handleLogin();
              }}
            />
            {/* hide input password tanpa hapus dari tree supaya bisa trigger autofill */}
            <Input
              type="password"
              label="Password"
              containerSx={showPasswordField ? {} : hideOffScreen}
              placeholder="Password"
              value={passwordValue}
              onChange={(val) => masintonChange('password', val)}
              labelProps={{ style: { color: inputColor } }}
              color={theme.palette.common.white}
              id="input-password"
              data-testid="input-password"
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') handleLogin();
              }}
            />
            <ColumnWrapper alignItems="center" gap={2}>
              <Button
                id="login-button"
                data-testid="login-button"
                isLoading={isLoading}
                color="white"
                sx={{ width: '15.8vw' }}
                variant="outlined"
                onClick={() => handleLogin()}
              // onClick={() => NiceModal.show(MODAL.OTP)}
              // onClick={() => NiceModal.show(MODAL.CHANGE_PASSWORD)}
              >
                Login
              </Button>
              <TextStyle
                variant="body4"
                color={theme.palette.common.white}
              >
                V.1.3.109
              </TextStyle>
            </ColumnWrapper>

          </ColumnWrapper>
        </ColumnWrapper>
      </RowWrapper>

      <ModalDef
        id={MODAL.OTP}
        component={OtpModal}
      />

      <ModalDef
        id={MODAL.CHANGE_PASSWORD}
        component={CreatePasswordModal}
      />
    </BaseContainer>
  );
};

export default LoginPage;
