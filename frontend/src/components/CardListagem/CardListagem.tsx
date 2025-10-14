"use client";

import Image from "next/image";

import "./style.scss";
import Star from "../UI/Star";

import { useSweetAlert } from "@/hooks/useAlert";
import { useEdicao } from "@/hooks/useEdicao";
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
  startTime: string;
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
  startTime
}: Readonly<CardListagem>) {
  const { showAlert } = useSweetAlert();
  const { Edicao } = useEdicao();

  function dateFormat(date:string){
    if (!date) return "";
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `Início às ${hours}:${minutes} do dia ${day}/${month}/${year}`;
  }

  return (
    <div className="card-listagem">
      <div className="card-listagem-text"             
            data-bs-toggle="modal"
            data-bs-target={`#${idModalEdit}`}
            onClick={() => {
              if (onEdit) {
                onEdit();
              }
            }}
      >
        <h5 className="card-listagem-title">{title}</h5>
        {startTime && <p>{dateFormat(startTime)}</p>}
        {mainAuthor != "Sem nome" &&
        <div className="card-listagem-authors">
          <h6 className="card-listagem-main-author">Doutorando(a): {mainAuthor}</h6>
          {advisor && <p className="card-listagem-advisor">Orientador(a): {advisor}</p>}
        </div>
        }
        
        <ReadMore text={subtitle} maxLength={100}/>
      </div>
      <div className="buttons-area">
        {!!idGeneralModal && !!generalButtonLabel && !!Edicao?.isActive && (
          <button
            className="button-general"
            data-bs-toggle="modal"
            data-bs-target={`#${idGeneralModal}`}
          >
            {generalButtonLabel}
          </button>
        )}
        {showFavorite ? (
          <Star color={"#F17F0C"} />
        ) : (
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${idModalEdit}`}
            onClick={() => {
              if (onEdit) {
                onEdit();
              }
            }}
            style={{ display: Edicao?.isActive ? "block" : "none" }}
          >
            <Image
              src="/assets/images/edit.svg"
              id="edit-button"
              alt="edit button"
              width={50}
              height={50}
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
                if (result.isConfirmed) {
                  onDelete();
                }
              });
            }}
          >
            <Image
              src="/assets/images/delete.svg"
              alt="delete button"
              width={50}
              height={50}
            />
          </button>
        )}
      </div>
    </div>
  );
}
