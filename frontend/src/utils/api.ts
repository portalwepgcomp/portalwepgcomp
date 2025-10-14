"use client";

import Axios from "axios";


const axiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("@Auth:token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Reject promise if usual error
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    /*
     * When response code is 401 (token expired/invalid)
     * Clear storage and redirect to login
     */
   
    localStorage.clear();
    
    // Dispara evento customizado para o AuthProvider
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session-expired"));
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
