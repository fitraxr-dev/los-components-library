import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';


import { TABLE_RISK_PROFILE_HEADER } from './TableRiskProfile.constants';
import { useRiskProfileTable } from './TableRiskProfile.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const RiskProfileTable = () => {
  const {
    handleOpenEditModal,
    riskProfileList,
    viewOnly,
  } = useRiskProfileTable();

  const tableHeader: Array<TableHeader> = [
    ...TABLE_RISK_PROFILE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: () => {
        if (!viewOnly) {
          return [
            {
              iconName: 'edit',
              onClick: (props) => handleOpenEditModal(props.id),
            }
          ];
        }

        return [];
      },
      sx: {
        width: '8%',
      },
      type: 'action',
    }
  ];

  return (
    <BaseContainer sx={{ boxShadow: 7 }}>
      <Table
        tableHeader={tableHeader}
        tableData={riskProfileList}
        isLoading={false}
      />
    </BaseContainer>
  );
};

export default RiskProfileTable;
