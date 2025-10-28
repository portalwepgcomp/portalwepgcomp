import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useSweetAlert } from "@/hooks/useAlert";
import { UpdateUserRequest } from "@/models/update-user";
import { userApi } from "@/services/user";

interface UserProps {
  children: ReactNode;
}

import axiosInstance from "@/utils/api";

const baseUrl = "/users";
const authBaseUrl = "/auth";
const instance = axiosInstance;

interface UserProviderData {
  loadingCreateUser: boolean;
  loadingCreateProfessor: boolean;
  loadingSendEmail: boolean;
  loadingResetPassword: boolean;
  loadingUserList: boolean;
  loadingAdvisors: boolean;
  loadingAdmins: boolean;
  loadingSwitchActive: boolean;
  loadingRoleAction: boolean;
  user: User | null;
  userList: User[];
  advisors: User[];
  admins: User[];
  getUsers: (params: GetUserParams) => void;
  registerUser: (body: RegisterUserParams) => Promise<void>;
  createProfessorBySuperadmin: (
    body: CreateProfessorBySuperadminParams,
  ) => Promise<void>;
  resetPasswordSendEmail: (body: ResetPasswordSendEmailParams) => Promise<void>;
  resetPassword: (body: ResetPasswordParams) => Promise<void>;
  getAdvisors: () => Promise<void>;
  getAdmins: () => Promise<void>;
  switchActiveUser: (userId: string, activate: boolean) => Promise<void>;
  approveTeacher: (userId: string) => Promise<void>;
  approvePresenter: (userId: string) => Promise<void>;
  promoteToAdmin: (userId: string) => Promise<void>;
  promoteToSuperadmin: (userId: string) => Promise<void>;
  demoteUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (
    email: string,
    updateUserRequest: UpdateUserRequest,
  ) => Promise<void>;
  findUserById: (userId: string) => Promise<User | undefined>;
}

