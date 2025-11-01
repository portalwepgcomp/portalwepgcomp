import { useCallback, useState } from "react";
import { useSweetAlert } from "./useAlert";
import { emailApi } from "@/services/emailApi";

interface SendGroupEmailParams {
  subject: string;
  message: string;
  filters: {
    profiles?: ProfileType[];
    roles?: RoleType[];
    subprofiles?: SubprofileType[];
  };
}

interface SendGroupEmailResponse {
  success: boolean;
  sentCount: number;
  failedCount: number;
  message: string;
}

export const useEmails = () => {
  const { showAlert } = useSweetAlert();
  const [sendingEmail, setSendingEmail] = useState(false);

  const sendGroupEmail = useCallback(
    async (params: SendGroupEmailParams): Promise<SendGroupEmailResponse | null> => {
      setSendingEmail(true);

      try {
        const response = await emailApi.sendGroupEmail(params);

        showAlert({
          icon: "success",
          title: "E-mail Enviado!",
          text: `E-mail enviado com sucesso para ${response.sentCount} destinatário(s).`,
        });

        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Ocorreu um erro ao enviar o e-mail.";

        showAlert({
          icon: "error",
          title: "Erro ao Enviar E-mail",
          text: errorMessage,
        });

        return null;
      } finally {
        setSendingEmail(false);
      }
    },
    [showAlert]
  );

  return {
    sendGroupEmail,
    sendingEmail,
  };
};
