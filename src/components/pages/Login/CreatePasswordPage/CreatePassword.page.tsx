'use client';

import { useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useController } from 'react-hook-form';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useCreatePassword from './CreatePassword.hook';
import { LogoImg, styBaseContainer, styRowWrapper } from './CreatePassword.styles';

import type { InputProps } from '@/components/shared/Input/Input.types';
import type { UseControllerProps } from 'react-hook-form';


export const ControlledInput = (props: InputProps & UseControllerProps) => {
  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled,
    ...inputProps
  } = props;
  const { field } = useController({ control, defaultValue, disabled, name, rules, shouldUnregister });

  return (
    <Input
      {...field}
      {...inputProps}
    />
  );
};

const CreatePasswordPage = () => {
  const theme = useTheme();
  const params = useSearchParams();
  const {
    methods,
    isPending,
    onSubmit,
  } = useCreatePassword({ token: params.get('token') });


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
              <Title title="Buat Password" />
            </RowWrapper>
            <ControlledInput
              control={methods.control}
              name="newPassword"
              containerSx={{ marginTop: theme.spacing(4.5) }}
              autoComplete="new-password"
              type="password"
              label="Password Baru"
              placeholder="Password Baru"
              iconColor="black"
            />
            <ColumnWrapper gap={1.5} sx={{ marginTop: theme.spacing(1.5) }}>
              <RowWrapper gap={1} >
                <Icon
                  iconName="tick-circle"
                  sx={{
                    '& *': {
                      stroke:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types?.min ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                    },
                  }}
                />
                <Text
                  labelProps={{ color:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types.min ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                  }}
                >
                  Terdiri dari 12 karakter atau lebih
                </Text>
              </RowWrapper>
              <RowWrapper gap={1}>
                <Icon
                  iconName="tick-circle"
                  sx={{
                    '& *': {
                      stroke:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['lower-upper-case'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                    },
                  }}
                />
                <Text
                  labelProps={{ color:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['lower-upper-case'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                  }}
                >
                  Mengandung huruf besar dan huruf kecil
                </Text>
              </RowWrapper>
              <RowWrapper gap={1}>
                <Icon
                  iconName="tick-circle"

                  sx={{
                    '& *': {
                      stroke:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['number-symbol'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                    },
                  }}
                />
                <Text
                  labelProps={{ color:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['number-symbol'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                  }}
                >
                  Mengandung paling tidak 1 angka atau 1 simbol
                </Text>
              </RowWrapper>
            </ColumnWrapper>
            <ControlledInput
              control={methods.control}
              name="newPasswordConfirm"
              containerSx={{ marginTop: theme.spacing(3) }}
              autoComplete="new-password"
              type="password"
              label="Konfirmasi Password Baru"
              placeholder="Konfirmasi Password Baru"
              iconColor="black"
            />
            <Button
              id="login-button"
              disabled={!methods.formState.isValid}
              data-testid="login-button"
              isLoading={isPending}
              onClick={methods.handleSubmit(onSubmit)}
              sx={{
                '&': {
                  marginTop: theme.spacing(3),
                },
              }}
            >
              Login
            </Button>
          </ColumnWrapper>
        </BaseContainer>
      </ColumnWrapper>
    </BaseContainer>
  );
};

export default CreatePasswordPage;
