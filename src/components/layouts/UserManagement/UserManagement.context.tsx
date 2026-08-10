'use client';
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';

import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { userManagement } from '@/configs/constants/pathname'; // Impor userManagement untuk path
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';

import useGetApprovalDetail from '@/components/pages/UserManagement/AccessMenu/hooks/useGetApprovalDetail';
import useGetAccessMenuDetail from '@/components/pages/UserManagement/hooks/useGetAccessMenuDetail';
import useGetDetailSubmission from '@/components/pages/UserManagement/UserList/hooks/useGetDetailSubmission';
import useGetDetailUser from '@/components/pages/UserManagement/UserList/hooks/useGetDetailUser';


interface UserManagementContextState {
  currentRole: string[];
  stepper: {
    from: string;
    steps: { urlPath: string; id: string }[];
  };
  actions: any;
  currentModule: TypeModule | undefined;
  currentProcess: TypeProcess | undefined;
  idParams: string;
  isApproval: boolean;
  isKadiv: boolean;
  isStaff: boolean;
  isTL: boolean;
  isWait: boolean;
  editUser: boolean;
  bucketProcessIdForStepper: string | undefined;
  isUserDetailLoading: boolean;
  isDetailReady: boolean;
  setBucketProcessIdForStepper: (newId: string | undefined) => void;
  setIsUserDetailLoading: (isLoading: boolean) => void;
  setIsDetailReady: (isReady: boolean) => void;
}

const initialState: UserManagementContextState = {
  actions: null,
  bucketProcessIdForStepper: undefined,
  currentModule: undefined,
  currentProcess: undefined,
  currentRole: [],
  editUser: false,
  idParams: '',
  isApproval: false,
  isDetailReady: false,
  isKadiv: false,
  isStaff: false,
  isTL: false,
  isUserDetailLoading: false,
  isWait: false,
  setBucketProcessIdForStepper: () => { },
  setIsDetailReady: () => { },
  setIsUserDetailLoading: () => { },
  stepper: { from: '', steps: []},
};

export const UserManagement = createContext<UserManagementContextState>(initialState);

