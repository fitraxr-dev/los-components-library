import { spfp } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';


const useTitleDebtor = () => {
  const { parentId } = useIdentity();


  const handleRerouteViewSPFP = () => {
    const path = replacePath(
      spfp.DEBTOR_INFORMATION_PAGE,
      {
        module: 'bucket',
        processId: parentId,
      });

    window.open(setPreviewPage(path), 'blank', 'noopener,noreferrer');
  };

  return {
    handleRerouteViewSPFP,
  };
};

export default useTitleDebtor;
