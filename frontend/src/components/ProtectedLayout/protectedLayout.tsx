import React, { useEffect } from "react";
import "./protectedLayout.scss";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSweetAlert } from "@/hooks/useAlert";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { user, isValidatingToken } = useAuth();
  const { showAlert } = useSweetAlert();

  useEffect(() => {
    // Aguarda a validação inicial do token terminar
    if (isValidatingToken) {
      return;
    }

    // Se não houver usuário após a validação, redireciona
    if (!user) {
      showAlert({
        icon: "error",
        text: "Ops! Você não possui acesso e será redirecionado para o login!",
        confirmButtonText: "Retornar",
      });

      router.push("/login");
    }
  }, [user, isValidatingToken, router, showAlert]);

  // Não renderiza nada enquanto valida ou se não houver usuário
  if (isValidatingToken || !user) {
    return null;
  }

  return <>{children}</>;
};
