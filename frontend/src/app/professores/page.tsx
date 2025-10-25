"use client";

import LoadingPage from "@/components/LoadingPage";
import { useRef, useState } from "react";
import "./style.scss";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";        
import { FormCadastroProfessor } from "@/components/Forms/CadastroProfessor/FormCadastroProfessor";

export default function Professores() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSuccess = () => {
        console.log("Professor cadastrado com sucesso!");
    }
  return (
    <ProtectedLayout>
        <div className="professores">
            <div className="wrapper-professores">
                <div className="header-professores">
                    <h2 className="titulo modal-title">Cadastrar Novo Professor</h2>
                    <p className="subtitulo modal-subtitle">
                        Preencha os dados abaixo para cadastrar um novo professor. 
                        Uma senha temporária será gerada e enviada por email.
                    </p>
                </div>
                

                  <FormCadastroProfessor 
                    onSuccess={handleSuccess} 
                    formRef={formRef}
                    showButtons={true}
                  />

            </div>
        </div>
    </ProtectedLayout>
  );
}
