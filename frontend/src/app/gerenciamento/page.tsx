"use client";

import { GraduationCap, Mail, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import "../../components/UI/styles/button.scss";
import "../../components/UI/styles/card.scss";
import "./styles.scss";

const Index = () => {
  const router = useRouter();

  return (
    <div className="index-page">
      {/* Header */}
      <header className="index-page__header">
        <h1 className="index-page__title">Portal WePGCOMP</h1>
        <p className="index-page__subtitle">Painel Administrativo</p>
        <p className="index-page__description">
          Sistema de gerenciamento e comunicação com usuários
        </p>
      </header>

      {/* Main Content */}
      <main className="index-page__main">
        <div className="index-page__grid">
          {/* Email Card */}
          <div className="feature-card feature-card--active">
            <div className="feature-card__icon">
              <Mail />
            </div>
            <h3 className="feature-card__title">Envio de E-mails</h3>
            <p className="feature-card__description">
              Envie mensagens para grupos específicos de usuários do sistema
            </p>
            <button 
              className="button button--primary button--full-width"
              onClick={() => router.push("/gerenciamento/enviar-email")}
            >
              Acessar
            </button>
          </div>

          {/* Users Card */}
          <div className="feature-card feature-card--disabled">
            <div className="feature-card__icon">
              <Users />
            </div>
            <h3 className="feature-card__title">Gerenciar Usuários</h3>
            <p className="feature-card__description">
              Visualize e gerencie todos os usuários cadastrados
            </p>
            <div className="feature-card__badge">Em breve</div>
          </div>

          {/* Permissions Card */}
          <div className="feature-card feature-card--disabled">
            <div className="feature-card__icon">
              <GraduationCap  />
            </div>
            <h3 className="feature-card__title">Professores</h3>
            <p className="feature-card__description">
              Cadastre novos professores
            </p>
            <div className="feature-card__badge">Em breve</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
