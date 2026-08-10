import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { TypeProcess } from '@/enums/Module';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalMaster = () => {

};

export default useApprovalMaster;
