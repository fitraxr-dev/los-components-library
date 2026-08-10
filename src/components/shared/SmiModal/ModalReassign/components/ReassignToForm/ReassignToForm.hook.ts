import { useEffect, useState } from 'react';

import { positions } from '@/configs/constants';
import { TypeRoles } from '@/enums/Roles';
import useSearchAllUserMonitoring from '@/hooks/services/monitoring/useSearchUserMonitoring';
import useSearchAllUser from '@/hooks/services/useSearchUser';
import useApp from '@/hooks/useApp';

import type { ReassignToFormProps } from './ReassignToForm.types';


const useReassignToForm = (props: ReassignToFormProps) => {
  const {
    picList,
    picData,
    useFormValues,
    selectedTaskReassign,
    setSelectedTaskReassign,
    divisionId,
    position,
    isMonitoring,
  } = props;
  const { watch, setValue } = useFormValues;
  const [{ currentRole, currentPosition }] = useApp();
  const [isPermanent, setIsPermanent] = useState(false);
  const [userKeyword, setUserKeyword] = useState('');
  const [userList, setUserList] = useState([]);
  const isInternalGuest = currentPosition?.some((pos: string) =>
    pos.toUpperCase().includes(positions.INTERNAL_GUEST.toUpperCase())
  );
  const isSuperAdminOrInternalGuest = currentRole?.includes('MAKER') || currentRole?.includes('CHECKER') || isInternalGuest;
  const currentPic = watch(`picList.${picData.index}`);
  const selectedUserValue = watch(`picList.${picData.index}.selectedUser`);
  const reAssignToValue = watch(`picList.${picData.index}.reAssignTo`);
  const startDate = watch(`picList.${picData.index}.reAssignTo.startDate`);
  const endDate = watch(`picList.${picData.index}.reAssignTo.endDate`);
  const currentPicIsProcessAnalyst = picData?.isProcessAnalyst;
  const currentPicIsTechnicalStaff = picData?.isTechnicalStaff;

  const combinedArrays = (arr: Array<Array<any>>) => {
    const combinedArray = [];

    arr.forEach((subArray) => {
      subArray?.forEach((content) => {
        combinedArray.push(content);
      });
    });

    return combinedArray;
  };

  const shouldSendDivision = !(isMonitoring && isSuperAdminOrInternalGuest);

  const getUserPosition = () => {
    if (!isMonitoring) {
      return position;
    }

    if (currentPicIsProcessAnalyst === true) {
      return TypeRoles.ANALYST;
    } else if (currentPicIsProcessAnalyst === false) {
      return `${TypeRoles.STAFF_RM},${TypeRoles.ARM}`;
    }

    return position || `${TypeRoles.STAFF_RM},${TypeRoles.ARM}`;
  };

  const getUserPositionGroup = () => {
    if (currentPicIsProcessAnalyst === true) {
      return TypeRoles.STAFF_ANALYST;
    } else if (currentPicIsTechnicalStaff === true) {
      return TypeRoles.TECHNICAL_STAFF;
    }

    return TypeRoles.GENERAL_STAFF;
  };

  const { data: userDataNormal, isSuccess: isGetUserListDataNormal } = useSearchAllUser({
    division: shouldSendDivision ? divisionId : undefined,
    position: (isMonitoring && isSuperAdminOrInternalGuest) ? undefined : getUserPosition(),
    role: TypeRoles.RM,
    value: userKeyword,
  }, { enabled: !isMonitoring });

  const { data: userDataMonitoring, isSuccess: isGetUserListDataMonitoring } = useSearchAllUserMonitoring({
    division: shouldSendDivision ? divisionId : undefined,
    positionGroup: (isMonitoring && isSuperAdminOrInternalGuest) ? undefined : getUserPositionGroup(),
    value: userKeyword,
  }, { enabled: !!isMonitoring });

  const userData = isMonitoring ? userDataMonitoring : userDataNormal;
  const isGetUserListData = isMonitoring ? isGetUserListDataMonitoring : isGetUserListDataNormal;

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

      const selectedPic = selectedTaskReassign.map((item) => item.pic);

      let selectedPicById = combinedArrays(selectedPic.map((pic) => pic))
        .filter((item) => item.taskId === picData.taskId).map((item) => item.picId);

      const selectedReassignPicById = watch('picList')
        ?.map((item) => item.selectedUser?.value)
        .filter(Boolean) // Remove null/undefined values
        .concat(selectedPicById);
      const availablelUsers = users.filter((item) => !selectedReassignPicById.includes(item.value));

      setUserList(availablelUsers);
    }
  }, [userData, isGetUserListData, watch('picList')]);


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


      selectedTaskReassign.forEach((_, index) => {
        selectedTaskReassign[index].pic.forEach((pic, index2) => {
          if (name === pic.name) {
            selectedTaskReassign[index].pic[index2].reAssignTo = reAssignToObj;
            picList[picData.index].reAssignTo = reAssignToObj;
          }
        });
      });

      setSelectedTaskReassign(selectedTaskReassign);
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
      setValue(`picList.${picData.index}.reAssignTo.startDate`, '');
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
