"use client";

import Image from "next/image";
import { useState } from "react";

import Premiacoes from "@/components/Premiacao/Premiacoes";
import Banner from "@/components/UI/Banner";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { presentationApi } from "@/services/presentation";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useSweetAlert } from "@/hooks/useAlert";
import { PremiacaoProvider } from "@/hooks/usePremiacao";

export default function Premiacao() {
  const [activeCategory, setActiveCategory] = useState<
    "banca" | "avaliadores" | "publico"
  >("banca");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { showAlert } = useSweetAlert();

  const handleChangeCategory = (
    categoria: "banca" | "avaliadores" | "publico"
  ) => {
    setActiveCategory(categoria);
  };

  const handleRecalculateScores = async () => {
    const eventEditionId = getEventEditionIdStorage();
    if (!eventEditionId) {
      showAlert({
        icon: "error",
        title: "Erro",
        text: "Evento não encontrado",
      });
      return;
    }

    setIsCalculating(true);
    try {
      await presentationApi.calculateAllScores(eventEditionId);
      showAlert({
        icon: "success",
        title: "Sucesso!",
        text: "Scores recalculados com sucesso",
        timer: 2000,
      });
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Erro ao recalcular scores",
        text: error.response?.data?.message || "Ocorreu um erro inesperado",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleResetScores = async (type: "evaluators" | "public") => {
    const eventEditionId = getEventEditionIdStorage();
    if (!eventEditionId) {
      showAlert({
        icon: "error",
        title: "Erro",
        text: "Evento não encontrado",
      });
      return;
    }

    const typeLabel = type === "evaluators" ? "da Banca" : "do Público";

    const result = await showAlert({
      icon: "warning",
      title: "Tem certeza que deseja resetar?",
      text: `Isso irá apagar todos os scores ${typeLabel}. Esta ação não pode ser desfeita.`,
      showCancelButton: true,
      confirmButtonText: "Resetar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsResetting(true);
    try {
      if (type === "evaluators") {
        await presentationApi.resetEvaluatorsScores(eventEditionId);
      } else {
        await presentationApi.resetPublicScores(eventEditionId);
      }

      showAlert({
        icon: "success",
        title: "Sucesso!",
        text: `Scores ${typeLabel} resetados com sucesso`,
        timer: 2000,
      });
      window.location.reload();
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Erro ao resetar scores",
        text: error.response?.data?.message || "Ocorreu um erro inesperado",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <ProtectedLayout>
      <PremiacaoProvider>
        <div className="d-flex flex-column before-banner premiacao">
          <div className="d-flex flex-column">
            <Banner title="Premiação" />
            <div className="d-flex justify-content-center gap-4 buttons">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquise pelo nome da apresentação"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary border border-0 search-button d-flex justify-content-center align-items-center"
                  type="button"
                  id="button-addon2"
                >
                  <Image
                    src="/assets/images/search.svg"
                    alt="Search icon"
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              <button
                className="btn d-flex justify-content-center align-items-center fw-semibold"
                onClick={handleRecalculateScores}
                disabled={isCalculating || isResetting}
                style={{
                  background: "#FFA90F",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                {isCalculating ? "Recalculando..." : "Recalcular Scores"}
              </button>

              <div className="dropdown">
                <button
                  className="btn btn-danger dropdown-toggle d-flex justify-content-center align-items-center fw-semibold"
                  type="button"
                  id="dropdownResetScores"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={isCalculating || isResetting}
                  style={{
                    borderRadius: "8px",
                    padding: "6px 16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isResetting ? "Resetando..." : "Resetar Scores"}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownResetScores">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleResetScores("evaluators")}
                      disabled={isResetting}
                    >
                      Resetar Scores da Banca
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleResetScores("public")}
                      disabled={isResetting}
                    >
                      Resetar Scores do Público
                    </button>
                  </li>
                </ul>
              </div>

              <button
                className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                  activeCategory === "banca" ? "click" : "unclick"
                }`}
                onClick={() => handleChangeCategory("banca")}
              >
                Banca
              </button>
              <button
                className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                  activeCategory === "avaliadores" ? "click" : "unclick"
                }`}
                onClick={() => handleChangeCategory("avaliadores")}
              >
                Avaliadores
              </button>
              <button
                className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                  activeCategory === "publico" ? "click" : "unclick"
                }`}
                onClick={() => handleChangeCategory("publico")}
              >
                Público
              </button>
            </div>

            {!!activeCategory && <Premiacoes categoria={activeCategory} searchValue={searchTerm} />}
          </div>
        </div>
      </PremiacaoProvider>
    </ProtectedLayout>
  );
}
