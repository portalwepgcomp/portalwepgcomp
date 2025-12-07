"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";

import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useSession } from "@/hooks/useSession";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useEdicao } from "@/hooks/useEdicao";
import { useSubmission } from "@/hooks/useSubmission";
import { useUsers } from "@/hooks/useUsers";
import { formatOptions } from "@/utils/formatOptions";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import "./style.scss";

const formSessaoApresentacoesSchema = z.object({
  titulo: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Título é obrigatório."),
  apresentacoes: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      }),
    )
    .optional(),

  n_apresentacoes: z
    .number({
      invalid_type_error: "Campo inválido!",
    })
    .refine((value) => value > 0, {
      message:
        "Número de apresentações é obrigatório e deve ser maior que zero!",
    }),

  sala: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Sala é obrigatória!"),

  inicio: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .datetime({
      message: "Data ou horário inválidos!",
    })
    .min(1, "Data e horário de início são obrigatórios!")
    .nullable(),

  avaliadores: z
    .array(
      z.object({
        label: z.string(),
        value: z.string({
          invalid_type_error: "Campo inválido!",
        }),
      }),
    )
    .optional(),
});

interface FormSessaoAuxiliarProps {
  disabledIntervals: { start: Date; end: Date }[];
}

export default function FormSessaoApresentacoes({
  disabledIntervals,
}: Readonly<FormSessaoAuxiliarProps>) {
  const { formAuxiliarFields, formApresentacoesFields, confirmButton } =
    ModalSessaoMock;
  const { createSession, updateSession, sessao, setSessao, roomsList } =
    useSession();
  const { userList } = useUsers();
  const { submissionList } = useSubmission();
  const { Edicao } = useEdicao();

  type FormSessaoApresentacoesSchema = z.infer<
    typeof formSessaoApresentacoesSchema
  >;

  const defaultValues = sessao?.id
    ? {
        titulo: sessao?.title ?? "",
        apresentacoes: [],
        n_apresentacoes: sessao?.numPresentations ?? 0,
        sala: sessao?.roomId ?? "",
        inicio: sessao?.startTime ?? null,
        avaliadores: [],
      }
    : {
        inicio: null,
        n_apresentacoes: 0,
      };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSessaoApresentacoesSchema>({
    resolver: zodResolver(formSessaoApresentacoesSchema),
    defaultValues,
  });

  const salasOptions = formatOptions(roomsList, "name");

  // Opções com metadados para montar tabela
  const apresentacoesOptions = useMemo(() => {
    return (submissionList || []).map((v) => {
      const presenterName = v?.mainAuthor?.name || "Apresentador não informado";
      const title = v?.title || "Título não informado";
      return {
        value: v.id,
        label: title,
        title,
        presenterName,
      };
    });
  }, [submissionList]);

  // Estado local que guarda a ordem dos selecionados
  const [orderedApresentacoes, setOrderedApresentacoes] = useState<
    { value: string; label: string; title: string; presenterName: string }[]
  >([]);

  // Sincroniza o estado local com o campo RHF "apresentacoes"
  const syncFormApresentacoes = (
    items: { value: string; label: string; title: string; presenterName: string }[],
  ) => {
    setOrderedApresentacoes(items);
    setValue(
      "apresentacoes",
      items.map((i) => ({ value: i.value, label: i.label })),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  // Ao entrar em modo edição, carregar ordem existente da sessão
  useEffect(() => {
    if (sessao?.id && sessao?.presentations?.length) {
      const loaded =
        sessao.presentations
          .toSorted((a, b) => a.positionWithinBlock - b.positionWithinBlock)
          .map((p) => {
            const presenterName =
              p.submission?.mainAuthor?.name || "Apresentador não informado";
            const title = p.submission?.title || "Título não informado";
            return {
              value: p.submission?.id ?? "",
              label: title,
              title,
              presenterName,
            };
          }) || [];
      syncFormApresentacoes(loaded);
    } else {
      syncFormApresentacoes([]);
    }
  }, [sessao?.id]);

  // Opções disponíveis (remove as já adicionadas para evitar duplicidade)
  const availableOptions = useMemo(() => {
    const selectedIds = new Set(orderedApresentacoes.map((a) => a.value));
    return apresentacoesOptions.filter((opt) => !selectedIds.has(opt.value));
  }, [apresentacoesOptions, orderedApresentacoes]);

  // Ações: adicionar, subir, descer, remover
  const addApresentacao = (id: string) => {
    const opt = apresentacoesOptions.find((o) => o.value === id);
    if (!opt) return;
    syncFormApresentacoes([...orderedApresentacoes, opt]);
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...orderedApresentacoes];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    syncFormApresentacoes(next);
  };

  const moveDown = (index: number) => {
    if (index >= orderedApresentacoes.length - 1) return;
    const next = [...orderedApresentacoes];
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    syncFormApresentacoes(next);
  };
  const avaliadoresOptions = formatOptions(userList, "name");
  const removeRow = (index: number) => {
    console.log("Removendo índice: ", index);
    console.log("Antes: ", orderedApresentacoes);
    const next = orderedApresentacoes.filter((_, i) => i !== index);
    console.log("Depois: ", next);
    syncFormApresentacoes(next);
  };

  const combinedTimeFilter = (time: Date) => {
    const hour = time.getHours();
    const isWithinOperatingHours = hour < 22 && hour > 6;

    if (!isWithinOperatingHours) {
      return false;
    }

    const timeToCheck = time.getTime();
    const isTimeUnavailable = disabledIntervals.some((interval) => {
      const startTime = interval.start.getTime();
      const endTime = interval.end.getTime();
      return timeToCheck >= startTime && timeToCheck < endTime;
    });

    return !isTimeUnavailable;
  };

  const handleFormSessaoApresentacoes = (
    data: FormSessaoApresentacoesSchema,
  ) => {
    const {
      titulo,
      apresentacoes,
      sala,
      inicio,
      n_apresentacoes,
      avaliadores,
    } = data;

    if (!Edicao?.id) return;
    if (!titulo || !sala || !inicio) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const body = {
      type: "Presentation",
      eventEditionId: Edicao.id,
      title: titulo,
      submissions: apresentacoes?.length
        ? apresentacoes?.map((v) => v.value)
        : undefined,
      roomId: sala,
      startTime: inicio,
      numPresentations: n_apresentacoes,
      panelists: avaliadores?.length
        ? avaliadores?.map((v) => v.value)
        : undefined,
    } as SessaoParams;

    if (sessao?.id) {
      updateSession(sessao.id, Edicao.id, body).then((status) => {
        if (status) {
          reset();
          setSessao(null);
        }
      });
      return;
    }

    createSession(Edicao.id, body).then((status) => {
      if (status) {
        reset();
        setSessao(null);
      }
    });
  };

  useEffect(() => {
    if (sessao) {
      setValue("titulo", sessao?.title ?? "");
      setValue(
        "apresentacoes",
        sessao?.presentations?.map((v) => {
          const presenterName = v.submission?.mainAuthor?.name || "Apresentador não informado";
          const title = v.submission?.title || "Título não informado";
          return {
            value: v.submission?.id ?? "",
            label: title,
            title: title,
            presenterName: presenterName,
          };
        }),
      );
      setValue("n_apresentacoes", (sessao?.duration ? sessao?.duration/20 : 0));
      setValue("sala", sessao?.roomId);
      setValue("inicio", sessao?.startTime);
      setValue(
        "avaliadores",
        sessao?.panelists?.map((v) => {
          return { value: v.userId, label: v.user?.name ?? "" };
        }),
      );
    } else {
      setValue("titulo", "");
      setValue("apresentacoes", []);
      setValue("n_apresentacoes", 0);
      setValue("sala", "");
      setValue("inicio", "");
      setValue("avaliadores", []);
    }
  }, [sessao?.id]);


  const bloquearTeclasInvalidas = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const blockedKeys = ['e', 'E', '+', '-', ',', '.'];
    if (blockedKeys.includes(e.key)) e.preventDefault();
  };


  const formatarEntradaNumerica = (e: React.FormEvent<HTMLInputElement>) => {
    const t = e.currentTarget;
    const clean = t.value.replace(/\D/g, '').replace(/^0+/, '');
    t.value = clean;
  };


  const colarApenasNumeros = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!/^\d+$/.test(text)) e.preventDefault();
  };

  return (
    <form
      className="row g-3 form-sessao"
      onSubmit={handleSubmit(handleFormSessaoApresentacoes)}
    >
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          {formAuxiliarFields.titulo.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={formAuxiliarFields.titulo.placeholder}
          {...register("titulo")}
        />
        <p className="text-danger error-message">{errors.titulo?.message}</p>

        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.apresentacoes.label}
        </label>

        {/* Select para adicionar uma apresentação à tabela */}
        <div className="input-group mb-2">
          <select
            className="form-select"
            id="sa-apresentacoes-add-select"
            defaultValue=""
            onChange={(e) => {
              if (!e.target.value) return;
              addApresentacao(e.target.value);
              e.currentTarget.value = ""; // limpa após inclusão
            }}
          >
            <option value="" disabled>
              {formApresentacoesFields.apresentacoes.placeholder}
            </option>
            {availableOptions.map((op) => (
              <option key={op.value} value={op.value}>
                {op.title} ({op.presenterName})
              </option>
            ))}
          </select>
        </div>

        {/* Tabela com ordem e ações */}
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th></th>
                <th style={{ width: 56 }}>#</th>
                <th>Título</th>
                <th>Apresentador</th>
                <th style={{ width: 220 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orderedApresentacoes.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-body-secondary">
                    Nenhuma apresentação selecionada.
                  </td>
                </tr>
              )}
              {orderedApresentacoes.map((row, index) => (
                <tr key={`${row.value}-${index}`}>
                  <td>
                    <div className="btn-group btn-group-sm setas-muda-posicao" role="group">
                      <button
                          type="button"
                          className="btn btn-outline-secondary"
                          title="Subir"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          title="Descer"
                          onClick={() => moveDown(index)}
                          disabled={index === orderedApresentacoes.length - 1}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                  <td>{index + 1}</td>
                  <td>{row.title}</td>
                  <td>{row.presenterName}</td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Excluir"
                        onClick={() => removeRow(index)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-danger error-message">
          {errors.apresentacoes?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          {formApresentacoesFields.n_apresentacoes.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="number"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={formApresentacoesFields.n_apresentacoes.placeholder}
          min={1}
          step={1}
          inputMode="numeric"
          onKeyDown={bloquearTeclasInvalidas}
          onInput={formatarEntradaNumerica}
          onPaste={colarApenasNumeros}
          {...register("n_apresentacoes", {
            valueAsNumber: true,
          })}
        />
        <p className="text-danger error-message">
          {errors.n_apresentacoes?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.sala.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <select
          id="sa-sala-select"
          className="form-select"
          {...register("sala")}
        >
          <option value="" hidden>
            {formApresentacoesFields.sala.placeholder}
          </option>
          {salasOptions?.map((op, i) => (
            <option id={`sala-op${i}`} key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        <p className="text-danger error-message">{errors.sala?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label
          htmlFor="datetime-local"
          className="form-label fw-bold form-title"
        >
          {formApresentacoesFields.inicio.label}
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <div className="input-group listagem-template-content-input">
          <Controller
            control={control}
            name="inicio"
            render={({ field }) => (
              <DatePicker
                id="sa-inicio-data"
                showIcon
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                showTimeSelect
                className="form-control datepicker"
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={dayjs(Edicao?.startDate || "")
                  .tz("America/Sao_Paulo", true)
                  .toDate()}
                maxDate={dayjs(Edicao?.endDate || "")
                  .tz("America/Sao_Paulo", true)
                  .toDate()}
                isClearable
                filterTime={combinedTimeFilter}
                placeholderText={formApresentacoesFields.inicio.placeholder}
                toggleCalendarOnIconClick
              />
            )}
          />
        </div>
        <p className="text-danger error-message">{errors.inicio?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          {formApresentacoesFields.avaliadores.label}
        </label>
        <Controller
          name="avaliadores"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              id="sa-avaliadores-select"
              isClearable
              placeholder={formApresentacoesFields.avaliadores.placeholder}
              options={avaliadoresOptions}
            />
          )}
        />
        <p className="text-danger error-message">
          {errors.avaliadores?.message}
        </p>
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="submit"
          id="sa-submit-button"
          className="btn btn-primary button-modal-component button-sessao-geral"
          disabled={!Edicao?.isActive}
        >
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
