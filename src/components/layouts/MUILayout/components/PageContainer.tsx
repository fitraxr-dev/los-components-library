'use client';
import {
  Backdrop,
  Box,
  CircularProgress,
  styled,
  useTheme,
} from '@mui/material';
import { useIsMutating } from '@tanstack/react-query';

import { shouldShowGlobalLoading } from '@/helpers/mutation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';

import ColumnWrapper from '@/components/shared/ColumnWrapper';

import Header from './Header';
import Sidebar from './Sidebar';

import type { PageContainerProps } from '../MUI.types';


const PageContainer = ({ children, sidebarMenu }: PageContainerProps) => {
  const [state] = useApp();
  const theme = useTheme();
  const router = useCustomRouter();
  const isMutating = useIsMutating({
    predicate: (mutation) => shouldShowGlobalLoading(mutation.options.mutationKey),
  });

  // state.userData.user deprecated
  const username = state.userData?.user.fullName || '';
  const profilePicture = state.userData?.profilePicture;

  const handleSidebarAction = (menu) => {
    if (menu.path) router.push(menu.path);
  };

  return (
    <>
      <Header username={username} profilePicture={profilePicture} />
      <Container>
        <Sidebar sidebarMenu={sidebarMenu} handleAction={handleSidebarAction} />
        <ColumnWrapper
          sx={{
            alignItems: 'start',
            flex: 1,
            minWidth: 0,
            ml: theme.spacing(2),
          }}
        >
          {children}
        </ColumnWrapper>
      </Container>
      {
        isMutating ? (
          <Backdrop
            sx={{
              color: theme.palette.background.default,
              zIndex: (theme) => theme.zIndex.drawer + 99999999,
            }}
            open={!!isMutating}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null
      }
    </>
  );
};

const Container = styled(Box)(({ theme }) => ({
  borderRadius: theme.radius(3),
  display: 'flex',
  flex: 1,
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(2),
}));

export default PageContainer;
