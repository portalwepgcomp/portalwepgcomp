"use client";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import "./style.scss";

interface ModalConfirmacaoProps {
  id: string;
  text: string;
  colorButtonConfirm: string;
  onConfirm: () => void;
}

export default function ModalConfirmacao({
  id,
  text,
  colorButtonConfirm,
  onConfirm,
}: Readonly<ModalConfirmacaoProps>) {
  return (
    <ModalComponent
      id={id}
      loading={false}
      labelConfirmButton="Confirmar"
      colorButtonConfirm={colorButtonConfirm}
      onConfirm={onConfirm}
      isShortModal
    >
      <div className="modal-confirmacao">
        <p>{text}</p>
      </div>
    </ModalComponent>
  );
}
