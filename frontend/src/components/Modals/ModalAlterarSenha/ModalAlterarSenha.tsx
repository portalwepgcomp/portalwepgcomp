"use client";

import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";

import { useEdicao } from "@/hooks/useEdicao";

import "./style.scss";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";

export default function ModalAlterarSenha() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { resetPasswordSendEmail, loadingSendEmail } = useUsers();
  const { Edicao } = useEdicao();

  const validateEmail = (value: string) => {
    if (!value) return "O email é obrigatório.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "E-mail inválido!";
    return "";
  };

  const handleSendEmail = () => {
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return; 
    }
    setError("");
    const body = { email };
    resetPasswordSendEmail(body);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const validationError = validateEmail(value);
    setError(validationError);
  };

  return (
    <ModalComponent
      id="alterarSenhaModal"
      loading={loadingSendEmail}
      labelConfirmButton="Enviar"
      disabledConfirmButton={!email || !!error}
      colorButtonConfirm="#0065A3"
      onConfirm={handleSendEmail}
    >
      <div className="modal-alterar-senha">
        <h1 className="d-flex justify-content-center mt-5 fw-normal border-yellow ms-2">
          {Edicao?.name || "Carregando..."}
        </h1>
        <hr className="linha-alterar-senha" />

        <div className="content-alterar-senha">
          <h2>Esqueci minha senha</h2>
          <p>
            Por favor, informe o e-mail cadastrado em sua conta, e enviaremos um
            link com as instruções para recuperação.
          </p>
        </div>

        <div className="col-12 mb-1 field-alterar-senha">
          <label className="form-label fw-bold form-title form-label-alterar-senha">
            E-mail
            <span className="text-danger ms-1 form-title">*</span>
          </label>
          <input
            type="email"
            className={`form-control input-title ${error ? "is-invalid" : ""}`}
            id="email-alterar-senha"
            placeholder="Insira seu e-mail"
            value={email}
            onChange={handleEmailChange}
          />
          {error && <p className="text-danger error-message">{error}</p>}
        </div>
      </div>
    </ModalComponent>
  );
}
