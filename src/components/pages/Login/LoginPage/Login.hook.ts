'use client';
import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useSearchParams } from 'next/navigation';

import { HOME_PAGE, PASSWORD_PAGE } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useMasintonForm from '@/hooks/useMasintonForm';
import useRecordLog from '@/hooks/useRecordLog';
import login from '@/services/api/auth/login';
import loginWithToken from '@/services/api/auth/loginWithToken';

import { reducer } from '@/components/layouts/AppLayout/App.constants';

import { MODAL } from './login.constants';
import { formData } from './Login.form';

import type { LoginResponseDto, OtpResponseDto } from '@/services/openapi/auth-service';


interface IpWhoData {
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: {
    time_zone?: string;
  };
}

const useLogin = () => {
  const { masintonForm, masintonChange } = useMasintonForm(formData);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ipWhoData, setIpWhoData] = useState<IpWhoData | null>(null);
  const params = useSearchParams();
  const [_, dispatch] = useApp();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const fetchIpWhoData = async () => {
    try {
      const response = await fetch('https://api.ipwho.org/me');
      const data = await response.json();
      if (data.success && data.data) {
        setIpWhoData({
          city: data.data.city,
          country: data.data.country,
          ip: data.data.ip,
          region: data.data.region,
          timezone: data.data.timezone,
        });
      }
    } catch (error) {
      console.error('Failed to fetch IP data:', error);
    }
  };

  // useEffect(() => {
  //   fetchIpWhoData();
  // }, []);

  const getLocationString = (): string => {
    if (!ipWhoData) return '';
    const parts = [];
    if (ipWhoData.ip) parts.push(`IP: ${ipWhoData.ip}`);
    if (ipWhoData.city) parts.push(`City: ${ipWhoData.city}`);
    if (ipWhoData.region) parts.push(`Region: ${ipWhoData.region}`);
    if (ipWhoData.country) parts.push(`Country: ${ipWhoData.country}`);
    // console.log(parts.length > 0 ? ` (${parts.join(', ')})` : '');
    return '';
    // return parts.length > 0 ? ` (${parts.join(', ')})` : '';
  };

  useMemo(async () => {
    if (params?.get('success') === 'true' && params?.get('accessToken')) {
      setIsLoading(true);
      loginWithToken({ token: params?.get('accessToken') }).then(async (response) => {
        setIsLoading(false);
        await setUserdataAndLogin(response);
      }).catch(async (error) => {
        setIsLoading(false);
        await recordActivity({
          activity: ActivityType.LOGIN,
          changeAfter: `Failed to login${getLocationString()}`,
          changeBefore: 'Not logged in',
          remarks: `Login attempt failed: ${error.message || 'Unknown error'}`,
        });
        alert(error.message);
      });
    } else if (params?.get('success') === 'false') {
      await recordActivity({
        activity: ActivityType.LOGIN,
        changeAfter: `Failed to login${getLocationString()}`,
        changeBefore: 'Not logged in',
        remarks: `Login attempt failed: ${params?.get('message') || 'Terjadi kesalahan'}`,
      });

      alert(params?.get('message') || 'Terjadi kesalahan');
    }
  }, [params]);

  const onSuccessOtp = (response: OtpResponseDto) => {
    if (response.needChangePassword) {
      router.push(`${PASSWORD_PAGE.CREATE_PAGE}?token=${response.token}`);
    } else {
      router.push(HOME_PAGE);
    }
  };

  const setUserdataAndLogin = async (response) => {
    const profile = { ...response.profile.accessManagementActive, user: {} };
    // TEMPORARY FIX buat compatibility dengan api dulu
    for (const [key, value] of Object.entries(response.profile)) {
      if (profile[key] !== 'accessManagementActive' || profile[key] !== 'accessManagements') {
        profile.user[key] = value;
      }
    }
    const { roleCode } = profile?.userRoleRefactor || {};
    const currentRole = [roleCode];
    const currentPosition = profile?.userPosition?.map((dt) => dt.positionCode);

    // Record login activity
    recordActivity({
      activity: ActivityType.LOGIN,
      changeAfter: `Successfully logged in${getLocationString()}`,
      changeBefore: 'Not logged in',
      remarks: `User ${profile.user.email || profile.user.fullName || 'unknown'} logged in successfully`,
    });

    if (typeof window !== 'undefined') {
      const minuteFromStorage = localStorage.getItem('autosave_minute');
      const value = !!minuteFromStorage ? minuteFromStorage : '20';
      localStorage.setItem('autosave_minute', value);
    }

    dispatch({
      data: { currentPosition, currentRole, userData: profile },
      type: reducer.UPDATE_USER_DATA,
    });
    router.push(HOME_PAGE);
  };

  const resetEmail = () => {
    setShowPasswordField(false);
    masintonChange('username', '');
    masintonChange('password', '');
  };

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const {
      username: { value: username }, password: { value: password },
    } = masintonForm;

    let response: Promise<LoginResponseDto>;
    if (showPasswordField) {
      response = login({ password, username });
    } else {
      response = login({ username });
    }
    response.then(async (val) => {
      if (val.ldap) {
        if (val.otp) {
          router.replace(val.redirectSSO);
        } else {
          await setUserdataAndLogin(val);
        }
      } else if (showPasswordField) {
        if (val.otp) {
          NiceModal.show(MODAL.OTP, {
            email: username,
            onClose: () => { },
            onSuccess: onSuccessOtp,
            token: val.token,
          });
        } else {
          await setUserdataAndLogin(val);
          return;
        }
      } else {
        setShowPasswordField(true);
      }
    }, async (error) => {
      await recordActivity({
        activity: ActivityType.LOGIN,
        changeAfter: `Failed to login for user ${username}${getLocationString()}`,
        changeBefore: 'Not logged in',
        remarks: `Login attempt failed for user ${username}: ${error.message || 'Unknown error'}`,
      });
      alert(error.message);
    }).catch(async (error) => {
      await recordActivity({
        activity: ActivityType.LOGIN,
        changeAfter: `Failed to login for user ${username}${getLocationString()}`,
        changeBefore: 'Not logged in',
        remarks: `Login attempt failed for user ${username}: ${error.message || 'Unknown error'}`,
      });
      alert(error.message);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return {
    handleLogin,
    isLoading,
    masintonChange,
    masintonForm,
    resetEmail,
    showPasswordField,
  };
};

export default useLogin;
