import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { MAX_STEP_PERCENTAGE, roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { siteVisit } from '@/configs/constants/pathname';
import { SITEVISIT_STATUS } from '@/configs/constants/siteVisit';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteSiteVisitDetail from '../shared/hooks/useDeleteSiteVisitDetail';
import useGenerateVisitCode from '../shared/hooks/useGenerateVisitCode';
import useGetSiteVisitSelectedList from '../shared/hooks/useGetSiteVisitSelectedList';
import useSiteVisitContext from '../shared/hooks/useSiteVisitContext';
import useSubmitSiteVisit from '../shared/hooks/useSubmitSiteVisit';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ProcessingRequestDto } from '@/services/openapi/site-visit-service';


const extractAddressValue = (field: any): string => {
  if (field && typeof field === 'object' && 'value' in field) {
    return field.value || '';
  }
  return field || '';
};


export const useSiteVisit = (formValues?: any) => {
  const queryClient = useQueryClient();
  const [App] = useApp();
  const [{ currentRole }] = useApp();
  const router = useCustomRouter();
  const { processId } = useParams();
  const path = usePathname();
  const { viewOnly } = useViewOnly();
  const { updateState, siteVisitDetail } = useSiteVisitContext();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const { progress, from: statusForm } = App.stepper;
  const [filter, setFilter] = useSessionStorage('filter-component-sitevisit-selected', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const isTL = currentRole.includes(roles.TL);
  const isChecker = currentRole.includes(roles.CHECKER);
  const isMaker = currentRole.includes(roles.MAKER);
  const submitDisabled = progress < MAX_STEP_PERCENTAGE;
  const [isValidForm, setIsValidForm] = useState(false);

  // Get actions from stepper
  let actions = [];
  const buttons = {};

  if (App.stepper) {
    actions = App.stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  if (!!actions) {
    Object.keys(actions).forEach((key) => {
      buttons[key] = actions[key];
    });
  }

  const { data: debtorInfoDataMaster } = useGetBucketById({
    bucketProcessId: processId as string,
    module: TypeModule.SITE_VISIT,
    process: TypeProcess.SITE_VISIT,
  });

  const { mutate: submitSiteVisit, isPending: isSubmitPending } = useSubmitSiteVisit({
    onError() {
      showNiceModalV2({
        onClose: () => {
          setDirtyMsg(undefined);
        }, type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        type: 'success',
      });

      setTimeout(() => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        closeNiceModal(MODAL.GLOBAL.SUCCESS);
        setDirtyMsg(undefined);
        router.push(siteVisit.LIST_PAGE);
      }, 1000);
    },
  });

  const { data, isFetching: isLoading, refetch } = useGetSiteVisitSelectedList({
    filter: {
      ...filter?.filter,
      bucketProcessId: String(processId),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const { mutate: genVisitCode, data: visitCodeGenerated, isPending } = useGenerateVisitCode({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal generate visit code',
        type: 'error',
      });
    },
  });

  const { mutate: deleteSiteVisit } = useDeleteSiteVisitDetail({
    onError() {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess() {
      setDirtyMsg(undefined);
      setVisibleAdd(false);
      updateState({ siteVisitDetail: undefined });
      refetch();
    },
  });

  const generatedCode = visitCodeGenerated?.data?.content;
  const existingCode = siteVisitDetail?.visitCode;

  const activeVisitCode = existingCode || generatedCode?.visitCode;

  const clientNote = formValues?.clientNote || '';
  const externalNote = formValues?.externalNote || '';
  const surveyorNote = formValues?.surveyorNote || '';
  const remarks = formValues?.remarks || '';
  const evidence = formValues?.evidence || '';
  const startDate = formValues?.startDate || '';
  const endDate = formValues?.endDate || '';
  const reportDate = formValues?.reportDate || '';
  const institutionType = formValues?.institutionType || debtorInfoDataMaster?.institutionType;

  const clientPartyStr = JSON.stringify(formValues?.clientParty ?? []);
  const externalPartyStr = JSON.stringify(formValues?.externalParty ?? []);
  const internalPartyStr = JSON.stringify(formValues?.internalParty ?? []);
  const deletedPartyIdStr = JSON.stringify(formValues?.deletedPartyId ?? []);

  const debtorAddressAddress = formValues?.debtorAddress?.address || '';
  const debtorAddressCity = extractAddressValue(formValues?.debtorAddress?.city);
  const debtorAddressDistrict = extractAddressValue(formValues?.debtorAddress?.district);
  const debtorAddressPostal = formValues?.debtorAddress?.postalCode || '';
  const debtorAddressProvince = extractAddressValue(formValues?.debtorAddress?.province);
  const debtorAddressSub = extractAddressValue(formValues?.debtorAddress?.subDistrict);

  const visitAddressAddress = formValues?.visitAddress?.address || '';
  const visitAddressCity = extractAddressValue(formValues?.visitAddress?.city);
  const visitAddressDistrict = extractAddressValue(formValues?.visitAddress?.district);
  const visitAddressPostal = formValues?.visitAddress?.postalCode || '';
  const visitAddressProvince = extractAddressValue(formValues?.visitAddress?.province);
  const visitAddressSub = extractAddressValue(formValues?.visitAddress?.subDistrict);
  // ─────────────────────────────────────────────────────────────────────────────

  const autoSavePayload = useMemo(() => () => {
    if (!activeVisitCode) {
      return Promise.resolve(null);
    }

    const payload = {
      bucketMasterId: debtorInfoDataMaster?.bucketMaster || siteVisitDetail?.bucketMasterId,
      bucketProcessId: processId as string,
      clientNote,
      clientParty: JSON.parse(clientPartyStr),
      debtorAddress: {
        address: debtorAddressAddress,
        city: debtorAddressCity,
        district: debtorAddressDistrict,
        postalCode: debtorAddressPostal,
        province: debtorAddressProvince,
        subDistrict: debtorAddressSub,
      },
      debtorId: debtorInfoDataMaster?.debtorId || '',
      debtorName: debtorInfoDataMaster?.debtorName || '',
      deletedPartyId: JSON.parse(deletedPartyIdStr),
      endDate,
      evidence,
      externalNote,
      externalParty: JSON.parse(externalPartyStr),
      id: siteVisitDetail?.id || null,
      institutionType,
      internalParty: JSON.parse(internalPartyStr),
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      remarks,
      reportDate,
      startDate,
      surveyorNote,
      visitAddress: {
        address: visitAddressAddress,
        city: visitAddressCity,
        district: visitAddressDistrict,
        postalCode: visitAddressPostal,
        province: visitAddressProvince,
        subDistrict: visitAddressSub,
      },
      visitCode: activeVisitCode,
    };

    return Promise.resolve(payload);
  }, [
    activeVisitCode,
    clientNote,
    clientPartyStr,
    debtorAddressAddress,
    debtorAddressCity,
    debtorAddressDistrict,
    debtorAddressPostal,
    debtorAddressProvince,
    debtorAddressSub,
    debtorInfoDataMaster?.bucketMaster,
    debtorInfoDataMaster?.debtorId,
    debtorInfoDataMaster?.debtorName,
    deletedPartyIdStr,
    endDate,
    evidence,
    externalNote,
    externalPartyStr,
    institutionType,
    internalPartyStr,
    processId,
    remarks,
    reportDate,
    siteVisitDetail?.bucketMasterId,
    siteVisitDetail?.id,
    startDate,
    surveyorNote,
    visitAddressAddress,
    visitAddressCity,
    visitAddressDistrict,
    visitAddressPostal,
    visitAddressProvince,
    visitAddressSub,
  ]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && (visibleAdd || !!siteVisitDetail?.id),
    payload: autoSavePayload,
    url: 'siteVisit.siteVisit.saveVisitLocation',
  });

  const handleGenerateVisitCode = () => {
    genVisitCode({
      bucketProcessId: `${processId}`,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
    });
  };

  const handleClickDetail = (payload) => {
    updateState({
      siteVisitDetail: {
        bucketId: payload.bucketProcessId,
        bucketMasterId: debtorInfoDataMaster?.bucketMaster,
        bucketProcessId: payload.bucketProcessId,
        id: payload.id,
        isFromHistory: payload.isFromHistory,
        isRefina: payload.isRefina,
        masterDebtor: debtorInfoDataMaster,
        module: TypeModule.SITE_VISIT,
        process: TypeProcess.SITE_VISIT,
        visitCode: payload?.visitCode,
      },
    });

    setVisibleAdd(false);
  };

  const handleShowDetailAfterSave = (payload) => {
    const isDataFormHistory = data?.data?.contents?.find((item) => item.id === payload.id)?.isFromHistory;

    updateState({
      siteVisitDetail: {
        bucketId: payload.bucketProcessId,
        bucketMasterId: debtorInfoDataMaster?.bucketMaster,
        bucketProcessId: payload.bucketProcessId,
        id: payload.id,
        isFromHistory: isDataFormHistory,
        isRefina: payload.isRefina,
        masterDebtor: debtorInfoDataMaster,
        module: TypeModule.SITE_VISIT,
        process: TypeProcess.SITE_VISIT,
        visitCode: payload?.visitCode,
      },
    });

    setVisibleAdd(false);
  };

  const visitCode = visitCodeGenerated?.data?.content;
  const tablePage = data?.data?.page?.totalPage;
  const tableDataSelected = data?.data?.contents?.map((data) => ({
    ...data,
    siteVisitLocation: `${data?.province ?? '-'}, ${data?.city ?? '-'}, ${data?.district ?? '-'}, ${data?.subdistrict ?? '-'}`,
  }));

  const dataVisitHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3.6vw' },
      type: 'index',
    },
    {
      key: 'visitCode',
      label: 'ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'startDate',
      label: 'Actual Start Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'endDate',
      label: 'Actual End Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'reportDate',
      label: 'Tanggal Dokumen',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'siteVisitLocation',
      label: 'Lokasi Site Visit',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => { handleClickDetail(data); },
        },
        {
          iconName: 'delete',
          isDisabled: viewOnly || isTL,
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
                deleteSiteVisit({
                  bucketMasterId: debtorInfoDataMaster?.bucketMaster,
                  bucketProcessId: String(processId),
                  module: TypeModule.SITE_VISIT,
                  process: TypeProcess.SITE_VISIT,
                  visitCode: data?.visitCode,
                });
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin menghapus data?',
              type: 'warning',
            });
          },
        },
      ],
      sx: { minWidth: '5.5vw' },
      type: 'action',
    },
  ];

  const updateStatus = async (act: 'SUBMIT' | 'RETURN_TO_STAFF' | 'RETURN_TO_MAKER') => {
    let action: string = act;

    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          setDirtyMsg(undefined);
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          closeNiceModal(MODAL.GLOBAL.SUCCESS);
          const payload: ProcessingRequestDto = {
            action,
            bucketProcessId: `${processId}`,
            comment,
            isRegionalGovern: debtorInfoDataMaster?.isRegionalGovern,
            module: TypeModule.SITE_VISIT,
            process: TypeProcess.SITE_VISIT,
          };

          submitSiteVisit({
            debtorName: debtorInfoDataMaster?.debtorName,
            submitRequestDto: payload,
            submmitRequestDtoPemda: payload,
          });
        },
      },
    );
  };

  const handleDecline = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }) => {
          setDirtyMsg(undefined);
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: ProcessingRequestDto = {
            action: radioValue,
            bucketProcessId: `${processId}`,
            comment,
            module: TypeModule.SITE_VISIT,
            process: TypeProcess.SITE_VISIT,
          };

          submitSiteVisit({
            debtorName: debtorInfoDataMaster?.debtorName,
            submitRequestDto: payload,
            submmitRequestDtoPemda: payload,
          });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: SITEVISIT_STATUS.CANCELED },
          { label: 'Rejected', value: SITEVISIT_STATUS.REJECTED }
        ],
      },
    );
  };

  const onSuccessSave = (data, variables) => {
    closeNiceModal(MODAL.GLOBAL.COMMENT);
    closeNiceModal(MODAL.GLOBAL.SUCCESS);
    setDirtyMsg(undefined);
    setVisibleAdd(false);
    updateState({ siteVisitDetail: undefined });

    handleShowDetailAfterSave({ ...variables, id: data.data.content });

    refetch();
  };

  const warnBeforeLeaving = () => {
    // setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
  };

  useEffect(() => {
    if (!siteVisitDetail && !visibleAdd) {
      setDirtyMsg(undefined);
    }
  }, [siteVisitDetail, visibleAdd]);

  useEffect(() => {
    updateState({ siteVisitDetail: undefined });

  }, []);

  const anomalyRow = (val: any) => {
    if (val.visitCode === siteVisitDetail?.visitCode)
      return { bgcolor: 'rgba(87, 235, 87, 0.2)' };
  };

  return {
    anomalyRow,
    buttons,
    dataVisitHeader,
    dataVisitList: tableDataSelected,
    handleDecline,
    handleGenerateVisitCode,
    isAutoSaveFetching,
    isChecker,
    isLoading,
    isMaker,
    isPending,
    isSubmitPending,
    isTL,
    isValidForm,
    onSuccessSave,
    page,
    queryClient,
    setFilter,
    setIsValidForm,
    setPage,
    setPageSize,
    setVisibleAdd,
    statusForm,
    submitDisabled,
    tablePage,
    updateStatus,
    viewOnly,
    visibleAdd,
    visitCode,
    warnBeforeLeaving,
  };
};
