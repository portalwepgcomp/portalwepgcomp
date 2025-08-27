import { useEffect } from "react";

import PremiacaoCategoria from "./PremiacaoCategoria";

import "./style.scss";
import { usePremiacao } from "@/hooks/usePremiacao";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function Premiacoes({
  categoria,
  searchValue,
}: Readonly<{
  categoria: "banca" | "avaliadores" | "publico";
  searchValue: string;
}>) {
  const {
    premiacaoListBanca,
    premiacaoListAudiencia,
    premiacaoListAvaliadores,
    getPremiacoesBanca,
    getPremiacoesAudiencia,
    getPremiacoesAvaliadores,
  } = usePremiacao();

  useEffect(() => {
    const eventEditionId = getEventEditionIdStorage();

    if (eventEditionId) {
      switch (categoria) {
        case "banca":
          getPremiacoesBanca(eventEditionId);
          break;
        case "publico":
          getPremiacoesAudiencia(eventEditionId);
          break;
        case "avaliadores":
          getPremiacoesAvaliadores(eventEditionId);
          break;
        default:
          break;
      }
    }
  }, [categoria]);

  const getAwards = () => {
    switch (categoria) {
      case "banca":
        return premiacaoListBanca;
      case "publico":
        return premiacaoListAudiencia;
      default:
        return [];
    }
  };

  return (
    <div className="d-flex flex-column premiacao-list">
      <PremiacaoCategoria
        categoria={categoria}
        premiacoes={getAwards()}
        searchValue={searchValue}
        avaliadores={premiacaoListAvaliadores}
      />
    </div>
  );
}
