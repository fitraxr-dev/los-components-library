import React from 'react';

import { Box } from '@mui/material';
import Image from 'next/image';


interface OverlayImageProps {
  url: string;
  width?: number;
  height?: number;
}

const OverlayImage: React.FC<OverlayImageProps> = ({ url, width = 500, height = 500 }) => {
  console.log('image url', url);
  return (

    <Box
      height="80vh"
      width="60vw"
      position="relative"
      display="block"
    >
      <Image
        src={url}
        fill
        style={{ objectFit: 'contain' }}
        //   width={width}
        //   height={height}
        alt="Overlay Image"
      />
    </Box>
  );
};

export default OverlayImage;
