import type { Dispatch, SetStateAction } from 'react';


export type UserFormProps = {
  type: UserFormType;
}

export type UserModeProps = {
  setType: Dispatch<SetStateAction<UserFormType>>;
}

export type UserFormType = 'add' | 'edit' | 'detail'

export type UserRoleCode = 'KADIV' | 'STAFF' | 'TL'
