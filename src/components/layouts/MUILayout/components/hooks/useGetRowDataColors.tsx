import { Colors } from '@/configs/constants/colors';


const useGetRowDataColors = () => {
  const activeFullname = typeof window !== 'undefined'
    ? sessionStorage.getItem('activeFullname')
    : null;

  const anomalyRowStyle = (rowData: any) => {
    if (!activeFullname) {
      return {};
    }

    const activeFullnameLower = activeFullname.toLowerCase();

    const isMatching = rowData?.pic?.some((picItem: any) => {
      const prevName = picItem?.prevName;
      const currentName = picItem?.name;

      if (prevName && prevName !== '-') {
        const prevNameLower = prevName.toLowerCase();
        return prevNameLower === activeFullnameLower;
      }
      else if (currentName) {
        const currentNameLower = currentName.toLowerCase();
        return currentNameLower === activeFullnameLower;
      }

      return false;
    });

    return {
      backgroundColor: isMatching
        ? Colors.BLUE_PASTEL
        : Colors.INHERIT,
    };
  };

  return {
    anomalyRowStyle,
  };
};

export default useGetRowDataColors;
