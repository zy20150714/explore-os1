import { useState, useEffect } from 'react';
import { getDeviceInfo, DeviceInfo } from './deviceDetector';

interface UseDeviceDetectorReturn {
  deviceInfo: DeviceInfo | null;
  isLoading: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  os: string;
}

export function useDeviceDetector(): UseDeviceDetectorReturn {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function detectDevice() {
      try {
        const info = await getDeviceInfo();
        setDeviceInfo(info);
      } catch (error) {
        console.error('Error detecting device:', error);
      } finally {
        setIsLoading(false);
      }
    }

    detectDevice();
  }, []);

  return {
    deviceInfo,
    isLoading,
    isMobile: deviceInfo?.isMobile || false,
    isDesktop: deviceInfo?.isDesktop || true,
    os: deviceInfo?.os || 'Unknown'
  };
}
