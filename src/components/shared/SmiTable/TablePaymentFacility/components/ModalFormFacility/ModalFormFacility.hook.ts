import { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { mapOrderTypeToDatabase } from '@/helpers/orderTypeMapping';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { capitalize } from '@/helpers/string';
import { convertToDocx } from '@/helpers/synfusion';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetParamComponentSyariah from '@/hooks/services/useGetParamComponentSyariah';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useSegmentFinancing from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import useGetDetailProcessingType from '@/components/shared/SmiSection/PK/hooks/useGetDetailProcessingType';

import useGetFinancingFacility from '../../hooks/useGetFinancingFacility';
import useGetProjectList from '../../hooks/useGetProjectList';
import useSaveFinancingFacility from '../../hooks/useSaveFinancingFacility';
import useSaveMappingFacility from '../../hooks/useSaveMappingFacility';
import useSaveSyndicationOtherBucket from '../../hooks/useSaveSyndicationOtherBucket';
import useSendFacilityEmail from '../../hooks/useSendFacilityEmail';
import { modal } from '../../TablePaymentFacility.constants';

import { formData, validation } from './ModalFormFacility.form';

import type { ProjectDto } from '@/services/openapi/master-service';


const useModalFormFacility = (props: SmiComponentProps) => {
  const { id, type, module, process } = props;
  const queryClient = useQueryClient();
  const existing = type === 'existing';

  const { processId, facilityId, debtorId, parentId } = useIdentity();
  const _segmentFinancing = useSegmentFinancing();
  const _formData = Object.assign(formData, { financingSegment: { value: _segmentFinancing } });
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const exchangeRateNominal = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;


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
    data: financingFacilityData,
    isSuccess: isFinancingFacilitySuccess,
  } = useGetFinancingFacility({ bucketProcessId: processId, facilityId });

  const method = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [container, setContainer] = useState<any>(null);

  const { mutateAsync: saveSyndicationOtherAsync } = useSaveSyndicationOtherBucket({
    onError: (e: any) => console.error(e),
    onSuccess: () => {},
  });

  useEffect(() => {
    if (financingFacilityData) {
      const content = financingFacilityData;
      if (!content) return;

      const feeList = content.typeOfFeeList?.map((item: any) => ({
        feeId: item.feeId,
        feeType: item.typeOfFee,
        isEditable: item.isEditable,
        nominal: { currency: item.currencyNominal || 'IDR', value: item.nominal },
        remarks: item.remarksFee,
      })) || [];

      const krediturList = content.bankInformationList?.map((item: any) => ({
        amount: { currency: item.currency || 'IDR', value: item.amount },
        bankInformationId: item.bankInformationId,
        isEditable: item.isEditable,
        jenisKreditur: item.bankType,
        namaKreditur: item.bankName ? { id: item.bankName, label: item.bankName } : null,
      })) || [];

      const agentList = content.agentInformationList?.map((item: any) => ({
        agentId: item.agentId,
        agentType: item.agentType,
        bankName: item.bankName ? { id: item.bankName, label: item.bankName } : null,
        bankType: item.bankType,
        isEditable: item.isEditable,
      })) || [];

      method.reset({
        ...content,
        agentList,
        feeList,
        krediturList,
      });

    }
  }, [financingFacilityData]);


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
    rateType: { value: rateType },
    floatingReference: { value: floatingReference },
    childFacilityAlias: { value: childFacilityAlias },
    rates: { value: rates },
    withdrawalPeriod: { value: withdrawalPeriod },
    timePeriod: { value: timePeriod },
    gracePeriod: { value: gracePeriod },
    financingObjectives: { value: financingObjectives },
  } = masintonForm;

  const [productModule, setProductModule] = useState(`product${capitalize(financingSegment.toLowerCase())}`);
  const [mappingProductModule, setMappingProductModule] = useState(`${mappingFinancingSegment === 'syariah' ? 'mappingProductSyariah' : 'product' + capitalize(mappingFinancingSegment?.toLowerCase())}`);

  const [projectDetail, setProjectDetail] = useState<ProjectDto>({});
  const [syariahFormData, setSyariahFormData] = useState(null);
  const [projectField, setProjectField] = useState('');
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

  const { data: mappingProductList } = useGetParameterList(mappingProductModule);

  const mappingFinancingSegmentList = [
    { label: 'Konven', value: 'KONVEN' },
    { label: 'Syariah', value: 'SYARIAH' }
  ];
  const { data: orderType } = useGetParameterList(Modules.ORDER_TYPE);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT);
  const { data: mapOrderTypeList } = useGetParameterList(Modules.MAPPING_ORDER_TYPE);
  const { data: productList } = useGetParameterList(productModule, {
    id: 'id',
    label: 'value1',
    value: 'key',
    value2: 'value2',
  });
  const { data: floatingReferenceOptions } = useGetParameterList('referensiFloatingTemenos', {
    id: 'key',
    label: 'value1',
  });
  const { data: rateTypeOptions } = useGetParameterList('rateTypeFacility', {
    id: 'key',
    label: 'value1',
  });

  const { data: governmentMandateList } = useGetParameterList(Modules.GOVERMENT_MANDATE);
  const projectListPayload = useMemo(() => ({
    bucketProcessId: processId,
    debtorId,
    module,
    name: projectField,
    process,
  }), [processId, debtorId, module, projectField, process]);

  const { data: resultProject } = useGetProjectList(projectListPayload);


  const coreMappingProcesses = [TypeProcess.ENGAGEMENT_AGREEMENT, TypeProcess.LPS_CORE];
  const isCoreMappingProcess = coreMappingProcesses.includes(process as TypeProcess);

  const selectedProduct = useMemo(() => {
    if (financingSegment === 'SYARIAH' && product && productList?.length) {
      return productList.find((p) => p.value === product || p.key === product);
    }
    return null;
  }, [financingSegment, product, productList]);

  const selectedProductId = selectedProduct?.id || null;
  const paymentSchemeValue = selectedProduct?.value2 || product;

  const isEnabled = financingSegment === 'SYARIAH' && !!selectedProductId && selectedProductId !== null;

  const {
    data: syariahComponentConfig,
    error: syariahComponentError,
    isError: isSyariahComponentError,
  } = useGetParamComponentSyariah({
    enabled: isEnabled,
    id: selectedProductId || 0,
  });

  const { data: pkDetail } = useGetDetailProcessingType({
    bucketProcessId: parentId,
    id: 0,
  });

  const { mutate: saveMappingFacility } = useSaveMappingFacility({});
  const { mutate: sendFacilityEmail } = useSendFacilityEmail({});

  const isWhiteListProcess = (module === TypeModule.ENGAGEMENT_AGREEMENT &&
    process === TypeProcess.ENGAGEMENT_AGREEMENT) ||
    (module === TypeModule.LPS && process === TypeProcess.LPS_CORE);

  const isAnyFieldChanged = useMemo(() => {
    if (!financingFacilityData || !existing) return false;

    const normalizeValue = (value: any) => {
      if (value === null || value === undefined) return '';
      const strValue = value.toString().replace(/,/g, '');
      const numValue = parseFloat(strValue);
      return isNaN(numValue) ? strValue : numValue.toFixed(2);
    };

    // Check basic fields
    const fieldsToCompare = [
      { current: orderValue, original: financingFacilityData.orderValue },
      { current: currencyOrderValue, original: financingFacilityData.currencyOrderValue },
      { current: rates, original: financingFacilityData.rates },
      { current: withdrawalPeriod, original: (financingFacilityData as any).withdrawalPeriod },
      { current: timePeriod, original: (financingFacilityData as any).timePeriod },
      { current: gracePeriod, original: (financingFacilityData as any).gracePeriod },
      { current: financingObjectives, original: (financingFacilityData as any).financingObjectives },
      { current: remark, original: financingFacilityData.remark },
      { current: projectId, original: financingFacilityData.project?.id },
      { current: governmentMandate, original: financingFacilityData.governmentMandate },
    ];

    for (const field of fieldsToCompare) {
      if (normalizeValue(field.current) !== normalizeValue(field.original)) {
        return true;
      }
    }

    // Check Syariah attributes if applicable
    if (financingSegment === 'SYARIAH' && syariahFormData && financingFacilityData.attributes) {
      for (const [key, value] of Object.entries(syariahFormData)) {
        const originalAttr = financingFacilityData.attributes.find((attr: any) => attr.attributeKey === key);
        if (originalAttr && normalizeValue(value) !== normalizeValue(originalAttr.attributeValue)) {
          return true;
        }
      }
    }

    return false;
  }, [financingFacilityData, masintonForm, syariahFormData, existing, financingSegment]);

  // Force checkbox checked for ADD NEW + existing mode
  useEffect(() => {
    if (!facilityId && existing && financingFacilityData) {
      setIsOrderValueUnchanged(true);
    } else if (!facilityId && existing) {
      setIsOrderValueUnchanged(true);
    }
  }, [facilityId, existing, financingFacilityData]);

  const { mutate: saveFinancingFacility } = useSaveFinancingFacility({
    onError: (error: any) => {
      const errorDetail = error?.response?.data?.errorDetail || error?.message || 'Failed to read request';
      showNiceModalV2({ title: errorDetail, type: 'error' });
    },
    onSuccess: async (data: any) => {
      if (container && container.documentEditor) {
        try {
          const blob = await convertToDocx(container);
          await saveSyndicationOtherAsync({
            bucketProcessId: processId,
            facilityId: facilityId || data?.data?.content?.facilityId,
            other: blob,
          });
        } catch (error) {
          console.error('Error saving syndication other:', error);
        }
      }
      if (module === TypeModule.LPS && process === TypeProcess.LPS_CORE) {
        saveMappingFacility({
          bucketProcessId: pkDetail?.bucketProcessId ?? null,
          financingFacilities: [
            {
              facilityId: data?.data?.content?.facilityId,
              financingFacilityId: data?.data?.content?.id,
            },
          ],
          module: TypeModule.LPS,
          process: TypeProcess.LPS_CORE,
        });
      }

      closeNiceModal(modal.PAYMENT_FACILITY_FORM).then(() => {
        showNiceModalV2({
          onClose: () => {
            masintonReset();
            // I don't know what this does, but if you do it inside onSuccess useSaveFinancingFacility,
            // it will make the modal can't be closed #Kurniawan
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
            queryClient.invalidateQueries({ queryKey: ['financing-facilities']});
            queryClient.invalidateQueries({ queryKey: ['financing-facility']});
            queryClient.invalidateQueries({ queryKey: ['financing-facility-list']}); //table mip
            queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']}); //table mip
            queryClient.invalidateQueries({ queryKey: ['financing-facility-summary-list']}); //table mup
            queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']}); //table mup
            queryClient.invalidateQueries({ queryKey: ['pipeline']});
            queryClient.invalidateQueries({ queryKey: ['bucket-financing-facility']});
            queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});
          },
          title: 'Fasilitas pembiayaan berhasil ditambahkan',
          type: 'success',
        });
      });
    },
  });

  useEffect(() => {
    if (financingSegment) {
      masintonChange('mappingProduct', '');
      masintonChange('mappingFinancingSegment', '');
      setProductModule(`product${capitalize(financingSegment.toLowerCase())}`);
      masintonChange('product', '');
    }
  }, [financingSegment]);

  useEffect(() => {
    if (mappingFinancingSegment) {
      const isPemdaKonven = financingSegment?.toLowerCase() === 'pemda' &&
        mappingFinancingSegment?.toLowerCase() === 'konven';
      const isSyariah = mappingFinancingSegment?.toLowerCase() === 'syariah';
      const mappingProductParam = isPemdaKonven
        ? 'mappingProductPemdaKonven'
        : isSyariah ? 'mappingProductSyariah' : `product${mappingFinancingSegment.toLowerCase()}`;
      setMappingProductModule(mappingProductParam);
      masintonChange('mappingProduct', '');
    }
  }, [mappingFinancingSegment, mappingProductList]);

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
          const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
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

  const projectList = useMemo(() => {
    const list = resultProject?.map((project) => ({
      ...project,
      label: project.name,
      originalValue: project.value,
      value: String(project.id),
      value2: project.value,
    })) || [];

    if (financingFacilityData?.project &&
      !list.some((p) => Number(p.id) === Number(financingFacilityData.project.id))) {
      list.push({
        ...financingFacilityData.project,
        id: financingFacilityData.project.id,
        label: financingFacilityData.project.name,
        originalValue: (financingFacilityData.project as any)?.value,
        value: String(financingFacilityData.project.id),
        value2: (financingFacilityData.project as any)?.value,
      } as any);
    }

    return list;
  }, [resultProject, financingFacilityData]);

  useEffect(() => {
    if (!projectId) {
      setProjectDetail({});
      return;
    }

    const project = projectList?.find((p) => Number(p.id) === Number(projectId));
    if (project) {
      if (projectDetail?.id !== project.id || projectDetail?.value !== project.originalValue) {
        setProjectDetail({
          ...project,
          value: project.originalValue,
        });
      }
    } else if (financingFacilityData?.project && Number(financingFacilityData.project.id) === Number(projectId)) {
      setProjectDetail(financingFacilityData.project);
    }

  }, [projectId, projectList, financingFacilityData]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      const masintonData = Object.assign(newFinancingData, {
        childFacilityAlias: financingFacilityData?.childFacilityAlias || '',
        exchangeRate: financingFacilityData.exchangeRate || exchangeRateNominal,
        floatingReference: financingFacilityData?.floatingReference || '',
        mappingFinancingSegment: financingFacilityData?.mappingFinancingSegment || '',
        mappingOrderType: financingFacilityData?.mappingOrderType || '',
        mappingProduct: financingFacilityData?.mappingProduct || '',
        orderType: mapOrderTypeToDatabase(financingFacilityData.orderType || 'NEW'),
        projectId: financingFacilityData.project?.id,
        rateType: financingFacilityData?.rateType || '',
      });

      masintonMagic(masintonData);

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
    if (financingFacilityData) {
      masintonChange('mappingProduct', financingFacilityData?.mappingProduct);
    }
  }, [financingFacilityData, mappingProductList]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING' || financingFacilityData?.orderType === 'New From Existing';

  const syariahFormMandatoryEmpty = useMemo(() => {
    if (paymentSchemeValue === 'AL_MUSYARAKAH') {
      return (
        !syariahFormData?.partnership_smi ||
        syariahFormData?.currency_partnership_smi !== 'IDR' && !syariahFormData?.exchange_rate_partnership_smi ||
        !syariahFormData?.partnership_customer ||
        syariahFormData?.currency_partnership_customer !== 'IDR' && !syariahFormData?.exchange_rate_partnership_customer
      );
    }
    else if (paymentSchemeValue === 'AL_MUSYARAKAH_MUTANAQISAH_MMQ') {

      return (
        (!showTooltips && !syariahFormData?.mmq_object) ||
        !syariahFormData?.partnership_smi_facility ||
        syariahFormData?.currency_partnership_smi_facility !== 'IDR' && !syariahFormData?.exchange_rate_partnership_smi_facility ||
        !syariahFormData?.partnership_customer ||
        syariahFormData?.currency_partnership_customer !== 'IDR' && !syariahFormData?.exchange_rate_partnership_customer
      );
    }
    else if (paymentSchemeValue === 'AL_MURABAHAH') {
      return (
        (!showTooltips && !syariahFormData?.murabahah_object) ||
        !syariahFormData?.purchase_price ||
        syariahFormData?.currency_purchase_price !== 'IDR' && !syariahFormData?.exchange_rate_purchase_price
      );
    }
    else if (paymentSchemeValue === 'AL_ISTISHNA') {
      return (
        (!showTooltips && !syariahFormData?.istishna_object) ||
        !syariahFormData?.purchase_price ||
        syariahFormData?.currency_purchase_price !== 'IDR' && !syariahFormData?.exchange_rate_purchase_price
      );
    }
    else if (paymentSchemeValue === 'AL_QARDH') {
      return (
        !syariahFormData?.al_qardh_loan_amount ||
        syariahFormData?.currency_al_qardh_loan_amount !== 'IDR' && !syariahFormData?.exchange_rate_al_qardh_loan
      );
    }
    else if (paymentSchemeValue === 'AL_IJARAH') {
      return (
        !syariahFormData?.facility_value ||
        syariahFormData?.currency_facility_value !== 'IDR' && !syariahFormData?.exchange_rate_facility_value ||
        syariahFormData?.currency_facility_value === 'USD' && !syariahFormData?.facility_value_idr
      );
    }
    else if (paymentSchemeValue === 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ') {
      return (
        !syariahFormData?.facility_value ||
        syariahFormData?.currency_facility_value !== 'IDR' && !syariahFormData?.exchange_rate_facility_value ||
        syariahFormData?.currency_facility_value === 'USD' && !syariahFormData?.facility_value_idr ||
        syariahFormData?.currency_ujroh_value !== 'IDR' && !syariahFormData?.exchange_rate_ujroh ||
        syariahFormData?.currency_ujroh_value === 'USD' && !syariahFormData?.ujroh_value_idr
      );
    }
    else if (paymentSchemeValue === 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT') {
      return (
        !syariahFormData?.facility_value ||
        syariahFormData?.currency_facility_value !== 'IDR' && !syariahFormData?.exchange_rate_facility_value ||
        syariahFormData?.currency_facility_value === 'USD' && !syariahFormData?.facility_value_idr
      );
    }
    else if (paymentSchemeValue === 'AL_MUDHARABAH') {
      return (
        !syariahFormData?.mudharabah_fund ||
        syariahFormData?.currency_mudharabah_fund !== 'IDR' && !syariahFormData?.exchange_rate_mudharabah_fund ||
        syariahFormData?.currency_mudharabah_fund === 'USD' && !syariahFormData?.mudharabah_fund_idr
      );
    }
  }, [syariahFormData, paymentSchemeValue]);

  function handleSubmit() {
    const ignoreValidation = [];

    if (financingSegment !== 'SYARIAH') {
      ignoreValidation.push(
        'mappingOrderType',
        'mappingFinancingSegment',
        'mappingProduct',
        'rateType',
        'floatingReference',
        'childFacilityAlias'
      );
    } else {
      ignoreValidation.push('orderValue');
      if (!isCoreMappingProcess) {
        ignoreValidation.push(
          'mappingOrderType',
          'mappingFinancingSegment',
          'mappingProduct',
          'rateType',
          'floatingReference',
          'childFacilityAlias'
        );
      } else {
        if (rateType?.toUpperCase() !== 'FLOATING') ignoreValidation.push('floatingReference');
      }
    }

    if (currencyOrderValue === 'IDR') ignoreValidation.push('exchangeRate');

    if (!masintonValidation({ ignoreValidation })) return;

    const tempSyariahData = {
      ...syariahFormData,
      orderValue: formatNumber(syariahFormData?.orderValue),
    };
    const syariahExchangeRate = syariahFormData?.exchange_rate_global ||
      syariahFormData?.exchange_rate_purchase_price ||
      syariahFormData?.exchange_rate_facility_value ||
      syariahFormData?.exchange_rate_al_qardh_loan ||
      syariahFormData?.exchange_rate_mudharabah_fund;

    const finalRate = formatNumber(syariahExchangeRate || exchangeRate);

    // Update mapping-specific exchange rate fields in tempSyariahData
    if (financingSegment === 'SYARIAH' && tempSyariahData) {
      if (paymentSchemeValue === 'AL_MUSYARAKAH') {
        tempSyariahData['exchange_rate_partnership_smi'] = finalRate;
        tempSyariahData['exchange_rate_partnership_customer'] = finalRate;
      } else if (paymentSchemeValue === 'AL_MUSYARAKAH_MUTANAQISAH_MMQ') {
        tempSyariahData['exchange_rate_partnership_smi_facility'] = finalRate;
        tempSyariahData['exchange_rate_partnership_customer'] = finalRate;
        tempSyariahData['exchange_rate_global'] = finalRate;
      } else if (paymentSchemeValue === 'AL_MURABAHAH' || paymentSchemeValue === 'AL_ISTISHNA') {
        tempSyariahData['exchange_rate_purchase_price'] = finalRate;
      } else if (paymentSchemeValue === 'AL_QARDH') {
        tempSyariahData['exchange_rate_al_qardh_loan'] = finalRate;
      } else if (['AL_IJARAH', 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ', 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT'].includes(paymentSchemeValue)) {
        tempSyariahData['exchange_rate_facility_value'] = finalRate;
      } else if (paymentSchemeValue === 'AL_MUDHARABAH') {
        tempSyariahData['exchange_rate_mudharabah_fund'] = finalRate;
      }
    }

    const temp = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      exchangeRate: finalRate,
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

    const methodValues = method.getValues();

    const agentInformationList = methodValues?.agentList?.map((item: any) => ({
      agentId: item.agentId || null,
      agentType: item.agentType,
      bankName: typeof item.bankName === 'object' ? item.bankName?.label : item.bankName,
      bankType: item.bankType,
    })) || [];

    const bankInformationList = methodValues?.krediturList?.map((item: any) => ({
      amount: Number(item.amount?.value) || 0,
      bankInformationId: item.bankInformationId || null,
      bankName: typeof item.namaKreditur === 'object' ? item.namaKreditur?.label : item.namaKreditur,
      bankType: item.jenisKreditur,
      currency: item.amount?.currency || 'IDR',
    })) || [];

    const typeOfFeeList = methodValues?.feeList?.map((item: any) => ({
      currencyNominal: item.nominal?.currency || 'IDR',
      feeId: item.feeId || null,
      nominal: Number(item.nominal?.value) || 0,
      remarksFee: item.remarks,
      typeOfFee: item.feeType,
    })) || [];

    const payload = financingSegment === 'SYARIAH' ? {
      ...temp,
      agentInformationList,
      attributes: Object.keys(tempSyariahData).map((item) => {
        return {
          attributeKey: item,
          attributeLabel: '',
          attributeValue: tempSyariahData[item],
        };
      }),
      bankInformationList,
      isSyndicated: methodValues?.isSyndicated?.[0] || null,
      remark: tempSyariahData['remarks'],
      remarkCreditor: methodValues?.remark,
      typeOfFeeList,
    } : {
      ...temp,
      agentInformationList,
      bankInformationList,
      isSyndicated: methodValues?.isSyndicated?.[0] || null,
      remarkCreditor: methodValues?.remark,
      typeOfFeeList,
    };

    const shouldShowAlertAndEmail = isWhiteListProcess && existing && isAnyFieldChanged;

    const executeSave = () => {
      saveFinancingFacility(payload, {
        onSuccess: async (data: any) => {
          if (shouldShowAlertAndEmail) {
            sendFacilityEmail({
              bucketProcessId: processId,
              debtorId: debtorId,
              facilityId: data?.data?.content?.facilityId,
            });
          }
        },
      });
    };

    if (shouldShowAlertAndEmail) {
      showNiceModalV2({
        onSubmit: () => {
          executeSave();
        },
        submitText: 'Yes',
        title: 'Data yang dipilih memerlukan pembaruan di Temenos. Kirim permintaan perubahan?',
        type: 'warning',
      });
    } else {
      executeSave();
    }
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

    const syariahExchangeRate = outputData.exchange_rate_global ||
      outputData.exchange_rate_purchase_price ||
      outputData.exchange_rate_facility_value ||
      outputData.exchange_rate_al_qardh_loan ||
      outputData.exchange_rate_mudharabah_fund;

    if (syariahExchangeRate && syariahExchangeRate !== exchangeRate) {
      masintonChange('exchangeRate', syariahExchangeRate);
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

  const autoSavePayload = useMemo(() => () => {
    const tempSyariahData = {
      ...syariahFormData,
      orderValue: formatNumber(syariahFormData?.orderValue),
    };

    const syariahExchangeRate = syariahFormData?.exchange_rate_global ||
      syariahFormData?.exchange_rate_purchase_price ||
      syariahFormData?.exchange_rate_facility_value ||
      syariahFormData?.exchange_rate_al_qardh_loan ||
      syariahFormData?.exchange_rate_mudharabah_fund;

    const finalRate = formatNumber(syariahExchangeRate || exchangeRate);

    // Update mapping-specific exchange rate fields in tempSyariahData
    if (financingSegment === 'SYARIAH' && tempSyariahData) {
      if (paymentSchemeValue === 'AL_MUSYARAKAH') {
        tempSyariahData['exchange_rate_partnership_smi'] = finalRate;
        tempSyariahData['exchange_rate_partnership_customer'] = finalRate;
      } else if (paymentSchemeValue === 'AL_MUSYARAKAH_MUTANAQISAH_MMQ') {
        tempSyariahData['exchange_rate_partnership_smi_facility'] = finalRate;
        tempSyariahData['exchange_rate_partnership_customer'] = finalRate;
        tempSyariahData['exchange_rate_global'] = finalRate;
      } else if (paymentSchemeValue === 'AL_MURABAHAH' || paymentSchemeValue === 'AL_ISTISHNA') {
        tempSyariahData['exchange_rate_purchase_price'] = finalRate;
      } else if (paymentSchemeValue === 'AL_QARDH') {
        tempSyariahData['exchange_rate_al_qardh_loan'] = finalRate;
      } else if (['AL_IJARAH', 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ', 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT'].includes(paymentSchemeValue)) {
        tempSyariahData['exchange_rate_facility_value'] = finalRate;
      } else if (paymentSchemeValue === 'AL_MUDHARABAH') {
        tempSyariahData['exchange_rate_mudharabah_fund'] = finalRate;
      }
    }

    const temp = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      exchangeRate: finalRate,
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

    const payload = financingSegment === 'SYARIAH' ? {
      ...temp,
      attributes: Object.keys(tempSyariahData).map((item) => ({
        attributeKey: item,
        attributeLabel: '',
        attributeValue: tempSyariahData[item],
      })),
      remark: tempSyariahData['remarks'],
    } : temp;

    return Promise.resolve(payload);
  }, [
    syariahFormData,
    masintonSubmit,
    processId,
    facilityId,
    id,
    existing,
    module,
    process,
    orderValue,
    exchangeRate,
    orderValueAfterExchangeRate,
    projectDetail,
    projectId,
    remark,
    financingSegment
  ]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!facilityId,
    payload: autoSavePayload,
    url: 'bucket.manage.saveFacility',
  });

  return {
    container,
    currencyDropdownList,
    existing,
    financingFacilityData,
    financingSegmentList,
    floatingReferenceOptions,
    governmentMandateList,
    handleSubmit,
    hasSyariahMappingError,
    isAutoSaveFetching,
    isOrderValueUnchanged,
    mapOrderTypeList,
    mappingFinancingSegmentList,
    mappingProductList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    method,
    onChangeSyariahForm,
    orderTypeList: orderType,
    paymentScheme: paymentSchemeValue,
    productList,
    projectDetail,
    projectList,
    rateTypeOptions,
    setContainer,
    setProjectField,
    syariahComponentConfig,
    syariahFormMandatoryEmpty,
  };
};

export default useModalFormFacility;
