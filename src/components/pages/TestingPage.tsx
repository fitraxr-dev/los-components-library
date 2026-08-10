'use client';
import { useCallback, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FormProvider, useForm } from 'react-hook-form';

import { ALL_MENU } from '@/__mocks__/mockSidebar';
import { MODAL } from '@/configs/constants/modalId';
import { mip, pipeline } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { removeCookie } from '@/helpers/cookie';
import useApp from '@/hooks/useApp';
import useAutoSave from '@/hooks/useAutoSave';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdleTimer from '@/hooks/useIdleTimer';
import logout from '@/services/api/auth/logout';

import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import VStack from '@/components/shared/VStack';

import Chart from '../shared/Chart';
import { CHART_DATA, PIE_CHART_DATA, PIE_CHART_DATA2 } from '../shared/Chart/Chart.types';
import InputList from '../shared/InputList';
import UploadDocumentForm from '../shared/SmiComponent/FormUploadDocument';
import { DOCUMENT_SCHEMA } from '../shared/SmiComponent/FormUploadDocument/FormUploadDocument.constants';
import TableExposureGroup from '../shared/SmiTable/TableExposureGroup';
import TextStyle from '../shared/TextStyle';

import type { InputListPlaceholder } from '../shared/InputList/InputList.types';


const TestingPage = () => {
  const [state] = useApp();
  const router = useCustomRouter();
  const [currency, setCurrency] = useState('');
  const [npwp, setNpwp] = useState('');
  const [number, setNumber] = useState('');
  const [time, setTime] = useState(dayjs().format('HH:mm'));
  // useIdleTimer();

  const dropdownList = [
    { label: 'option 1', value: 1 },
    { label: 'option 2', value: 2 }
  ];

  async function handleLogout() {
    try {
      const response = await logout();
      console.log('response logout', response);

    } catch (error) {

      console.log(error);
      removeCookie('token');
    }
    window.location.href = '/';
  }

  const data = [
    { id: '1', name: 'Item 1', value: 10 },
    { id: '2', name: 'Item 2', value: 20 },
    { id: '3', name: 'Item 3', value: 30 },
  ];

  // INI CONTOH UNTUK FORM UPLOAD DOCUMENT BARU
  const methods = useForm({
    defaultValues: {
      documentName: 'test123',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(DOCUMENT_SCHEMA), // if there is schema for validation
    // values: useMemo(() => initialData, [initialData]), // if there is initial data
  });

  const [numberTest, setNumberTest] = useState(0);

  // console.log(JSON.stringify(ALL_MENU));

  const valueCurrency = {
    currency: 'IDR',
    value: 1000000,
  };


  const handleSave = useCallback(() => {
    console.log('save');
  }, []);

  useAutoSave(10000, handleSave);

  // For optimizing performance, use useMemo to prevent re-rendering
  // const fieldList = useMemo(() => {
  const fieldList: Array<InputListPlaceholder> = [
    {
      label: '',
      onChange: (val) => console.log(val),
      value: '',
    },
    {
      label: '',
      onChange: (val) => console.log(val),
      value: '',
    },
    {
      label: '',
      onChange: (val) => console.log(val),
      value: '',
    },
    {
      label: '',
      onChange: (val) => console.log(val),
      value: '',
    },
    {
      label: 'Nomor Izin Dari Instansi Berwenang',
      onChange: (val) => console.log(val),
      value: '',
    },
    {
      emptyField: true,
      label: '',
      onChange: (val) => console.log(val),
      value: '',
    },
    {
      disabled: true,
      label: 'Testing Disabled',
      onChange: (val) => console.log(val),
      value: '',
    },
  ];

  const openFieldListHandler = () => {
    NiceModal.show(MODAL.MODAL_INPUT_LIST, {
      column: 3,
      fieldList,
      onConfirm: () => console.log('confirm'),
      title: 'Modal Input List',
    });
  };

  return (
    <VStack align="center" padding="5px 15px">
      <InputList fieldList={fieldList} column={4} />

      <Button onClick={openFieldListHandler}>Open Modal List</Button>
      <Currency
        placeholder="Masukan Angka122344"
        label="Currency"
        value={valueCurrency}
        onChange={(val) => console.log(val)}
      />

      <Input
        label="Number Baru"
        type="number"
        thousandSeparator=","
        value={123233334}

        onValueChange={(values) => {
          console.log(values);
        }}
      />
      <Input
        label="Currency Lama"
        type="currency"
        value={numberTest}
        onChange={(val) => setNumberTest(val)}
      />
      <VStack>
        <h2>Testing Page</h2>
        <h3>role: {state.currentRole}</h3>
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={100}
          height={24}
          priority
        />
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </VStack>
      <VStack top="20px" left="20px">
        <Button onClick={() => handleLogout()}>Logout</Button>
        <br />
        <Button onClick={() => router.push(pipeline.LIST_PAGE)}>Go to Pipeline</Button>
        <br />
        <Button onClick={() => router.push(mip.LIST_PAGE)}>Go to MIP</Button>
      </VStack>

      <VStack left="12px">

        {/* To use Upload Form Must wrap with FormProvider */}
        <FormProvider {...methods} >
          <UploadDocumentForm />
        </FormProvider>

        <Button
          disabled={methods.formState.isValid}
          onClick={methods.handleSubmit((data) => console.log(data))}
        >Submit
        </Button>


        <TableExposureGroup
          module={TypeModule.MIP}
          process={TypeProcess.MIP}
        />

        <Input
          type="time"
          label="Time"
          onChange={(val) => setTime(val)}
          value={time}
        />

        <TextStyle>Time: {time}</TextStyle>
        <Input
          type="currency"
          value={currency}
          label="Type: currency"
          onChange={(val) => {
            console.log(val);
            setCurrency(val);
          }}
        />
        <Input
          isMandatory
          type="date"
          label="Type: date"
          onChange={(val) => console.log(val)}
        />
        <Input
          type="dropdown"
          value="1"
          label="Type: dropdown"
          dropdownList={dropdownList}
          onChange={(val) => console.log(val)}
        />
        <Input
          type="dropdown-search"
          value="1"
          label="Type: dropdown-search"
          dropdownList={dropdownList}
          onChange={(val) => console.log(val)}
        />
        <Input
          type="file"
          label="Type: file"
          onChange={(val) => console.log(val)}
        />
        <Input
          type="npwp"
          value={npwp}
          label="Type: npwp"
          onChange={(val) => setNpwp(val)}
        />
        <Input
          type="number"
          label="Type: number"
          value={number}
          onChange={(val) => setNumber(val)}
        />
        <Input
          type="area"
          label="Type: area"
          onChange={(val) => console.log(val)}
        />
        <Input
          type="text"
          label="Type: text"
          onChange={(val) => console.log(val)}
        />

        <Chart type="STACKED_BAR" data={CHART_DATA} />
        <Box width="702px">
          <Chart type="PIE_BOTTOM" data={PIE_CHART_DATA2} />
        </Box>
        <RowWrapper gap={3}>
          <Box width="50%">
            <Chart type="PIE_RIGHT" data={PIE_CHART_DATA} />
          </Box>
          <Box width="50%">
            <Chart type="PIE_RIGHT" data={PIE_CHART_DATA} />
          </Box>
        </RowWrapper>
        <div style={{ marginTop: 20 }} />
      </VStack>
    </VStack>
  );
};

export default TestingPage;
