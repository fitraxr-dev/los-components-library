import { useEffect } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { MODAL } from '../../DetailAgunan.constant';

import PopupAgunanBangunan from './component/PopupAgunanBangunan';
import PopupAgunanInventory from './component/PopupAgunanInventory';
import PopupAgunanKapal from './component/PopupAgunanKapal';
import PopupAgunanKendaraan from './component/PopupAgunanKendaraan';
import PopupAgunanMesin from './component/PopupAgunanMesin';
import PopupAgunanSaranaPelengkap from './component/PopupAgunanSaranaPelengkap';
import PopupAgunanTanah from './component/PopupAgunanTanah';


const DetailAset = NiceModal.create((props: any) => {
  console.log(props);
  const modalId = MODAL.DETAIL_AGUNAN_TANAH;
  const modal = useModal(modalId);
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer lpa detail aset type ' + props.typeAgunan,
    });
  }, []);

  return (
    <SectionModal
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{ minWidth: '72vw' }}
    >
      {
        props.typeAgunan === 'LAND' ? <PopupAgunanTanah item={props.item} /> :
          props.typeAgunan === 'BUILDING' ? <PopupAgunanBangunan item={props.item} /> :
            props.typeAgunan === 'MACHINES_EQUIPMENT' ? <PopupAgunanMesin item={props.item} /> :
              props.typeAgunan === 'COMPLEMENTARY_FACILITIES' ? <PopupAgunanSaranaPelengkap item={props.item} /> :
                props.typeAgunan === 'BOAT' ? <PopupAgunanKapal item={props.item} /> :
                  props.typeAgunan === 'VEHICLES' ? <PopupAgunanKendaraan item={props.item} /> :
                    props.typeAgunan === 'INVENTORY' ? <PopupAgunanInventory item={props.item} /> :
                      props.typeAgunan === 'LAND_BUILDING' && props.item.typeAgunan === 'LAND' ? <PopupAgunanTanah item={props.item} /> :
                        props.typeAgunan === 'LAND_BUILDING' && props.item.typeAgunan === 'BUILDING' ? <PopupAgunanBangunan item={props.item} /> : ''
      }

    </SectionModal>
  );
});

export default DetailAset;
