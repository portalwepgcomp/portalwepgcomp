"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { AuthContext } from "@/context/AuthProvider/authProvider";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { SubmissionContext } from "@/hooks/useSubmission";
import { UserContext } from "@/hooks/useUsers";
import { useSweetAlert } from "@/hooks/useAlert";
import { useSubmissionFile } from "@/hooks/useSubmissionFile";

import { useEdicao } from "@/hooks/useEdicao";
import "./style.scss";

import IndicadorDeCarregamento from "@/components/IndicadorDeCarregamento/IndicadorDeCarregamento";
import InputMask from "react-input-mask";

const esquemaCadastro = z.object({
  id: z.string().optional(),
  titulo: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O título é obrigatório"),
  resumo: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O resumo é obrigatório"),
  apresentador: z.string({ invalid_type_error: "Campo Inválido" }).optional(),
  orientador: z
    .string({ invalid_type_error: "Campo Inválido" })
    .uuid({ message: "O orientador é obrigatório" }),
  coorientador: z.string().optional(),
  data: z.string().optional(),
  celular: z
    .string()
    .refine((value) => {
      const celularFormatado = value.replace(/\D/g, "");
      return celularFormatado.length >= 10 && celularFormatado.length <= 11;
    }, "O celular deve conter 10 ou 11 dígitos"),
  slide: z
    .string({ invalid_type_error: "Campo Inválido" })
    .refine((val) => val && val.trim().length > 0, {
        message: "O envio do slide em PDF é obrigatório",
      }),
});

type CadastroFormulario = z.infer<typeof esquemaCadastro>;

