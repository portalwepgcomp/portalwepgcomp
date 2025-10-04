import { createContext, ReactNode, useState, useContext } from "react";

import { useSweetAlert } from "@/hooks/useAlert";

import axiosInstance from '@/utils/api';

const baseUrl = "/uploads";
const instance = axiosInstance;

interface SubmissionFileProps {
  children: ReactNode;
}

interface SubmissionFileProviderData {
  loadingSubmissionFileList: boolean;
  loadingSubmissionFile: boolean;
  submissionFileList: SubmissionFile[];
  submissionFile: SubmissionFile | null;
  getFiles: () => void;
  sendFile: (file: File) => Promise<any>;
  deleteFile: (idFile: string) => Promise<any>;
}

export const SubmissionFileContext = createContext<SubmissionFileProviderData>(
  {} as SubmissionFileProviderData
);

export const SubmissionFileProvider = ({ children }: SubmissionFileProps) => {
  const [loadingSubmissionFileList, setLoadingSubmissionFileList] =
    useState<boolean>(false);
  const [loadingSubmissionFile, setLoadingSubmissionFile] =
    useState<boolean>(false);
  const [submissionFileList, setSubmissionFileList] = useState<
    SubmissionFile[]
  >([]);
  const [submissionFile, setSubmissionFile] = useState<SubmissionFile | null>(
    null
  );

  const { showAlert } = useSweetAlert();

  const getFiles = async () => {
    setLoadingSubmissionFileList(true);

    try {
      const { data } = await instance.post(`${baseUrl}/list`);
      setSubmissionFileList(data);
    } catch (err: any) {
      setSubmissionFileList([]);
      console.error(err);
    } finally {
      setLoadingSubmissionFileList(false);
    }
  };

  const sendFile = async (file: File) => {
    setLoadingSubmissionFile(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data } = await instance.post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSubmissionFile(data);
      return data;
    } catch (err: any) {
      console.error(err);
      setLoadingSubmissionFile(false);
      return null;
    } finally {
      setLoadingSubmissionFile(false);
    }
  };

  const deleteFile = async (idFile: string) => {
      const { data } = await instance.delete(`${baseUrl}/${idFile}`, {method: 'DELETE'});
      console.log("DELETE", data)
      return data;
    }

  return (
    <SubmissionFileContext.Provider
      value={{
        loadingSubmissionFileList,
        loadingSubmissionFile,
        submissionFileList,
        submissionFile,
        getFiles,
        sendFile,
        deleteFile,
      }}
    >
      {children}
    </SubmissionFileContext.Provider>
  );
};

export const useSubmissionFile = () => useContext(SubmissionFileContext);
