"use client";

import IndicadorDeCarregamento from "@/components/IndicadorDeCarregamento/IndicadorDeCarregamento";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { usePresentation } from "@/hooks/usePresentation";
import Listagem, { mapCardList } from "@/templates/Listagem/Listagem";
import { useEffect, useState } from "react";

export default function Favoritos() {
  const {
    presentationBookmarks,
    getPresentationBookmarks,
    deletePresentationBookmark,
  } = usePresentation();

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getPresentationBookmarks().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!presentationBookmarks?.bookmarkedPresentations?.length) {
      return;
    }
    const newSessionsList =
      presentationBookmarks.bookmarkedPresentations.filter((item) =>
        item.submission?.title
          ?.toLowerCase()
          .includes(searchValue.trim().toLowerCase())
      );

    setSessionsListValues(newSessionsList);
  }, [presentationBookmarks, searchValue]);

  function favoriteItem(item) {
    setSessionsListValues({ ...sessionsListValues, ...item });
  }

  const handleDelete = async (submissionId: any) => {
    const favoritoParaDeletar: PresentationBookmarkRegister = {
      presentationId: submissionId,
    };
    await deletePresentationBookmark(favoritoParaDeletar);

    const updatedSubmissions = sessionsListValues.filter(
      (submission) => submission.id !== submissionId
    );
    setSessionsListValues(updatedSubmissions);
  };

  const sessionMaped = sessionsListValues.map((presentation) => ({
    id: presentation?.submission.id,
    title: presentation?.submission.title,
    name: presentation?.submission.mainAuthor.name,
    email: presentation?.submission.mainAuthor.email,
    subtitle: presentation?.submission.abstract,
    pdfFile: presentation?.submission.pdfFile,
    advisorName: presentation?.submission?.advisor?.name,
    ...presentation,
  }));

  return (
    
    <ProtectedLayout>
      <div
        className="d-flex flex-column"
        style={{
          gap: "50px",
        }}
      >
      {isLoading ? (
        <IndicadorDeCarregamento />
      ) : (
        <Listagem
          title="Apresentações Favoritas"
          cardsList={mapCardList(sessionMaped, "title", "abstract")}
          isFavorites
          idModal={"Apresentações Favoritas".trim() + "-modal"}
          searchValue={searchValue}
          onChangeSearchValue={(value) => setSearchValue(value)}
          searchPlaceholder="Pesquise pelo título da apresentação"
          onDelete={handleDelete}
          onEdit={(item) => favoriteItem(item)}
          fullInfo={true}
        />
      )}
        
      </div>
    </ProtectedLayout>
  );
}
