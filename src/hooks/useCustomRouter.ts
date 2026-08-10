import { useContext } from 'react';

import { show } from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';


const useCustomRouter = () => {
  const { dirtyMsg } = useContext(DirtyContext);
  const router = useRouter();

  return new Proxy(router, {
    get: function (target, propKey) {
      return (...args) => {
        const hasHref = args[0];
        if (dirtyMsg.current === undefined) {
          target[propKey]?.apply(target, hasHref ? args : ['']);
        } else {
          show(MODAL.IS_DIRTY, {
            onSubmit: () => {
              target[propKey].apply(target, hasHref ? args : ['']);
            },
            title: dirtyMsg.current,
          });
        }
      };
    },
  });
};

export default useCustomRouter;
