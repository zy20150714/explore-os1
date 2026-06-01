import { useState, useEffect } from 'react';
import { getDeviceInfo, DeviceInfo } from './deviceDetector';

interface UseDeviceDetectorReturn {
  deviceInfo: DeviceInfo;
  isLoading: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  os: string;
}

export function useDeviceDetector(): UseDeviceDetectorReturn {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
    setIsLoading(false);
  }, []);

  return {
    deviceInfo,
    isLoading,
    isMobile: deviceInfo?.isMobile || false,
    isDesktop: deviceInfo?.isDesktop || true,
    os: deviceInfo?.os || 'Unknown'
  };
}
