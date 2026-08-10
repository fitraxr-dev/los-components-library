import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';

import { CurrencyLOV } from '@/configs/constants/lov';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListRaw from '@/hooks/services/useGetParameterListRaw';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';
import Autocomplete from '@/components/shared/Autocomplete';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';

import useGetFacilityInformationDetail from '../../../../hooks/FacilityInformation/useGetFacilityInformation';
import useGetSyndicationInformationDetail from '../../../../hooks/SyndicationInformation/useGetSyndicationInformation';
import useSaveSyndicationInformation from '../../../../hooks/SyndicationInformation/useSaveSyndicationInformation';
import useSaveSyndicationInformationOther from '../../../../hooks/SyndicationInformation/useSaveSyndicationInformationOther';

import { schema } from './InformasiSindikasiTab.schema';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const BankNameCell = ({ index, control }: { index: number; control: any }) => {
  const bankType = useWatch({
    control,
    name: `agentList.${index}.bankType`,
  });

  const { data: bankList } = useGetParameterList(bankType || '', {
    id: 'value2',
    label: 'value1',
  });

  return (
    <Controller
      name={`agentList.${index}.bankName`}
      control={control}
      render={({ field }) => (
        <Autocomplete
          placeholder="Choose Bank Name"
          dropdownList={bankList}
          value={field.value}
          onChange={(val) => { field.onChange(val); }}
        />
      )}
    />
  );
};

const KrediturNameCell = ({ index, control }: { index: number; control: any }) => {
  const jenisKreditur = useWatch({
    control,
    name: `krediturList.${index}.jenisKreditur`,
  });

  const { data: bankList } = useGetParameterList(jenisKreditur || '', {
    id: 'value2',
    label: 'value1',
  });

  return (
    <Box sx={{ flex: 2 }}>
      <Controller
        name={`krediturList.${index}.namaKreditur`}
        control={control}
        render={({ field }) => (
          <Autocomplete
            placeholder="Choose Nama Kreditur"
            dropdownList={bankList}
            value={field.value}
            onChange={(val) => { field.onChange(val); }}
          />
        )}
      />
    </Box>
  );
};

