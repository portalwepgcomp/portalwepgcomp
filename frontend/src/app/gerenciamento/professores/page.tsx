"use client";

import { FormCadastroProfessor } from "@/components/Forms/CadastroProfessor/FormCadastroProfessor";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import Banner from "@/components/UI/Banner";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import "./style.scss";
import { ArrowLeft } from "lucide-react";
import "../../../components/UI/styles/button.scss";
import "../../../components/UI/styles/card.scss";
import "../../../components/UI/styles/header.scss";
import "../../../components/UI/styles/input.scss";

export default function Professores() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSuccess = () => {
    console.log("Professor cadastrado com sucesso!");
  }
  return (
    <ProtectedLayout>
      <Banner title="Professores" />
      <header className="header">
        <div className="header__container">
          <div className="header__brand">
          </div>
          <button className="button button--ghost" onClick={() => router.back()}>
            <ArrowLeft />
            Voltar
          </button>
        </div>
      </header>
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
