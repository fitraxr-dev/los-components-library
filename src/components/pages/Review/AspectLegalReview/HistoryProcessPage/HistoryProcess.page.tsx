'use client';
import React from 'react';

import { TypeProcess, TypeModule } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import DetailHistory from './components/DetailHistory/DetailHostory';
import useHistoryProcess from './HistoryProcess.hook';


const HistoryProcess = () => {
  const { history } = useHistoryProcess();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />
      <Title title="History Proses" />
      {
        history.map((item, index) => (
          <DetailHistory data={item} key={`history-${index + 1}`} />
        ))
      }
    </ColumnWrapper>
  );
};

export default HistoryProcess;
