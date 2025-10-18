"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { useUsers } from "@/hooks/useUsers";
import { zodResolver } from "@hookform/resolvers/zod";

import "./style.scss";

const formCadastroProfessorSchema = z.object({
  nome: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O nome é obrigatório.")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "Nome deve conter apenas letras e espaços.",
    }),
  email: z
    .string({ invalid_type_error: "Campo inválido!" })
    .min(1, "O email é obrigatório.")
    .email({ message: "E-mail inválido!" })
    .refine((email) => email.toLowerCase().endsWith("@ufba.br"), {
      message: "E-mail deve ser da UFBA (@ufba.br)",
    }),
  matricula: z
    .string({ invalid_type_error: "Campo inválido!" })
    .min(1, "A matrícula é obrigatória.")
    .regex(/^\d+$/, {
      message: "Matrícula deve conter apenas números.",
    }),
});

type FormCadastroProfessorSchema = z.infer<typeof formCadastroProfessorSchema>;

interface FormCadastroProfessorProps {
  onSuccess?: () => void;
  formRef?: React.RefObject<HTMLFormElement>;
  showButtons?: boolean;
}

export function FormCadastroProfessor({ onSuccess, formRef, showButtons = true }: FormCadastroProfessorProps) {
  const { createProfessorBySuperadmin, loadingCreateProfessor } = useUsers();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormCadastroProfessorSchema>({
    resolver: zodResolver(formCadastroProfessorSchema),
    defaultValues: {
      nome: "",
      email: "",
      matricula: "",
    },
  });

  const handleFormCadastroProfessor = async (data: FormCadastroProfessorSchema) => {
    const { nome, email, matricula } = data;

    const body = {
      name: nome,
      email,
      registrationNumber: matricula,
    };

    try {
      await createProfessorBySuperadmin(body);
      reset(); // Limpa o formulário após sucesso
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error creating professor:", error);
    }
  };

  const handleAoMudarDeNome = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    setValue("nome", filteredValue);
  };

  const handleMudancaMatricula = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbersOnly = value.replace(/\D/g, "");
    setValue("matricula", numbersOnly);
  };

  const handleCancel = () => {
    reset();
    router.push("/gerenciamento");
  };

  return (
    <div className="cadastro-professor-form">
      <form className="row" onSubmit={handleSubmit(handleFormCadastroProfessor)} ref={formRef}>
        <div className="col-12 mb-3">
          <label className="form-label fs-5 fw-bold">
            Nome completo
            <span className="text-danger ms-1 fs-5">*</span>
          </label>
          <input
            type="text"
            className={`form-control input-title ${errors.nome ? "is-invalid" : ""}`}
            id="nome"
            placeholder="Insira o nome completo do professor"
            {...register("nome")}
            onChange={handleAoMudarDeNome}
            disabled={loadingCreateProfessor}
          />
          {errors.nome && (
            <div className="invalid-feedback">
              {errors.nome.message}
            </div>
          )}
        </div>

        <div className="col-12 mb-3">
          <label className="form-label fs-5 fw-bold">
            E-mail institucional
            <span className="text-danger ms-1 fs-5">*</span>
          </label>
          <input
            type="email"
            className={`form-control input-title ${errors.email ? "is-invalid" : ""}`}
            id="email"
            placeholder="professor@ufba.br"
            {...register("email")}
            disabled={loadingCreateProfessor}
          />
          {errors.email && (
            <div className="invalid-feedback">
              {errors.email.message}
            </div>
          )}
          <div className="form-text">
            O email deve ser da UFBA (terminar com @ufba.br)
          </div>
        </div>

        <div className="col-12 mb-4">
          <label className="form-label fs-5 fw-bold">
            Número de matrícula
            <span className="text-danger ms-1 fs-5">*</span>
          </label>
          <input
            type="text"
            className={`form-control input-title ${errors.matricula ? "is-invalid" : ""}`}
            id="matricula"
            placeholder="Digite o número de matrícula"
            {...register("matricula")}
            onChange={handleMudancaMatricula}
            disabled={loadingCreateProfessor}
          />
          {errors.matricula && (
            <div className="invalid-feedback">
              {errors.matricula.message}
            </div>
          )}
        </div>

        <div className="col-12 mb-3">
          <div className="alert alert-info" role="alert">
            <div className="d-flex align-items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              <div>
                <strong>Informação importante:</strong>
                <br />
                Uma senha temporária será gerada automaticamente e enviada por email para o professor.
                O professor poderá alterar a senha no primeiro acesso.
              </div>
            </div>
          </div>
        </div>

        {showButtons && (
          <div className="col-12 d-flex justify-content-end gap-3">
{/*             <button
              type="button"
              className="btn btn-outline-secondary btn-lg"
              onClick={handleCancel}
              disabled={loadingCreateProfessor}
            >
              Cancelar
            </button> */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loadingCreateProfessor}
            >
              {loadingCreateProfessor ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cadastrando...
                </>
              ) : (
                "Cadastrar Professor"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}