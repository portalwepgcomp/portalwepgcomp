"use client";

import { useSweetAlert } from "@/hooks/useAlert";
import { useUsers } from "@/hooks/useUsers";
import { ArrowLeft, Mail, Send, UserCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/Select/Select";
import "../../../components/UI/styles/button.scss";
import "../../../components/UI/styles/card.scss";
import "../../../components/UI/styles/header.scss";
import "../../../components/UI/styles/input.scss";
import "./styles.scss";

type GroupType = "professors" | "admins" | "superadmins" | "presenters" | "listeners" | "all";

interface GroupConfig {
  label: string;
  profiles?: ProfileType[];
  roles?: RoleType[];
  subprofiles?: SubprofileType[];
}

const GROUPS: Record<GroupType, GroupConfig> = {
  professors: {
    label: "Professores",
    profiles: ["Professor"],
  },
  admins: {
    label: "Admins",
    roles: ["Admin"],
  },
  superadmins: {
    label: "SuperAdmins",
    roles: ["Superadmin"],
  },
  presenters: {
    label: "Apresentadores",
    profiles: ["Presenter"],
  },
  listeners: {
    label: "Ouvintes",
    profiles: ["Listener"],
  },
  all: {
    label: "Todos",
  },
};

const SendEmail = () => {
  const router = useRouter();
  const { showAlert } = useSweetAlert();
  const { userList, getUsers, loadingUserList } = useUsers();
  
  const [selectedGroup, setSelectedGroup] = useState<GroupType | "">("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Buscar usuários quando o grupo mudar
  useEffect(() => {
    if (!selectedGroup) {
      return;
    }

    const groupConfig = GROUPS[selectedGroup];
    
    if (selectedGroup === "all") {
      // Para "todos", buscar sem filtros
      getUsers({});
    } else {
      // Buscar com os filtros específicos do grupo
      getUsers({
        profiles: groupConfig.profiles?.[0],
        roles: groupConfig.roles?.[0],
        subprofiles: groupConfig.subprofiles?.[0],
      });
    }
  }, [selectedGroup]); // ← CORREÇÃO: Removido getUsers das dependências

  const recipientCount = userList?.length || 0;

  const handleSendEmail = async () => {
    // Validação
    if (!selectedGroup) {
      showAlert({
        icon: "error",
        title: "Erro de Validação",
        text: "Por favor, selecione um grupo de destinatários.",
      });
      return;
    }

    if (!subject.trim()) {
      showAlert({
        icon: "error",
        title: "Erro de Validação",
        text: "Por favor, preencha o assunto do e-mail.",
      });
      return;
    }

    if (!message.trim()) {
      showAlert({
        icon: "error",
        title: "Erro de Validação",
        text: "Por favor, preencha a mensagem do e-mail.",
      });
      return;
    }

    if (recipientCount === 0) {
      showAlert({
        icon: "warning",
        title: "Sem Destinatários",
        text: "Não há usuários no grupo selecionado.",
      });
      return;
    }

    setIsSending(true);

    try {
      const groupConfig = GROUPS[selectedGroup];
      
      // Enviar para o backend apenas os filtros do grupo
      const emailData = {
        subject,
        message,
        filters: {
          profiles: groupConfig.profiles,
          roles: groupConfig.roles,
          subprofiles: groupConfig.subprofiles,
        },
      };

      // TODO: Substituir pela sua chamada real de API
      // await emailApi.sendEmail(emailData);
      
      console.log("Enviando email:", emailData);
      console.log("Para:", recipientCount, "destinatários");

      // Simulação de delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      showAlert({
        icon: "success",
        title: "E-mail Enviado!",
        text: `E-mail enviado com sucesso para ${recipientCount} destinatário(s).`,
      });

      // Limpar formulário
      setSelectedGroup("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao Enviar E-mail",
        text: err.response?.data?.message || "Ocorreu um erro ao enviar o e-mail.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="send-email-page">
      {/* Header */}
      <header className="header">
        <div className="header__container">
          <div className="header__brand">
            <div className="header__icon">
              <Mail />
            </div>
            <div>
              <h1 className="header__title">Portal WePGCOMP</h1>
              <p className="header__subtitle">Envio de E-mails</p>
            </div>
          </div>
          <button className="button button--ghost" onClick={() => router.back()}>
            <ArrowLeft />
            Voltar ao Início
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="send-email-page__main">
        <p className="send-email-page__description">
          Envie mensagens para grupos específicos de usuários
        </p>

        <div className="send-email-page__grid">
          {/* Email Composition Card */}
          <div className="card animate-fade-in">
            <div className="card__header">
              <Send />
              <h2 className="card__title">Compor E-mail</h2>
            </div>
            <p className="card__subtitle">
              Preencha os detalhes da mensagem que será enviada
            </p>

            <div>
              <div className="form-group">
                <label>Grupo de Destinatários</label>
                <Select 
                  value={selectedGroup} 
                  onValueChange={(value) => setSelectedGroup(value as GroupType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GROUPS).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <label>Assunto</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Digite o assunto do e-mail"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Mensagem</label>
                <textarea
                  className="textarea"
                  placeholder="Digite a mensagem do e-mail"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                />
              </div>

              <button 
                className="button button--primary button--full-width"
                onClick={handleSendEmail}
                disabled={!selectedGroup || !subject || !message || isSending || loadingUserList}
              >
                {isSending ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send />
                    Enviar E-mail para {recipientCount} destinatário(s)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recipients List Card */}
          <div className="card animate-fade-in">
            <div className="card__header">
              <Users />
              <h2 className="card__title">Destinatários</h2>
            </div>
            <p className="card__subtitle">
              Selecione um grupo para ver os destinatários
            </p>

            {!selectedGroup ? (
              <div className="recipients-list__empty">
                <div className="recipients-list__empty-icon">
                  <UserCircle />
                </div>
                <p className="recipients-list__empty-text">
                  Selecione um grupo para visualizar os destinatários
                </p>
              </div>
            ) : loadingUserList ? (
              <div className="recipients-list__empty">
                <div className="loading-spinner"></div>
                <p className="recipients-list__empty-text">
                  Carregando destinatários...
                </p>
              </div>
            ) : recipientCount === 0 ? (
              <div className="recipients-list__empty">
                <div className="recipients-list__empty-icon">
                  <UserCircle />
                </div>
                <p className="recipients-list__empty-text">
                  Nenhum usuário encontrado neste grupo
                </p>
              </div>
            ) : (
              <>
                <div className="recipients-list__count">
                  <p>
                    Total: <strong>{recipientCount}</strong> destinatário(s)
                  </p>
                </div>

                <div className="recipients-list__scroll">
                  <div className="recipients-list__items">
                    {userList.map((user) => (
                      <div key={user.id} className="recipients-list__item">
                        <div className="recipients-list__item-content">
                          <div className="recipients-list__item-icon">
                            <UserCircle />
                          </div>
                          <div className="recipients-list__item-info">
                            <p className="recipients-list__item-name">
                              {user.name}
                            </p>
                            <div className="recipients-list__item-email">
                              <Mail />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SendEmail;
