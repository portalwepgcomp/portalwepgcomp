"use client";

import { useState } from "react";

import Premiacoes from "@/components/Premiacao/Premiacoes";
import Banner from "@/components/UI/Banner";

import "./style.scss";
import { PremiacaoProvider } from "@/context/premiacao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";

export default function Premiacao() {
  const [activeCategory, setActiveCategory] = useState<
    "banca" | "avaliadores" | "publico"
  >("banca");

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

            {!!activeCategory && <Premiacoes categoria={activeCategory} />}
          </div>
        </div>
      </PremiacaoProvider>
    </ProtectedLayout>
  );
}
