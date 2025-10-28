"use client";
import Contato from "@/components/Contato";
import Endereco from "@/components/Endereco/Endereco";
import "./style.scss";

export default function LocalEvento() {
  return (
    <section
      id="Contato"
      className="contatoWrapper"
    >
      <div
        className="d-flex flex-row justify-content-evenly contato"
      >
        <Contato />
        <Endereco />
      </div>
    </section>
  );
}
