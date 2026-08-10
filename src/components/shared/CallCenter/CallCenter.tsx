import React, { useState } from 'react';

import styled from '@emotion/styled';


const CallCenter = () => {
  const [playMusic, setPlayMusic] = useState(false);

  function handleWhatsapp() {
    setPlayMusic(true);
    const text = 'halo Mas Kur, tolong bantu cek issue ini [tuliskan issue]';
    window.open(`https://wa.me/6285887453948?text=${text}`);
  };

  return (
    <>
      {
        playMusic ? (
          <iframe width="0" height="0" src="https://www.youtube.com/embed/gMHWUGjncHY?list=RDGMEMYH9CUrFO7CfLJpaD7UR85wVMoOi3oJmfz4o&autoplay=1" title="TheFatRat &amp; Maisy Kay - The Storm (Lyrics)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"></iframe>
        ) : null
      }
      <StyledDiv onClick={handleWhatsapp}>Call Center: 0858-8745-3948 (Cak Kurmin)</StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
    position: fixed;
    bottom: 15px;
    left: 15px;
    opacity: 0.15;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
`;

export default CallCenter;