export const UserManagementProvider = ({ children }) => {
  const [bucketProcessIdForStepper, setBucketProcessIdForStepper] = useState<string | undefined>(undefined);
  const [isUserDetailLoading, setIsUserDetailLoading] = useState(false);
  const [isDetailReady, setIsDetailReady] = useState(false);

  const [{ currentRole, stepper }] = useApp();
  const { id }: { id: string } = useParams();
  const pathname = usePathname();

  const isWait = stepper.from === 'WAITING_APPROVAL_CHECKER';
  const isAccessMenu = pathname.includes('access-menu');
  const isUserList = pathname.includes('user-list');
  const isAccessMenuPath = isAccessMenu;
  const isUserListPath = isUserList;

  const isStaff = currentRole.includes(roles.STAFF);
  const isTL = currentRole.includes(roles.TL);
  const isKadiv = currentRole.includes(roles.KADIV);

  const segments = pathname.split('/');
  const getPath = getLastPath(pathname);
  const actions = stepper.steps.find((step) => step.urlPath === getPath);
  const isApproval = id && id.includes('AM-');
  const idParams = id;
  const isHasUMPrefix = !!id && id.includes('UM-');
  const isHasAMPrefix = !!id && id.includes('AM-');
  const editUser = stepper.from === 'DRAFT' || stepper.from === 'RETURN_TO_MAKER' || stepper.from === 'APPROVED' || !isHasAMPrefix && stepper.from === 'CANCELED' || !isHasAMPrefix && stepper.from === 'REJECTED';

  const {
    data: detailSubmission,
    isLoading: isLoadingDetailSubmission,
  } = useGetDetailSubmission({ bucketProcessId: id }, {
    enabled: !!id && id.includes('UM-'),
  });

  const {
    data: detailUser,
    isLoading: isLoadingDetailUser,
  } = useGetDetailUser({ userId: id }, {
    enabled: !!id && !id.includes('UM-'),
  });

  const {
    data: accesMenuDetailData,
    isLoading: isLoadingAccessMenuDetail,
  } = useGetAccessMenuDetail({ id: id }, {
    enabled: !!id && id.includes('AM-'),
  });

  const {
    data: accessMenuApprovalDetailData,
    isLoading: isLoadingAccessMenuApproval,
  } = useGetApprovalDetail({ id: id }, {
    enabled: !!id && !id.includes('AM-'),
  });

  useEffect(() => {
    setIsDetailReady(false);
    setBucketProcessIdForStepper(undefined);
  }, [id]);

  useEffect(() => {
    const getCurrentDataConfig = () => {
      if (isUserListPath && isHasUMPrefix) {
        return {
          data: detailSubmission,
          isLoading: isLoadingDetailSubmission,
        };
      }

      if (isUserListPath && !isHasUMPrefix && !isHasAMPrefix) {
        return {
          data: detailUser,
          isLoading: isLoadingDetailUser,
        };
      }

      if (isAccessMenuPath && !isHasUMPrefix && isHasAMPrefix) {
        return {
          data: accessMenuApprovalDetailData,
          isLoading: isLoadingAccessMenuApproval,
        };
      }

      if (isAccessMenuPath && !isHasUMPrefix && !isHasAMPrefix) {
        return {
          data: accesMenuDetailData,
          isLoading: isLoadingAccessMenuDetail,
        };
      }

      return null;
    };

    const config = getCurrentDataConfig();
    if (!config) return;

    const { data, isLoading } = config;

    if (isLoading) return;
    if (data?.bucketProcessId) {
      setBucketProcessIdForStepper(data.bucketProcessId);
    } else {
      setBucketProcessIdForStepper(undefined);
    }

    setIsDetailReady(true);
  }, [
    id,
    isHasUMPrefix,
    isHasAMPrefix,
    detailUser,
    detailSubmission,
    accesMenuDetailData,
    accessMenuApprovalDetailData,
    isLoadingDetailSubmission,
    isLoadingDetailUser,
    isLoadingAccessMenuDetail,
    isLoadingAccessMenuApproval,
    isUserListPath,
    isAccessMenuPath,
  ]);

  const currentModule = useMemo(() => {
    if (isUserList) return TypeModule.USER_MANAGEMENT;
    if (isAccessMenu) return TypeModule.ACCESS_MENU;
    return undefined;
  }, [isUserList, isAccessMenu]);

  const currentProcess = useMemo(() => {
    if (isUserList) return TypeProcess.USER_MANAGEMENT;
    if (isAccessMenu) return TypeProcess.ACCESS_MENU;
    return undefined;
  }, [isUserList, isAccessMenu]);

  const contextValue = useMemo(() => ({
    actions,
    bucketProcessIdForStepper,
    currentModule,
    currentProcess,
    currentRole,
    editUser,
    idParams,
    isApproval,
    isDetailReady,
    isKadiv,
    isStaff,
    isTL,
    isUserDetailLoading,
    isWait,
    setBucketProcessIdForStepper,
    setIsDetailReady,
    setIsUserDetailLoading,
    stepper,
  }), [
    actions,
    bucketProcessIdForStepper,
    currentModule,
    currentProcess,
    currentRole,
    editUser,
    idParams,
    isApproval,
    isDetailReady,
    isKadiv,
    isStaff,
    isTL,
    isUserDetailLoading,
    isWait,
    stepper,
    setBucketProcessIdForStepper,
    setIsDetailReady,
    setIsUserDetailLoading,
  ]);

  return (
    <UserManagement.Provider value={contextValue}>
      {children}
    </UserManagement.Provider>
  );
};

export const useUserManagementContext = () => {
  const context = useContext(UserManagement);

  if (context === undefined) {
    throw new Error('useUserManagementContext must be used within a UserManagementProvider');
  }
  return context;
};
