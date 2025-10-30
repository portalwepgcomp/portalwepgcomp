import Image from "next/image";

import "./style.scss";
import { useEffect, useState } from "react";

export default function Premiacao({
  categoria,
  premiacoes,
  avaliadores,
  searchValue,
}: PremiacaoCategoriaProps) {
  const [premiacoesValues, setPremiacoesValues] = useState<Premiacoes[]>();
  const [premiacoesValuesAvaliadores, setPremiacoesValuesAvaliadores] =
    useState<AuthorOrEvaluator[]>();

  useEffect(() => {
    if (categoria == "banca" || categoria == "publico") {
      const newPremiacoesValues =
        premiacoes?.filter(
          (v) =>
            !v.submission.title ||
            v.submission.title
              ?.toLowerCase()
              .includes(searchValue.trim().toLowerCase()),
        ) ?? [];
      setPremiacoesValues(newPremiacoesValues);
    } else {
      const newPremiacoesValuesAvaliadores =
        avaliadores
          ?.filter(
            (v) =>
              !v.name ||
              v.name?.toLowerCase().includes(searchValue.trim().toLowerCase()),
          )
          .sort((a, b) => {
            return (b.votes ?? 0) - (a.votes ?? 0);
          }) ?? [];
      setPremiacoesValuesAvaliadores(newPremiacoesValuesAvaliadores);
    }
  }, [premiacoes, searchValue, avaliadores]);

  return (
    <div className="d-grid gap-3 mb-5 premiacao">
      <div className="d-flex flex-column">
        <h1 className="fw-bold title">
          {categoria === "banca" ? " " : categoria === "avaliadores" ? "" : ""}
        </h1>
        <h5 className="text-black">
          {`
                    ${
                      categoria === "banca"
                        ? ""
                        : categoria === "avaliadores"
                          ? ""
                          : categoria === "publico"
                            ? ""
                            : ""
                    }
                    `}
        </h5>
        <div className="d-flex flex-column gap-3">
          {premiacoes.length === 0 && categoria !== "avaliadores" ? (
            <div className="d-flex align-items-center justify-content-center p-3">
              <h4 className="empty-list mb-0">
                <Image
                  src="/assets/images/empty_box.svg"
                  alt="Lista vazia"
                  width={90}
                  height={90}
                />
                Essa lista ainda está vazia
              </h4>
            </div>
          ) : categoria === "avaliadores" &&
            premiacoesValuesAvaliadores !== undefined &&
            premiacoesValuesAvaliadores.length === 0 ? (
            <div className="d-flex align-items-center justify-content-center p-3">
              <h4 className="empty-list mb-0">
                <Image
                  src="/assets/images/empty_box.svg"
                  alt="Lista vazia"
                  width={90}
                  height={90}
                />
                Essa lista ainda está vazia
              </h4>
            </div>
          ) : premiacoes.length === 0 &&
            categoria === "avaliadores" &&
            premiacoesValuesAvaliadores !== undefined ? (
            premiacoesValuesAvaliadores.map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between border border-3 border-solid custom-border p-3"
              >
                <div className="d-flex">
                  <div
                    className="text-black fw-bold fs-3 me-3"
                    style={{ minWidth: "30px" }}
                  >
                    {index + 1}º
                  </div>
                  <div className="text-black">
                    <h6
                      className={`text-black fw-semibold ${
                        !item.name ? "mb-0" : ""
                      }`}
                    >
                      {item.name}
                    </h6>
                    {item.email && (
                      <h6 className="text-black mb-0">{item.email}</h6>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-column text-center">
                  <p className="m-0">Votos</p>
                  <p className="mb-0 text-black fw-bold">
                    {categoria === "avaliadores" && item.votes}
                  </p>
                </div>
              </div>
            ))
          ) : premiacoesValues !== undefined ? (
            premiacoesValues.map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between border border-3 border-solid custom-border p-3"
              >
                <div className="text-black">
                  <h6
                    className={`text-black fw-semibold ${
                      !item.submission.mainAuthor.name ? "mb-0" : ""
                    }`}
                  >
                    {item.submission.title}
                  </h6>
                  {item.submission.mainAuthor.name && (
                    <h6 className="text-black mb-0">
                      {item.submission.mainAuthor.name}
                    </h6>
                  )}
                </div>
                <div className="text-end">
                  <h4 className="mb-0 text-black fw-bold">
                    {categoria === "banca"
                      ? item.evaluatorsAverageScore
                      : categoria === "publico"
                        ? item.publicAverageScore
                        : ""}
                  </h4>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
              <h4 className="empty-list mb-0">
                <Image
                  src="/assets/images/empty_box.svg"
                  alt="Lista vazia"
                  width={90}
                  height={90}
                />
                Essa lista ainda está vazia
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
