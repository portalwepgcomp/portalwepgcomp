"use client";

import InfoBox from "@/components/InfoBox/InfoBox";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { useSweetAlert } from "@/hooks/useAlert";
import { useUsers } from "@/hooks/useUsers";
import { UpdateUserRequest } from "@/models/update-user";
import { maskCPF, unmask } from "@/utils/masks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

import InputMask from "react-input-mask";
import Banner from "@/components/UI/Banner";

const updateUserSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    email: z.string().email("Por favor, insira um email válido."),
    profile: z.enum(["Presenter", "Professor", "Listener"], {
      message: "Selecione um perfil válido.",
    }),
    level: z.enum(["Superadmin", "Admin", "Default"], {
      message: "Selecione um nível de permissão válido.",
    }),
    registrationNumberType: z.enum(["CPF", "MATRICULA"]),
    registrationNumber: z
      .string()
      .min(1, "O número do documento é obrigatório."),
    linkLattes: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.profile === "Listener") {
      if (data.registrationNumberType !== "CPF") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["profile"],
          message: "Ouvintes devem ter um CPF.",
        });
      }
      if (data.registrationNumber.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["registrationNumber"],
          message: "O CPF deve ter 11 dígitos.",
        });
      }
    } else if (data.profile === "Presenter" || data.profile === "Professor") {
      if (data.registrationNumberType !== "MATRICULA") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["profile"],
          message: "Apresentadores e Professores devem ter uma Matrícula.",
        });
      }
    }
  });

const EditarUsuario = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { updateUser, findUserById } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = params;
  const { showAlert } = useSweetAlert();
  const [selectedProfile, setSelectedProfile] = useState<
    User["profile"] | null
  >(null);

  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      setIsLoading(true);

      findUserById(id)
        .then((data: User | undefined) => {
          if (data) {
            setUser(data);
            setSelectedProfile(data.profile);

            const type = data.registrationNumberType;
            const number = data.registrationNumber || "";

            if (type === "CPF") {
              setCpf(maskCPF(number));
            } else if (type === "MATRICULA") {
              setMatricula(number.replace(/\D/g, ""));
            }
          } else {
            setUser(null);
          }
        })
        .catch((err) => {
          setUser(null);
          showAlert({
            icon: "error",
            title: "Erro ao processar dados",
            text: err.response?.data?.message || "Ocorreu um erro local.",
          });
        })
        .finally(() => setIsLoading(false));
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const dataToValidate: any = {
      name: formData.get("nomeCompleto"),
      email: formData.get("email"),
      profile: formData.get("perfil"),
      level: formData.get("permissao"),
      linkLattes: formData.get("linkLattes"),
    };

    const profileFromForm = dataToValidate.profile as User["profile"];

    const rawDocumentNumber = profileFromForm === "Listener" ? cpf : matricula;

    const docTypeFromProfile =
      profileFromForm === "Listener" ? "CPF" : "MATRICULA";
    const unmaskedDocumentNumber = unmask(rawDocumentNumber || "");

    dataToValidate.registrationNumberType = docTypeFromProfile;
    dataToValidate.registrationNumber = unmaskedDocumentNumber;
    const validationResult = updateUserSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map((e) => `${e.message}`)
        .join("\n");
      showAlert({
        icon: "error",
        title: "Dados Inválidos",
        text: errors,
      });
      setIsSubmitting(false);
      return;
    }

    const success = await updateUser(
      user?.email as string,
      validationResult.data as unknown as UpdateUserRequest,
    );

    setIsSubmitting(false);

    if (success) {
      router.push("/usuarios");
    }
  };

  const handleDocumentNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let { value } = e.target;

    if (selectedProfile === "Listener") {
      setCpf(value);
    } else {
      value = value.replace(/\D/g, "");
      setMatricula(value);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProfile = e.target.value as User["profile"];
    setSelectedProfile(newProfile);
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!user || !selectedProfile) {
    return <p>Usuário não encontrado.</p>;
  }

  return (
    <ProtectedLayout>
      <div className="d-flex flex-column" style={{ gap: "30px" }}>
        <Banner title="Editar Usuário" />
        <div className="align-self-center">
          <InfoBox
            title="Informação importante"
            message="Apenas os campos que você modificar serão atualizados no sistema. Os campos não alterados permanecerão com seus valores originais."
          />
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e9ecef",
              textAlign: "center",
              margin: "30px 0",
            }}
          >
            <form className="text-start" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nomeCompleto" className="form-label fw-bold">
                  Nome completo <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nomeCompleto"
                  name="nomeCompleto"
                  defaultValue={user.name}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  E-mail {selectedProfile === "Listener" ? "" : "Institucional"}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  defaultValue={user.email}
                />
              </div>

              <div className="mb-3">
                <label className="form-label d-block fw-bold">
                  Perfil <span className="text-danger">*</span>
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="perfil"
                    id="perfilApresentador"
                    value="Presenter"
                    checked={selectedProfile === "Presenter"}
                    onChange={handleProfileChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="perfilApresentador"
                  >
                    Apresentador (PGCOMP)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="perfil"
                    id="perfilProfessor"
                    value="Professor"
                    checked={selectedProfile === "Professor"}
                    onChange={handleProfileChange}
                  />
                  <label className="form-check-label" htmlFor="perfilProfessor">
                    Professor (PGCOMP)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="perfil"
                    id="perfilOuvinte"
                    value="Listener"
                    checked={selectedProfile === "Listener"}
                    onChange={handleProfileChange}
                  />
                  <label className="form-check-label" htmlFor="perfilOuvinte">
                    Ouvinte
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="documentoNumero" className="form-label fw-bold">
                  {selectedProfile === "Listener"
                    ? "CPF"
                    : "Número de Matrícula"}{" "}
                  <span className="text-danger">*</span>
                </label>

                <InputMask
                  mask={
                    selectedProfile === "Listener"
                      ? "999.999.999-99"
                      : undefined
                  }
                  maskChar={null}
                  type="text"
                  className="form-control"
                  id="documentoNumero"
                  name="registrationNumber"
                  value={selectedProfile === "Listener" ? cpf : matricula}
                  onChange={handleDocumentNumberChange}
                  placeholder={
                    selectedProfile === "Listener"
                      ? "000.000.000-00"
                      : "Digite a Matrícula (13 dígitos)"
                  }
                  maxLength={selectedProfile === "Listener" ? undefined : 13}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="linkLattes" className="form-label fw-bold">
                  Link Lattes
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="linkLattes"
                  name="linkLattes"
                  defaultValue={user.linkLattes}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="permissao" className="form-label fw-bold">
                  Nível de Permissão <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="permissao"
                  name="permissao"
                  defaultValue={user.level}
                >
                  <option value="Default">Normal</option>
                  <option value="Admin">Administrador</option>
                  <option value="Superadmin">Super Administrador</option>
                </select>
              </div>

              <div
                className="d-flex justify-content-end mt-4"
                style={{ gap: "10px" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    router.push("/usuarios");
                  }}
                  className="btn btn-outline-secondary"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default EditarUsuario;
