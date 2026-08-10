'use client';

import React from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import InformationOther from './components/InformationOther';
import LimitAnak from './components/LimitAnak';
import Menu from './components/Menu';
import useDetailFacility from './DetailFacility,hook';


interface MenuWrapperProps {
  children: React.ReactNode;
}

const MenuWrapper = ({ children }: MenuWrapperProps) => {

  return (
    <ColumnWrapper gap={3}>
      {children}
    </ColumnWrapper >
  );
};

const DetailFacility = () => {
  const { activeTab } = useDetailFacility();
  const theme = useTheme();
  const renderContent = () => {
    if (activeTab === 'other-information') {
      return (
        <MenuWrapper>
          <InformationOther />
        </MenuWrapper>
      );
    }

    return (
      <MenuWrapper>
        <LimitAnak />
      </MenuWrapper>
    );
  };

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Detail Fasilitas" />
      <Menu />
      {renderContent()}
    </ColumnWrapper>
  );
};

export default DetailFacility;
