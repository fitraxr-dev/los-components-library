import React from 'react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import DetailHistory from './components/DetailHistory';
import useHistoryProcess from './HistoryProcess.hook';


const HistoryProcess = () => {
  const { history } = useHistoryProcess();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
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
