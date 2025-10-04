import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
  useContext,
} from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { submissionApi } from "@/services/submission";

interface SubmissionProps {
  children: ReactNode;
}

interface SubmissionProviderData {
  loadingSubmissionList: boolean;
  loadingSubmission: boolean;
  submissionList: Submission[];
  submission: Submission | null;
  setSubmission: Dispatch<SetStateAction<Submission | null>>;
  getSubmissions: (params: GetSubmissionParams) => void;
  getSubmissionById: (idSubmission: string) => void;
  createSubmission: (body: SubmissionParams) => Promise<boolean>;
  updateSubmissionById: (
    idSubmission: string,
    body: SubmissionParams
  ) => Promise<boolean>;
  deleteSubmissionById: (idSubmission: string) => void;
}

export const SubmissionContext = createContext<SubmissionProviderData>(
  {} as SubmissionProviderData
);

export const SubmissionProvider = ({ children }: SubmissionProps) => {
  const [loadingSubmissionList, setLoadingSubmissionList] =
    useState<boolean>(false);
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);
  const [submissionList, setSubmissionList] = useState<Submission[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const { showAlert } = useSweetAlert();

  const getSubmissions = async (params: GetSubmissionParams) => {
    setLoadingSubmissionList(true);

    try {
      const response = await submissionApi.getSubmissions(params);
      setSubmissionList(response);
    } catch (err: any) {
      console.error(err);
      setSubmissionList([]);

      showAlert({
        icon: "error",
        title: "Erro ao listar submissions",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingSubmissionList(false);
    }
  };

  const getSubmissionById = async (idSubmission: string) => {
    setLoadingSubmission(true);

    try {
      const response = await submissionApi.getSubmissionById(idSubmission);
      setSubmission(response);
    } catch (err: any) {
      console.error(err);
      setSubmission(null);
    } finally {
      setLoadingSubmission(false);
    }
  };

  const createSubmission = async (body: SubmissionParams): Promise<boolean> => {
    setLoadingSubmission(true);

    try {
      const response = await submissionApi.createSubmission(body);
      setSubmission(response);

      showAlert({
        icon: "success",
        title: "Submission cadastrada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });

      return true;
    } catch (err: any) {
      console.error(err);
      setSubmission(null);

      showAlert({
        icon: "error",
        title: "Erro ao cadastrar submission",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });

      return false;
    } finally {
      setLoadingSubmission(false);
    }
  };

  const updateSubmissionById = async (
    idSubmission: string,
    body: SubmissionParams
  ): Promise<boolean> => {
    setLoadingSubmission(true);

    try {
      const response = await submissionApi.updateSubmissionById(
        idSubmission,
        body
      );
      setSubmission(response);

      showAlert({
        icon: "success",
        title: "Submission atualizada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });

      return true;
    } catch (err: any) {
      console.error(err);
      setSubmission(null);

      showAlert({
        icon: "error",
        title: "Erro ao atualizar submission",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a atualização. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });

      return false;
    } finally {
      setLoadingSubmission(false);
    }
  };

  const deleteSubmissionById = async (idSubmission: string) => {
    setLoadingSubmission(true);

    try {
      await submissionApi.deleteSubmissionById(idSubmission);

      showAlert({
        icon: "success",
        title: "Submission deletada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);

      showAlert({
        icon: "error",
        title: "Erro ao deletar submission",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a deleção. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setSubmission(null);
      setLoadingSubmission(false);
    }
  };

  return (
    <SubmissionContext.Provider
      value={{
        loadingSubmission,
        loadingSubmissionList,
        submission,
        setSubmission,
        submissionList,
        getSubmissions,
        getSubmissionById,
        createSubmission,
        updateSubmissionById,
        deleteSubmissionById,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmission = () => useContext(SubmissionContext);
