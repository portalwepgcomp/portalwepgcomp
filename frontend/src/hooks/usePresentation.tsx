import { useContext } from "react";

import { BookmarkedPresentations } from "@/models/presentatio-bookmarks";
import { presentationApi } from "@/services/presentation";
import { createContext, ReactNode, useState } from "react";


import axiosInstance from "@/utils/api";

const baseUrl = "/presentation";
const instance = axiosInstance;

interface PresentationProps {
  children: ReactNode;
}

interface PresentationProviderData {
  presentationList: Presentation[];
  presentationBookmark: PresentationBookmark;
  presentationBookmarks: BookmarkedPresentations;
  getPresentationAll: (eventEditionId: string) => void;
  getPresentationBookmark: (presentationBookmark: PresentationBookmarkRegister) => Promise<any>;
  getPresentationBookmarks: () => Promise<PresentationBookmark>;
  postPresentationBookmark: (presentationBookmark: PresentationBookmarkRegister) => void;
  deletePresentationBookmark: (presentationBookmark: PresentationBookmarkRegister) => void;
  getPresentationById: (id: string) => Promise<Presentation>;

}

export const PresentationContext = createContext<PresentationProviderData>(
  {} as PresentationProviderData
);

export const usePresentation = () => useContext(PresentationContext);

export const PresentationProvider = ({ children }: PresentationProps) => {
  const [presentationList, setpresentationList] = useState<Presentation[]>([]);
  const [presentationBookmark, setpresentationBookmark] = useState<PresentationBookmark>({ bookmarked: false });
  const [presentationBookmarks, setPresentationbookmarks] = useState<BookmarkedPresentations>({
    bookmarkedPresentations: [],
  });

  const getPresentationById = async (id: string): Promise<Presentation> => {
    const { data } = await instance.get(`${baseUrl}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  }

  const getPresentationAll = async (eventEditionId: string) => {
    presentationApi
      .getPresentations(eventEditionId)
      .then((response) => {
        setpresentationList(response);
      })
      .catch(() => {
        setpresentationList([]);
      })
      .finally(() => { });
  };

  const getPresentationBookmark = async (
    presentationBookmark: PresentationBookmarkRegister
  ) => {
    return presentationApi
      .getPresentationBookmark(presentationBookmark)
      .then((response) => {
        setpresentationBookmark(response);
        return response;
      })
      .catch(() => {
        setpresentationBookmark({ bookmarked: false });
        return { bookmarked: false };
      })
      .finally(() => { });
  };

  const getPresentationBookmarks = async () => {
    try {
      const response = await presentationApi.getPresentationBookmarks();

      setPresentationbookmarks(response);
      return response;
    } catch {
      setpresentationBookmark({ bookmarked: false });
      return { bookmarked: false };
    }
  }

  const postPresentationBookmark = async (presentationBookmark: PresentationBookmarkRegister) => {
    presentationApi.postPresentationBookmark(presentationBookmark)
      .finally(() => { });
  }

  const deletePresentationBookmark = async (presentationBookmark: PresentationBookmarkRegister) => {
    await presentationApi.deletePresentationBookmark(presentationBookmark)

    await getPresentationBookmarks();
  };

  return (
    <PresentationContext.Provider
      value={{
        presentationList,
        presentationBookmark,
        presentationBookmarks,
        getPresentationAll,
        postPresentationBookmark,
        deletePresentationBookmark,
        getPresentationBookmark,
        getPresentationBookmarks,
        getPresentationById
      }}
    >
      {children}
    </PresentationContext.Provider>
  )
}