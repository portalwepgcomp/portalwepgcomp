import axiosInstance from "@/utils/api";

export const api = axiosInstance;
 
export function setTokenLocalStorage(token: any){
    localStorage.setItem("@Auth:token", token)
}

export function setUserLocalStorage(user: UserProfile) {
  const userString = JSON.stringify(user);
  localStorage.setItem("@Auth:user", userString);
}

export function setEventEditionIdStorage(eventEditionId: string) {
  try {
    const COOKIE_NAME = "session_eventEditionId";
    const maxAge = 60 * 60 * 24 * 30;
    const value = encodeURIComponent(eventEditionId);
    document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } catch {
  }
}

export function getTokenLocalStorage() {
  const storageToken = localStorage.getItem("@Auth:token");

  if (storageToken) {
    return storageToken;
  }
  return null;
}

export function getUserLocalStorage() {
  const storageUser = localStorage.getItem("@Auth:user");

  if (storageUser) {
    return storageUser;
  }
  return null;
}

export function getEventEditionIdStorage() {
  try {
    if (typeof document === "undefined") return null;
    const COOKIE_NAME = "session_eventEditionId=";
    const parts = document.cookie.split("; ");
    for (const part of parts) {
      if (part.startsWith(COOKIE_NAME)) {
        return decodeURIComponent(part.substring(COOKIE_NAME.length));
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.clear();
}

export async function LoginRequest(
  email: string,
  password: string
): Promise<{
  token: string; data: UserProfile 
}> {


  const { data } = await api.post("auth/login", { email, password });

  return data;
}

export async function validateToken(): Promise<boolean> {
  try {
    const token = getTokenLocalStorage();
    
    if (!token) {
      return false;
    }

    await api.get("auth/validate-token");
    return true;
  } catch (error) {
    return false;
  }
}
