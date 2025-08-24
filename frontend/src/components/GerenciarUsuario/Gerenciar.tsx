"use client";

import Image from "next/image";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import LoadingPage from "../LoadingPage";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useEdicao } from "@/hooks/useEdicao";

export default function Gerenciar() {
  const { user } = useContext(AuthContext);
  const { Edicao } = useEdicao();

  const {
    userList,
    markAsAdminUser,
    markAsDefaultUser,
    markAsSpAdminUser,
    switchActiveUser,
    loadingUserList,
    getUsers,
  } = useUsers();

  const [ativo, setAtivo] = useState<boolean>(false);
  const [pendente, setPendente] = useState<boolean>(false);
  const [inativo, setInativo] = useState<boolean>(false);
  const [spAdmin, setSpAdmin] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  const [normal, setNormal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [usersListValues, setUsersListValues] = useState<User[]>(userList);

  const statusOptions = ["ATIVO", "PENDENTE", "INATIVO"];
  const statusOptionsFilterButtons = [
    { label: "ATIVO", option: "ATIVO" },
    { label: "PENDENTE OU INATIVO", option: "INATIVO" },
  ];
  const permissionsOptions = ["SUP ADMINISTRADOR", "ADMINISTRADOR", "NORMAL"];

  const getStatus = (isActive: boolean, isPending: boolean) => {
    if (isActive) {
      return "ATIVO";
    }

    if (isPending) {
      return "PENDENTE";
    }

    return "INATIVO";
  };

  const getPermission = (role: RoleType) => {
    const rolesOptions = {
      Superadmin: "SUP ADMINISTRADOR",
      Admin: "ADMINISTRADOR",
      Default: "NORMAL",
    };

    return rolesOptions[role];
  };

  const userStatusClassname = {
    ATIVO: "button-ativo-true",
    PENDENTE: "button-pendente-true",
    INATIVO: "button-inativo-true",
  };

  const buttonsStatusClassname = {
    ATIVO: ativo ? "button-ativo-true" : "button-ativo-false",
    PENDENTE: pendente ? "button-pendente-true" : "button-pendente-false",
    INATIVO: inativo ? "button-inativo-true" : "button-inativo-false",
    ["SUP ADMINISTRADOR"]: spAdmin ? "button-ativo-true" : "button-ativo-false",
    ADMINISTRADOR: admin ? "button-pendente-true" : "button-pendente-false",
    NORMAL: normal ? "button-inativo-true" : "button-inativo-false",
  };

  const handleFilter = {
    ATIVO: () => setAtivo(!ativo),
    PENDENTE: () => setPendente(!pendente),
    INATIVO: () => setInativo(!inativo),
    ["SUP ADMINISTRADOR"]: () => setSpAdmin(!spAdmin),
    ADMINISTRADOR: () => setAdmin(!admin),
    NORMAL: () => setNormal(!normal),
  };

  const handleUserPermission = (targetUser: User, newPermission: string) => {
    const body: SetPermissionParams = {
      requestUserId: user?.id ?? "",
      targetUserId: targetUser.id,
    };

    if (newPermission === "SUP ADMINISTRADOR") {
      return markAsSpAdminUser(body);
    }

    if (newPermission === "ADMINISTRADOR") {
      return markAsAdminUser(body);
    }

    return markAsDefaultUser(body);
  };

  useEffect(() => {
    const filterParams = {
      status: undefined,
      profile: undefined,
      role: undefined,
    } as GetUserParams;

    const filterRoles: string[] = [
      spAdmin ? "Superadmin" : "",
      admin ? "Admin" : "",
      normal ? "Default" : "",
    ].filter(Boolean);

    if (ativo && !inativo && !pendente) {
      filterParams.status = "Active";
    }

    if (!ativo && (inativo || pendente)) {
      filterParams.status = "Inactive";
    }

    const finalParams = {
      ...filterParams,
      roles: filterRoles.length ? filterRoles.join(",") : undefined,
    };

    getUsers(finalParams as GetUserParams);
  }, [ativo, inativo, pendente, admin, spAdmin, normal]);

  useEffect(() => {
    const newUsersList =
      userList?.filter((v) => {
        const searchMatch = v?.name
          ?.toLowerCase()
          .includes(searchValue.trim().toLowerCase());

        return !v?.name || searchMatch;
      }) ?? [];
    setUsersListValues(newUsersList);
  }, [userList, searchValue]);

  return (
    <div className="gerenciador">
      <div className="filtros">
        <div className="pesquisar">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquise pelo nome do usuário"
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <div
            className="btn btn-outline-secondary border border-0 search-button d-flex justify-content-center align-items-center"
            id="button-addon2"
          >
            <Image
              src="/assets/images/search.svg"
              alt="Search icon"
              height={24}
              width={24}
            />
          </div>
        </div>

        <div className="filter-dropdowns">
          <div className="filter-dropdown">
            <label className="filter-dropdown-label">Status</label>
            <select
              className="filter-dropdown-select"
              onChange={(e) => {
                const value = e.target.value;
                setAtivo(value === 'ativo');
                setPendente(value === 'pendente');
                setInativo(value === 'inativo');
              }}
              value={ativo ? 'ativo' : pendente ? 'pendente' : inativo ? 'inativo' : ''}
            >
              <option value="">Todos os status</option>
              <option value="ativo">Apenas Ativos</option>
              <option value="pendente">Apenas Pendentes</option>
              <option value="inativo">Apenas Inativos</option>
            </select>
          </div>

          <div className="filter-dropdown">
            <label className="filter-dropdown-label">Permissão</label>
            <select
              className="filter-dropdown-select"
              onChange={(e) => {
                const value = e.target.value;
                setSpAdmin(value === 'superadmin');
                setAdmin(value === 'admin');
                setNormal(value === 'normal');
              }}
              value={spAdmin ? 'superadmin' : admin ? 'admin' : normal ? 'normal' : ''}
            >
              <option value="">Todas as permissões</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      </div>


      <div className="d-flex flex-column w-100 justify-content-center m-0 listagem">
        {!!loadingUserList && <LoadingPage />}

        {!loadingUserList &&
          usersListValues?.map((userValue) => {
            const userStatus = getStatus(
              userValue.isActive,
              userValue?.profile === "Professor" && !userValue.isActive
            );
            const userPermission = getPermission(userValue.level);
            const superAdminsCount =
              usersListValues?.filter((v) => v.level === "Superadmin").length ??
              0;

            return (
              <div key={userValue.id} className="users">
                <div className="name">{userValue.name}</div>
                <div className="drop-boxes">
                  <div className="drop-section">
                    <div className="drop-text">Status:</div>
                    <div className="dropdown-center">
                      <select
                        className={`${userStatusClassname[userStatus]} dropdown-toggle text-center`}
                        disabled={!Edicao?.isActive}
                        onChange={(status) => {
                          switchActiveUser(
                            userValue.id,
                            status.target.value === "ATIVO"
                          );
                        }}
                        value={userStatus}
                      >
                        {statusOptions?.map((status) => (
                          <option
                            key={status}
                            className="drop-button1"
                            style={{
                              display:
                                status === userStatus || status === "PENDENTE"
                                  ? "none"
                                  : "block",
                            }}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="drop-section">
                    <div className="drop-text">Permissão:</div>
                    <div className="dropdown">
                      <select
                        className={`drop-permit dropdown-toggle`}
                        disabled={!Edicao?.isActive}
                        onChange={(permission) => {
                          handleUserPermission(
                            userValue,
                            permission.target.value
                          );
                        }}
                        value={userPermission}
                      >
                        {permissionsOptions?.map((permission) => (
                          <option
                            key={permission}
                            disabled={
                              userPermission === permission ||
                              (userPermission === "SUP ADMINISTRADOR" &&
                                superAdminsCount <= 1)
                            }
                            className="drop-button1"
                          >
                            {permission}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {!loadingUserList && !usersListValues.length && (
          <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
            <h4 className="empty-list mb-0">
              <Image
                src="/assets/images/empty_box.svg"
                alt="Lista vazia"
                width={90}
                height={90}
              />
              Essa lista ainda está vazia
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}
