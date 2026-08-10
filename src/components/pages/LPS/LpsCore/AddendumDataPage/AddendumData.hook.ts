import useGoToNextStep from '@/hooks/useGoToNextStep';


const useAddendumData = () => {
  const goToNextStep = useGoToNextStep();


  const handleNextStep = () => {
    goToNextStep();
  };

  return {
    handleNextStep,
  };
};

export default useAddendumData;
