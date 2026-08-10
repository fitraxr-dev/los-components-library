import { useEffect, useRef, useState } from 'react';

import useApp from '@/hooks/useApp';

import useEditIsSeenNotification from '@/components/shared/NotificationPopup/hooks/useEditIsSeenNotification';
import useGetNotificationList from '@/components/shared/NotificationPopup/hooks/useGetNotificationList';


type NotificationItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  status: string;
  isNew: boolean;
};

const toDateFromApi = (createdDate: string | any[]) => {
  if (Array.isArray(createdDate)) {
    const [y, m, d, h = 0, mi = 0, s = 0] = createdDate;
    return new Date(y, m - 1, d, h, mi, s);
  }
  // string ISO: "2025-08-22T11:09:01.840+07:00"
  return new Date(createdDate);
};

const fmtDate = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
});

const fmtTime = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Asia/Jakarta',
});

const useNotificationList = () => {
  const [isClickedPopup, setIsClickedPopup] = useState(false);
  const [data, setData] = useState<NotificationItem[]>([]);
  const seenIdsRef = useRef<Set<number>>(new Set()); // simpan id yang pernah di mark
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [unseenCount, setUnseenCount] = useState<number>(0);


  // buffer batch
  const [pendingSeen, setPendingSeen] = useState<number[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [state] = useApp();
  const userId = state.userData?.user?.userId || '';

  const ITEM_PER_PAGE = 10;

  const { data: apiData, isLoading } = useGetNotificationList({
    filter: { userId: userId },
    page: {
      itemPerPage: ITEM_PER_PAGE,
      noPage: page,
    },
  });

  const { mutate: updateSeen } = useEditIsSeenNotification();

  // transform api response -> state
  useEffect(() => {
    if (apiData?.contents) {
      if (apiData.additionalData?.unseenCount !== undefined) {
        setUnseenCount(apiData.additionalData.unseenCount);
      }
      const mapped = apiData.contents.map((item: any) => {
        const created = toDateFromApi(item.createdDate);
        const itemId = item.receiverId;


        const isAlreadyMarkedSeen = seenIdsRef.current.has(itemId);


        return {
          date: fmtDate.format(created),
          description: item.templateLosMessage,
          id: item.receiverId,
          isNew: isAlreadyMarkedSeen ? false : !item.isSeen,
          time: created.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          title: item.templateLosTitle,
        } as NotificationItem;
      });

      setData((prev) => (page === 0 ? mapped : [...prev, ...mapped]));

      if (mapped.length < ITEM_PER_PAGE) {
        setHasMore(false);
      } }

  }, [apiData, page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // A. Hybrid. awal hit http dan hit websocket kedepannya, listen notifikasi baru via WebSocket
  // useEffect(() => {
  //   const ws = new WebSocket(`wss://your-api-domain/ws/notifications?userId=${userId}`);

  //   ws.onmessage = (event) => {
  //     const raw = JSON.parse(event.data);
  //     const created = toDateFromApi(raw.createdDate);

  //     const newNotification: NotificationItem = {
  //       date: fmtDate.format(created),
  //       description: raw.templateLosMessage,
  //       id: raw.receiverId,
  //       isNew: !raw.isSeen,
  //       status: raw.status ?? '',
  //       time: created.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  //       title: raw.templateLosTitle,
  //     };

  //     setData((prev) => [newNotification, ...prev]);
  //   };

  //   return () => ws.close();
  // }, [userId]);

  // B. pure websocket
  // useEffect(() => {
  //   if (!userId) return;

  //   // misalnya endpoint WS Spring Boot
  //   const ws = new WebSocket(`wss://your-api-domain/ws/notifications?userId=${userId}`);

  //   ws.onopen = () => {
  //     console.log('WebSocket connected for user', userId);
  //   };

  //   ws.onmessage = (event) => {
  //     try {
  //       const payload = JSON.parse(event.data);
  //       const created = new Date(payload.createdDate);

  //       const newNotif: NotificationItem = {
  //         date: fmtDate.format(created),
  //         description: payload.templateLosMessage,
  //         id: payload.receiverId,
  //         isNew: !payload.isSeen,
  //         status: payload.status ?? '',
  //         time: created.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  //         title: payload.templateLosTitle,
  //       };

  //       // prepend ke state lama
  //       setData((prev) => [newNotif, ...prev]);
  //     } catch (err) {
  //       console.error('Failed to parse WS message:', err);
  //     }
  //   };

  //   ws.onclose = () => {
  //     console.log('WebSocket closed');
  //   };

  //   ws.onerror = (err) => {
  //     console.error('WebSocket error:', err);
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, [userId]);

  // jalan saat popup dibuka
  useEffect(() => {
    if (!isClickedPopup) return;
    if (data.length === 0) return;

    // console.log('---isClickedPopup true, auto mark seen 5 pertama');
    const firstVisible = data
      .slice(0, 5)
      .filter((i) => i.isNew && !seenIdsRef.current.has(i.id))
      .map((i) => i.id);

    if (firstVisible.length > 0) {
      firstVisible.forEach((id) => seenIdsRef.current.add(id));

      // Optimistic update
      setData((prev) =>
        prev.map((d) =>
          firstVisible.includes(d.id) ? { ...d, isNew: false } : d
        )
      );

      setPendingSeen((prev) => [...prev, ...firstVisible]);
    }
  }, [isClickedPopup, data]);

  // watcher untuk pendingSeen → kirim batch pakai debounce
  useEffect(() => {
    if (pendingSeen.length === 0) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      const idsToSend = [...pendingSeen];
      setPendingSeen([]);

      try {
        await updateSeen({ receiverIds: idsToSend });
        console.log('Batch update success, id notification:', idsToSend);

        setUnseenCount((prev) => Math.max(0, prev - idsToSend.length));

      } catch (err) {
        console.error('Batch update failed:', err);
        // rollback kalau gagal
        setData((prev) =>
          prev.map((d) =>
            idsToSend.includes(d.id) ? { ...d, isNew: true } : d
          )
        );
        idsToSend.forEach((id) => seenIdsRef.current.delete(id));
      }
    }, 500);
  }, [pendingSeen, updateSeen]);

  // markAsSeen dipanggil dari onVisible
  const markAsSeen = (id: number) => {
    const item = data.find((d) => d.id === id);

    if (item && item.isNew && !seenIdsRef.current.has(id)) {
      // console.log('markAsSeen optimistic: ', id);

      // langsung optimistic update
      seenIdsRef.current.add(id);
      setData((prev) =>
        prev.map((d) => (d.id === id ? { ...d, isNew: false } : d))
      );

      // masukkan ke buffer batch
      setPendingSeen((prev) => [...prev, id]);
    }
  };

  return {
    data,
    hasMore,
    isLoading,
    loadMore,
    markAsSeen,
    setData,
    setIsClickedPopup,
    unseenCount,

  };
};
export default useNotificationList;
