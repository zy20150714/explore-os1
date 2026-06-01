export const DEFAULT_COOKIE_DAYS = 3650;

export function setCookie(name: string, value: string, days: number = DEFAULT_COOKIE_DAYS): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function refreshCookie(name: string, days: number = DEFAULT_COOKIE_DAYS): void {
  const existingValue = getCookie(name);
  if (existingValue !== null) {
    setCookie(name, existingValue, days);
  }
}

export function saveObjectToCookie(name: string, obj: any, days: number = DEFAULT_COOKIE_DAYS): void {
  try {
    const jsonString = JSON.stringify(obj);
    setCookie(name, jsonString, days);
  } catch (error) {
    console.error('Failed to save object to cookie:', error);
  }
}

export function loadObjectFromCookie(name: string): any | null {
  try {
    const jsonString = getCookie(name);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error('Failed to load object from cookie:', error);
    return null;
  }
}

export function getAllCookies(): Array<{ name: string; value: string }> {
  const cookies: Array<{ name: string; value: string }> = [];
  const cookieString = document.cookie;
  
  if (!cookieString) return cookies;
  
  const decodedCookie = decodeURIComponent(cookieString);
  const cookieArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    const eqIndex = cookie.indexOf('=');
    if (eqIndex > 0) {
      cookies.push({
        name: cookie.substring(0, eqIndex).trim(),
        value: cookie.substring(eqIndex + 1).trim()
      });
    }
  }
  
  return cookies;
}

export function clearAllExploreOSCookies(): void {
  const prefixes = ['explore_os_'];
  const allCookies = getAllCookies();
  
  for (const cookie of allCookies) {
    for (const prefix of prefixes) {
      if (cookie.name.startsWith(prefix)) {
        deleteCookie(cookie.name);
        break;
      }
    }
  }
}
