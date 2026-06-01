// Device detection utilities based on UA-CH

export interface DeviceInfo {
  os: string;
  isMobile: boolean;
  isDesktop: boolean;
  browser: string;
}

// Check if UA-CH is supported (exported for external use)
export function isUA_CHSupported(): boolean {
  return 'userAgentData' in navigator;
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

// Main device detection function - synchronous for simplicity
export function getDeviceInfo(): DeviceInfo {
  return getDeviceInfoFallback();
}

// Helper function to check if device is mobile
export function isMobileDevice(): boolean {
  return getDeviceInfoFallback().isMobile;
}

// Helper function to check if device is desktop
export function isDesktopDevice(): boolean {
  return getDeviceInfoFallback().isDesktop;
}

// Helper function to get OS
export function getOS(): string {
  return getDeviceInfoFallback().os;
}
