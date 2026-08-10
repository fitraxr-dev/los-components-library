'use client';

import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useLogout from '@/hooks/useLogout';
import useRecordLog from '@/hooks/useRecordLog';

import useGetConfirmAccountUpdate from './useGetConfirmAccountUpdate';
import useGetReassignmentDropdownList from './useGetdropdownList';
import useRelogin from './useRelogin';
import useUpdateConfirmAccountUpdate from './useUpdateConfirmAccountUpdate';


const useHeader = () => {
  const { userData } = useIdentity();
  const [isRelogin, setIsRelogin] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const userId = userData?.user?.userId;
  const payload = useMemo(() => ({
    picId: userId,
  }), [userId]);
  const { onLogout } = useLogout();
  const { data, isLoading, error, refetch } = useGetReassignmentDropdownList(payload);
  const { recordActivity } = useRecordLog();
  const [isProcessingSubmit, setIsProcessingSubmit] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const { data: GetConfirmAccount } = useGetConfirmAccountUpdate({
    enabled: !hasShownModal,
  });
  const { mutate: UpdateConfirmAccount } = useUpdateConfirmAccountUpdate();
  const isOnActiveSku = GetConfirmAccount?.isOnActiveSku;
  const isCautionLogoutSeen = GetConfirmAccount?.isCautionLogoutSeen;

  useEffect(() => {
    if (isOnActiveSku && !isCautionLogoutSeen && !isProcessingSubmit && !hasShownModal) {
      setHasShownModal(true);
      setIsProcessingSubmit(true);

      const skuPayload = {
        skuBucketProcessId: GetConfirmAccount?.activeSkuBucketProcessId,
      };

      UpdateConfirmAccount(skuPayload, {
        onError: (error) => {
          console.error('Error mark caution seen:', error);
          setIsProcessingSubmit(false);
          setHasShownModal(false);
        },
        onSuccess: () => {
          console.log('Mark caution seen success');
          setIsProcessingSubmit(false);
          showConfirmAccountUpdate();
        },
      });
    }
  }, [GetConfirmAccount, isOnActiveSku, isCautionLogoutSeen, isProcessingSubmit, hasShownModal]);

  const showConfirmAccountUpdate = async () => {
    NiceModal.show(MODAL.GLOBAL.WARNING, {
      closeText: 'Logout',
      onClose: async () => {
        try {
          recordActivity({
            activity: ActivityType.LOGOUT,
            remarks: 'User logged out successfully after confirming SKU update',
          });

          await onLogout();
        } catch (error) {
          console.error('Error updating confirm account:', error);
        }
      },
      title: 'Mohon Login Kembali Untuk Pengkinian Akun',
    });
  };

  const reloginMutation = useRelogin({
    onError: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
    },
  });

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setIsRelogin(true);

      const originalUser = data.find((item: any) => item.original);
      const activeUserId = sessionStorage.getItem('activeUserId');

      if (activeUserId && data.some((item: any) => item.userId === activeUserId)) {
        setSelectedUserId(activeUserId);
      } else if (originalUser) {
        setSelectedUserId(originalUser.userId);
        sessionStorage.setItem('activeFullname', originalUser.fullName);
        sessionStorage.setItem('activeUserId', originalUser.userId);
      } else {
        setSelectedUserId(data[0].userId);
        sessionStorage.setItem('activeFullname', data[0].fullName);
        sessionStorage.setItem('activeUserId', data[0].userId);
      }
    }
  }, [data]);

  const handleUserSwitch = (targetUserId: string, activedFullname: string) => {
    if (userId && targetUserId !== selectedUserId) {
      setSelectedUserId(targetUserId);
      sessionStorage.setItem('activeUserId', targetUserId);
      sessionStorage.setItem('activeFullname', activedFullname);
      reloginMutation.mutate({
        userId: userId,
        userIdReassignment: targetUserId,
      });
    }
  };

  const userList = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => ({
        division: item.userDivision,
        fullName: item.fullName,
        id: item.userId,
        name: item.fullName,
        original: item.original,
        role: item.userRole,
      }));
    }

    return [];
  }, [data]);

  return {
    GetConfirmAccount,
    data,
    error,
    handleUserSwitch,
    isLoading,
    isRelogin,
    isReloginLoading: reloginMutation.isPending,
    refetch,
    selectedUserId,
    showConfirmAccountUpdate,
    userId,
    userList,
  };
};

export default useHeader;