const useInformasiSindikasi = () => {
  const { recordActivity } = useRecordLog();
  const searchParams = useSearchParams();
  const params = useParams();
  const { id, processId } = params;

  const canEdit = searchParams.get('isEdit') === 'true';
  const isOrderType = searchParams.get('orderType');

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view detail manajemen fasilitas conventional informasi sindikasi',
    });
  }, []);

  const { data: dataTabSyndication } = useGetSyndicationInformationDetail(
    {
      ...payloadFilterList(processId as string),
      facilityId: id as string,
    }
  );

  const { data: facilityInformation } = useGetFacilityInformationDetail(
    {
      ...payloadFilterList(processId as string),
      facilityId: id as string,
    }
  );

  const { data: typeOfFeeList } = useGetParameterList('typeOfFee');
  const { data: agentTypeList } = useGetParameterList('agentType');

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchFields = methods.watch();

  //bank Information
  const { data: bankTypeList } = useGetParameterList('bankType', {
    label: 'value1',
    value: 'value2',
  });

  const [container, setContainer] = useState(null);

  const initialSectionFormat = {
    bottomMargin: 5.00,
    footerDistance: 0,
    headerDistance: 0,
    leftMargin: 5.00,
    pageHeight: 792,
    pageWidth: 447.30,
    rightMargin: 5.00,
    topMargin: 0.00,
  };

  const { fields: krediturFields, append: appendKreditur, remove: removeKreditur } = useFieldArray({
    control: methods.control,
    name: 'krediturList',
  });

  const handleAddKrediturItem = () => {
    appendKreditur({ amount: null, jenisKreditur: '', namaKreditur: '' });
  };

  const handleDeleteKrediturItem = (index: number) => {
    removeKreditur(index);
  };

  const tableHeaderKreditur: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      type: 'index',
    },
    {
      key: 'creditur',
      label: 'Kreditur',
      render: (_: any, index: number) => (
        <Box display="flex" gap={2}>
          <Controller
            name={`krediturList.${index}.jenisKreditur`}
            control={methods.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Choose Jenis Kreditur"
                type="dropdown"
                dropdownList={bankTypeList}
                containerSx={{ flex: 1 }}
                onChange={(e) => {
                  field.onChange(e);
                  methods.setValue(`krediturList.${index}.namaKreditur`, null);
                }}
              />
            )}
          />
          <KrediturNameCell index={index} control={methods.control} />
        </Box>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (_: any, index: number) => (
        <Controller
          name={`krediturList.${index}.amount`}
          control={methods.control}
          render={({ field }) => (
            <Currency
              {...field}
              placeholder="Input Amount"
              onChange={(val) => {
                field.onChange(val);
              }}
              value={{
                currency: field?.value?.currency || 'IDR',
                value: field.value?.value?.toString() || 0,
              }}
              currencyList={CurrencyLOV()}
            />
          )}
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          // isHidden: !canEdit,
          onClick: (_, index) => handleDeleteKrediturItem(index),
        },
      ],
      sx: { width: '4vw' },
      type: 'action',
    },
  ];

  const { fields: agentFields, append: appendAgent, remove: removeAgent } = useFieldArray({
    control: methods.control,
    name: 'agentList',
  });

  const handleAddAgentItem = () => {
    appendAgent({ agentType: '', bankName: null, bankType: '' });
  };

  const handleDeleteAgentItem = (index: number) => {
    removeAgent(index);
  };

  const tableHeaderAgent: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      type: 'index',
    },
    {
      key: 'agentType',
      label: 'Agent Type',
      render: (_: any, index: number) => (
        <Controller
          name={`agentList.${index}.agentType`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Choose Agent Type"
              type="dropdown"
              dropdownList={agentTypeList}
              containerSx={{ flex: 1 }}
            />
          )}
        />
      ),
      sx: {
        maxWidth: '10vw',
      },
    },
    {
      key: 'bankType',
      label: 'Bank Type',
      render: (_: any, index: number) => (
        <Controller
          name={`agentList.${index}.bankType`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Choose Bank Type"
              type="dropdown"
              dropdownList={bankTypeList}
              containerSx={{ flex: 1 }}
              onChange={(e) => {
                field.onChange(e);
                methods.setValue(`agentList.${index}.bankName`, null);
              }}
            />
          )}
        />
      ),
      sx: {
        maxWidth: '10vw',
      },
    },
    {
      key: 'bankName',
      label: 'Bank Name',
      render: (_: any, index: number) => (
        <BankNameCell index={index} control={methods.control} />
      ),
      sx: {
        maxWidth: '10vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          // isHidden: !canEdit,
          onClick: (_, index) => handleDeleteAgentItem(index),
        },
      ],
      sx: { width: '4vw' },
      type: 'action',
    },
  ];

  const { fields: feeFields, append: appendFee, remove: removeFee } = useFieldArray({
    control: methods.control,
    name: 'feeList',
  });

  const handleAddFeeItem = () => {
    appendFee({ feeType: '', nominal: null, remarks: '' });
  };

  const handleDeleteFeeItem = (index: number) => {
    removeFee(index);
  };

  const tableHeaderFee: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      type: 'index',
    },
    {
      key: 'feeType',
      label: 'Type of Fee',
      render: (_: any, index: number) => (
        <Controller
          name={`feeList.${index}.feeType`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Choose Type of Fee"
              type="dropdown"
              dropdownList={typeOfFeeList}
              containerSx={{ flex: 1 }}
            />
          )}
        />
      ),
    },
    {
      key: 'nominal',
      label: 'Nominal',
      render: (_: any, index: number) => (
        <Controller
          name={`feeList.${index}.nominal`}
          control={methods.control}
          render={({ field }) => (
            <Currency
              {...field}
              placeholder="Input Nominal"
              onChange={(val) => {
                field.onChange(val);
              }}
              value={{
                currency: field.value?.currency || 'IDR',
                value: field.value?.value?.toString() || 0,
              }}
              currencyList={CurrencyLOV()}
            />
          )}
        />
      ),
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (_: any, index: number) => (
        <Controller
          name={`feeList.${index}.remarks`}
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Input Remarks"
              type="text"
              containerSx={{ flex: 1 }}
            />
          )}
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          // isHidden: !canEdit,
          onClick: (_, index) => handleDeleteFeeItem(index),
        },
      ],
      sx: { width: '4vw' },
      type: 'action',
    },
  ];

  useEffect(() => {
    if (dataTabSyndication) {
      const content = dataTabSyndication?.data?.content;
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

      methods.reset({
        ...content,
        agentList,
        feeList,
        krediturList,
      });
    }
  }, [dataTabSyndication]);

  const { mutateAsync: saveSyndicationTabAsync } = useSaveSyndicationInformation({
    onError(error) {
      showNiceModalV2({
        onClose: () => {},
        title: error?.message,
        type: 'error',
      });
      recordActivity({
        activity: ActivityType.EDIT,
        changeAfter: JSON.stringify(dataTabSyndication),
        changeBefore: JSON.stringify(methods.control._formValues),
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
        remarks: 'edit data error in manajemen fasilitas conventional informasi sindikasi',
      });
    },
    onSuccess() {
      showNiceModalV2({
        onClose: () => {},
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.EDIT,
        changeAfter: JSON.stringify(methods.control._formValues),
        changeBefore: JSON.stringify(dataTabSyndication),
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
        remarks: 'edit data success in manajemen fasilitas conventional informasi sindikasi',
      });
    },
  });

  const { mutateAsync: saveSyndicationTabOtherAsync } = useSaveSyndicationInformationOther({
    onError(error) {
      showNiceModalV2({
        onClose: () => {},
        title: error?.message,
        type: 'error',
      });
      recordActivity({
        activity: ActivityType.EDIT,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
        remarks: 'edit data error in manajemen fasilitas conventional informasi sindikasi other',
      });
    },
  });

  const onSubmit = async () => {
    try {
      const data = methods.getValues();

      const rawIsSyndicated = data.isSyndicated;
      let isSyndicated: boolean | null = null;

      if (typeof rawIsSyndicated === 'string') {
        if (rawIsSyndicated === 'true') isSyndicated = true;
        else if (rawIsSyndicated === 'false') isSyndicated = false;
      } else if (typeof rawIsSyndicated === 'boolean') {
        isSyndicated = rawIsSyndicated;
      }

      const payload = {
        agentInformationList: data.agentList?.map((item: any) => ({
          agentId: item.agentId || null,
          agentType: item.agentType,
          bankName: typeof item.bankName === 'object' ? item.bankName?.label : item.bankName,
          bankType: item.bankType,
        })) || [],
        bankInformationList: data.krediturList?.map((item: any) => ({
          amount: Number(item.amount.value) || 0,
          bankInformationId: item.bankInformationId || null,
          bankName: typeof item.namaKreditur === 'object' ? item.namaKreditur?.label : item.namaKreditur,
          bankType: item.jenisKreditur,
          currency: item.amount.currency,
        })) || [],
        bucketProcessId: processId.includes('MAI') ? processId : null,
        division: facilityInformation?.data?.content?.division || null,
        facilityId: id as string,
        isSyndicated: isSyndicated,
        relationshipManager: facilityInformation?.data?.content?.relationshipManager || null,
        remark: data.remark,
        typeOfFeeList: data.feeList?.map((item: any) => ({
          currencyNominal: item.nominal.currency || 'IDR',
          feeId: item.feeId || null,
          nominal: Number(item.nominal.value) || 0,
          remarksFee: item.remarks,
          typeOfFee: item.feeType,
        })) || [],
      };

      await saveSyndicationTabAsync(payload);

      const blob = await convertToDocx(container);

      await saveSyndicationTabOtherAsync({
        bucketProcessId: processId.includes('MAI') ? processId : null,
        facilityId: id,
        other: blob,
      });

    } catch (e) {
      console.log(e);
    }
  };

  return {
    agentFields,
    canEdit,
    container,
    dataTabSyndication,
    facilityInformation,
    feeFields,
    handleAddAgentItem,
    handleAddFeeItem,
    handleAddKrediturItem,
    initialSectionFormat,
    isOrderType,
    krediturFields,
    methods,
    onSubmit,
    setContainer,
    tableHeaderAgent,
    tableHeaderFee,
    tableHeaderKreditur,
    watchFields,
  };
};
export default useInformasiSindikasi;
