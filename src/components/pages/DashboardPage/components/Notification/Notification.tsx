import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import useNotificationPopup from '@/components/shared/NotificationPopup/NotificationPopup.hook';
import Title from '@/components/shared/Title';

import NotificationItem from '../NotificationItem';

import useNotificationList from './Notification.hook';


const Notification = () => {
  const theme = useTheme();
  const { data, markAsSeen, loadMore, unseenCount } = useNotificationList();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // jika sudah hampir sampai bawah (50px threshold)
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      loadMore();
    }
  };

  const countIsNew = unseenCount ?? 0;
  const renderNew = countIsNew > 0 ? `(${countIsNew} New)` : '';
  localStorage.setItem('notificationCount', countIsNew.toString());

  return (
    <BaseContainer>
      <Title
        title={`Notification ${renderNew}`}
      />

      {data && data.length > 0 ? (
        <Box
          onScroll={handleScroll}
          sx={{
            maxHeight: theme.spacing(100),
            overflow: 'auto',
          }}
        >
          <ColumnWrapper
            sx={{
              gap: theme.spacing(1),
              marginRight: theme.spacing(2),
            }}
          >
            {data.map((item, index) => (
              <NotificationItem {...item} key={index} onVisible={markAsSeen} />
            ))}

          </ColumnWrapper>
        </Box>
      ) : (
        <Box
          sx={{
            alignSelf: 'center',
            display: 'flex',
            flex: 1,
            margin: theme.spacing(4),
          }}
        >
          <EmptyPlaceholder status="notification" />
        </Box>
      )}
    </BaseContainer>
  );
};
export default Notification;
