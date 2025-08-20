"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import {
  getUserLocalStorage,
  getTokenLocalStorage,
  LoginRequest,
  setTokenLocalStorage,
  setUserLocalStorage,
  logout as logoutUtil,
} from "./util";
import api from "../../utils/api";

export const AuthContext = createContext<IContextLogin>({} as IContextLogin);

interface IContextLogin {
  user: UserProfile | null;
  signed: boolean;
  singIn: (body: UserLogin) => Promise<void>;
  logout: () => void;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<null | UserProfile>(null);
  const { showAlert } = useSweetAlert();
  const router = useRouter();

  useEffect(() => {
    const userSigned = getUserLocalStorage();
    const token = getTokenLocalStorage();
    
    if (userSigned && token) {
      // Verifica se o token está expirado
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
          // Token expirado, limpa o localStorage e redireciona
          logoutUtil();
          router.push("/login");
          return;
        }
        
        // Token válido, define o usuário
        setUser(JSON.parse(userSigned));
      } catch {
        // Token inválido, limpa o localStorage
        logoutUtil();
        router.push("/login");
      }
    }
  }, []);

  const singIn = async ({ email, password }) => {
    try {
      const response = await LoginRequest(email, password);
      const payload = {
        token: response.token,
        data: response.data,
      };

      setUser(payload.data);
      api.defaults.headers.common["Authorization"] = `Bearer ${payload.token}`;
      setTokenLocalStorage(payload.token);
      setUserLocalStorage(payload.data);
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    }
  };

  function logout() {
    localStorage.clear();
    setUser(null);
    return router.push("/home");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        singIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
