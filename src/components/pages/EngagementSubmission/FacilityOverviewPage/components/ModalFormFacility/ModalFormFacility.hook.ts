import { useEffect, useState, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetParamComponentSyariah from '@/hooks/services/useGetParamComponentSyariah';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetProjectList from '@/hooks/services/useGetProjectList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import useGetFinancingFacility from '@/components/shared/SmiTable/TablePaymentFacility/hooks/useGetFinancingFacility';

import { MODAL_FINANCING } from '../../FacilityOverview.constants';
import useGetDetailFinancingPk from '../hooks/useGetDetailFinancingPk';
import useSaveFinancingFacility from '../hooks/useSaveFinancingFacility';

import { formData, validation } from './ModalFormFacility.form';

import type { ProjectDto } from '@/services/openapi/loan-service';


const usePopupFormFacility = ({ existing, id, module, process }: any) => {
  const { processId, facilityId, debtorId, debiturName } = useIdentity();
  const _financingSegment = useFinancingSegment();

  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, {
    label: 'value1',
    rate: 'value2',
    value: 'key',
  });
  const exchangeRateNominal = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;

  const _formData = Object.assign(formData, {
    exchangeRate: { value: exchangeRateNominal },
    financingSegment: { value: _financingSegment },
  });

  const queryClient = useQueryClient();
  const [disabledSave, setDisabledSave] = useState(true);
  const [syariahFormData, setSyariahFormData] = useState(null);
  const [financingFacilityDataSyariah, setFinancingFacilityDataSyariah] = useState({});
  const [projectList, setProjectList] = useState([]);
  const [projectDetail, setProjectDetail] = useState<ProjectDto>({});

  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
    masintonValidation,
    masintonSubmit,
  } = useMasintonForm(_formData, validation);

  const {
    financingSegment: { value: financingSegment },
    financingObjectives: { value: financingObjectives },
    orderValue: { value: orderValue },
    currencyOrderValue: { value: currencyOrderValue },
    exchangeRate: { value: exchangeRate },
    orderValueAfterExchangeRate: { value: orderValueAfterExchangeRate },
    mappingOrderType: { value: mappingOrderType },
    mappingFinancingSegment: { value: mappingFinancingSegment },
    mappingProduct: { value: mappingProduct },
    product: { value: product },
    projectId: { value: projectId },
    outstanding: { value: outstanding },
  } = masintonForm;

  const [productModule, setProductModule] = useState(`product${financingSegment?.toLowerCase()}`);
  const [mappingProductModule, setMappingProductModule] = useState(`product${mappingFinancingSegment ? mappingFinancingSegment?.toLowerCase() : 'konven'}`);

  const { data: governmentMandateList } = useGetParameterList(Modules.GOVERMENT_MANDATE);
  const { data: orderTypeListNonExisting } = useGetParameterList(Modules.ORDER_TYPE);
  const { data: mapOrderTypeList } = useGetParameterList(Modules.MAPPING_ORDER_TYPE);
  const { data: typeListExisting } = useGetParameterList(Modules.ORDER_TYPE_EXISTING);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT);
  const { data: productList } = useGetParameterList(productModule, {
    id: 'id',
    label: 'value1',
    value: 'key',
  });
  const { data: mappingProductList } = useGetParameterList(mappingProductModule);

  const { data: resultProject } = useGetProjectList();

  const { data: financingFacilityData } = useGetFinancingFacility({
    bucketProcessId: processId,
    facilityId,
  });

  const { data: financingPk } = useGetDetailFinancingPk({
    facilityId: facilityId,
    financingFacilityId: id,
  });

  const selectedProductId = useMemo(() => {
    if (financingSegment === 'SYARIAH' && product && productList?.length) {
      const selectedProduct = productList.find((p) => p.value === product || p.key === product);
      if (selectedProduct?.id) {
        return selectedProduct.id;
      }
    }
    return null;
  }, [financingSegment, product, productList]);

  const isEnabled = financingSegment === 'SYARIAH' && !!selectedProductId && selectedProductId !== null;

  const {
    data: syariahComponentConfig,
    error: syariahComponentError,
    isError: isSyariahComponentError,
  } = useGetParamComponentSyariah({
    enabled: isEnabled,
    id: selectedProductId || 0,
  });

  const hasSyariahMappingError = useMemo(() => {
    if (financingSegment !== 'SYARIAH' || !isEnabled) return false;

    if (isSyariahComponentError) return true;

    if (syariahComponentConfig && (
      !syariahComponentConfig.productCodeReference ||
        syariahComponentConfig.productCodeReference === null
    )) {
      return true;
    }

    return false;
  }, [financingSegment, isEnabled, isSyariahComponentError, syariahComponentConfig]);

  const mappingFinancingSegmentList = [
    { label: 'Konven', value: 'KONVEN' },
    { label: 'Syariah', value: 'SYARIAH' }
  ];

  const { mutate: saveFinancingFacility, isPending: isLoadingSave } = useSaveFinancingFacility({
    onError: () => {
      showNiceModalV2({ title: 'Gagal menyimpan fasilitas pembiayaan', type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});
      closeNiceModal(MODAL_FINANCING.FORM_FACILITY).then(() => {
        showNiceModalV2({
          onClose: () => { masintonReset(); },
          title: 'Fasilitas pembiayaan berhasil ditambahkan',
          type: 'success',
        });
      });
    },
  });

  useEffect(() => {
    const mandatoryFields = [
      'financingSegment',
      'product',
      'mappingOrderType',
      'mappingFinancingSegment',
      'mappingProduct',
    ];

    const ignoreValidation = [];

    if (currencyOrderValue === 'IDR') {
      ignoreValidation.push('exchangeRate');
    }

    if (financingSegment === 'SYARIAH') {
      ignoreValidation.push('financingObjectives', 'exchangeRate', 'orderValue');
    }

    const isValid = mandatoryFields.every((field) => {
      if (ignoreValidation.includes(field)) return true;
      const fieldValue = masintonForm[field]?.value;
      return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
    });

    if (currencyOrderValue === 'USD' && (!exchangeRate || exchangeRate === '')) {
      setDisabledSave(true);
      return;
    }

    if (financingSegment === 'SYARIAH') {
      const isSyariahFormValid = syariahFormData && Object.keys(syariahFormData).length > 0;
      if (!isSyariahFormValid) {
        setDisabledSave(true);
        return;
      }
    }

    setDisabledSave(!isValid);
  }, [masintonForm, currencyOrderValue, exchangeRate, financingSegment, syariahFormData]);

  useEffect(() => {
    if (financingSegment) {
      masintonChange('mappingProduct', '');
      masintonChange('mappingFinancingSegment', '');
      setProductModule(`product${financingSegment.toLowerCase()}`);
      masintonChange('product', '');
    }
  }, [financingSegment]);

  useEffect(() => {
    if (mappingFinancingSegment) {
      const isPemdaKonven = financingSegment?.toLowerCase() === 'pemda' &&
                           mappingFinancingSegment?.toLowerCase() === 'konven';
      const mappingProductParam = isPemdaKonven
        ? 'mappingProductPemdaKonven'
        : `product${mappingFinancingSegment.toLowerCase()}`;
      setMappingProductModule(mappingProductParam);
      masintonChange('mappingProduct', '');
    }
  }, [mappingFinancingSegment]);

  useEffect(() => {
    if (orderValue && exchangeRate && currencyOrderValue === 'USD') {
      const newOrderValueAfterExchangeRate = multiplyNominalValues(orderValue, exchangeRate);
      masintonChange('orderValueAfterExchangeRate', newOrderValueAfterExchangeRate);
    } else if (currencyOrderValue === 'IDR') {
      masintonChange('orderValueAfterExchangeRate', orderValue);
    }
  }, [orderValue, exchangeRate, currencyOrderValue]);

  useEffect(() => {
    if (resultProject) {
      const projects = resultProject.map((project) => ({
        ...project,
        id: project?.id,
        label: project?.name,
      }));
      setProjectList(projects);
    }
  }, [resultProject]);

  useEffect(() => {
    if (projectId && projectList.length > 0) {
      const project = projectList.find((project) => project.label === projectId);
      if (project) {
        setProjectDetail(project);
      }
    } else {
      setProjectDetail({});
    }
  }, [projectId, projectList]);

  useEffect(() => {
    if (financingFacilityData && id) {
      const newFinancingData = structuredClone(financingFacilityData);

      const debtorNameFromAttributes = financingFacilityData.attributes?.find(
        (attr) => attr.attributeKey === 'debtorName'
      )?.attributeValue;

      const finalDebtorName = financingFacilityData.debtorName || debtorNameFromAttributes || '';

      const masintonData = Object.assign(newFinancingData, {
        debtorName: finalDebtorName,
        exchangeRate: financingFacilityData.exchangeRate || exchangeRateNominal,
        projectId: financingFacilityData?.project?.name || '',
        ...(existing && { orderType: 'NEW_FROM_EXISTING_FACILITY' }),
        mappingFinancingSegment: financingFacilityData?.mappingFinancingSegment || '',
        mappingOrderType: financingFacilityData?.mappingOrderType || '',
        mappingProduct: financingFacilityData?.mappingProduct || '',
      });

      masintonMagic(masintonData);
      setProjectDetail(financingFacilityData.project || {});

      if (financingSegment === 'SYARIAH') {
        const mappedAttributes = (financingFacilityData.attributes || []).reduce((acc, item) => {
          acc[item.attributeKey] = item.attributeValue;
          if (item.attributeKey === 'expected_profit_share') {
            acc['expected_profit'] = item.attributeValue;
          }
          return acc;
        }, {});

        const attributesSyariah = Object.assign(mappedAttributes, {
          government_mandate: financingFacilityData?.governmentMandate,
          remarks: financingFacilityData?.remark,
        });

        setFinancingFacilityDataSyariah(attributesSyariah);
      }
    }
  }, [financingFacilityData, id]);

  useEffect(() => {
    if (debiturName) {
      masintonChange('debtorName', debiturName);
    }
  }, [debiturName]);

  const onChangeSyariahForm = (params: {
    masintonForm: MasintonForm;
    masintonChange: (key: string, value: any) => void;
    masintonReplace: (formData: MasintonForm) => void;
  }) => {
    const {
      masintonForm,
    } = params;
    const outputData = Object.fromEntries(
      Object.entries(masintonForm).map(([key, obj]) => [key, obj.value])
    );

    if (outputData.remark) {
      masintonChange('remark', outputData.remark);
    }

    if (outputData.governmentMandate) {
      masintonChange('governmentMandate', outputData.governmentMandate);
    }

    setSyariahFormData(outputData);
  };

  function handleSubmit() {
    const ignoreValidation = [];

    if (currencyOrderValue === 'IDR') {
      ignoreValidation.push('exchangeRate');
    }

    if (financingSegment === 'SYARIAH') {
      ignoreValidation.push('financingObjectives', 'exchangeRate', 'orderValue');
    }

    if (!masintonValidation({ ignoreValidation })) return;

    const selectedProject = projectList.find((project) => project.label === projectId);
    const newProjectId = selectedProject?.id;

    const tempSyariahData = syariahFormData
      ? {
        ...syariahFormData,
        orderValue: formatNumber(syariahFormData?.orderValue || orderValue),
      }
      : null;

    const basePayload = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      debtorId: debtorId || null,
      exchangeRate: currencyOrderValue !== 'IDR' ? formatNumber(exchangeRate) : '1',
      facilityId: existing ? '' : financingFacilityData?.facilityId || '',
      mappingFinancingSegment: mappingFinancingSegment,
      mappingOrderType: mappingOrderType,
      mappingProduct: mappingProduct,
      module: module ? module : TypeModule.LPS,
      orderValue: formatNumber(orderValue),
      orderValueAfterExchangeRate: currencyOrderValue !== 'IDR' ? formatNumber(orderValueAfterExchangeRate) : '',
      outstanding: formatNumber(outstanding || '0'),
      process: process ? process : TypeProcess.LPS_CORE,
      projectId: newProjectId ? Number(newProjectId) : null,
    });

    let finalPayload;
    if (financingSegment === 'SYARIAH' && tempSyariahData) {
      finalPayload = {
        ...basePayload,
        attributes: Object.keys(tempSyariahData)
          .filter((item) => item !== 'remarks' && item !== 'government_mandate')
          .map((item) => ({
            attributeKey: item,
            attributeLabel: '',
            attributeValue: tempSyariahData[item] ? tempSyariahData[item] : '',
          })),
        governmentMandate: tempSyariahData['government_mandate'],
        remark: tempSyariahData['remarks'],
      };
    } else {
      finalPayload = basePayload;
    }

    saveFinancingFacility(finalPayload);
  }

  const orderTypeList = financingFacilityData?.isExisting
    ? typeListExisting
    : orderTypeListNonExisting;


  const autoSavePayload = useMemo(() => () => {
    const selectedProject = projectList.find((project) => project.label === projectId);
    const newProjectId = selectedProject?.id;

    const tempSyariahData = syariahFormData
      ? {
        ...syariahFormData,
        orderValue: formatNumber(syariahFormData?.orderValue || orderValue),
      }
      : null;

    const basePayload = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      debtorId: debtorId || null,
      exchangeRate: currencyOrderValue !== 'IDR' ? formatNumber(exchangeRate) : '1',
      facilityId: existing ? '' : financingFacilityData?.facilityId || '',
      mappingFinancingSegment: mappingFinancingSegment,
      mappingOrderType: mappingOrderType,
      mappingProduct: mappingProduct,
      module: module ? module : TypeModule.LPS,
      orderValue: formatNumber(orderValue),
      orderValueAfterExchangeRate: currencyOrderValue !== 'IDR' ? formatNumber(orderValueAfterExchangeRate) : '',
      outstanding: formatNumber(outstanding || '0'),
      process: process ? process : TypeProcess.LPS_CORE,
      projectId: newProjectId ? Number(newProjectId) : null,
    });

    let finalPayload;
    if (financingSegment === 'SYARIAH' && tempSyariahData) {
      finalPayload = {
        ...basePayload,
        attributes: Object.keys(tempSyariahData)
          .filter((item) => item !== 'remarks' && item !== 'government_mandate')
          .map((item) => ({
            attributeKey: item,
            attributeLabel: '',
            attributeValue: tempSyariahData[item] ? tempSyariahData[item] : '',
          })),
        governmentMandate: tempSyariahData['government_mandate'],
        remark: tempSyariahData['remarks'],
      };
    } else {
      finalPayload = basePayload;
    }

    return Promise.resolve(finalPayload);
  }, [masintonForm, syariahFormData, projectList, processId, existing, financingFacilityData]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!id && !!financingFacilityData,
    payload: autoSavePayload,
    url: 'bucket.facilitySyariah.save',
  });

  return {
    currencyDropdownList,
    disabledSave,
    financingFacilityData,
    financingFacilityDataSyariah,
    financingPk,
    financingSegmentList,
    governmentMandateList,
    handleSubmit,
    hasSyariahMappingError,
    isAutoSaveFetching,
    isLoadingSave,
    mapOrderTypeList,
    mappingFinancingSegmentList,
    mappingProductList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
    onChangeSyariahForm,
    orderTypeList,
    productList,
    projectDetail,
    projectList,
    syariahComponentConfig,
  };
};

export default usePopupFormFacility;
