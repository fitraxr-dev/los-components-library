import styled from '@emotion/styled';

import LoginBackground from '@/public/images/login-background.png';
import WhiteBackground from '@/public/images/white-background.png';


export const LogoImg = styled('img')(() => ({
  height: 'auto',
  width: '2.9vw',
}));

export const styBaseContainer = {
  alignItems: 'center',
  backgroundImage: `url(${WhiteBackground.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  justifyContent: 'center',
  minHeight: '100vh',
};

export const styRowWrapper = {
//   backgroundAttachment: 'fixed',
//   backgroundImage: `url(${LoginBackground.src})`,
//   backgroundRepeat: 'no-repeat',
//   backgroundSize: 'cover',
  borderRadius: '2.6vw',
  //   height: '80vh',
  position: 'relative',
//   width: '80vw',
};
