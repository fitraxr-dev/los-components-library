'use client';
import { usePathname } from 'next/navigation';

import BaseContainer from '@/components/shared/BaseContainer';

import CustomNavMenu from './components/CustomNavMenu/CustomNavMenu';
import { ParameterLOVProvider } from './ParameterLOV.context';


const ParameterLOVLayout = ({ children }) => {
  const path = usePathname();

  return (
    <ParameterLOVProvider>
      <BaseContainer sx={{ gap: 2 }}>
        {
          (path.includes('/process') || path.includes('/summary') || path.includes('/validasi')) && !path.includes('/add-group') ? <CustomNavMenu /> : null
        }
        {children}
      </BaseContainer>
    </ParameterLOVProvider>
  );
};

export default ParameterLOVLayout;
