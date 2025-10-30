import { sendContactRequest } from "@/services/contact";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.scss";
import { useSweetAlert } from "@/hooks/useAlert";
import { useEdicao } from "@/hooks/useEdicao";

const formContatoSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .min(1, { message: "Nome é obrigatório!" }),

  email: z
    .string({
      required_error: "E-mail é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .min(1, { message: "E-mail é obrigatório!" })
    .email({
      message: "E-mail inválido!",
    }),

  text: z
    .string({
      required_error: "A mensagem é obrigatória!",
      invalid_type_error: "Campo inválido!",
    })
    .min(1, { message: "A mensagem não pode ser vazia!" }),
});

export function FormContato() {
  type FormContatoSchema = z.infer<typeof formContatoSchema>;
  const { Edicao } = useEdicao();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormContatoSchema>({
    resolver: zodResolver(formContatoSchema),
  });

  const { showAlert } = useSweetAlert();

  const handleFormContato = async (data: FormContatoSchema) => {
    sendContactRequest(data)
      .then((resp) => {
        if (resp.status < 200 || resp.status >= 300) {
          showAlert({
            icon: "error",
            title: "Erro ao enviar mensagem",
            text:
              resp?.response?.data?.message?.message ||
              resp?.response?.data?.message ||
              "Ocorreu um erro ao enviar o formulário. Tente novamente.",
            confirmButtonText: "Retornar",
          });
        } else {
          showAlert({
            icon: "success",
            title: "Mensagem enviada com sucesso!",
            timer: 3000,
            showConfirmButton: false,
          });
          reset();
        }
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao enviar mensagem",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro ao enviar o formulário. Tente novamente.",
          confirmButtonText: "Retornar",
        });
      });
  };

  return (
    <form
      className="form-contato p-4 rounded-4 shadow-lg formContatoWrapper"
      style={{
      border: "1px solid #fff",
      margin: "0 auto",
      }}
      onSubmit={handleSubmit(handleFormContato)}
    >
      <div className="row mb-4">
      <div className="col-12 col-sm-6 mb-3 mb-sm-0">
        <label className="form-label fs-5 text-white fw-semibold mb-2">
        Nome:
        </label>
        <input
        type="text"
        className="form-control input-title bg-transparent border-2 border-white text-white shadow-sm"
        placeholder="Insira seu nome"
        {...register("name")}
        style={{ fontSize: "1.1rem" }}
        />
        <p className="text-warning error-message mt-1">{errors.name?.message}</p>
      </div>

      <div className="col-12 col-sm-6">
        <label className="form-label fs-5 text-white fw-semibold mb-2">
        E-mail:
        </label>
        <input
        type="email"
        className="form-control input-title bg-transparent border-2 border-white text-white shadow-sm"
        placeholder="Insira seu e-mail"
        {...register("email")}
        style={{ fontSize: "1.1rem" }}
        />
        <p className="text-warning error-message mt-1">{errors.email?.message}</p>
      </div>
      </div>

      <div className="mb-4">
      <label className="form-label fs-5 text-white fw-semibold mb-2">
        Mensagem:
      </label>
      <textarea
        className="form-control input-title bg-transparent border-2 border-white text-white shadow-sm"
        placeholder="Digite sua mensagem"
        rows={5}
        
        {...register("text")}
        style={{ fontSize: "1.1rem", resize: "none" }}
      />
      <p className="text-warning error-message mt-1">{errors.text?.message}</p>
      </div>

      <div className="d-flex justify-content-center mt-4">
      <button
        type="submit"
        className="btn fw-bold px-5 py-2"
        style={{
        background: Edicao?.isActive ? "#fff" : "#bbb",
        color: "#1e1e1e",
        border: "2px solid #fff",
        fontSize: "1.1rem",
        borderRadius: "2rem",
        boxShadow: Edicao?.isActive ? "0 2px 8px rgba(255,255,255,0.2)" : "none",
        transition: "background 0.2s, color 0.2s",
        }}
        disabled={!Edicao?.isActive}
      >
        Enviar
      </button>
      </div>
    </form>
  );
}
