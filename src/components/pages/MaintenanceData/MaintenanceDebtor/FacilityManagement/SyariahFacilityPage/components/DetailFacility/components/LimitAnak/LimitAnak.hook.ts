'use client';

import React, { useEffect, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParamComponentSyariah from '@/hooks/services/useGetParamComponentSyariah';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import {
  proyekCellData,
} from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalDetailFacility/ModalDetailFacility.constants';

import useGetChildLimit from '../../../../hooks/useGetChildLimit';
import useGetProjectList from '../../../../hooks/useGetProjectList';
import useGetSyariahDataDeltaChild from '../../../../hooks/useGetSyariahDataDeltaChild';
import useSaveChildLimitSyariah from '../../../../hooks/useSaveChildLimitSyariah';
import useProposedFacilityTab from '../../../ProposedFacilityTab/ProposedFacilityTab.hook';

import type { MappingFormData } from './LimitAnak.constants';


const useLimitAnak = () => {
  const { processId, setFacilityId, facilityId: currentIdentityFacilityId } = useIdentity();
  const { id } = useParams();
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const pathArray = path.split('/');
  const isDetail = pathArray[8]?.includes('detail');
  const isEdit = pathArray[8]?.includes('edit');
  const newFromExisting = searchParams.get('newFromExisting') === 'true';
  const isHidden: boolean = processId?.includes('DEBT');
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const modul = path.split('/')[3];
  const queryClient = useQueryClient();
  const { clearSessionStorage } = useProposedFacilityTab();
  const parentId = sessionStorage.getItem('currentIdLimitInduk');
  const fromLimitInduk = sessionStorage.getItem('currentModeFromLimitInduk');
  const idFacilitySyariah = path.split('/')[7];

  useEffect(() => {
    if (idFacilitySyariah && idFacilitySyariah !== currentIdentityFacilityId) {
      setFacilityId(idFacilitySyariah);
    }
  }, [idFacilitySyariah, setFacilityId, currentIdentityFacilityId]);

  const { recordActivity } = useRecordLog();

  const { data: orderTypeOptions } = useGetParameterList('orderType');
  const { data: mappingProductSyariahOptions } = useGetParameterList('mappingProductSyariah');
  const { data: financingSegmentOptions } = useGetParameterList('financingSegment');
  const { data: floatingReferenceOptions } = useGetParameterList('referensiFloatingTemenos', {
    id: 'key',
    label: 'value1',
  });
  const { data: rateTypeOptions } = useGetParameterList('rateTypeFacility', {
    id: 'key',
    label: 'value1',
  });
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, {
    label: 'value1',
    rate: 'value2',
    value: 'key',
  });
  const currentIdDetailFacility = typeof window !== 'undefined'
    ? sessionStorage.getItem('currentIdDetailFacility')
    : null;

  const { data: limitAnakData, isLoading, isFetching } = useGetChildLimit({
    ...(isHidden
      ? { debtorId: String(processId) }
      : { bucketProcessId: String(processId) }
    ),
    facilityId: String(idFacilitySyariah),
  });
  const { mutate: saveMutate, isPending: isSaving } = useSaveChildLimitSyariah();
  const isSyariah = limitAnakData?.financingSegment === 'SYARIAH';

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  const isWaiting = debtorInfoData?.status?.toLowerCase()?.includes('waiting');
  const isEnabledDataDelta = useMemo(() => Boolean(isWaiting), [isWaiting]);

  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetSyariahDataDeltaChild({
    bucketProcessId: processId,
    facilityId: String(idFacilitySyariah),
  }, {
    enabled: isEnabledDataDelta,
  });

  const [mappingFormData, setMappingFormData] = React.useState<MappingFormData>({
    childFacilityAlias: '',
    financingObjectives: '',
    floatingReference: '',
    mappingFinancingSegment: null,
    mappingOrderType: null,
    mappingProduct: null,
    os: null,
    projectId: '',
    rateType: null,
  });

  const [syariahFormData, setSyariahFormData] = React.useState<any>(null);
  const [projectField, setProjectField] = React.useState('');

  const projectListPayload = useMemo(() => ({
    searchDetail: {
      key: 'name',
      value: projectField,
    },
  }), [projectField]);

  const { data: resultProject } = useGetProjectList(projectListPayload);

  const productList = useMemo(() => {
    return mappingProductSyariahOptions?.map((p) => ({
      ...p,
      id: p.id || p.value,
    })) || [];
  }, [mappingProductSyariahOptions]);

  const selectedProductId = useMemo(() => {
    if (mappingFormData.mappingProduct && productList?.length) {
      const selectedProduct = productList.find((p) =>
        p.value === mappingFormData.mappingProduct?.value ||
        p.id === mappingFormData.mappingProduct?.value
      );
      return selectedProduct?.id || null;
    }
    return null;
  }, [mappingFormData.mappingProduct, productList]);

  const { data: syariahComponentConfig } = useGetParamComponentSyariah({
    enabled: !!selectedProductId,
    id: Number(selectedProductId) || 0,
  });

  // Shared payload preparation logic
  const preparePayload = useMemo(() => () => {
    const tempSyariahData = { ...syariahFormData };
    const syariahExchangeRate = syariahFormData?.exchange_rate_global ||
                                syariahFormData?.exchange_rate_purchase_price ||
                                syariahFormData?.exchange_rate_facility_value ||
                                syariahFormData?.exchange_rate_al_qardh_loan ||
                                syariahFormData?.exchange_rate_mudharabah_fund;

    const finalRate = formatNumber(syariahExchangeRate || 0);
    const product = limitAnakData?.product || '';

    if (tempSyariahData) {
      const rateMap: Record<string, string[]> = {
        AL_ISTISHNA: ['exchange_rate_purchase_price'],
        AL_MUDHARABAH: ['exchange_rate_mudharabah_fund'],
        AL_MURABAHAH: ['exchange_rate_purchase_price'],
        AL_MUSYARAKAH: ['exchange_rate_partnership_smi', 'exchange_rate_partnership_customer'],
        AL_MUSYARAKAH_MUTANAQISAH_MMQ: ['exchange_rate_partnership_smi_facility', 'exchange_rate_partnership_customer', 'exchange_rate_global'],
        AL_QARDH: ['exchange_rate_al_qardh_loan'],
      };

      const keysToUpdate = rateMap[product] || (['AL_IJARAH', 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ', 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT'].includes(product) ? ['exchange_rate_facility_value'] : []);
      keysToUpdate.forEach((key) => { tempSyariahData[key] = finalRate; });
    }

    return Promise.resolve({
      attributes: Object.keys(tempSyariahData).map((item) => ({
        attributeKey: item,
        attributeLabel: '',
        attributeValue: tempSyariahData[item],
      })),
      childFacilityAlias: mappingFormData.childFacilityAlias || '',
      exchangeRate: finalRate,
      financingObjectives: mappingFormData.financingObjectives || '',
      floatingReference: mappingFormData.floatingReference || '',
      id: String(currentIdDetailFacility),
      mappingFinancingSegment: mappingFormData.mappingFinancingSegment?.value || '',
      mappingOrderType: mappingFormData.mappingOrderType?.value || '',
      mappingProduct: mappingFormData.mappingProduct?.value || '',
      os: mappingFormData.os || 0,
      projectId: mappingFormData.projectId ? Number(mappingFormData.projectId) : null,
      rateType: mappingFormData.rateType?.id || '',
      remark: tempSyariahData['remarks'] || '',
      ...(!isHidden && { bucketProcessId: String(processId) }),
    });
  }, [currentIdDetailFacility, mappingFormData, syariahFormData, isHidden, processId, limitAnakData]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isDetail && isEdit,
    payload: preparePayload,
    url: 'master.facilityManagementSyariahProposed.updateChildLimit',
  });

  useEffect(() => {
    const breadcrumbs = [
      {
        label: 'Facility Management',
        url: replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, { module: modul, processId }),
      },
    ];

    if (from === 'limitInduk') {
      const modePaths: Record<string, string> = {
        add: maintenanceDebtor.ADD_FACILITY_SYARIAH,
        detail: maintenanceDebtor.DETAIL_LIMIT_INDUK,
      };
      const targetPath = modePaths[fromLimitInduk || ''] || maintenanceDebtor.EDIT_LIMIT_INDUK;

      breadcrumbs.push({
        label: 'Limit Induk Syariah',
        url: replacePath(targetPath, { id: parentId || '', module: modul, processId }),
      });
    }

    breadcrumbs.push({ label: `ID Fasilitas ${id} > Detail Fasilitas`, url: '' });
    handleSetBreadcrumb(breadcrumbs);
  }, [from, id, modul, processId, fromLimitInduk, parentId]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'load child limit detail page',
    });
  }, [processId]); // Simple trigger on processId change

  useEffect(() => {
    if (limitAnakData && !isFetching && !isLoading) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'view child limit detail data',
      });
    }
  }, [limitAnakData?.facilityId, isFetching, isLoading, processId]); // Use facilityId instead of whole object

  useEffect(() => {
    if (limitAnakData) {
      const getOption = (value: string, label: string, options: any[]) => {
        if (!value) return null;
        return options?.find((opt) => opt.value === value) || (label ? { label, value } : null);
      };

      const rateType = rateTypeOptions?.find(
        (opt: any) => opt.id?.toUpperCase() === limitAnakData.rateType?.toUpperCase()
      ) || (limitAnakData.rateType ? { id: limitAnakData.rateType, label: limitAnakData.rateType } : null);

      setMappingFormData({
        childFacilityAlias: limitAnakData.facilityAlias || '',
        financingObjectives: limitAnakData.financingObjectives || '',
        floatingReference: limitAnakData.floatingReference || '',
        mappingFinancingSegment: getOption(
          limitAnakData.financingSegment,
          limitAnakData.financingSegmentLabel,
          financingSegmentOptions || []
        ),
        mappingOrderType: getOption(
          limitAnakData.orderType,
          limitAnakData.orderTypeLabel,
          orderTypeOptions || []
        ),
        mappingProduct: getOption(
          limitAnakData.coreMappingProduct || limitAnakData.product,
          limitAnakData.coreMappingProductLabel || limitAnakData.productLabel,
          mappingProductSyariahOptions || []
        ),
        os: limitAnakData.os ?? null,
        projectId: limitAnakData.projects?.[0]?.projectId || '',
        rateType,
      });
    }

  }, [
    limitAnakData?.facilityId,
    orderTypeOptions,
    mappingProductSyariahOptions,
    financingSegmentOptions,
    rateTypeOptions
  ]);

  useEffect(() => {
    if (!isDetail && !limitAnakData) {
      if (financingSegmentOptions && !mappingFormData.mappingFinancingSegment) {
        const syariahOption = financingSegmentOptions?.find(
          (option) => option.value === 'SYARIAH'
        );
        if (syariahOption) {
          setMappingFormData((prev) => ({
            ...prev,
            mappingFinancingSegment: syariahOption,
          }));
        }
      }

      if (orderTypeOptions && !mappingFormData.mappingOrderType) {
        const defaultOrderType = orderTypeOptions?.find(
          (option) => option.value === 'New'
        ) || { label: 'New', value: 'New' };

        setMappingFormData((prev) => ({
          ...prev,
          mappingOrderType: defaultOrderType,
        }));
      }
    }
  }, [
    financingSegmentOptions,
    orderTypeOptions,
    isDetail,
    mappingFormData.mappingFinancingSegment,
    mappingFormData.mappingOrderType,
    limitAnakData,
  ]);

  const getCellValue = (itemLabel: string, rawValue: any, data: any): string => {
    if (itemLabel === '') return '';

    const currency = data?.curValue || 'IDR';

    const valueHandlers: Record<string, () => string> = {
      'Nama Proyek': () => data?.name || '-',
      'Nilai Proyek': () => rawValue === null ? '-' : `${currency} ${rawValue}`,
      'Nilai Proyek (dalam Rp)': () => rawValue === null ? '-' : `IDR ${rawValue}`,
    };

    const handler = valueHandlers[itemLabel];
    if (handler) return handler();

    return rawValue ?? '-';
  };

  const handleProjectData = (data: any, result: any[]) => {
    if (data?.curValue === 'USD') {
      const exchangeRateCell = {
        key: 'exchangeRate',
        label: 'Konversi Mata Uang',
        value: data?.exchangeRate ? `IDR ${data.exchangeRate}` : '-',
      };

      const provinceLabelIndex = result.findIndex((item) => item.key === 'provinceLabel');
      if (provinceLabelIndex !== -1) {
        result.splice(provinceLabelIndex, 0, exchangeRateCell);
      }
    } else {
      const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
      if (cityLabelIndex !== -1) {
        result.splice(cityLabelIndex + 1, 0, {
          key: '',
          label: '',
          value: '',
        });
      }
      if (result.length > 6) {
        result.splice(6, 2);
      }
    }
  };

  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[]) => {
    const result = cellData.map((item) => ({
      ...item,
      value: getCellValue(item.label, data?.[item.key], data),
    }));

    if (type === 'project') {
      handleProjectData(data, result);
    }

    return result;
  };

  const projectList = useMemo(() => {
    const list = resultProject?.map((project) => ({
      ...project,
      label: project.name,
      originalValue: project.value,
      value: String(project.id),
      value2: project.value,
    })) || [];

    return list;
  }, [resultProject]);

  const projectData = useMemo(() => {
    if (!limitAnakData?.projects || limitAnakData.projects.length === 0) {
      return proyekCellData.map((item) => ({
        ...item,
        value: '-',
      }));
    }

    const project = limitAnakData.projects[0];

    const projectDataForMapping = {
      city: project?.city,
      cityLabel: project?.cityLabel,
      curValue: project?.currency || 'IDR',
      district: project?.district,
      districtLabel: project?.districtLabel,
      exchangeRate: project?.exchangeRate ?
        Number(project.exchangeRate).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) : null,
      name: project?.projectName || '-',
      province: project?.province,
      provinceLabel: project?.provinceLabel,
      sector: project?.sectorFunded,
      sectorLabel: project?.sectorFundedLabel,
      value: project?.projectValue ?
        Number(project.projectValue).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) : '-',
      valueInIdr: project?.projectValueInIdr ?
        Number(project.projectValueInIdr).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) : '-',
    };

    return mapCellData('project', projectDataForMapping, proyekCellData);
  }, [limitAnakData]);

  const handleMappingChange = React.useCallback((field: keyof MappingFormData, value: any) => {
    setMappingFormData((prev) => {
      let newValue = value;

      if (field === 'rateType' && value && typeof value === 'object' && 'id' in value) {
        newValue = { id: value.id, label: value.label, value: value.id };
      }

      if (field === 'floatingReference' && value && typeof value === 'object' && 'id' in value) {
        newValue = value.id;
      }

      const isUnchanged = prev[field] === newValue;
      if (isUnchanged) return prev;

      return {
        ...prev,
        [field]: newValue,
      };
    });
  }, []);

  const onChangeSyariahForm = React.useCallback((params: any) => {
    const {
      masintonForm,
    } = params;
    const outputData = Object.fromEntries(
      Object.entries(masintonForm).map(([key, obj]: [string, any]) => [key, obj.value])
    );

    setSyariahFormData((prev) => {
      const isChanged = Object.keys(outputData).some((key) => prev?.[key] !== outputData[key]);
      if (!isChanged && prev !== null) return prev;
      return outputData;
    });
  }, []);

  const handleCancel = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'cancel and close child limit detail page',
    });

    if (from === 'limitInduk') {
      let targetPath = maintenanceDebtor.EDIT_LIMIT_INDUK;
      if (fromLimitInduk === 'detail') {
        targetPath = maintenanceDebtor.DETAIL_LIMIT_INDUK;
      } else if (fromLimitInduk === 'add') {
        targetPath = maintenanceDebtor.ADD_FACILITY_SYARIAH;
      }
      router.push(replacePath(targetPath, {
        id: parentId || '',
        module: modul,
        processId: processId,
      }));
    } else {
      clearSessionStorage();
      router.push(replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, {
        module: modul,
        processId: processId,
      }));
    }
  };

  const syariahFormMandatoryEmpty = useMemo(() => {
    const product = limitAnakData?.product || '';
    if (product === 'AL_MUSYARAKAH') {
      return (
        !syariahFormData?.partnership_smi ||
        syariahFormData?.currency_partnership_smi !== 'IDR' && !syariahFormData?.exchange_rate_partnership_smi ||
        !syariahFormData?.partnership_customer ||
        syariahFormData?.currency_partnership_customer !== 'IDR' && !syariahFormData?.exchange_rate_partnership_customer
      );
    }
    else if (product === 'AL_MUSYARAKAH_MUTANAQISAH_MMQ') {
      return (
        !syariahFormData?.mmq_object ||
        !syariahFormData?.partnership_smi_facility ||
        syariahFormData?.currency_partnership_smi_facility !== 'IDR' && !syariahFormData?.exchange_rate_partnership_smi_facility ||
        !syariahFormData?.partnership_customer ||
        syariahFormData?.currency_partnership_customer !== 'IDR' && !syariahFormData?.exchange_rate_partnership_customer
      );
    }
    else if (product === 'AL_MURABAHAH' || product === 'AL_ISTISHNA') {
      const isMurabahah = product === 'AL_MURABAHAH';
      return (
        !(isMurabahah ? syariahFormData?.murabahah_object : syariahFormData?.istishna_object) ||
        !syariahFormData?.purchase_price ||
        syariahFormData?.currency_purchase_price !== 'IDR' && !syariahFormData?.exchange_rate_purchase_price
      );
    }
    else if (product === 'AL_QARDH') {
      return (
        !syariahFormData?.al_qardh_loan_amount ||
        syariahFormData?.currency_al_qardh_loan_amount !== 'IDR' && !syariahFormData?.exchange_rate_al_qardh_loan
      );
    }
    else if (['AL_IJARAH', 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ', 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT'].includes(product)) {
      return (
        !syariahFormData?.facility_value ||
        syariahFormData?.currency_facility_value !== 'IDR' && !syariahFormData?.exchange_rate_facility_value ||
        syariahFormData?.currency_facility_value === 'USD' && !syariahFormData?.facility_value_idr
      );
    }
    else if (product === 'AL_MUDHARABAH') {
      return (
        !syariahFormData?.mudharabah_fund ||
        syariahFormData?.currency_mudharabah_fund !== 'IDR' && !syariahFormData?.exchange_rate_mudharabah_fund ||
        syariahFormData?.currency_mudharabah_fund === 'USD' && !syariahFormData?.mudharabah_fund_idr
      );
    }
    return false;
  }, [syariahFormData, mappingFormData.mappingProduct]);

  const isMandatoryEmpty = useMemo(() => {
    if (!isEdit || newFromExisting) return false;

    const basicFieldsEmpty = !mappingFormData.mappingOrderType ||
                            !mappingFormData.mappingFinancingSegment ||
                            !mappingFormData.mappingProduct ||
                            !mappingFormData.financingObjectives;

    if (isSyariah) {
      const mappingSyariahFieldsEmpty = (mappingFormData.rateType?.id?.toUpperCase() === 'FLOATING' && !mappingFormData.floatingReference);
      const isAliasInvalid = mappingFormData.childFacilityAlias && !/^[a-zA-Z0-9 ]*$/.test(mappingFormData.childFacilityAlias);

      return basicFieldsEmpty || mappingSyariahFieldsEmpty || syariahFormMandatoryEmpty || isAliasInvalid;
    }

    return basicFieldsEmpty;
  }, [isEdit, isSyariah, mappingFormData, syariahFormMandatoryEmpty, newFromExisting]);

  const handleSave = async () => {
    if (isMandatoryEmpty) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeBefore: JSON.stringify(limitAnakData),
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'initiate save child limit mapping',
    });

    const payload = await preparePayload();

    saveMutate(payload, {
      onError: (error: any) => {
        const messageError = error?.message || '';

        recordActivity({
          activity: ActivityType.CREATE,
          bucketProcessId: processId,
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: `save child limit mapping failed: ${messageError}`,
        });

        showNiceModalV2({
          title: messageError,
          type: 'error',
        });
      },
      onSuccess: (response) => {
        recordActivity({
          activity: ActivityType.CREATE,
          bucketProcessId: processId,
          changeAfter: JSON.stringify({
            payload,
            response,
          }),
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: 'save child limit mapping successfully',
        });

        showNiceModalV2({
          title: 'Data Child Limit berhasil disimpan',
          type: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['detail-syariah-child-limit']});
      },
    });
  };

  const findDataDelta = React.useCallback((inputKey: string,
    dropdownInputList?: { label: string; id?: string; value?: string }[]) => {
    if (!isSuccesDataDelta) return null;

    const diff = (dataDelta as any)?.differencesData?.find((el: any) => el?.field === inputKey);
    if (!diff) return null;

    const findPrevValues = diff.previousValue;
    if (findPrevValues === null || findPrevValues === undefined) return '-';

    if (dropdownInputList?.length) {
      const valToStr = typeof findPrevValues === 'boolean' ? findPrevValues.toString() : String(findPrevValues);
      return dropdownInputList.find((item) => (item.id || item.value) === valToStr)?.label || valToStr;
    }

    if (inputKey === 'os') {
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(Number(findPrevValues));
    }

    return findPrevValues;
  }, [isSuccesDataDelta, dataDelta]);

  return {
    currencyDropdownList,
    financingSegmentOptions,
    findDataDelta,
    floatingReferenceOptions,
    handleCancel,
    handleMappingChange,
    handleSave,
    idFacilitySyariah, // Export this for the component
    isAutoSaveFetching,
    isDetail,
    isEdit,
    isHidden,
    isLoading,
    isMandatoryEmpty,
    isSaving,
    isSyariah,
    limitAnakData: useMemo(() => (
      limitAnakData ? { ...limitAnakData, id: limitAnakData.facilityId } : null
    ), [limitAnakData]),
    mappingFormData,
    mappingProductSyariahOptions,
    modul,
    newFromExisting,
    onChangeSyariahForm,
    orderTypeOptions,
    projectData,
    projectList,
    rateTypeOptions,
    setProjectField,
    syariahComponentConfig,
  };
};

export default useLimitAnak;
