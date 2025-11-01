import Image from "next/image"

import { useEffect, useState } from "react"
import "./style.scss"

export default function Premiacao({ categoria, premiacoes, avaliadores, searchValue }: PremiacaoCategoriaProps) {
  const [premiacoesValues, setPremiacoesValues] = useState<Premiacoes[]>()
  const [premiacoesValuesAvaliadores, setPremiacoesValuesAvaliadores] = useState<AuthorOrEvaluator[]>()

  useEffect(() => {
    if (categoria == "banca" || categoria == "publico") {
      const newPremiacoesValues =
        premiacoes?.filter(
          (v) => !v.submission.title || v.submission.title?.toLowerCase().includes(searchValue.trim().toLowerCase())
        ) ?? []
      setPremiacoesValues(newPremiacoesValues)
    } else {
      const newPremiacoesValuesAvaliadores =
        avaliadores
          ?.filter((v) => !v.name || v.name?.toLowerCase().includes(searchValue.trim().toLowerCase()))
          .sort((a, b) => {
            return (b.votes ?? 0) - (a.votes ?? 0)
          }) ?? []
      setPremiacoesValuesAvaliadores(newPremiacoesValuesAvaliadores)
    }
  }, [premiacoes, searchValue, avaliadores])

  return (
    <div className="d-grid gap-3 mb-5 premiacao">
      <div className="d-flex flex-column">
        <h1 className="fw-bold title">{categoria === "banca" ? " " : categoria === "avaliadores" ? "" : ""}</h1>
        <h5 className="text-black">
          {`
                    ${categoria === "banca" ? "" : categoria === "avaliadores" ? "" : categoria === "publico" ? "" : ""}
                    `}
        </h5>
        <div className="d-flex flex-column gap-3">
         <div className="d-flex align-items-center justify-content-between border border-3 border-solid custom-border p-3"><div className="d-flex align-items-center gap-3 flex-grow-1"><div className="ranking-position"><h3 className="mb-0 fw-bold text-primary">1º</h3></div><div className="text-black flex-grow-1"><h6 className="text-black fw-semibold ">The dispersion of Test Smells in Flutter projects and the feeling of their insertions</h6><h6 className="text-black mb-0">Tássio Guerreiro Antunes Virgínio</h6></div></div><div className="text-end"><h4 className="mb-0 text-black fw-bold">3.48</h4></div></div>
        </div>
      </div>
    </div>
  )
}
