"use client";

import Banner from "@/components/UI/Banner";
import InfoBox from "@/components/InfoBox/InfoBox";
import { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { userApi } from "@/services/user";
import { useSweetAlert } from "@/hooks/useAlert";
import { z } from "zod";
import { UpdateUserRequest } from "@/models/update-user";
import { maskCPF, unmask } from "@/utils/masks";
import {useRouter} from "next/navigation";
import {ProtectedLayout} from "@/components/ProtectedLayout/protectedLayout";

const updateUserSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    email: z.string().email("Por favor, insira um email válido."),
    profile: z.enum(['Presenter', 'Professor', 'Listener'], {
        message: "Selecione um perfil válido.",
    }),
    level: z.enum(['Superadmin', 'Admin', 'Default'], {
        message: "Selecione um nível de permissão válido.",
    }),
    registrationNumberType: z.enum(['CPF', 'MATRICULA']).optional(),
    registrationNumber: z.string().optional(),
});

const EditarUsuario = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { updateUser } = useUsers();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = params;
    const { showAlert } = useSweetAlert();
    const [docType, setDocType] = useState<'CPF' | 'MATRICULA' | null>('CPF');
    const [documentNumber, setDocumentNumber] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) return;
            setIsLoading(true);

            await userApi.getById(id)
                .then((data: User) => {
                    setUser(data);

                    const type = data.registrationNumberType;
                    const number = data.registrationNumber || '';

                    if (type) {
                        setDocType(type);
                        setDocumentNumber(type === 'CPF' ? maskCPF(number) : number);
                    } else {
                        setDocType('CPF');
                        setDocumentNumber('');
                    }
                })
                .catch((err) => {
                    setUser(null);
                    showAlert({
                        icon: "error",
                        title: "Erro ao encontrar o usuário",
                        text: err.response?.data?.message || "Ocorreu um erro."
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
            name: formData.get('nomeCompleto'),
            email: formData.get('email'),
            profile: formData.get('perfil'),
            level: formData.get('permissao'),
        };

        const docTypeFromForm = formData.get('registrationNumberType') as string;
        let rawDocumentNumber = formData.get('registrationNumber') as string;

        if (docTypeFromForm === 'CPF' && rawDocumentNumber) {
            rawDocumentNumber = unmask(rawDocumentNumber);
        }

        dataToValidate.registrationNumberType = docTypeFromForm;
        dataToValidate.registrationNumber = rawDocumentNumber;

        const validationResult = updateUserSchema.safeParse(dataToValidate);

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(e => `• ${e.path[0]}: ${e.message}`).join('\n');
            showAlert({
                icon: 'error',
                title: 'Dados Inválidos',
                text: errors,
            });
            setIsSubmitting(false);
            return;
        }

        await updateUser(user?.email as string, validationResult.data as UpdateUserRequest)
            .finally(() => setIsSubmitting(false))
    };

    const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (docType === 'CPF') {
            setDocumentNumber(maskCPF(value));
        } else {
            setDocumentNumber(value);
        }
    };

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (!user) {
        return <p>Usuário não encontrado.</p>;
    }

    return (
        <ProtectedLayout>
        <div className="d-flex flex-column" style={{ gap: "30px" }}>
            <Banner title="Editar Usuário"/>
            <div className="align-self-center">
                <InfoBox
                    title="Informação importante"
                    message="Apenas os campos que você modificar serão atualizados no sistema. Os campos não alterados permanecerão com seus valores originais."
                />
                <div style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "2rem",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #e9ecef",
                    textAlign: "center",
                    margin: "30px 0",
                }}>
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
                                E-mail institucional <span className="text-danger">*</span>
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
                                <input className="form-check-input" type="radio" name="perfil" id="perfilApresentador"
                                       value="Presenter" defaultChecked={user.profile === 'Presenter'}/>
                                <label className="form-check-label" htmlFor="perfilApresentador">
                                    Apresentador (PGCOMP)
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="perfil" id="perfilProfessor"
                                       value="Professor" defaultChecked={user.profile === 'Professor'}/>
                                <label className="form-check-label" htmlFor="perfilProfessor">
                                    Professor (PGCOMP)
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="perfil" id="perfilOuvinte"
                                       value="Listener" defaultChecked={user.profile === 'Listener'}/>
                                <label className="form-check-label" htmlFor="perfilOuvinte">
                                    Ouvinte
                                </label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label d-block fw-bold">Tipo de Documento</label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="registrationNumberType"
                                    id="tipoCPF"
                                    value="CPF"
                                    checked={docType === 'CPF'}
                                    onChange={() => setDocType('CPF')}
                                />
                                <label className="form-check-label" htmlFor="tipoCPF">
                                    CPF
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="registrationNumberType"
                                    id="tipoMatricula"
                                    value="MATRICULA"
                                    checked={docType === 'MATRICULA'}
                                    onChange={() => setDocType('MATRICULA')}
                                />
                                <label className="form-check-label" htmlFor="tipoMatricula">
                                    Matrícula
                                </label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="documentoNumero" className="form-label fw-bold">
                                {docType === 'CPF' ? 'CPF' : 'Número de Matrícula'}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="documentoNumero"
                                name="registrationNumber"
                                value={documentNumber}
                                onChange={handleDocumentNumberChange}
                                placeholder={docType === 'CPF' ? '000.000.000-00' : 'Digite a Matrícula'}
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

                        <div className="d-flex justify-content-end mt-4" style={{gap: "10px"}}>
                            <button type="button" onClick={() => { router.push('/gerenciamento') }} className="btn btn-outline-secondary" disabled={isSubmitting}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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