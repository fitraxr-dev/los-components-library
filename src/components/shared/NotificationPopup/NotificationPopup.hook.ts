import { useEffect, useState } from 'react';

import useApp from '@/hooks/useApp';

import useEditIsSeenNotification from './hooks/useEditIsSeenNotification';
import useGetNotificationList from './hooks/useGetNotificationList';


type NotificationItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  status: string;
  isNew: boolean;
};

const useNotificationPopup = () => {
  const [data, setData] = useState<NotificationItem[]>([]);

  const [state] = useApp();
  const userId = state.userData?.user?.userId || '';
  const [unseenCount, setUnseenCount] = useState<number>(0);

  const { data: apiData, isLoading } = useGetNotificationList({
    filter: { userId: userId },
    page: {
      itemPerPage: 10,
      noPage: 0,
    },
  });

  const { mutate: updateSeen } = useEditIsSeenNotification();

  // transform api response -> state
  useEffect(() => {
    if (apiData?.contents) {

      const mapped = apiData.contents.map((item: any) => {
        const [year, month, day, hour, minute] = item.createdDate;
        const created = new Date(year, month - 1, day, hour, minute);

        return {
          date: created.toLocaleDateString('id-ID'), // "22/8/2025"
          description: item.messageContent,
          id: item.id,
          isNew: !item.isSeen,
          time: created.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), // "11:08"
          title: item.messageSubject,
        } as NotificationItem;
      });

      setData(mapped);

      // Ambil 5 teratas yang masih isNew untuk update isSeen
      const unseenIds = mapped
        .slice(0, 5)
        .filter((item) => item.isNew)
        .map((item) => item.id);

      if (unseenIds.length > 0) {
        updateSeen({ receiverIds: unseenIds });
        // console.log('id isSeen: ', unseenIds);
      }
    }
  }, [apiData]);

  return {
    data,
    setData,
    unseenCount,
  };
};
export default useNotificationPopup;
