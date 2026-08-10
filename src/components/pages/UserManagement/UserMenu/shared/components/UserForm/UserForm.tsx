'use client';

import useUserForm from './UserForm.hook';


const UserForm = () => {
  const {
    renderPage,
  } = useUserForm();

  return (
    <>
      {renderPage}
    </>
  );
};


export default UserForm;
