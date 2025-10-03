"use client";

import { useEffect, useMemo, useState } from "react";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useAuth } from "@/hooks/useAuth";
import { useSubmission } from "@/hooks/useSubmission";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem, { mapCardList } from "@/templates/Listagem/Listagem";
import IndicadorDeCarregamento from "@/components/IndicadorDeCarregamento/IndicadorDeCarregamento";
import { useEdicao } from "@/hooks/useEdicao";

export default function Apresentacoes() {
  const { title, userArea } = ApresentacoesMock;
  const { user } = useAuth();

  const {
    submissionList,
    getSubmissions,
    loadingSubmissionList,
    deleteSubmissionById,
    setSubmission,
  } = useSubmission();

  const [searchValue, setSearchValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);

  const { Edicao } = useEdicao();

  const eventEditionId = Edicao?.id;

  useEffect(() => {
    if (eventEditionId) {
      getSubmissions({ eventEditionId: eventEditionId ?? "" });
    }
    setIsMounted(true);
  }, [eventEditionId]);

  const filteredSubmissions = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    const filtered = submissionList.filter((submission) => {
      const matchesSearch = submission.title.toLowerCase().includes(search);

      if (user?.level !== "Default") return matchesSearch;

      return submission.mainAuthorId === user?.id && matchesSearch;
    });

    setIsAddButtonDisabled(user?.level === "Default" && filtered.length > 0);

    return filtered;
  }, [searchValue, submissionList, user]);

  const handleDelete = async (submissionId: string) => {
    const submission = submissionList.find((s) => s.id === submissionId);

    if (!submission) return;

    if (user?.level !== "Default" || submission.mainAuthorId === user?.id) {
      await deleteSubmissionById(submissionId);
    }
  };

  const handleEdit = (submissionId: string) => {
    const submission = filteredSubmissions.find((s) => s.id === submissionId);
    if (submission) setSubmission(submission);
  };

  const handleSelect = (card: any) => {
    const submission = submissionList.find((s) => s.id === card.id);
    if (submission) setSubmission(submission);
  };

  if (loadingSubmissionList || !isMounted) {
    return (
      <ProtectedLayout>
        <IndicadorDeCarregamento />
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="d-flex flex-column before-list">
        <Listagem
          idModal="editarApresentacaoModal"
          title={title}
          labelAddButton={userArea.add}
          searchValue={searchValue}
          onChangeSearchValue={setSearchValue}
          searchPlaceholder={userArea.search}
          cardsList={mapCardList(filteredSubmissions, "title", "abstract")}
          isLoading={loadingSubmissionList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClickItem={handleSelect}
          onClear={() => setSubmission(null)}
          isAddButtonDisabled={isAddButtonDisabled}
        />
        <ModalEditarCadastro />
      </div>
    </ProtectedLayout>
  );
}
