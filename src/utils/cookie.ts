// Cookie 工具函数

// 设置 cookie (没有过期时间，设置为 10 年后过期)
export function setCookie(name: string, value: string, days: number = 3650): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

// 获取 cookie
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

// 删除 cookie
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// 保存对象到 cookie (没有过期时间，设置为 10 年后过期)
export function saveObjectToCookie(name: string, obj: any, days: number = 3650): void {
  try {
    const jsonString = JSON.stringify(obj);
    setCookie(name, jsonString, days);
  } catch (error) {
    console.error('Failed to save object to cookie:', error);
  }
}

// 从 cookie 加载对象
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
