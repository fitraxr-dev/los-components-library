'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import { maintenanceGroup } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import useDebtorDetail from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useDebtorDetail';
import useGetGroupById from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useGetGroupById';
import useGetMemberInformation from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useGetMemberInformation';
import useGetSubmissionData from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useGetSubmissionList';
import useSaveMemberInformation from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useSaveMemberInformation';
import TextStyle from '@/components/shared/TextStyle';

import useGetIndividualDetail from '../../../hooks/useGetBmpkIndividu';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useMemberInformationDetail = (onSaveSuccess?: () => void) => {
  const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();
  const router = useCustomRouter();
  const searchParams = useSearchParams();
  const [currentPositionForm] = useSessionStorage('maintenance-group-session-page', null);
  const isEditMode = currentPositionForm === 'edit';

  // Check if user comes from approval status based on path
  const pathname = window.location.pathname;
  const fromApprovalStatus = pathname.includes('/MG-') || pathname.includes('/PIPE-') || pathname.includes('/BAR-');

  const { data: debtorDetail, isLoading: loadDetailDebtor } = useDebtorDetail({ debtorId: memberId });

  const { data: groupDetail } = useGetGroupById({
    id: groupId,
  });

  const bucketProcessId = groupDetail?.data?.content?.bucketProcessId;
  const groupCode = groupDetail?.data?.content?.groupCode;

  // Get submission data and stepper data to determine final status
  const { data: submissionListData } = useGetSubmissionData({
    filter: {
      sectors: [],
      statuses: [],
    } as any,
    page: {
      itemPerPage: 50,
      noPage: 1,
    },
    searchDetail: {
      key: '',
      value: '',
    },
    sortList: {},
  });

  const submissionItem = fromApprovalStatus ? submissionListData?.contents?.find(
    (item) => item.bucketProcessId === bucketProcessId
  ) : null;
  const status = submissionItem?.status || '';

  const { data: bucketStepperData } = useGetBucketStepper({
    bucketProcessId: bucketProcessId || '',
    module: 'MG',
    process: 'MG',
  }, {
    enabled: !!bucketProcessId,
  });

  const stepperStatus = bucketStepperData?.from || '';
  const finalStatus = status || stepperStatus || '';
  const normalizedFinalStatus = finalStatus?.toUpperCase?.().replace(/\s+/g, '_');

  const [pageBmpk, setPageBmpk] = useState(1);
  const [pageSizeBmpk, setPageSizeBmpk] = useState(5);
  const [filterBmpk, setFilterBmpk] = useSessionStorage('filter-bmpk-member-information', null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});

  const { recordActivity } = useRecordLog();
  const hasLoggedDebtorView = useRef(false);
  const hasLoggedBmpkView = useRef(false);

  const memberInfoParams = {
    ...((fromApprovalStatus || finalStatus?.toUpperCase?.() === 'DRAFT') && ((bucketProcessId && bucketProcessId.startsWith('MG-')) || (bucketProcessId && bucketProcessId.startsWith('PIPE-')) || (bucketProcessId && bucketProcessId.startsWith('BAR-'))) ? { bucketProcessId } : {}),
    debtorCode: memberId,
    groupId: groupCode,
  };


  const { data: memberInformation, isLoading: isLoadingMemberInfo } = useGetMemberInformation(memberInfoParams);

  const { saveMemberInfo, isSaving } = useSaveMemberInformation();

  const { data: bmpkList, isLoading: isLoadingBmpk } = useGetIndividualDetail({
    filter: {
      debtorId: memberId,
      ...filterBmpk?.filter,
      lastResult: filterBmpk?.filter?.lastResult === 'yes' ? true : filterBmpk?.filter?.lastResult === 'no' ? false : null,
    },
    page: {
      itemPerPage: pageSizeBmpk,
      noPage: pageBmpk,
    },
    searchDetail: filterBmpk?.searchDetail ?? { key: '', value: '' },
    sortList: filterBmpk?.sortList ?? undefined,
  });

  const { data: searchByOptionsBmpk } = useGetParameterList('searchByMaintenanceGroupBmpp');
  const { data: sortDropdownListBmpk = []} = useGetParameterList('sortByMaintenanceGroupBmpp');

  const sortDropdownMelampauiBmpk = [
    { label: 'Ya', value: 'yes' },
    { label: 'Tidak', value: 'no' }
  ];

  const filterDropdownListBmpk = searchByOptionsBmpk;

  const filterContentListBmpk = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortDropdownListBmpk,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Data as of',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'lastResult',
      label: 'Melampaui BMPK/BMPD/BMPP Group',
      options: sortDropdownMelampauiBmpk,
      type: 'dropdown',
    },
  ];

  const dataAsOfDateBmpk = useMemo(() => {
    const lastUpdated = bmpkList?.additionalData?.lastUpdate;
    if (!lastUpdated) return '-';

    const date = new Date(lastUpdated);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];

    return `${day} ${monthNames[date.getUTCMonth()]} ${year} ${hours}:${minutes}:${seconds}`;
  }, [bmpkList]);

  const [state] = useApp();
  const isRM = state.currentRole.includes(roles.RM);
  const isSuperAdminMaker = state.currentRole.includes(roles.MAKER);
  const isTL = state.currentRole.includes(roles.TL);
  const isKadiv = state.currentRole.includes(roles.KADIV);

  const isFieldDisabled = useMemo(() => {
    const disabledStatuses = [
      'WAITING_APPROVAL_TL',
      'WAITING_APPROVAL_KADIV',
      'WAITING_APPROVAL_CHECKER',
      'REJECTED',
      'CANCELED',
      'COMPLETED'
    ];

    return fromApprovalStatus && disabledStatuses.includes(normalizedFinalStatus);
  }, [fromApprovalStatus, normalizedFinalStatus]);

  // Function to determine field styling based on member information changes
  const getFieldStyle = (fieldName: string) => {
    // Only apply styling when TL/Kadiv is viewing and there are changes
    const shouldShowChanges = (isTL || isKadiv) && memberInformation?.data?.content;

    if (!shouldShowChanges) {
      return {};
    }

    const content = memberInformation.data.content as any;
    const fieldsSetTrue = content.fieldsSetTrue || [];
    const fieldsSetFalse = content.fieldsSetFalse || [];
    const remarkChanged = content.remarkChanged;

    // Check if field has changes
    if (fieldName === 'remark' && remarkChanged) {
      return { backgroundColor: '#fff3cd' }; // Light yellow for changed remark
    }

    if (fieldsSetTrue.includes(fieldName)) {
      return { backgroundColor: '#e8f5e8' }; // Light green for fields set to true
    }

    if (fieldsSetFalse.includes(fieldName)) {
      return { backgroundColor: '#f8d7da' }; // Light red for fields set to false
    }

    return {};
  };

  useEffect(() => {
    setPageBmpk(1);
  }, [filterBmpk]);

  useEffect(() => {
    if (debtorDetail && !loadDetailDebtor && !hasLoggedDebtorView.current) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || groupCode || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: `viewed debtor detail for member ${memberId} (${debtorDetail?.data?.content?.name || 'Unknown'})`,
      });

      hasLoggedDebtorView.current = true;
    }
  }, [debtorDetail, loadDetailDebtor, bucketProcessId, groupCode, memberId, recordActivity]);

  useEffect(() => {
    if (bmpkList && !isLoadingBmpk && !hasLoggedBmpkView.current) {
      const bmpkCount = bmpkList?.contents?.length || 0;
      const hasExceededLimit = bmpkList?.contents?.some((item: any) =>
        item.percentage > item.percentageThreshold
      ) || false;

      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || groupCode || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: `viewed BMPK individual detail for member ${memberId} with ${bmpkCount} calculation(s)${hasExceededLimit ? ' (has exceeded limit)' : ''}`,
      });

      hasLoggedBmpkView.current = true;
    }
  }, [bmpkList, isLoadingBmpk, bucketProcessId, groupCode, memberId, recordActivity]);

  useEffect(() => {
    hasLoggedBmpkView.current = false;
  }, [memberId, filterBmpk]);

  const onSubmit = async (data: any) => {
    const formData = {
      bucketProcessId: bucketProcessId,
      checkBox1: !!data.hasFinancialDependency,
      checkBox2: !!data.hasSharedDirectors,
      checkBox3: !!data.isControlledBySameParty,
      checkBox4: !!data.isControllingOther,
      checkBox5: !!data.isGuarantorForOther,
      debtorCode: memberId,
      groupId: groupCode,
      hasFinancialDependency: !!data.hasFinancialDependency,
      hasSharedDirectors: !!data.hasSharedDirectors,
      initialValues: initialFormValues,
      isControlledBySameParty: !!data.isControlledBySameParty,
      isControllingOther: !!data.isControllingOther,
      isGuarantorForOther: !!data.isGuarantorForOther,
      remark: data.remark || '',
    };

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        saveMemberInfo(formData);
        setIsFormDirty(false);
        setInitialFormValues(data);
        onSaveSuccess?.();
      },
      submitText: 'Ya',
      title: 'Pastikan Data Sudah Sesuai',
      type: 'warning',
    });
  };

  const tableHeaderBMPK: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'description',
      label: 'Melampaui BMPK/BMPD/BMPP Group',
      render(row) {
        const description = row?.description;
        return (
          <TextStyle variant="body4">
            {!description || description.trim() === '' ? '-' : description}
          </TextStyle>
        );
      },
      sx: { minWidth: '10vw' },
    },
    {
      key: 'percentage',
      label: 'Persentase',
      render(row) {
        return (
          <TextStyle variant="body4">
            {`${Number(row?.percentage).toFixed(0)}% of ${Number(row?.percentageThreshold).toFixed(0)}%`}
          </TextStyle>
        );
      },
      sx: { minWidth: '10vw' },
    },
    {
      key: 'lastModified',
      label: 'Data as of',
      render(row) {
        const lastModified = row?.lastModified;
        if (!lastModified) return '-';

        const date = new Date(lastModified);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');

        const monthNames = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember'
        ];

        return (
          <TextStyle variant="body4">
            {`${day} ${monthNames[date.getUTCMonth()]} ${year} ${hours}:${minutes}:${seconds}`}
          </TextStyle>
        );
      },
      sx: { minWidth: '10vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            const path = replacePath(maintenanceGroup.BMPK_DETAIL_PAGE, {
              calculationId: data.id || data.calculationId,
              groupId,
              memberId,
            });
            router.push(path);
          },
        },
      ],
      type: 'action',
    },
  ];

  return {
    bmpkList,
    dataAsOfDateBmpk,
    debtorDetail,
    filterBmpk,
    filterContentListBmpk,
    filterDropdownListBmpk,
    finalStatus,
    getFieldStyle,
    groupId,
    initialFormValues,
    isFieldDisabled,
    isFormDirty,
    isLoadingBmpk,
    isLoadingMemberInfo,
    isRM,
    isSaving,
    isSuperAdminMaker,
    loadDetailDebtor,
    memberId,
    memberInformation,
    normalizedFinalStatus,
    onSubmit,
    pageBmpk,
    setFilterBmpk,
    setInitialFormValues,
    setIsFormDirty,
    setPageBmpk,
    setPageSizeBmpk,
    tableHeaderBMPK,
  };
};

export default useMemberInformationDetail;
