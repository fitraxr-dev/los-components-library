import { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { mapOrderTypeToDatabase } from '@/helpers/orderTypeMapping';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { capitalize } from '@/helpers/string';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetParamComponentSyariah from '@/hooks/services/useGetParamComponentSyariah';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useSegmentFinancing from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import useGetFinancingFacility from '../../hooks/useGetFinancingFacility';
import useGetProjectList from '../../hooks/useGetProjectList';
import useSaveFinancingFacility from '../../hooks/useSaveFinancingFacility';
import { MODALPK } from '../../PK.constants';

import { formData, validation } from './ModalFormFacility.form';

import type { ProjectDto } from '@/services/openapi/master-service';


const usePopupFormFacility = (props: SmiComponentProps) => {
  const { id, type, module, process } = props;
  const queryClient = useQueryClient();
  const existing = type === 'existing';

  const { processId, facilityId, debtorId } = useIdentity();
  const _segmentFinancing = useSegmentFinancing();
  const _formData = Object.assign(formData, { financingSegment: { value: _segmentFinancing } });
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const exchangeRateNominal = currencyDropdownList.find((item) => item.value === 'USD')?.rate;

  console.log('processID: ', processId);

  const {
    masintonForm,
    masintonChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
    masintonMultiChange,
    masintonValidation,
    masintonSubmit,
  } = useMasintonForm(_formData, validation);

  const {
    financingSegment: { value: financingSegment },
    orderValue: { value: orderValue },
    currencyOrderValue: { value: currencyOrderValue },
    exchangeRate: { value: exchangeRate },
    orderValueAfterExchangeRate: { value: orderValueAfterExchangeRate },
    projectId: { value: projectId },
    product: { value: product },
    governmentMandate: { value: governmentMandate },
    remark: { value: remark },
    mappingOrderType: { value: mappingOrderType },
    mappingFinancingSegment: { value: mappingFinancingSegment },
    mappingProduct: { value: mappingProduct },
  } = masintonForm;

  const [productModule, setProductModule] = useState(`product${capitalize(financingSegment.toLowerCase())}`);
  const [projectDetail, setProjectDetail] = useState<ProjectDto>({});
  const [syariahFormData, setSyariahFormData] = useState(null);
  const [correctDebtorId, setCorrectDebtorId] = useState<string>(debtorId);
  const [isOrderValueUnchanged, setIsOrderValueUnchanged] = useState<boolean>(true);
  const [existingPartnershipSmi, setExistingPartnershipSmi] = useState<string>('');
  const [existingPartnershipCustomer, setExistingPartnershipCustomer] = useState<string>('');
  const [existingCurrencySmi, setExistingCurrencySmi] = useState<string>('');
  const [existingCurrencyCustomer, setExistingCurrencyCustomer] = useState<string>('');
  const [initialOrderValue, setInitialOrderValue] = useState<string>('');
  const [initialCurrency, setInitialCurrency] = useState<string>('');

  // Initialize checkbox as checked for add existing mode
  useEffect(() => {
    if (!facilityId && existing) {
      setIsOrderValueUnchanged(true);
    }
  }, [facilityId, existing]);

  const { data: mappingOrderTypeList } = useGetParameterList('mappingOrderTypePK');

  const { data: orderType } = useGetParameterList(Modules.ORDER_TYPE);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT);
  const { data: productList } = useGetParameterList(productModule, {
    id: 'id',
    label: 'value1',
    value: 'key',
  });
  const { data: governmentMandateList } = useGetParameterList(Modules.GOVERMENT_MANDATE);
  const projectListPayload = useMemo(() => ({
    debtorId: correctDebtorId,
  }), [correctDebtorId]);

  const { data: resultProject } = useGetProjectList(projectListPayload);

  const {
    data: financingFacilityData,
    isSuccess: isFinancingFacilitySuccess,
  } = useGetFinancingFacility({ bucketProcessId: processId, facilityId });

  const selectedProductId = useMemo(() => {

    if (financingSegment === 'SYARIAH' && product && productList?.length) {
      const selectedProduct = productList.find((p) => p.value === product || p.key === product);

      if (selectedProduct?.id) {
        return selectedProduct.id;
      } else {
      }
    } else {
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

  // Force checkbox checked for ADD NEW + existing mode
  useEffect(() => {
    if (!facilityId && existing && financingFacilityData) {
      setIsOrderValueUnchanged(true);
    } else if (!facilityId && existing) {
      setIsOrderValueUnchanged(true);
    }
  }, [facilityId, existing, financingFacilityData]);

  useEffect(() => {
    if (facilityId && financingFacilityData?.debtorId) {
      setCorrectDebtorId(financingFacilityData.debtorId);
    }
  }, [facilityId, financingFacilityData?.debtorId]);

  const { mutate: saveFinancingFacility } = useSaveFinancingFacility({
    onError: (error: any) => {
      const errorDetail = error?.response?.data?.errorDetail || error?.message || 'Failed to read request';
      showNiceModalV2({ title: errorDetail, type: 'error' });
    },
    onSuccess: () => {
      closeNiceModal(MODALPK.FORM_FACILITY).then(() => {
        showNiceModalV2({ onClose: () => {
          masintonReset();
          // I don't know what this does, but if you do it inside onSuccess useSaveFinancingFacility,
          // it will make the modal can't be closed #Kurniawan
          queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
          queryClient.invalidateQueries({ queryKey: ['financing-facilities']});
          queryClient.invalidateQueries({ queryKey: ['financing-facility']});
        }, title: 'Fasilitas pembiayaan berhasil ditambahkan', type: 'success' });
      });
    },
  });

  useEffect(() => {
    if (financingSegment) {
      setProductModule(`product${capitalize(financingSegment.toLowerCase())}`);
      masintonChange('product', '');
    }
  }, [financingSegment]);


  useEffect(() => {
    if (financingFacilityData?.existingOrderValue) {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      // Check if this is EDIT mode (facilityId exists and we're editing an existing facility)
      // vs ADD NEW FROM EXISTING mode (facilityId exists but we're creating a new facility from existing data)
      const isEditMode = facilityId && !existing;
      const isAddNewFromExistingMode = facilityId && existing;

      if (isEditMode) {
        // Edit mode: compare current input with existing values
        const existingOrderValue = normalizeValue(financingFacilityData.existingOrderValue.toString());
        const currentOrderValue = normalizeValue(orderValue || '0');
        const currentCurrency = currencyOrderValue;

        let isValueUnchanged = true;

        if (currentCurrency === 'USD') {
          // If currency is USD, compare USD input with converted existing IDR to USD
          const existingIdrValue = parseFloat(existingOrderValue || '0');
          const usdExchangeRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
          const existingExchangeRate = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 1;

          // Convert existing IDR to USD using API exchange rate
          const existingUsdValue = existingExchangeRate > 0 ? existingIdrValue / existingExchangeRate : 0;
          const currentUsdValue = parseFloat(currentOrderValue || '0');

          // Compare with tolerance for floating point differences
          const isUsdValueDifferent = Math.abs(existingUsdValue - currentUsdValue) > 0.01;
          isValueUnchanged = !isUsdValueDifferent;
        } else {
          // If currency is IDR, compare directly with existing IDR
          const existingIdrValue = parseFloat(existingOrderValue || '0');
          const currentIdrValue = parseFloat(currentOrderValue || '0');

          const isIdrValueDifferent = Math.abs(existingIdrValue - currentIdrValue) > 0.01;
          isValueUnchanged = !isIdrValueDifferent;
        }

        setIsOrderValueUnchanged(isValueUnchanged);
      } else if (isAddNewFromExistingMode) {
        // ADD NEW FROM EXISTING MODE: checkbox checked by default, unchecked only if there are changes
        // For ADD NEW FROM EXISTING mode: checkbox should be checked by default
        // Only uncheck if user has made changes from the API values
        const currentOrderValue = normalizeValue(orderValue || '0');
        const currentCurrency = currencyOrderValue;
        const apiOrderValue = normalizeValue(financingFacilityData.orderValue?.toString() || '0');
        const apiCurrency = financingFacilityData.currencyOrderValue;

        // Check if current input is different from API values
        const isOrderValueDifferent = apiOrderValue !== currentOrderValue;
        const isCurrencyDifferent = apiCurrency !== currentCurrency;

        // For ADD NEW FROM EXISTING: checkbox checked if values match API, unchecked if different
        // But if this is the first time (no user input yet), keep it checked
        const hasUserInput = orderValue || currencyOrderValue;
        const isValueUnchanged = !isOrderValueDifferent && !isCurrencyDifferent;

        if (!hasUserInput) {
          setIsOrderValueUnchanged(true);
        } else {
          setIsOrderValueUnchanged(isValueUnchanged);
        }
      } else {
        // ADD EXISTING MODE (no facilityId): checkbox checked by default, unchecked only if there are changes
        // For ADD EXISTING mode: checkbox should be checked by default
        // Only uncheck if user has made changes from the API values
        const currentOrderValue = normalizeValue(orderValue || '0');
        const currentCurrency = currencyOrderValue;
        const apiOrderValue = normalizeValue(financingFacilityData.orderValue?.toString() || '0');
        const apiCurrency = financingFacilityData.currencyOrderValue;

        // Check if current input is different from API values
        const isOrderValueDifferent = apiOrderValue !== currentOrderValue;
        const isCurrencyDifferent = apiCurrency !== currentCurrency;

        // For ADD EXISTING: checkbox checked if values match API, unchecked if different
        // But if this is the first time (no user input yet), keep it checked
        const hasUserInput = orderValue || currencyOrderValue;
        const isValueUnchanged = !isOrderValueDifferent && !isCurrencyDifferent;

        if (!hasUserInput) {
          setIsOrderValueUnchanged(true);
        } else {
          setIsOrderValueUnchanged(isValueUnchanged);
        }
      }
    } else if (!facilityId && existing) {
      // For add existing mode without existingOrderValue, checkbox should be checked by default
      setIsOrderValueUnchanged(true);
    }
  }, [
    financingFacilityData?.existingOrderValue,
    financingFacilityData?.orderValue,
    financingFacilityData?.currencyOrderValue,
    orderValue,
    orderValueAfterExchangeRate,
    currencyOrderValue,
    facilityId,
    initialOrderValue,
    initialCurrency,
    existing
  ]);

  useEffect(() => {
    const orderValueAfterExchangeRate = multiplyNominalValues(orderValue, exchangeRate);
    masintonChange('orderValueAfterExchangeRate', orderValueAfterExchangeRate);
  }, [orderValue, exchangeRate]);

  const projectList = useMemo(() => (
    resultProject?.map((project) => ({
      ...project,
      label: project.name,
      originalValue: project.value,
      value: String(project.id),
      value2: project.value,
    })) || []
  ), [resultProject]);

  useEffect(() => {
    if (!projectId) {
      setProjectDetail({});
      return;
    }

    const project = projectList?.find((project) => project.id === Number(projectId));
    if (project) {
      if (projectDetail?.id !== project.id || projectDetail?.value !== project.originalValue) {
        setProjectDetail({
          ...project,
          value: project.originalValue,
        });
      }
    }

  }, [projectId, projectList]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      const masintonData = Object.assign(newFinancingData, {
        exchangeRate: financingFacilityData.exchangeRate || exchangeRateNominal,
        orderType: mapOrderTypeToDatabase(financingFacilityData.orderType || 'NEW'),
        projectId: financingFacilityData.project?.id,
      });

      masintonMagic(masintonData);

      if (financingFacilityData.project) {
        setProjectDetail(financingFacilityData.project);
      }

      // Get existing partnership values from API attributes
      // Always try to get existing_partnership_smi/customer first, fallback to partnership_smi/customer
      const existingPartnershipSmiFromApi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_smi')?.attributeValue ||
        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_smi')?.attributeValue;
      const existingPartnershipCustomerFromApi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue ||
        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_customer')?.attributeValue;

      // Get existing currency values from API attributes
      // Always try to get existing_currency_smi/customer first, fallback to currency_partnership_smi/customer
      const existingCurrencySmiFromApi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_smi')?.attributeValue ||
        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_smi')?.attributeValue;
      const existingCurrencyCustomerFromApi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_customer')?.attributeValue ||
        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_customer')?.attributeValue;

      if (existingPartnershipSmiFromApi && !existingPartnershipSmi) {
        setExistingPartnershipSmi(existingPartnershipSmiFromApi.toString());
      }
      if (existingPartnershipCustomerFromApi && !existingPartnershipCustomer) {
        setExistingPartnershipCustomer(existingPartnershipCustomerFromApi.toString());
      }
      if (existingCurrencySmiFromApi && !existingCurrencySmi) {
        setExistingCurrencySmi(existingCurrencySmiFromApi);
      }
      if (existingCurrencyCustomerFromApi && !existingCurrencyCustomer) {
        setExistingCurrencyCustomer(existingCurrencyCustomerFromApi);
      }
    }

  }, [financingFacilityData, facilityId, existing]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING' || financingFacilityData?.orderType === 'New From Existing';

  const syariahFormMandatoryEmpty = useMemo(() => {
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
        (!showTooltips && !syariahFormData?.mmq_object) ||
        !syariahFormData?.partnership_smi_facility ||
        syariahFormData?.currency_partnership_smi_facility !== 'IDR' && !syariahFormData?.exchange_rate_partnership_smi_facility ||
        !syariahFormData?.partnership_customer ||
        syariahFormData?.currency_partnership_customer !== 'IDR' && !syariahFormData?.exchange_rate_partnership_customer
      );
    }
    else if (product === 'AL_MURABAHAH') {
      return (
        (!showTooltips && !syariahFormData?.murabahah_object) ||
        !syariahFormData?.purchase_price ||
        syariahFormData?.currency_purchase_price !== 'IDR' && !syariahFormData?.exchange_rate_purchase_price
      );
    }
    else if (product === 'AL_ISTISHNA') {
      return (
        (!showTooltips && !syariahFormData?.istishna_object) ||
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
    else if (product === 'AL_IJARAH') {
      return (
        !syariahFormData?.facility_value ||
        syariahFormData?.currency_facility_value !== 'IDR' && !syariahFormData?.exchange_rate_facility_value ||
        syariahFormData?.currency_facility_value === 'USD' && !syariahFormData?.facility_value_idr
      );
    }
    else if (product === 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ') {
      return (
        !syariahFormData?.facility_value ||
        syariahFormData?.currency_facility_value !== 'IDR' && !syariahFormData?.exchange_rate_facility_value ||
        syariahFormData?.currency_facility_value === 'USD' && !syariahFormData?.facility_value_idr ||
        syariahFormData?.currency_ujroh_value !== 'IDR' && !syariahFormData?.exchange_rate_ujroh ||
        syariahFormData?.currency_ujroh_value === 'USD' && !syariahFormData?.ujroh_value_idr
      );
    }
    else if (product === 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT') {
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
  }, [syariahFormData, product]);

  function handleSubmit() {
    if (financingSegment !== 'SYARIAH') {
      const ignoreValidation = [];
      if (currencyOrderValue === 'IDR') ignoreValidation.push('exchangeRate');
      if (!masintonValidation({ ignoreValidation })) return;
    }

    const tempSyariahData = {
      ...syariahFormData,
      orderValue: formatNumber(syariahFormData?.orderValue),
    };
    const temp = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      exchangeRate: formatNumber(exchangeRate),
      facilityId: facilityId,
      id: !existing ? Number(id) : null,
      module,
      orderValue: formatNumber(orderValue),
      orderValueAfterExchangeRate: formatNumber(orderValueAfterExchangeRate),
      process,
      projectCode: (projectDetail as any)?.projectCode,
      projectId: projectId ? Number(projectId) : null,
      remark: remark === 'null' ? null : remark,
    });

    const payload = financingSegment === 'SYARIAH' ? { ...temp,
      attributes: Object.keys(tempSyariahData).map((item) => {
        return {
          attributeKey: item,
          attributeLabel: '',
          attributeValue: tempSyariahData[item],
        };
      }),
      remark: tempSyariahData['remarks'],
    } : temp;

    saveFinancingFacility(payload);
  };

  const onChangeSyariahForm = (params: {
    masintonForm: MasintonForm;
    masintonChange: (key: string, value: any) => void;
    masintonReplace: (formData: MasintonForm) => void;
  }) => {
    ///Access the Form Value Here/////
    const {
      masintonForm,
    } = params;
    const outputData = Object.fromEntries(
      Object.entries(masintonForm).map(([key, obj]) => [key, obj.value])
    );

    // Save initial values for existing_partnership fields
    // Logic: if existing_partnership_smi is empty, fill with first partnership_smi value
    // Once filled, never change it again
    if (outputData.partnership_smi && !existingPartnershipSmi) {
      setExistingPartnershipSmi(outputData.partnership_smi);
    }
    if (outputData.partnership_customer && !existingPartnershipCustomer) {
      setExistingPartnershipCustomer(outputData.partnership_customer);
    }

    // Save initial values for existing_currency fields
    // Logic: if existing_currency_smi is empty, fill with first currency_partnership_smi value
    // Once filled, never change it again
    if (outputData.currency_partnership_smi && !existingCurrencySmi) {
      setExistingCurrencySmi(outputData.currency_partnership_smi);
    }
    if (outputData.currency_partnership_customer && !existingCurrencyCustomer) {
      setExistingCurrencyCustomer(outputData.currency_partnership_customer);
    }

    setSyariahFormData(outputData);
  };

  const isValueInList = (value: string, list: any[]) => {
    if (!value || !list) return false;
    return list.some((item) => item.value === value || item.key === value);
  };

  const getDisplayValue = (value: string, list: any[]) => {
    if (!value || !list) return '';
    return isValueInList(value, list) ? value : '';
  };

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

  return {
    currencyDropdownList,
    existing,
    financingFacilityData,
    financingSegmentList,
    governmentMandateList,
    handleSubmit,
    hasSyariahMappingError,
    isOrderValueUnchanged,
    mappingOrderTypeList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    onChangeSyariahForm,
    orderTypeList: orderType,
    productList,
    projectDetail,
    projectList,
    syariahComponentConfig,
    syariahFormMandatoryEmpty,
  };
};

export default usePopupFormFacility;
