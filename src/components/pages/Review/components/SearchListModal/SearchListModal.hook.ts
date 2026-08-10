import { useState } from 'react';


const useSearchListModal = () => {
  const [selected, setSelected] = useState<Array<{id: number; name: string}>>([]);

  return {
    selected,
    setSelected,
  };
};

export default useSearchListModal;
