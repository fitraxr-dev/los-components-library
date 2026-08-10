'use client';
import { Controller } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input/Input';
import SectionTitle from '@/components/shared/SectionTitle/SectionTitle';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';


import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import BusinessPage from './components/Business/Business.page';
import DPOPPage from './components/DPOP/DPOP.page';
import { useVerificationSheet } from './VerificationSheet.hook';


const VerificationSheet = () => {

  const {
    activeTab,
    handleChangeTab,
    verificationSheetData,
    isFetching,
    bucketDetail,
    applicationTypeList,
    methods,
    viewOnly,
    isSpfpFinal,
    isDpop,
    isDti,
    isSPFP,
  } = useVerificationSheet();

  console.log('isDti:', isDti, 'isSPFP:', isSPFP);
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDpop && (
        <ConfirmationLatest />
      )}
      <Title title="Lembar Verifikasi" />
      <SectionTitle title="Tipe Permohonan" sx={{ mb: 3 }} isOpen>
        <ColumnWrapper sx={{ gap: 2 }}>
          <Controller
            control={methods.control}
            name="submissionType"
            render={({
              field: { ref, ...field },
            }) => (
              <Input
                {...field}
                type="radio"
                radioList={applicationTypeList}
                disabled={viewOnly || isDpop || isSpfpFinal || (isDti && !isSPFP)}
              />
            )}
          />
          <Controller
            control={methods.control}
            name="remark"
            render={({
              field: { ref, ...field },
            }) => (
              <Input
                {...field}
                type="area"
                rows={3}
                label="Keterangan"
                placeholder="Input Keterangan"
                disabled={viewOnly || isDpop || isSpfpFinal || (isDti && !isSPFP)}
              />
            )}
          />
        </ColumnWrapper>
      </SectionTitle>

      <Tabs
        activeTab={activeTab}
        onChange={(val) => handleChangeTab(val as number)}
        items={[
          { label: 'Bisnis' },
          { label: 'DPOP' },
        ]}
      />

      <TabItem activeValue={activeTab} value={0}>
        <BusinessPage
          data={verificationSheetData}
          isLoading={isFetching}
          bucketData={bucketDetail}
          formMethods={methods}
        />
      </TabItem>

      <TabItem activeValue={activeTab} value={1}>
        <DPOPPage
          data={verificationSheetData}
          isLoading={isFetching}
          bucketData={bucketDetail}
        />
      </TabItem>

    </ColumnWrapper>
  );
};

export default VerificationSheet;
