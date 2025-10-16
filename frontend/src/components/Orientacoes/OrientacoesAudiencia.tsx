"use client";

import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useEffect, useState } from "react";

import "./style.scss";
import { useOrientacao } from "@/hooks/useOrientacao";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function OrientacoesAudiencia() {
  const { putOrientacao, orientacoes, getOrientacoes } = useOrientacao();

  const [content, setContent] = useState(orientacoes?.audienceGuidance || "");

  const handleEditOrientacao = () => {
    const idOrientacao = orientacoes?.id;
    const eventEditionId = getEventEditionIdStorage();

    if (idOrientacao) {
      putOrientacao(idOrientacao, {
        eventEditionId: eventEditionId ?? "",
        audienceGuidance: content,
      });
      getOrientacoes()
    }
  };

  useEffect(() => {
    setContent(orientacoes?.audienceGuidance || "");
  }, [orientacoes?.audienceGuidance]);

  return (
    <div className="orientacoes">
      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
        handleEditField={handleEditOrientacao}
      />
    </div>
  );
}
