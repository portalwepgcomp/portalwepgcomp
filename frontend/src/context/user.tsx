"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { userApi } from "@/services/user";
import { AuthContext } from "./AuthProvider/authProvider";

interface UserProps {
  children: ReactNode;
}

interface UserProviderData {
  loadingCreateUser: boolean;
  loadingSendEmail: boolean;
  loadingResetPassword: boolean;
  loadingUserList: boolean;
  loadingAdvisors: boolean;
  loadingAdmins: boolean;
  loadingSwitchActive: boolean;
  loadingRoleAction: boolean; // NEW: For role management actions
  user: User | null;
  userList: User[];
  advisors: User[];
  admins: User[];
  getUsers: (params: GetUserParams) => void;
  registerUser: (body: RegisterUserParams) => Promise<void>;
  resetPasswordSendEmail: (body: ResetPasswordSendEmailParams) => Promise<void>;
  resetPassword: (body: ResetPasswordParams) => Promise<void>;
  getAdvisors: () => Promise<void>;
  getAdmins: () => Promise<void>;
  switchActiveUser: (userId: string, activate: boolean) => Promise<void>;
  markAsDefaultUser: (body: SetPermissionParams) => Promise<void>;
  markAsAdminUser: (body: SetPermissionParams) => Promise<void>;
  markAsSpAdminUser: (body: SetPermissionParams) => Promise<void>;
  // NEW: Enhanced role management methods
  approveTeacher: (userId: string) => Promise<void>;
  promoteToAdmin: (userId: string) => Promise<void>;
  promoteToSuperadmin: (userId: string) => Promise<void>;
  demoteUser: (userId: string) => Promise<void>;
}

export const UserContext = createContext<UserProviderData>(
  {} as UserProviderData
);

export const UserProvider = ({ children }: UserProps) => {
  const [loadingCreateUser, setLoadingCreateUser] = useState<boolean>(false);
  const [loadingUserList, setLoadingUserList] = useState<boolean>(false);
  const [loadingSendEmail, setLoadingSendEmail] = useState<boolean>(false);
  const [loadingResetPassword, setLoadingResetPassword] =
    useState<boolean>(false);
  const [loadingAdvisors, setLoadingAdvisors] = useState<boolean>(false);
  const [loadingAdmins, setLoadingAdmins] = useState<boolean>(false);
  const [loadingSwitchActive, setLoadingSwitchActive] =
    useState<boolean>(false);
  const [loadingRoleAction, setLoadingRoleAction] = useState<boolean>(false); // NEW
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const { user: authUser } = useContext(AuthContext);


  const { showAlert } = useSweetAlert();
  const router = useRouter();

  const getUsers = useCallback(async (params: GetUserParams) => {
    setLoadingUserList(true);
    
    if(authUser){
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
    };
  }, [authUser, showAlert]);

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

  const markAsDefaultUser = async (body: SetPermissionParams) => {
    setLoadingSwitchActive(true);

    userApi
      .markAsDefaultUser(body)
      .then(() => {
        showAlert({
          icon: "success",
          title: "Nível de permissão alterado com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
        getUsers({});
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao alterar permissão",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro ao tentar alterar permissão. Tente novamente!",
          confirmButtonText: "Retornar",
        });
      })
      .finally(() => setLoadingSwitchActive(false));
  };

  const markAsAdminUser = async (body: SetPermissionParams) => {
    setLoadingSwitchActive(true);

    userApi
      .markAsAdminUser(body)
      .then(() => {
        showAlert({
          icon: "success",
          title: "Nível de permissão alterado com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
        getUsers({});
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao alterar permissão",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro ao tentar alterar permissão. Tente novamente!",
          confirmButtonText: "Retornar",
        });
      })
      .finally(() => setLoadingSwitchActive(false));
  };

  const markAsSpAdminUser = async (body: SetPermissionParams) => {
    setLoadingSwitchActive(true);

    userApi
      .markAsSpAdminUser(body)
      .then(() => {
        showAlert({
          icon: "success",
          title: "Nível de permissão alterado com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
        getUsers({});
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao alterar permissão",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro ao tentar alterar permissão. Tente novamente!",
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
  }

  // NEW: Enhanced role management methods
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

  const promoteToAdmin = async (userId: string) => {
    setLoadingRoleAction(true);

    try {
      await userApi.promoteToAdmin(userId);
      showAlert({
        icon: "success",
        title: "Usuário promovido a Administrador!",
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
      await userApi.promoteToSuperadmin(userId);
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
      await userApi.demoteUser(userId);
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
          "Ocorreu um erro ao tentar rebaixar o usuário. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingRoleAction(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loadingCreateUser,
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
        resetPasswordSendEmail,
        resetPassword,
        getAdvisors,
        getAdmins,
        switchActiveUser,
        markAsDefaultUser,
        markAsAdminUser,
        markAsSpAdminUser,
        approveTeacher,
        promoteToAdmin,
        promoteToSuperadmin,
        demoteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
