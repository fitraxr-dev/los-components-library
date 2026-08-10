import { useEffect } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useMasintonForm from '@/hooks/useMasintonForm';

import { AlIstishnaData } from './AlIstishna.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlIstishna = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, existing, facilityId } = props;

  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: Dselling_price_payment_method } = useGetParameterList('sellingPricePaymentMethod');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const _financingSegment = useFinancingSegment();
  const _formData = Object.assign(AlIstishnaData, { financingSegment: { value: _financingSegment } });

  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
  } = useMasintonForm(_formData);


  const {
    exchange_rate_purchase_price: { value: exchange_rate_purchase_price },
    purchase_price: { value: purchase_price },
    down_payment: { value: down_payment },
    exchange_rate_down_payment: { value: exchange_rate_down_payment },
    istishna_margin: { value: istishna_margin },
    exchange_rate_istishna_margin: { value: exchange_rate_istishna_margin },
    istishna_installment: { value: istishna_installment },
    exchange_rate_istishna_installment: { value: exchange_rate_istishna_installment },
    exchange_rate_selling_price: { value: exchange_rate_selling_price },
    selling_price: { value: selling_price },
  } = masintonForm;

  useEffect(() => {
    const new_purchase_price_idr = multiplyNominalValues(purchase_price, exchange_rate_purchase_price);
    masintonChange('purchase_price_idr', new_purchase_price_idr);
  }, [purchase_price, exchange_rate_purchase_price]);

  useEffect(() => {
    const new_down_payment_idr =
    multiplyNominalValues(down_payment, exchange_rate_down_payment);
    masintonChange('down_payment_idr', new_down_payment_idr);
  }, [down_payment, exchange_rate_down_payment]);

  useEffect(() => {
    const new_istishna_margin_idr = multiplyNominalValues(istishna_margin, exchange_rate_istishna_margin);
    masintonChange('istishna_margin_idr', new_istishna_margin_idr);
  }, [istishna_margin, exchange_rate_istishna_margin]);

  useEffect(() => {
    const new_istishna_installment_idr =
    multiplyNominalValues(istishna_installment, exchange_rate_istishna_installment);
    masintonChange('istishna_installment_idr', new_istishna_installment_idr);
  }, [istishna_installment, exchange_rate_istishna_installment]);

  useEffect(() => {
    const new_selling_price_idr = multiplyNominalValues(selling_price, exchange_rate_selling_price);
    masintonChange('selling_price_idr', new_selling_price_idr);
  }, [selling_price, exchange_rate_selling_price]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      const masintonData = Object.assign(newFinancingData, {
        projectId: financingFacilityData.project?.id,
      });
      masintonMagic(masintonData);
    }
  }, [financingFacilityData]);

  useEffect(() => {
    onChangeSyariahForm(
      {
        masintonChange: masintonChange,
        masintonForm: masintonForm,
        masintonReplace: masintonReplace,
      });
  }, [masintonForm]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  return {
    Dselling_price_payment_method,
    currencyDropdownList,
    governmentMandateList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default useAlIstishna;
