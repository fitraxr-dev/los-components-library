import useApp from './useApp';


const useDivision = () => {
  const [{ userData }] = useApp();
  const userGroup = userData?.userDivision ?? '';
  const divisionCode = userGroup?.divisionCode ?? '';
  const divisionName = userGroup?.name ?? '';

  return {
    divisionCode,
    divisionName,
  };
};

export default useDivision;