export const UserContext = createContext<UserProviderData>(
  {} as UserProviderData,
);

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }: UserProps) => {
  const [loadingCreateUser, setLoadingCreateUser] = useState<boolean>(false);
  const [loadingCreateProfessor, setLoadingCreateProfessor] =
    useState<boolean>(false);
  const [loadingUserList, setLoadingUserList] = useState<boolean>(false);
  const [loadingSendEmail, setLoadingSendEmail] = useState<boolean>(false);
  const [loadingResetPassword, setLoadingResetPassword] =
    useState<boolean>(false);
  const [loadingAdvisors, setLoadingAdvisors] = useState<boolean>(false);
  const [loadingAdmins, setLoadingAdmins] = useState<boolean>(false);
  const [loadingSwitchActive, setLoadingSwitchActive] =
    useState<boolean>(false);
  const [loadingRoleAction, setLoadingRoleAction] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const { user: authUser } = useContext(AuthContext);

  const { showAlert } = useSweetAlert();
  const router = useRouter();

  const getUsers = useCallback(
    async (params: GetUserParams) => {
      setLoadingUserList(true);

      if (authUser) {
        userApi
          .getUsers(params)
          .then((response) => {
            setUserList(response);
          })
          .catch((err) => {
            setUserList([]);

            showAlert({
              icon: "error",
              title: "Erro ao listar usuários",
              text:
                err.response?.data?.message?.message ||
                err.response?.data?.message ||
                "Ocorreu um erro durante a busca.",
              confirmButtonText: "Retornar",
            });
          })
          .finally(() => {
            setLoadingUserList(false);
          });
      }
    },
    [authUser, showAlert],
  );

  const registerUser = async (body: RegisterUserParams) => {
    setLoadingCreateUser(true);

    try {
      const response = await userApi.registerUser(body);
      setUser(response);

      showAlert({
        icon: "success",
        title: "Cadastro realizado com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao cadastrar usuário",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingCreateUser(false);
    }
  };

  const createProfessorBySuperadmin = async (
    body: CreateProfessorBySuperadminParams,
  ) => {
    setLoadingCreateProfessor(true);

    try {
      const response = await userApi.createProfessorBySuperadmin(body);

      showAlert({
        icon: "success",
        title: "Professor cadastrado com sucesso!",
        text: "O professor foi cadastrado e receberá um email com as credenciais de acesso.",
        timer: 3000,
        showConfirmButton: false,
      });

      // Refresh user list
      getUsers({});

      return response;
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao cadastrar professor",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
      throw err;
    } finally {
      setLoadingCreateProfessor(false);
    }
  };

  const resetPasswordSendEmail = async (body: ResetPasswordSendEmailParams) => {
    setLoadingSendEmail(true);

    try {
      const response = await userApi.resetPasswordSendEmail(body);
      setUser(response);

      showAlert({
        icon: "success",
        title: "E-mail enviado com sucesso!",
        text: "Confira o e-mail cadastrado para redefinir a senha.",
        timer: 3000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao enviar e-mail",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao enviar o e-mail.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingSendEmail(false);
    }
  };

  const resetPassword = async (body: ResetPasswordParams) => {
    setLoadingResetPassword(true);

    try {
      const response = await userApi.resetPassword(body);
      setUser(response);

      showAlert({
        icon: "success",
        title: "Senha alterada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao alterar senha",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar alterar sua senha. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingResetPassword(false);
    }
  };

  const switchActiveUser = async (userId: string, activate: boolean) => {
    setLoadingSwitchActive(true);

    userApi
      .switchActiveUser(userId, activate)
      .then(() => {
        showAlert({
          icon: "success",
          title: "Status de ativação alterado com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
        getUsers({});
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao trocar status",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro ao tentar alterar status. Tente novamente!",
          confirmButtonText: "Retornar",
        });
      })
      .finally(() => setLoadingSwitchActive(false));
  };

  const getAdvisors = async () => {
    setLoadingAdvisors(true);

    try {
      const response = await userApi.getAdvisors();
      setAdvisors(response);
    } catch (err: any) {
      console.error(err);
      setAdvisors([]);

      showAlert({
        icon: "error",
        title: "Erro ao buscar orientadores",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao buscar orientadores.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingAdvisors(false);
    }
  };

  const getAdmins = async () => {
    setLoadingAdmins(true);

    try {
      const response = await userApi.getAdmins();
      setAdmins(response);
    } catch (err: any) {
      console.error(err);
      setAdmins([]);

      showAlert({
        icon: "error",
        title: "Erro ao buscar orientadores",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao buscar orientadores.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  const approveTeacher = async (userId: string) => {
    setLoadingRoleAction(true);

    try {
      await userApi.approveTeacher(userId);
      showAlert({
        icon: "success",
        title: "Professor aprovado com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
      getUsers({});
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao aprovar professor",
        text:
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar aprovar o professor. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  const approvePresenter = async (userId: string) => {
    setLoadingRoleAction(true);

    try {
      const result = await userApi.approvePresenter(userId);

      // Optimistic update - immediately update the user in the local state
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isPresenterActive: true } : user,
        ),
      );

      showAlert({
        icon: "success",
        title: "Apresentador aprovado com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });

      await getUsers({});
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao aprovar apresentador",
        text:
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar aprovar o apresentador. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    setLoadingRoleAction(true);

    try {
      const user = userList.find((u) => u.id === userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      await userApi.updateUser(user.email, { level: "Admin" });
      showAlert({
        icon: "success",
        title: "Usuário promovido a Administrador!",
        timer: 3000,
        showConfirmButton: false,
      });
      getUsers({});
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
      showAlert({
        icon: "error",
        title: "Erro ao promover usuário",
        text:
          err.response?.data?.message ||
          err.message ||
          "Ocorreu um erro ao tentar promover o usuário. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  const promoteToSuperadmin = async (userId: string) => {
    setLoadingRoleAction(true);

    try {
      const user = userList.find((u) => u.id === userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      await userApi.updateUser(user.email, { level: "Superadmin" });
      showAlert({
        icon: "success",
        title: "Usuário promovido a Superadministrador!",
        timer: 3000,
        showConfirmButton: false,
      });
      getUsers({});
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao promover usuário",
        text:
          err.response?.data?.message ||
          err.message ||
          "Ocorreu um erro ao tentar promover o usuário. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  const demoteUser = async (userId: string) => {
    setLoadingRoleAction(true);

    try {
      const user = userList.find((u) => u.id === userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Determine target level based on current level
      let targetLevel: RoleType = "Default";
      if (user.isSuperadmin) {
        targetLevel = "Admin";
      } else if (user.isAdmin) {
        targetLevel = "Default";
      }

      await userApi.updateUser(user.email, { level: targetLevel });
      showAlert({
        icon: "success",
        title: "Usuário rebaixado com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
      getUsers({});
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao rebaixar usuário",
        text:
          err.response?.data?.message ||
          err.message ||
          "Ocorreu um erro ao tentar rebaixar o usuário. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoadingRoleAction(true);

    try {
      await userApi.deleteUser(userId);
      showAlert({
        icon: "success",
        title: "Usuário excluído com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
      getUsers({});
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao excluir usuário",
        text:
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar excluir o usuário. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  const updateUser = async (
    email: string,
    updateUserRequest: UpdateUserRequest,
  ) => {
    try {
      await instance.patch(`${baseUrl}/edit/${email}`, updateUserRequest);
      showAlert({
        icon: "success",
        title: "Usuário editado com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
      getUsers({});
    } catch (err: any) {
      showAlert({
        icon: "error",
        title: "Erro ao editar usuário",
        text:
          Array.isArray(err.response?.data?.message?.message)
              ? err.response.data.message.message[0]
              : err.response?.data?.message?.message ||
          "Ocorreu um erro ao tentar editar o usuário. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  const findUserById = async (id: string) => {
    setLoadingUser(true);
    return instance.get(`${baseUrl}/${id}`)
        .then(({ data }) => {
          setUser(data);
          return data
        })
        .catch((err) => {
          setUser(null);
          showAlert({
            icon: "error",
            title: "Erro ao encontrar o usuário",
            text:
                err.response?.data?.message?.message ||
                err.response?.data?.message ||
                "Ocorreu um erro durante a busca.",
            confirmButtonText: "Retornar",
          });
          return undefined;
        })
        .finally(() => {
          setLoadingUser(false);
        });
  }

  return (
    <UserContext.Provider
      value={{
        loadingCreateUser,
        loadingCreateProfessor,
        loadingSendEmail,
        loadingResetPassword,
        loadingUserList,
        loadingAdvisors,
        loadingAdmins,
        loadingSwitchActive,
        loadingRoleAction,
        user,
        userList,
        advisors,
        admins,
        getUsers,
        registerUser,
        createProfessorBySuperadmin,
        resetPasswordSendEmail,
        resetPassword,
        getAdvisors,
        getAdmins,
        switchActiveUser,
        approveTeacher,
        approvePresenter,
        promoteToAdmin,
        promoteToSuperadmin,
        demoteUser,
        deleteUser,
        updateUser,
        findUserById
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
