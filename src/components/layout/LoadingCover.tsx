'use client';
import { LoadingOverlay } from '@mantine/core';

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingCover: React.FC<LoadingOverlayProps> = ({ visible }) => {
  return (
    <LoadingOverlay
      visible={visible}
      zIndex={1000}
      overlayProps={{ radius: 'sm', blur: 2 }}
      loaderProps={{ color: 'blue', type: 'bars', size: 'xl' }}
      content='Loading...'
      bg={visible ? 'rgba(255, 255, 255, 0.9)' : 'transparent'}
    />
  );
};

export default LoadingCover;
