"use client";

import Image from "next/image";

import Star from "../UI/Star";
import "./style.scss";

import { useSweetAlert } from "@/hooks/useAlert";
import { useEdicao } from "@/hooks/useEdicao";
import { useState } from "react";
import ReadMore from "../ReadMore/ReadMore";

interface CardListagem {
  title: string;
  mainAuthor: string;
  advisor: string;
  subtitle: string;
  showFavorite?: boolean;
  generalButtonLabel?: string;
  idModalEdit?: string;
  idGeneralModal?: string;
  onClickItem?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClickItemDrag?: () => void | undefined;
  fileUrl?: string;
  linkHostedFile?: string;
}

export default function CardListagem({
  title,
  mainAuthor,
  advisor,
  subtitle,
  onClickItem,
  generalButtonLabel,
  showFavorite,
  idGeneralModal,
  idModalEdit,
  onDelete,
  onEdit,
  onClickItemDrag,
  fileUrl,
  linkHostedFile,
}: Readonly<CardListagem>) {
  const { showAlert } = useSweetAlert();
  const { Edicao } = useEdicao();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const obterNomeDoArquivoViaUrl = (url: string): string => {
    try {
      const u = new URL(
        url,
        typeof window !== "undefined" ? window.location.origin : "http://localhost"
      );
      const last = u.pathname.split("/").filter(Boolean).pop() || "";
      return decodeURIComponent(last);
    } catch {
      const clean = url.split("?")[0].split("#")[0];
      return decodeURIComponent(clean.split("/").pop() || "");
    }
  };

  function getIconStyle(id: string) {
    return {
      transition: "transform 0.3s ease",
      transform: hoveredId === id ? "scale(1.2)" : "scale(1)",
    };
  }

  const fileName = fileUrl ? obterNomeDoArquivoViaUrl(fileUrl) : "";

  return (
    <div className="card-listagem">
      <div className="card-listagem-text">
        <h5 className="card-listagem-title">{title}</h5>
        {mainAuthor !== "Sem nome" && (
          <div className="card-listagem-authors">
            <h6 className="card-listagem-main-author">Apresentador(a): {mainAuthor}</h6>
            {advisor && <p className="card-listagem-advisor">Orientador(a): {advisor}</p>}
          </div>
        )}
        <ReadMore text={subtitle} maxLength={100} />
      </div>
      <div className="buttons-area">
        {!!idGeneralModal && !!generalButtonLabel && !!Edicao?.isActive && (
          <button
            className="button-general"
            data-bs-toggle="modal"
            data-bs-target={`#${idGeneralModal}`}
            onClick={() => onClickItemDrag && onClickItemDrag()}
          >
            {generalButtonLabel}
          </button>
        )}

        {linkHostedFile ? (
          <a
            href={`${linkHostedFile}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredId("linkHostedFile")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Image
              src="/assets/images/link.svg"
              id="download-button-linkHostedFile"
              alt={`download ${fileName || "arquivo"}`}
              width={40}
              height={40}
              style={getIconStyle("linkHostedFile")}
            />
          </a>
        ) : (
          <span style={{ display: "none" }} title="Arquivo indisponível">
            <Image
              src="/assets/images/download.svg"
              id="go-to-link-uploaded-file"
              alt="go-to-link-uploaded-file button"
              width={40}
              height={40}
              onMouseEnter={() => setHoveredId("linkHostedFile")}
              onMouseLeave={() => setHoveredId(null)}
              style={getIconStyle("linkHostedFile")}
            />
          </span>
        )}

        {fileUrl ? (
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileName}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredId("fileUrl")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Image
              src="/assets/images/download.svg.svg"
              id="download-button-fileUrl"
              alt={`download ${fileName || "arquivo"}`}
              width={40}
              height={40}
              style={getIconStyle("fileUrl")}
            />
          </a>
        ) : (
          <span style={{ display: "none" }} title="Arquivo indisponível">
            <Image
              src="/assets/images/download.svg.svg"
              id="download-button-disabled-fileUrl"
              alt="download button"
              width={40}
              height={40}
              onMouseEnter={() => setHoveredId("fileUrl")}
              onMouseLeave={() => setHoveredId(null)}
              style={getIconStyle("fileUrl")}
            />
          </span>
        )}

        {showFavorite ? (
          <Star color={"#F17F0C"} />
        ) : (
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${idModalEdit}`}
            onClick={() => {
              if (onEdit) onEdit();
            }}
            style={{ display: Edicao?.isActive ? "block" : "none" }}
            onMouseEnter={() => setHoveredId("editButton")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Image
              src="/assets/images/edit.svg"
              id="edit-button"
              alt="edit button"
              width={50}
              height={50}
              style={getIconStyle("editButton")}
            />
          </button>
        )}

        {!!onDelete && !!Edicao?.isActive && (
          <button
            onClick={() => {
              showAlert({
                title: "Você tem certeza?",
                text: "Ao deletar você não poderá reverter essa ação.",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#CF000A",
                cancelButtonText: "Cancelar",
                showConfirmButton: true,
                confirmButtonColor: "#019A34",
                confirmButtonText: "Deletar",
              }).then((result) => {
                if (result.isConfirmed) onDelete();
              });
            }}
            onMouseEnter={() => setHoveredId("deleteButton")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Image
              src="/assets/images/delete.svg"
              alt="delete button"
              width={50}
              height={50}
              style={getIconStyle("deleteButton")}
            />
          </button>
        )}
      </div>
    </div>
  );
}
