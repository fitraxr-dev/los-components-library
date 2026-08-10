import { useContext, useEffect, useState } from 'react';

import { ONE_MINUTE } from '@/configs/constants';
import { TypeDivision } from '@/enums/Division';
import { TypeRoles } from '@/enums/Roles';
import { getCookie } from '@/helpers/cookie';
import { formatDate } from '@/helpers/date';
import useSearchAllUser from '@/hooks/services/useSearchUser';

import { CreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';

import type { ReassignToFormProps } from './ReassignToForm.types';


const useReassignToForm = (props: ReassignToFormProps) => {
  const { picList, picData, useFormValues } = props;
  const { watch, setValue } = useFormValues;
  const userId = getCookie('userId');
  const [state, setState] = useContext(CreditCheckingContext);

  const [isPermanent, setIsPermanent] = useState(false);
  const [userKeyword, setUserKeyword] = useState('');
  const [userList, setUserList] = useState([]);

  const today = formatDate(new Date(), 'DD MMMM YYYY');

  const currentPic = watch(`picList.${picData.index}`);
  const selectedUserValue = watch(`picList.${picData.index}.selectedUser`);
  const reAssignToValue = watch(`picList.${picData.index}.reAssignTo`);
  const startDate = watch(`picList.${picData.index}.reAssignTo.startDate`);
  const endDate = watch(`picList.${picData.index}.reAssignTo.endDate`);


  const combinedArrays = (arr: Array<Array<any>>) => {
    const combinedArray = [];

    arr.forEach((subArray) => {
      subArray?.forEach((content) => {
        combinedArray.push(content);
      });
    });

    return combinedArray;
  };

  const { data: userData, isSuccess: isGetUserListData } = useSearchAllUser({
    division: TypeDivision.DPOP_DIVISION,
    role: TypeRoles.RM,
    value: userKeyword,
  }, {
    staleTime: ONE_MINUTE,
  });

  useEffect(() => {
    if (userData && isGetUserListData) {
      const users = userData?.contents?.map((user) => ({
        directorate: user.division[0]?.directorate.name,
        division: user.division[0]?.name,
        id: user.userId,
        jobPosition: user.roleRefactor.name,
        label: user.fullName,
        value: user.userId,
      }));

      const selectedPic = state.selectedTask.map((item) => item.pic);

      let selectedPicById = combinedArrays(selectedPic.map((pic) => pic))
        .filter((item) => item.taskId === picData.taskId).map((item) => item.picId);

      const selectedReassignPicById = watch('picList')?.map((item) => item.reAssignTo.picId).concat(selectedPicById);
      const availableUsers = users.filter((item) => !selectedReassignPicById.includes(item.value));

      setUserList(availableUsers);
    }
  }, [userData, isGetUserListData]);


  useEffect(() => {
    (() => {
      const reAssignToObj = {
        ...selectedUserValue,
        directorate: selectedUserValue?.directorate ?? '',
        division: selectedUserValue?.division ?? '',
        endDate: endDate ? endDate : '',
        isLeader: currentPic?.isLeader ? currentPic?.isLeader : false,
        isPermanent: isPermanent ? isPermanent : false,
        jobPosition: selectedUserValue?.jobPosition ?? '',
        name: selectedUserValue?.label ?? '',
        previousPicId: currentPic?.picId ?? '',
        startDate: startDate ? startDate : '',
      };

      const name = picData.name;

      const newState = structuredClone(state);
      newState.selectedTask.forEach((_, index) => {
        newState.selectedTask[index].pic.forEach((pic, index2) => {
          if (name === pic.name) {
            newState.selectedTask[index].pic[index2].reAssignTo = reAssignToObj;
            picList[picData.index].reAssignTo = reAssignToObj;
          }
        });
      });

      setState(newState);
    })();

    setValue(`picList.${picData.index}.reAssignTo.name`, selectedUserValue?.label);
    setValue(`picList.${picData.index}.reAssignTo.id`, selectedUserValue?.id);
    setValue(`picList.${picData.index}.reAssignTo.picId`, selectedUserValue?.id);
    setValue(`picList.${picData.index}.reAssignTo.previousPicId`, currentPic?.picId);
    setValue(`picList.${picData.index}.reAssignTo.isLeader`, currentPic?.isLeader);
    setValue(`picList.${picData.index}.reAssignTo.jobPosition`, selectedUserValue?.jobPosition);
    setValue(`picList.${picData.index}.reAssignTo.division`, selectedUserValue?.division);
    setValue(`picList.${picData.index}.reAssignTo.directorate`, selectedUserValue?.directorate);
  }, [selectedUserValue]);

  useEffect(() => {
    if (isPermanent) {
      setValue(`picList.${picData.index}.reAssignTo.endDate`, '');
      setValue(`picList.${picData.index}.reAssignTo.startDate`, today);
    }

    setValue(`picList.${picData.index}.reAssignTo.isPermanent`, isPermanent);
    setValue(`picList.${picData.index}.reAssignTo.startDate`, reAssignToValue?.startDate);
    setValue(`picList.${picData.index}.reAssignTo.endDate`, reAssignToValue?.endDate);
  }, [isPermanent, startDate, endDate]);


  return {
    isPermanent,
    setIsPermanent,
    setUserKeyword,
    userList,
  };
};

export default useReassignToForm;
