"use client"

import Gerenciar from "@/components/GerenciarUsuario/Gerenciar";
import Banner from "@/components/UI/Banner";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import "../../../components/UI/styles/button.scss";
import "../../../components/UI/styles/card.scss";
import "../../../components/UI/styles/header.scss";
import "../../../components/UI/styles/input.scss";

export default function Gerenciamento() {
  const router = useRouter();
  return (
    <div
      className="d-flex flex-column"
      style={{
        gap: "30px",
      }}
    >
      <Banner title="Gerenciamento de Usuários" />
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
      <Gerenciar />
    </div>
  );
}
