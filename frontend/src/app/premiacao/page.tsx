"use client";

import { useState } from "react";
import Image from "next/image";

import Premiacoes from "@/components/Premiacao/Premiacoes";
import Banner from "@/components/UI/Banner";

import "./style.scss";
import { PremiacaoProvider } from "@/hooks/usePremiacao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";

export default function Premiacao() {
  const [activeCategory, setActiveCategory] = useState<
    "banca" | "avaliadores" | "publico"
  >("banca");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangeCategory = (
    categoria: "banca" | "avaliadores" | "publico"
  ) => {
    setActiveCategory(categoria);
  };

  return (
    <ProtectedLayout>
      <PremiacaoProvider>
        <div className="d-flex flex-column before-banner premiacao">
          <div className="d-flex flex-column">
            <Banner title="Premiação" />
            <div className="d-flex justify-content-center gap-4 buttons">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquise pelo nome da apresentação"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary border border-0 search-button d-flex justify-content-center align-items-center"
                  type="button"
                  id="button-addon2"
                >
                  <Image
                    src="/assets/images/search.svg"
                    alt="Search icon"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
              
              <button
                className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                  activeCategory === "banca" ? "click" : "unclick"
                }`}
                onClick={() => handleChangeCategory("banca")}
              >
                Banca
              </button>
              <button
                className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                  activeCategory === "avaliadores" ? "click" : "unclick"
                }`}
                onClick={() => handleChangeCategory("avaliadores")}
              >
                Avaliadores
              </button>
              <button
                className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                  activeCategory === "publico" ? "click" : "unclick"
                }`}
                onClick={() => handleChangeCategory("publico")}
              >
                Público
              </button>
            </div>

            {!!activeCategory && <Premiacoes categoria={activeCategory} searchValue={searchTerm} />}
          </div>
        </div>
      </PremiacaoProvider>
    </ProtectedLayout>
  );
}
