import { useEffect } from 'react';


const useAutoSave = (interval: number, saveFunction: () => void) => {
  useEffect(() => {
    const saveData = async () => {
      console.log('saveData');
      saveFunction();
    };

    const intervalId = setInterval(saveData, interval);

    return () => {
      clearInterval(intervalId);
      saveData();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('beforeunload');
      saveFunction();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export default useAutoSave;