export function FormCadastroApresentacao() {
  const roteador = useRouter();
  const { showAlert } = useSweetAlert();
  const { user } = useContext(AuthContext);
  const { createSubmission, updateSubmissionById, submission, setSubmission } =
    useContext(SubmissionContext);
  const { getAdvisors, advisors, getUsers, userList, loadingUserList } =
    useContext(UserContext);
  const { sendFile, deleteFile } = useSubmissionFile();
  const [professoresCarregou, setProfessoresCarregou] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const { Edicao } = useEdicao();
  const [carregandoEnvio, setCarregandoEnvio] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<CadastroFormulario>({
    resolver: zodResolver(esquemaCadastro),
  });

  useEffect(() => {
    if (submission && Object.keys(submission).length) {
      setValue("id", submission.id);
      setValue("titulo", submission?.title);
      setValue("resumo", submission?.abstract ?? "");
      setValue("apresentador", submission?.mainAuthorId);
      setValue("orientador", submission?.advisorId);
      setValue("coorientador", submission?.coAdvisor);
      setValue("slide", submission?.pdfFile);
      setNomeArquivo(submission?.pdfFile);
      setValue("celular", submission?.phoneNumber);
    } else {
      setValue("id", "");
      setValue("titulo", "");
      setValue("resumo", "");
      setValue("apresentador", "");
      setValue("orientador", "");
      setValue("coorientador", "");
      setValue("data", "");
      setValue("slide", "");
      setValue("celular", "");

      setArquivo(null);
      setNomeArquivo(null);
    }
  }, [submission, setValue]);

  useEffect(() => {
    if (!professoresCarregou) {
      getAdvisors();
      setProfessoresCarregou(true);
    }
  }, [professoresCarregou, getAdvisors]);

  useEffect(() => {
    if (user?.level !== "Default" && userList.length === 0) {
      getUsers({ profiles: "Presenter" });
    }
  }, [user?.level, userList.length, getUsers]);

  const apresentadores = userList
    .filter((usuario) => usuario.profile === "Presenter")

  const aoMudarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivoSelecionado = e.target.files?.[0];

    if (arquivoSelecionado) {
      setArquivo(arquivoSelecionado);
      setNomeArquivo(arquivoSelecionado.name);
      setValue("slide", arquivoSelecionado.name, {
          shouldValidate: true,
       });
    }
  };

  const criarDadosSubmissao = (data: CadastroFormulario, arquivoPdf: string) => {
    return {
      ...submission,
      eventEditionId: getEventEditionIdStorage() ?? "",
      mainAuthorId: data.apresentador || user?.id,
      title: data.titulo,
      abstractText: data.resumo,
      advisorId: data.orientador as UUID,
      coAdvisor: data.coorientador || "",
      dateSuggestion: data.data ? new Date(data.data) : undefined,
      pdfFile: arquivoPdf,
      phoneNumber: data.celular,
    };
  };

  const processarSubmissao = async (dadosSubmissao: any): Promise<boolean> => {
    setCarregandoEnvio(true);
    try {
      if (submission?.id) {
        return await updateSubmissionById(submission.id, dadosSubmissao);
      } else {
        const sucesso = await createSubmission(dadosSubmissao);
        if (sucesso && user?.profile === "Presenter") {
          roteador.push("/minha-apresentacao");
        }
        return sucesso;
      }
    } catch (erro) {
      console.error("Erro ao processar submissão:", erro);
      return false;
    } finally {
      setCarregandoEnvio(false);
    }
  };

  const limparArquivoOrfao = async (arquivoKey: string) => {
    try {
      await deleteFile(arquivoKey);
    } catch (erro) {
      console.debug("Erro ao remover arquivo órfão:", erro);
    }
  };

  const aoEnviar = async (data: CadastroFormulario) => {
    if (!user) {
      showAlert({
        icon: "error",
        text: "Você precisa estar logado para realizar a submissão.",
        confirmButtonText: "Retornar",
      });
      return;
    }

    let arquivoEnviadoKey: string | null = null;

    try {
      if (arquivo) {
        const respostaUpload = await sendFile(arquivo, user.id);
        if (!respostaUpload?.key) {
          throw new Error("Falha no upload do arquivo");
        }
        arquivoEnviadoKey = respostaUpload.key;
      }

      const dadosSubmissao = criarDadosSubmissao(
        data,
        arquivoEnviadoKey || data.slide || ""
      );

      const sucesso = await processarSubmissao(dadosSubmissao);

      if (sucesso) {
        reset();
        setSubmission(null);
        setArquivo(null);
        setNomeArquivo("");

        showAlert({
          icon: "success",
          text: "Submissão realizada com sucesso!",
          confirmButtonText: "OK",
        });
      } else {
        throw new Error("Falha ao processar submissão");
      }
    } catch (_) {
      if (arquivoEnviadoKey) {
        await limparArquivoOrfao(arquivoEnviadoKey);
      }
      showAlert({
        icon: "error",
        text: "Erro ao processar submissão. Tente novamente.",
        confirmButtonText: "OK",
      });
    }
  };

  const aoErro = (erros) => console.error(erros);

  const tituloModal =
    submission && submission.id
      ? "Editar Apresentação"
      : "Cadastrar Apresentação";

  const aoMudarTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return carregandoEnvio ? (
    <IndicadorDeCarregamento />
  ) : (
    <form
      className="row cadastroApresentacao"
      onSubmit={handleSubmit(aoEnviar, aoErro)}
    >
      <div className="modal-title">
        <h3 className="d-flex fw-bold text-center justify-content-center mb-4">
          {tituloModal}
        </h3>
      </div>

      {user?.level !== "Default" && (
        <div className="col-12 mb-1">
          <label className="form-label form-title">
            Selecionar apresentador
            <span className="text-danger ms-1">*</span>
          </label>
          <select
            id="apresentador-select"
            className="form-control input-title"
            {...register("apresentador")}
            disabled={loadingUserList}
          >
            <option value="">Selecione um apresentador</option>
            {apresentadores.length === 0 && !loadingUserList ? (
              <option value="" disabled>
                Nenhum apresentador encontrado
              </option>
            ) : (
              apresentadores.map((apresentador) => (
                <option key={apresentador.id} value={apresentador.id}>
                  {apresentador.name}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Título da pesquisa<span className="text-danger ms-1">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o título da pesquisa"
          {...register("titulo")}
        />
        <p className="text-danger error-message">{errors.titulo?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Resumo<span className="text-danger ms-1">*</span>
        </label>
        <textarea
          className="form-control input-title overflow-y-hidden"
          placeholder="Insira o resumo da pesquisa"
          {...register("resumo")}
          onInput={aoMudarTextarea}
        />
        <p className="text-danger error-message">{errors.resumo?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Nome do orientador<span className="text-danger ms-1">*</span>
        </label>
        <select
          id="orientador-select"
          className="form-control input-title"
          {...register("orientador")}
        >
          <option value="">Selecione o nome do orientador</option>
          {advisors
            .map((orientador) => (
              <option key={orientador.id} value={orientador.id}>
                {orientador.name}
              </option>
            ))}
        </select>
        <p className="text-danger error-message">
          {errors.orientador?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">Nome do coorientador</label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o nome do coorientador"
          {...register("coorientador")}
        />
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Slide da apresentação <span className="txt-min">(PDF)</span>
          <span className="text-danger ms-1">*</span>
        </label>
        <input
          type="file"
          className="form-control input-title"
          accept=".pdf"
          onChange={aoMudarArquivo}
        />
        {nomeArquivo && (
          <p className="file-name">Arquivo selecionado: {nomeArquivo}</p>
        )}
        <p className="text-danger error-message">{errors.slide?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Celular <span className="txt-min">(preferência WhatsApp)</span>
          <span className="text-danger ms-1">*</span>
        </label>
        <Controller
          name="celular"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <InputMask
              mask="(99) 99999-9999"
              value={value || ""}
              onChange={onChange}
              onBlur={onBlur}
              maskChar=" "
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  ref={ref}
                  className="form-control input-title"
                  placeholder="(XX) XXXXX-XXXX"
                />
              )}
            </InputMask>
          )}
        />
        <p className="text-danger error-message">{errors.celular?.message}</p>
      </div>

      <br />
      <br />

      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          data-bs-target="#collapse"
          type="submit"
          data-bs-toggle="collapse"
          className="btn text-white fs-5 submit-button"
          disabled={!Edicao?.isActive}
        >
          {submission && submission?.id ? "Alterar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
