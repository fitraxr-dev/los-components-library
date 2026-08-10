import { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetDetailFinancingFacility from '@/hooks/services/bucket/financing-facility/useGetDetailFinancingFacility';
import useSaveFinancingFacility from '@/hooks/services/bucket/financing-facility/useSaveFinancingFacility';
import useGetProjectList from '@/hooks/services/bucket/useGetProjectList';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetParamComponentSyariah from '@/hooks/services/useGetParamComponentSyariah';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import { modal } from '../../FinancingOverview.constants';

import { formData, validation } from './ModalFormFacility.form';

import type { ProjectDto } from '@/services/openapi/loan-service';


const usePopupFormFacility = ({ existing, id }: any) => {
  const bucket = useSpfpBucketContext();
  const { processId, bucketProcessId, facilityId, debtorId, debiturName } = useIdentity();
  const queryClient = useQueryClient();
  const _financingSegment = useFinancingSegment();
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const exchangeRateNominal = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
  const _formData = Object.assign({}, formData, {
    exchangeRate: { ...formData.exchangeRate, value: exchangeRateNominal },
    financingSegment: { ...formData.financingSegment, value: _financingSegment },
  });
  const [syariahFormData, setSyariahFormData] = useState(null);
  const [disabledSave, setDisabledSave] = useState(true);
  const [projectList, setProjectList] = useState([]);

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
    product: { value: product },
    orderValue: { value: orderValue },
    currencyOrderValue: { value: currencyOrderValue },
    exchangeRate: { value: exchangeRate },
    orderValueAfterExchangeRate: { value: orderValueAfterExchangeRate },
    projectId: { value: projectId },
    outstanding: { value: outstanding },
    mappingOrderType: { value: mappingOrderType },
    mappingFinancingSegment: { value: mappingFinancingSegment },
    mappingProduct: { value: mappingProduct },
  } = masintonForm;

  const mandatoryFields = [
    'financingObjectives', 'exchangeRate', 'orderValue', 'product', 'financingSegment'
  ];

  useEffect(() => {
    const ignoreValidation: string[] = [];

    if (currencyOrderValue !== '' && currencyOrderValue === 'IDR') {
      ignoreValidation.push('exchangeRate');
    }

    if (financingSegment === 'SYARIAH') {
      ignoreValidation.push('financingObjectives', 'exchangeRate', 'orderValue');
    } else if (currencyOrderValue !== '' && currencyOrderValue === 'IDR') {
      ignoreValidation.push('exchangeRate');
    }

    const isValid = mandatoryFields.every((field) => {
      if (ignoreValidation.includes(field)) return true;
      const fieldValue = masintonForm[field]?.value;
      return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
    });

    setDisabledSave(!isValid);
  }, [financingObjectives, exchangeRate, orderValue, product, financingSegment]);

  const [productModule, setProductModule] = useState(`product${financingSegment?.toLowerCase()}`);
  const [mappingProductModule, setMappingProductModule] = useState(`product${mappingFinancingSegment ? mappingFinancingSegment?.toLowerCase() : 'konven'}`);
  const [projectDetail, setProjectDetail] = useState<ProjectDto>({});
  const [financingFacilityDataSyariah, setFinancingFacilityDataSyariah] = useState({});

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

  const { data: financingFacilityData } = useGetDetailFinancingFacility({
    bucketProcessId: bucketProcessId,
    facilityId: facilityId,
  });

  // Get selected product ID
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

  // Check if syariah component has mapping error
  const hasSyariahMappingError = useMemo(() => {
    if (financingSegment !== 'SYARIAH' || !isEnabled) return false;

    // Check for API error (500 or other errors)
    if (isSyariahComponentError) return true;

    // Check for empty response or null productReference
    if (syariahComponentConfig && (
      !syariahComponentConfig.productCodeReference ||
        syariahComponentConfig.productCodeReference === null
    )) {
      return true;
    }

    return false;
  }, [financingSegment, isEnabled, isSyariahComponentError, syariahComponentConfig]);

  const { data: resultProject } = useGetProjectList({
    bucketProcessId: bucketProcessId || bucket?.bucketProcessId,
    debtorId,
    module: bucket?.module,
    name: projectId ? projectId : '',
    process: bucket?.process,
  });

  useEffect(() => {
    if (resultProject && projectList.length === 0) {
      const projectLists = resultProject?.map((project) => ({ ...project, id: project.id, label: project.name }));
      setProjectList(projectLists);
    }
  }, [resultProject]);

  const {
    mutate: saveFinancingFacility,
    isPending: isLoadingSave,
  } = useSaveFinancingFacility({
    onError: () => {
      showNiceModalV2({ title: 'Gagal menyimpan fasilitas pembiayaan', type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});
      closeNiceModal(modal.FORM_FACILITY).then(() => {
        showNiceModalV2({
          onClose: () => {
            masintonReset();
          }, title: 'Fasilitas pembiayaan berhasil ditambahkan', type: 'success',
        });
      });
    },
  });

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
      const isPemdaKonven = financingSegment?.toLowerCase() === 'pemda' && mappingFinancingSegment?.toLowerCase() === 'konven';
      const mappingProuctParam = isPemdaKonven ? 'mappingProductPemdaKonven' : `product${mappingFinancingSegment.toLowerCase()}`;
      setMappingProductModule(mappingProuctParam);
      masintonChange('mappingProduct', '');
    }
  }, [mappingFinancingSegment]);

  useEffect(() => {
    const newOrderValueAfterExchangeRate = multiplyNominalValues(orderValue, exchangeRate);
    masintonChange('orderValueAfterExchangeRate', newOrderValueAfterExchangeRate);
  }, [orderValue, exchangeRate]);

  useEffect(() => {
    if (projectId) {
      const project = projectList?.find((project) => projectId === project.name);
      if (project) setProjectDetail(project);
    } else {
      setProjectDetail({});
    }
  }, [projectId]);

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
        projectId: financingFacilityData.project.name,
        ...(existing && { orderType: 'NEW_FROM_EXISTING_FACILITY' }),
        mapProduk: financingFacilityData?.product,
        mapSegmenFinancing: financingFacilityData?.financingSegment,
      });
      masintonMagic(masintonData);

      setProjectDetail(financingFacilityData.project);

      const mappedAttributes = financingFacilityData.attributes.reduce((acc, item) => {
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
  }, [financingFacilityData]);

  useEffect(() => {
    masintonChange('debtorName', debiturName);
  }, [debiturName]);

  function handleSubmit() {
    const ignoreValidation = [];

    if (currencyOrderValue !== '' && currencyOrderValue === 'IDR') {
      ignoreValidation.push('exchangeRate');
    }

    if (financingSegment === 'SYARIAH') {
      ignoreValidation.push('financingObjectives');
      ignoreValidation.push('exchangeRate');
      ignoreValidation.push('orderValue');
    } else if (currencyOrderValue !== '' && currencyOrderValue === 'IDR') {
      ignoreValidation.push('exchangeRate');
    }

    if (!masintonValidation({ ignoreValidation })) return;

    const selectedProject = projectList?.find((project) => projectId === project.name);
    const newProjectId = selectedProject?.id;

    const tempSyariahData = {
      ...syariahFormData,
      orderValue: formatNumber(syariahFormData?.orderValue),
    };

    const temp = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      debtorId: debtorId ? debtorId : null,
      exchangeRate: currencyOrderValue !== 'IDR' ? formatNumber(exchangeRate) : '1',
      facilityId: existing ? '' : financingFacilityData?.facilityId || '',
      id: existing ? null : (id ? Number(id) : null),
      mappingFinancingSegment: mappingFinancingSegment,
      mappingOrderType: mappingOrderType,
      mappingProduct: mappingProduct,
      module: bucket?.module,
      orderValue: formatNumber(orderValue),
      orderValueAfterExchangeRate: currencyOrderValue !== 'IDR' ? formatNumber(orderValueAfterExchangeRate) : '0',
      outstanding: formatNumber(outstanding),
      process: bucket?.process,
      projectCode: (selectedProject as any)?.code || (projectDetail as any)?.code || '',
      projectId: newProjectId ? Number(newProjectId) : '',
    });

    const payloadFinancing = financingSegment === 'SYARIAH' ? { ...temp,
      attributes: Object.keys(tempSyariahData)
        .filter((item) => item !== 'remarks' && item !== 'government_mandate')
        .map((item) => {
          return {
            attributeKey: item,
            attributeLabel: '',
            attributeValue: tempSyariahData[item] ? tempSyariahData[item] : '',
          };
        }),
      governmentMandate: tempSyariahData['government_mandate'],
      remark: tempSyariahData['remarks'],
    } : temp;

    saveFinancingFacility(payloadFinancing);
  };

  let orderTypeList = orderTypeListNonExisting;
  if (financingFacilityData?.isExisting) {
    orderTypeList = typeListExisting;
  }

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

  return {
    currencyDropdownList,
    disabledSave,
    financingFacilityData,
    financingFacilityDataSyariah,
    financingSegmentList,
    governmentMandateList,
    handleSubmit,
    hasSyariahMappingError,
    isLoadingSave,
    mapOrderTypeList,
    mappingFinancingSegmentList: [
      {
        'label': 'Konven',
        'value': 'KONVEN',
      },
      {
        'label': 'Syariah',
        'value': 'SYARIAH',
      }
    ],
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
