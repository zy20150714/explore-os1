// Device detection utilities based on UA-CH

interface DeviceInfo {
  os: string;
  isMobile: boolean;
  isDesktop: boolean;
  browser: string;
}

// Check if UA-CH is supported
function isUA_CHSupported(): boolean {
  return 'userAgentData' in navigator;
}

// Get device info using UA-CH
async function getDeviceInfoUA_CH(): Promise<DeviceInfo> {
  if (!isUA_CHSupported()) {
    return getDeviceInfoFallback();
  }

  try {
    const uaData = await navigator.userAgentData.getHighEntropyValues([
      'platform',
      'platformVersion',
      'mobile',
      'uaFullVersion',
      'browser'
    ]);

    const os = uaData.platform || 'Unknown';
    const isMobile = uaData.mobile || false;

    return {
      os,
      isMobile,
      isDesktop: !isMobile,
      browser: uaData.browser || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting UA-CH data:', error);
    return getDeviceInfoFallback();
  }
}

// Fallback to User-Agent string parsing
function getDeviceInfoFallback(): DeviceInfo {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  let os = 'Unknown';
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Macintosh')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
    os = 'iOS';
  }

  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  }

  return {
    os,
    isMobile,
    isDesktop: !isMobile,
    browser
  };
}

// Main device detection function
export async function getDeviceInfo(): Promise<DeviceInfo> {
  return isUA_CHSupported() ? getDeviceInfoUA_CH() : getDeviceInfoFallback();
}

// Helper function to check if device is mobile
export async function isMobileDevice(): Promise<boolean> {
  const deviceInfo = await getDeviceInfo();
  return deviceInfo.isMobile;
}

// Helper function to check if device is desktop
export async function isDesktopDevice(): Promise<boolean> {
  const deviceInfo = await getDeviceInfo();
  return deviceInfo.isDesktop;
}

// Helper function to get OS
export async function getOS(): Promise<string> {
  const deviceInfo = await getDeviceInfo();
  return deviceInfo.os;
}
