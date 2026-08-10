'use client';
import React from 'react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import ProjectPhase from '../../MaintenanceDebtor/ProjectPage/ProjectDetailPage/components/ProjectPhase';

import Group from './components/Group';
import GroupMember from './components/GroupMember';


const DebtorBusinessGroupDetail = () => {
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Detail Group Usaha Customer" />
      <Group />
      <GroupMember />

    </ColumnWrapper>
  );
};

export default DebtorBusinessGroupDetail;
