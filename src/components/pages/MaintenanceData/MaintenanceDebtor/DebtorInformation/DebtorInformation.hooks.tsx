import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetDebtorDetail from '../hooks/useGetDebtorDetail';
import useStoreDebtor from '../hooks/useStoreDebtor';

import { tabItems } from './DebtorInformation.constants';


const useDebtorInformation = () => {
  const { debtorId, processId } = useIdentity();

  const { data: storeData, isLoading: isStoreLoading } = useGetDebtorDetail({
    bucketProcessId: processId,
    debtorId,
  });

  const methods = useForm({
    defaultValues: {
      anotherInformation: {},
      apuPptResponse: {},
      bucketProcessId: null,
      debtorId,
      debtorIdentity: {},
      generalInformation: {},
    },
  });

  useEffect(() => {
    if (storeData) {
      const {
        identity,
        anotherInformation,
        apuPptResponse,
        bucketProcessId,
        debtorId,
        generalInformation,
      } = storeData;

      methods.reset({
        anotherInformation: {
          ...anotherInformation,
          affiliate: storeData.anotherInformation.affiliate.key,
          relation: storeData.anotherInformation.relation.key,
        },
        apuPptResponse,
        bucketProcessId,
        debtorId,
        debtorIdentity: {
          ...identity,
          address: identity.address,
          city: identity.city,
          country: identity.country,
          district: identity.district,
          dob: identity.dob,
        },
        generalInformation: {
          ...generalInformation,
          country: storeData.generalInformation.country.key,
          dataSource: storeData.generalInformation.dataSource.key,
          debtorCategory: storeData.generalInformation.debtorCategory.key,
          debtorType: storeData.generalInformation.debtorType.key,
          defineSector: storeData.generalInformation.defineSector.key,
          district: storeData.generalInformation.district.key,
          institutionType: storeData.generalInformation.institutionType.key,
          province: storeData.generalInformation.province.key,
          sectorInfrastructure: storeData.generalInformation.sectorInfrastructure.key,
          subDistrict: storeData.generalInformation.subDistrict.key,
          village: storeData.generalInformation.village.key,
        },
      });
    }
  }, [storeData]);

  const { mutate: saveDebtorDetail } = useStoreDebtor(
    {
      onError: () => {
        showNiceModalV2({ type: 'error' });
      },
      onSuccess: () => {
        showNiceModalV2({ type: 'success' });
      },
    }
  );

  const handleSaveDebtorDetail = () => {
    saveDebtorDetail({
      anotherInformation: methods.getValues('anotherInformation'),
      apuPptRequest: methods.getValues('apuPptResponse'),
      debtorId,
      generalInformation: methods.getValues('generalInformation'),
      identity: methods.getValues('identity'),
    });
  };

  const [activeTab, setActiveTab] = useSessionStorage('maintenance-debtor-tab', tabItems[0].value);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  return {
    activeTab,
    handleChangeTab,
    handleSaveDebtorDetail,
    methods,
    processId,
    storeData,
  };
};

export default useDebtorInformation;
