import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { TypeRoles } from '@/enums/Roles';
import useSearchAllUser from '@/hooks/services/useSearchUser';

import type { PIC, PICCollapsibleHookProps } from './PICCollapsible.types';


const usePICCollapsible = ({ index, divisionId, position }: PICCollapsibleHookProps) => {
  const { watch, setValue } = useFormContext();
  const [userKeyword, setUserKeyword] = useState('');
  const [userList, setUserList] = useState([]);

  const { data: userData, isSuccess } = useSearchAllUser({
    division: divisionId,
    position,
    role: TypeRoles.RM,
    value: userKeyword,
  });


  const handleDisabledLeaderPIC = (idx: number) => {
    if (watch('pic').some((item) => item?.isLeaderPIC === true)) {
      const result = watch('pic').at(idx)?.isLeaderPIC;
      return !result;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (watch(`pic.${index}`) === null) {
      setValue(`pic.${index}`, {
        directorate: '',
        division: '',
        isLeaderPIC: false,
        jobPosition: '',
        label: '',
        picId: 0,
      });
    }
  }, [watch(`pic.${index}`)]);

  useEffect(() => {
    if (userData && isSuccess) {
      const users: PIC[] = userData?.contents?.map((user) => ({
        directorate: user.division[0]?.directorate.name,
        division: user.division[0]?.name,
        isLeaderPIC: watch(`pic.${index}.isLeaderPIC`),
        jobPosition: user.roleRefactor?.name,
        label: user.fullName,
        picId: user.userId,
      }));

      const selectedPicById = watch('pic')?.map((item) => item?.picId);
      const availablelUsers = users.filter((item) => !selectedPicById.includes(item.picId));

      setUserList(availablelUsers);
    }
  }, [userData, isSuccess]);


  const handleCheckLeader = (checkValue) => {
    setValue(`pic.${index}.isLeaderPIC`, checkValue);
  };

  return {
    handleCheckLeader,
    handleDisabledLeaderPIC,
    setUserKeyword,
    userList,
  };
};


export default usePICCollapsible;
