"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import Link from "next/link";
import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";
import { useCertificate } from "@/services/certificate";
import { useSweetAlert } from "@/hooks/useAlert";
import ModalMelhoresAvaliadores from "../Modals/ModalMelhoresAvaliadores/ModalMelhoresAvaliadores";
import ModalCriterios from "../Modals/ModalCriterios/ModalCriterios";
import { createPortal } from "react-dom";

interface PerfilAdminProps {
    profile: ProfileType;
    role: RoleType;
}

export default function PerfilAdmin({
    profile,
    role,
}: Readonly<PerfilAdminProps>) {
    const { logout } = useContext(AuthContext);
    const { Edicao } = useEdicao();
    const { showAlert } = useSweetAlert();
    const { downloadCertificate } = useCertificate();
  const [mounted, setMounted] = useState(false);

    const certificateDownload = async () => {
        const response = await downloadCertificate(Edicao?.id || "");

        if (response === 200) {
            showAlert({
                icon: "success",
                title: "Download feito com sucesso!",
                timer: 3000,
                showConfirmButton: false,
            });
            return;
        }
        showAlert({
            icon: "error",
            title: response,
            timer: 3000,
            showConfirmButton: false,
        });
    };

  useEffect(() => setMounted(true), []);

    return (
        <div className="dropdown">
            <button
                className="btn dropdown-toggle border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <i className="bi bi-list fs-3"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end border-3 border-light">
                <li>
                    <Link className="dropdown-item" href="/apresentacoes">
                        Apresentações
                    </Link>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#escolherAvaliadorModal">
                        Avaliadores
                    </button>
                </li>
                {profile === "Presenter" && (
                    <li>
                        <Link
                            className="dropdown-item"
                            href="/minha-apresentacao">
                            Submissão
                        </Link>
                    </li>
                )}
                {profile === "Professor" && (
                    <li>
                        <Link className="dropdown-item" href="/minhas-bancas">
                            Bancas
                        </Link>
                    </li>
                )}
                <li>
                    <button
                        className="dropdown-item"
                        onClick={certificateDownload}>
                        Certificado
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#criteriosModal">
                        Critérios
                    </button>
                </li>
                {role === "Superadmin" && (
                    <li>
                        <Link className="dropdown-item" href="/edicoes">
                            Eventos
                        </Link>
                    </li>
                )}
                <li>
                    <Link className="dropdown-item" href="/favoritos">
                        Favoritos
                    </Link>
                </li>
                <li>
                    <Link className="dropdown-item" href="/premiacao">
                        Premiação
                    </Link>
                </li>
                {role === "Superadmin" && (
                  <li>
                                <Link className="dropdown-item" href="/professores">
                      Professores
                    </Link>
                  </li>
                )}
                <li>
                    <Link className="dropdown-item" href="/sessoes">
                        Sessões
                    </Link>
                </li>
                {role === "Superadmin" && (
                    <li>
                        <Link className="dropdown-item" href="/gerenciamento">
                            Usuários
                        </Link>
                    </li>
                )}
                <li>
                    <Link
                        className="dropdown-item"
                        href="/home"
                        onClick={logout}>
                        Sair
                    </Link>
                </li>
            </ul>
      {mounted &&
        createPortal(
          <>
                  <ModalMelhoresAvaliadores />
                  <ModalCriterios />
          </>,
          document.body,
        )}
        </div>
    );
}
