"use client";

import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AuthContext } from "@/context/AuthProvider/authProvider";

import PerfilAdmin from "../Perfil/PerfilAdmin";
import PerfilApresentador from "../Perfil/PerfilApresentador";
import PerfilOuvinte from "../Perfil/PerfilOuvinte";
import PerfilProfessor from "../Perfil/PerfilProfessor";

import { useActiveEdition } from "@/hooks/useActiveEdition";
import { useEdicao } from "@/hooks/useEdicao";
import "./style.scss";

export default function Header() {
  const { user, signed } = useContext(AuthContext);
  const { listEdicao, edicoesList, getEdicaoByYear } = useEdicao();
  const { setSelectEdition, selectEdition } = useActiveEdition();

  type MenuItem =
    | "inicio"
    | "programação do evento"
    | "contato"
    | "login";

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const pathname = usePathname();

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    if (pathname === "/home") {
      const section = document.getElementById(item);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const yearsOptions = edicoesList
    ?.map((ed) => {
      if (ed.startDate) {
        const fullYear = new Date(ed?.startDate).getFullYear();

        return {
          value: fullYear,
          label: `Edição ${fullYear}`,
          isActive: ed.isActive,
        };
      }

      return { value: "", label: "", isActive: false };
    })
    ?.filter(
      (option, index, self) =>
        option.value &&
        self.findIndex((o) => o.value === option.value) === index
    )
    ?.toSorted((a, b) => Number(b.value) - Number(a.value));

  function perfil() {
    if (!user) return null;
    if (user.level !== "Default")
      return <PerfilAdmin profile={user?.profile} role={user?.level} />;

    switch (user.profile) {
      case "Listener":
        return <PerfilOuvinte />;
      case "Professor":
        return <PerfilProfessor />;
      case "Presenter":
        return <PerfilApresentador />;

      default:
        return null;
    }
  }

  useEffect(() => {
    const currentPath = pathname;
    const currentHash = window.location.hash;
    listEdicao();

    if (currentPath === "/home") {
      if (currentHash === "#inicio") setSelectedItem("inicio");
      else if (currentHash === "#Programacao")
        setSelectedItem("programação do evento");
      else if (currentHash === "#Contato") setSelectedItem("contato");
      else setSelectedItem(null);
    } else if (currentPath === "/login") {
      setSelectedItem("login");
    } else {
      setSelectedItem(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (selectEdition.year) {
      getEdicaoByYear(selectEdition.year);
    }
  }, [selectEdition.year]);

  useEffect(() => {
    if (edicoesList?.length && !selectEdition.year) {
      const edAtiva = edicoesList.find((v) => v.isActive);

      if (edAtiva?.startDate) {
        setSelectEdition({
          year: String(new Date(edAtiva.startDate).getFullYear()),
          isActive: true,
        });
      }
    }
  }, [edicoesList, selectEdition.year, setSelectEdition]);

  return (
    <>
      <div className="header-placeholder">
        <span />
      </div>
      <nav className="navbar navbar-expand-lg fixed px-2">
        <div className="container-fluid justify-content-between">
          <div className="container-brand-edition">
            <Link className="navbar-brand" href="/">
              <Image
                src={"/assets/images/logo_PGCOMP.svg"}
                alt="PGCOMP Logo"
                className="navbar-image"
                width={300}
                height={100}
              />
            </Link>
          </div>
          <div className="container-brand-edition">
            {!!yearsOptions.length && (
              <select
                id="event-edition-select"
                className="form-select event-edition-select"
                value={selectEdition.year}
                onChange={(ed) =>
                  setSelectEdition({
                    year: ed.target.value,
                    isActive:
                      yearsOptions.find((v) => v.value == ed.target.value)
                        ?.isActive ?? false,
                  })
                }
              >
                {yearsOptions?.map((op, i) => (
                  <option id={`edicao-op${i}`} key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <section className="wrapper-menus-mobile">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-house"></i>
            </button>
            <li className="nav-item-mobile">
              {signed ? (
                <div className="welcome-user">
                  {perfil()}
                </div>
              ) : (
                <Link
                  className="nav-link active text-black"
                  aria-current="page"
                  href="/login"
                >
                  Login
                </Link>
              )}
            </li>
          </section>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav align-items-center fw-normal">
              <div
                className={`nav-item ${selectedItem === "inicio" ? "fw-bold" : ""
                  }`}
                onClick={() => handleItemClick("inicio")}
              >
                <Link className="nav-link text-black" href="/home">
                  Início
                </Link>
              </div>

              <div
                className={`nav-item ${selectedItem === "programação do evento" ? "fw-bold" : ""
                  }`}
                onClick={() => handleItemClick("programação do evento")}
              >
                <Link
                  className="nav-link text-black tamanho-texto-programacao-evento"
                  href="/home#Programacao"
                >
                  Programação
                </Link>
              </div>

              <div>
                <Link className="nav-link text-black" href="/orientacoes">
                  Orientações
                </Link>
              </div>

              <div
                className={`nav-item ${selectedItem === "contato" ? "fw-bold" : ""
                  }`}
                onClick={() => handleItemClick("contato")}
              >
                <Link className="nav-link text-black" href="/home#Contato">
                  Contato
                </Link>
              </div>

              {!signed && (
                <li className="nav-item">
                  <Link
                    className="nav-link active text-black"
                    aria-current="page"
                    href="/cadastro"
                  >
                    Cadastro
                  </Link>
                </li>
              )}

              <li className="nav-item-menu">
                {signed ? (
                  <div className="welcome-user">
                    Olá, {user?.name.split(" ")[0]}!{perfil()}
                  </div>
                ) : (
                  <Link
                    className="nav-link active text-black"
                    aria-current="page"
                    href="/login"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>

          </div>
        </div>
      </nav>
    </>
  );
}
