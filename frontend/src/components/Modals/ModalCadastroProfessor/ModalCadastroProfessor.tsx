"use client";

import { useRef } from "react";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { FormCadastroProfessor } from "@/components/Forms/CadastroProfessor/FormCadastroProfessor";
import { useUsers } from "@/hooks/useUsers";
import "./style.scss";

interface ModalCadastroProfessorProps {
  onSuccess?: () => void;
}

export default function ModalCadastroProfessor({ onSuccess }: ModalCadastroProfessorProps) {
  const { loadingCreateProfessor } = useUsers();
  const formRef = useRef<HTMLFormElement>(null);

  const handleConfirm = () => {
    // Trigger form submission
    if (formRef.current) {
      const submitEvent = new Event("submit", { cancelable: true, bubbles: true });
      formRef.current.dispatchEvent(submitEvent);
    }
  };

  const handleSuccess = () => {
    onSuccess?.();
    // Close modal programmatically
    const modal = document.getElementById('cadastroProfessorModal');
    const backdrop = document.querySelector('.modal-backdrop');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      if (backdrop) {
        backdrop.remove();
      }
    }
  };

  return (
    <ModalComponent
      onConfirm={handleConfirm}
      id="cadastroProfessorModal"
      idCloseModal="cadastroProfessorModalClose"
      loading={loadingCreateProfessor}
      labelConfirmButton="Cadastrar Professor"
      colorButtonConfirm="#0066BA"
    >
      <div className="body-modal-cadastro-professor">
        <div className="modal-header-content">
          <h2 className="modal-title">Cadastrar Novo Professor</h2>
          <p className="modal-subtitle">
            Preencha os dados abaixo para cadastrar um novo professor. 
            Uma senha temporária será gerada e enviada por email.
          </p>
        </div>
        
        <div className="modal-form-content">
          <FormCadastroProfessor 
            onSuccess={handleSuccess} 
            formRef={formRef}
            showButtons={false}
          />
        </div>
      </div>
    </ModalComponent>
  );
}