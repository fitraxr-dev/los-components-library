'use client';
import React, { useState } from 'react';


import NiceModal from '@ebay/nice-modal-react';
import {
  Avatar,
  IconButton,
  Popover,
  styled,
  useTheme,
} from '@mui/material';
import Link from 'next/link';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { toCurrentDate, toDaysDateString } from '@/helpers/date';
import useLogout from '@/hooks/useLogout';
import useRecordLog from '@/hooks/useRecordLog';
import Logo from '@/public/images/logo.png';


import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import NotificationPopup from '@/components/shared/NotificationPopup';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useHeader from './hooks/useHeader.hook';

import type { HeaderProps } from '../MUI.types';
import type { TextVariant } from '@/types/TextVariant';
import type { TextWeight } from '@/types/TextWeight';


const Header = ({
  username,
  profilePicture,
}: HeaderProps) => {
  const theme = useTheme();
  const { onLogout } = useLogout();
  const { recordActivity } = useRecordLog();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<HTMLElement | null>(null);

  const {
    userList,
    selectedUserId,
    handleUserSwitch,
    isReloginLoading,
    isRelogin,
  } = useHeader();


  const styHeader = {
    backgroundColor: theme.palette.primary.main,
    logoutFontColor: theme.palette.common.white,
    titleFontColor: theme.palette.common.white,
    titleFontVariant: 'display1',
    titleFontWeight: 700,
    usernameFontColor: theme.palette.common.white,
    usernameFontVariant: 'body2',
    usernameFontWeight: 700,
  };

  const open = Boolean(anchorEl);
  const id = open ? 'change-password-popover' : undefined;
  const dropdownOpen = Boolean(dropdownAnchorEl);
  const dropdownId = dropdownOpen ? 'user-list-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  const handleChangePassword = () => {
    NiceModal.show(MODAL.CHANGE_PASSWORD);
  };

  const handleUserSelect = (userId: string, activeFullname: string) => {
    handleUserSwitch(userId, activeFullname);
    handleDropdownClose();
  };

  const handleLogout = async () => {
    NiceModal.show('CONFIRM', {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: async () => {
        recordActivity({
          activity: ActivityType.LOGOUT,
          remarks: `User '${username}'logged out successfully`,
        });
        await onLogout();
      },
      title: 'Apakah anda yakin ingin keluar?',
    });
  };

  return (
    <RowWrapper
      sx={{
        backgroundColor: styHeader.backgroundColor,
        boxShadow: 1,
        justifyContent: 'space-between',
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        paddingTop: theme.spacing(3),
        width: '100%',
      }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <RowWrapper sx={{ alignItems: 'center' }}>
          <LogoImg src={Logo.src} alt="Logo" />
          <TextStyle
            variant={styHeader.titleFontVariant as TextVariant}
            weight={styHeader.titleFontWeight as TextWeight}
            color={styHeader.titleFontColor}
          >
            NEW LOS
          </TextStyle>
        </RowWrapper>
      </Link>
      <RowWrapper sx={{ alignItems: 'center' }}>
        <ColumnWrapper sx={{ alignItems: 'end', mr: theme.spacing(2) }}>
          <TextStyle
            variant={styHeader.usernameFontVariant as TextVariant}
            weight={styHeader.usernameFontWeight as TextWeight}
            color={styHeader.usernameFontColor}
          >
            {username}
          </TextStyle>
          <TextStyle variant="body4" color={styHeader.usernameFontColor}>
            {toDaysDateString(toCurrentDate())}
          </TextStyle>
        </ColumnWrapper>
        {isRelogin ? (
          <RowWrapper
            sx={{
              alignItems: 'center',
              backgroundColor: '#638FB1',
              border: `2px solid ${theme.palette.primary.light}`,
              borderRadius: '24px',
              gap: theme.spacing(0),
              padding: theme.spacing(0.00),
            }}
          >
            <CustomAvatar
              alt="Avatar"
              sx={{
                cursor: 'pointer',
                height: theme.spacing(6),
                width: theme.spacing(6),
              }}
              src={profilePicture}
              onClick={handleClick}
            >
              {username[0]}
            </CustomAvatar>
            <IconButton
              onClick={handleDropdownClick}
              disabled={isReloginLoading}
              sx={{
                '&:disabled': {
                  opacity: 0.5,
                },
                color: theme.palette.common.white,
                pl: theme.spacing(0.5),
                pr: theme.spacing(1),
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: theme.transitions.create(['transform'], {
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              <Icon
                iconName="chevron-down"
                textVariant="body1"
                sx={{
                  path: {
                    stroke: theme.palette.common.white,
                  },
                }}
              />
            </IconButton>
          </RowWrapper>
        ) : (
          <CustomAvatar
            alt="Avatar"
            sx={{
              cursor: 'pointer',
              height: theme.spacing(6),
              width: theme.spacing(6),
            }}
            src={profilePicture}
            onClick={handleClick}
          >
            {username[0]}
          </CustomAvatar>
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          sx={{
            '& > .MuiPaper-root': {
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              gap: '1vw',
              height: '3.5vw',
              justifyContent: 'center',
              marginLeft: '1.3vw',
              marginTop: '1vw',
              overflow: 'visible',
              paddingLeft: '1vw',
              paddingRight: '1vw',
            },
            '& > .MuiPaper-root::before': {
              // borderBottom: '8px solid white',
              // borderLeft: '6px solid transparent',
              // border: '8px',
              // borderRight: '6px solid transparent',
              // borderTop: '10px solid transparent',
              content: 'url(/icons/pointer.svg)',
              position: 'absolute !important',
              right: '0.8vw',
              top: '-1vw',
              zIndex: 99999,
            },
          }}
          onClose={() => setAnchorEl(null)}
          slotProps={{ root: { onClick: handleChangePassword } }}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}

        >
          <Icon
            textVariant="body1"
            iconName="password-check"
          />
          <TextStyle
            variant="body4"
            color={theme.palette.common.black}
          >
            Ubah Password
          </TextStyle>
        </Popover>
        <Popover
          id={dropdownId}
          open={dropdownOpen}
          anchorEl={dropdownAnchorEl}
          onClose={handleDropdownClose}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom',
          }}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
          sx={{
            '& > .MuiPaper-root': {
              border: `1.4px solid ${theme.palette.primary.main}`,
              borderRadius: '12px',
              marginTop: '0.8vw',
              minWidth: '20vw',
            },
          }}
        >
          <ColumnWrapper sx={{ gap: theme.spacing(1), p: theme.spacing(2) }}>
            {userList.map((user, index) => (
              <ColumnWrapper
                key={user.id}
                onClick={() => !isReloginLoading && handleUserSelect?.(user.id, user?.fullName)}
                sx={{
                  '&:hover': {
                    opacity: 0.8,
                  },
                  backgroundColor:
                    user.id === selectedUserId
                      ? theme.palette.primary.main
                      : theme.palette.grey[200],
                  borderRadius: '8px',
                  cursor: isReloginLoading ? 'not-allowed' : 'pointer',
                  opacity: isReloginLoading ? 0.7 : 1,
                  p: theme.spacing(2),
                  position: 'relative',
                  transition: theme.transitions.create(['background-color', 'opacity'], {
                    duration: theme.transitions.duration.short,
                  }),
                }}
              >
                {isReloginLoading && user.id !== selectedUserId && (
                  <Icon
                    iconName="loader"
                    textVariant="body2"
                    sx={{
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                      animation: 'spin 1s linear infinite',
                      position: 'absolute',
                      right: theme.spacing(1),
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                )}

                <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <TextStyle
                    variant="body2"
                    weight={700}
                    color={
                      user.id === selectedUserId
                        ? theme.palette.common.white
                        : theme.palette.common.black
                    }
                  >
                    {user.name}
                  </TextStyle>
                </RowWrapper>

                <TextStyle
                  variant="body4"
                  color={
                    user.id === selectedUserId
                      ? theme.palette.common.white
                      : theme.palette.common.black
                  }
                >
                  {user.role} - {user.division}
                </TextStyle>
              </ColumnWrapper>
            ))}
          </ColumnWrapper>
        </Popover>

        <NotificationPopup />
        <RowWrapper sx={{ alignItems: 'center', borderLeft: '1px solid white' }}>
          <IconButton
            onClick={handleLogout}
            sx={{ ml: theme.spacing(1), mr: theme.spacing(1) }}
          >
            <Icon
              iconName="logout"
              textVariant="title1"
              sx={{
                marginRight: theme.spacing(2),
                path: {
                  stroke: theme.palette.common.white,
                },
              }}
            />
            <TextStyle
              color={styHeader.logoutFontColor}
              variant="body4"
              fontWeight={400}
            >
              Logout
            </TextStyle>
          </IconButton>
        </RowWrapper>
      </RowWrapper>
    </RowWrapper>
  );
};

const CustomAvatar = styled(Avatar)(({ theme }) => ({
  height: theme.spacing(8),
  transition: theme.transitions.create(['max-width'], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  width: theme.spacing(8),
}));

const LogoImg = styled('img')(({ theme }) => ({
  height: 'auto',
  marginRight: theme.spacing(2),
  width: '3vw',
}));

export default Header;
