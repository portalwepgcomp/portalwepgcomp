"use client";

import Image from "next/image";
import "./enhanced-style.scss";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useUsers } from "@/hooks/useUsers";
import LoadingPage from "../LoadingPage";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useEdicao } from "@/hooks/useEdicao";

export default function Gerenciar() {
  const { user: currentUser } = useContext(AuthContext);
  const { Edicao } = useEdicao();

  const {
    userList,
    markAsAdminUser,
    markAsDefaultUser,
    markAsSpAdminUser,
    switchActiveUser,
    loadingUserList,
    loadingRoleAction,
    getUsers,
    approveTeacher,
    promoteToAdmin,
    promoteToSuperadmin,
    demoteUser,
  } = useUsers();

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    permission: "",
    profile: "",
  });
  const [searchValue, setSearchValue] = useState<string>("");
  
  // Optimized user list with memoization for stability
  const filteredUsers = useMemo(() => {
    let filtered = userList || [];

    // Search filter
    if (searchValue.trim()) {
      filtered = filtered.filter((user) =>
        user?.name?.toLowerCase().includes(searchValue.trim().toLowerCase())
      );
    }

    // Status filter with enhanced logic
    if (filters.status) {
      filtered = filtered.filter((user) => {
        switch (filters.status) {
          case "ativo":
            return user.isActive && (user.profile !== "Professor" || user.isTeacherActive);
          case "pendente":
            return user.profile === "Professor" && user.isActive && !user.isTeacherActive;
          case "inativo":
            return !user.isActive;
          default:
            return true;
        }
      });
    }

    // Permission filter
    if (filters.permission) {
      filtered = filtered.filter((user) => {
        switch (filters.permission) {
          case "superadmin":
            return user.isSuperadmin;
          case "admin":
            return user.isAdmin && !user.isSuperadmin;
          case "normal":
            return !user.isAdmin && !user.isSuperadmin;
          default:
            return true;
        }
      });
    }

    // Profile filter
    if (filters.profile) {
      filtered = filtered.filter((user) => {
        switch (filters.profile) {
          case "aluno":
            return user.profile === "DoctoralStudent";
          case "professor":
            return user.profile === "Professor";
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [userList, searchValue, filters]);

  // Stable filter update function
  const updateFilter = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value
    }));
  }, []);

  // Enhanced status calculation
  const getUserStatus = useCallback((user: User) => {
    if (!user.isActive) return "INATIVO";
    if (user.profile === "Professor" && !user.isTeacherActive) return "PENDENTE";
    return "ATIVO";
  }, []);

  // Enhanced permission calculation
  const getUserPermission = useCallback((user: User) => {
    if (user.isSuperadmin) return "SUPERADMIN";
    if (user.isAdmin) return "ADMIN";
    return "NORMAL";
  }, []);

  // Enhanced user badges
  const getUserBadges = useCallback((user: User): JSX.Element[] => {
    const badges: JSX.Element[] = [];
    
    if (user.isSuperadmin) {
      badges.push(
        <span key="superadmin" className="badge bg-warning text-dark me-1">
          👑 Superadmin
        </span>
      );
    } else if (user.isAdmin) {
      badges.push(
        <span key="admin" className="badge bg-primary me-1">
          ⚡ Admin
        </span>
      );
    }
    
    if (user.profile === "Professor") {
      if (user.isTeacherActive) {
        badges.push(
          <span key="teacher" className="badge bg-success me-1">
            👨‍🏫 Professor Aprovado
          </span>
        );
      } else {
        badges.push(
          <span key="pending" className="badge bg-warning text-dark me-1">
            ⏳ Professor Pendente
          </span>
        );
      }
    }

    return badges;
  }, []);

  // Enhanced action buttons with permission checking
  const getActionButtons = useCallback((targetUser: User): JSX.Element[] => {
    const actions: JSX.Element[] = [];
    const isCurrentUserSuperadmin = currentUser?.level === "Superadmin";
    const isCurrentUserAdmin = currentUser?.level === "Admin" || currentUser?.level === "Superadmin";
    const isSelf = targetUser.id === currentUser?.id;

    // Teacher approval (Admin and Superadmin only)
    if (
      isCurrentUserAdmin &&
      targetUser.profile === "Professor" &&
      targetUser.isActive &&
      !targetUser.isTeacherActive
    ) {
      actions.push(
        <button
          key="approve"
          className="btn btn-success btn-sm"
          onClick={() => approveTeacher(targetUser.id)}
          disabled={!Edicao?.isActive || loadingRoleAction}
          title="Aprovar Professor"
        >
          <span className="d-none d-md-inline">✅ Aprovar Professor</span>
          <span className="d-md-none">✅</span>
        </button>
      );
    }

    // Admin promotion (Superadmin only)
    if (
      isCurrentUserSuperadmin &&
      targetUser.profile === "Professor" &&
      targetUser.isTeacherActive &&
      !targetUser.isAdmin &&
      !targetUser.isSuperadmin &&
      !isSelf
    ) {
      actions.push(
        <button
          key="promote-admin"
          className="btn btn-primary btn-sm"
          onClick={() => promoteToAdmin(targetUser.id)}
          disabled={!Edicao?.isActive || loadingRoleAction}
          title="Promover a Admin"
        >
          <span className="d-none d-md-inline">⬆️ Promover a Admin</span>
          <span className="d-md-none">⬆️</span>
        </button>
      );
    }

    // Superadmin promotion (Superadmin only)
    if (
      isCurrentUserSuperadmin &&
      targetUser.isAdmin &&
      !targetUser.isSuperadmin &&
      !isSelf
    ) {
      actions.push(
        <button
          key="promote-superadmin"
          className="btn btn-warning btn-sm"
          onClick={() => promoteToSuperadmin(targetUser.id)}
          disabled={!Edicao?.isActive || loadingRoleAction}
          title="Promover a Superadmin"
        >
          <span className="d-none d-md-inline">👑 Promover a Superadmin</span>
          <span className="d-md-none">👑</span>
        </button>
      );
    }

    // Demotion (Superadmin only, cannot demote self)
    if (
      isCurrentUserSuperadmin &&
      !isSelf &&
      (targetUser.isAdmin || targetUser.isSuperadmin)
    ) {
      actions.push(
        <button
          key="demote"
          className="btn btn-secondary btn-sm"
          onClick={() => demoteUser(targetUser.id)}
          disabled={!Edicao?.isActive || loadingRoleAction}
          title="Rebaixar Usuário"
        >
          <span className="d-none d-md-inline">⬇️ Rebaixar</span>
          <span className="d-md-none">⬇️</span>
        </button>
      );
    }

    return actions;
  }, [currentUser, Edicao, loadingRoleAction, approveTeacher, promoteToAdmin, promoteToSuperadmin, demoteUser]);

  // Enhanced status class names
  const statusClassNames = {
    ATIVO: "status-ativo",
    PENDENTE: "status-pendente", 
    INATIVO: "status-inativo",
  };

  // Load users on component mount with stable dependency
  useEffect(() => {
    getUsers({});
  }, []); // Remove getUsers dependency to prevent infinite loops

  // Remove the debounced effect that was causing unnecessary renders
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // Only trigger API call if needed for server-side filtering
  //     // For now, we're doing client-side filtering for better UX
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [filters]);

  return (
    <div className="gerenciador">
      <div className="filtros">
        <div className="pesquisar">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquise pelo nome do usuário"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <div className="btn btn-outline-secondary border border-0 search-button d-flex justify-content-center align-items-center">
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
              onChange={(e) => updateFilter("status", e.target.value)}
              value={filters.status}
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
              onChange={(e) => updateFilter("permission", e.target.value)}
              value={filters.permission}
            >
              <option value="">Todas as permissões</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div className="filter-dropdown">
            <label className="filter-dropdown-label">Cargo</label>
            <select
              className="filter-dropdown-select"
              onChange={(e) => updateFilter("profile", e.target.value)}
              value={filters.profile}
            >
              <option value="">Todos os cargos</option>
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
            </select>
          </div>
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card info-card-teacher">
          <div className="info-icon">👨‍🏫</div>
          <div className="info-content">
            <div className="info-title">Professor Pendente</div>
            <div className="info-desc">Professor aguardando aprovação administrativa</div>
          </div>
        </div>
        <div className="info-card info-card-admin">
          <div className="info-icon">⚡</div>
          <div className="info-content">
            <div className="info-title">Administrador</div>
            <div className="info-desc">Pode aprovar professores e gerenciar usuários</div>
          </div>
        </div>
        <div className="info-card info-card-superadmin">
          <div className="info-icon">👑</div>
          <div className="info-content">
            <div className="info-title">Superadministrador</div>
            <div className="info-desc">Acesso completo ao sistema</div>
          </div>
        </div>
      </div>

      <div className="listagem">
        {loadingUserList && (
          <div className="loading-container">
            <LoadingPage />
          </div>
        )}

        {!loadingUserList && filteredUsers.length > 0 && (
          <div className="user-list">
            {filteredUsers.map((userValue) => {
              const userStatus = getUserStatus(userValue);
              const userPermission = getUserPermission(userValue);
              const actionButtons = getActionButtons(userValue);
              const userBadges = getUserBadges(userValue);

              return (
                <div key={userValue.id} className="user-card">
                  <div className="user-info">
                    <div className="user-header">
                      <div className="user-name">{userValue.name}</div>
                      <div className="user-email">{userValue.email}</div>
                    </div>
                    <div className="user-badges">{userBadges}</div>
                  </div>
                  
                  <div className="user-controls">
                    <div className="control-section">
                      <div className="control-label">Status:</div>
                      <select
                        className={`control-select ${statusClassNames[userStatus]}`}
                        disabled={!Edicao?.isActive || loadingRoleAction}
                        onChange={(e) => {
                          switchActiveUser(
                            userValue.id,
                            e.target.value === "ATIVO"
                          );
                        }}
                        value={userStatus}
                      >
                        <option value="ATIVO">ATIVO</option>
                        <option value="INATIVO">INATIVO</option>
                      </select>
                    </div>

                    <div className="control-section">
                      <div className="control-label">Permissão:</div>
                      <div className="permission-badge">
                        <span className={`badge ${
                          userPermission === 'SUPERADMIN' ? 'badge-superadmin' :
                          userPermission === 'ADMIN' ? 'badge-admin' : 'badge-normal'
                        }`}>
                          {userPermission}
                        </span>
                      </div>
                    </div>

                    {actionButtons.length > 0 && (
                      <div className="control-section">
                        <div className="control-label">Ações:</div>
                        <div className="action-buttons">
                          {actionButtons}
                        </div>
                      </div>
                    )}
                  </div>

                  {loadingRoleAction && (
                    <div className="loading-overlay">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loadingUserList && filteredUsers.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-content">
              <Image
                src="/assets/images/empty_box.svg"
                alt="Lista vazia"
                width={90}
                height={90}
              />
              <h4 className="empty-state-title">
                {searchValue || Object.values(filters).some(f => f) 
                  ? "Nenhum usuário encontrado"
                  : "Nenhum usuário cadastrado"
                }
              </h4>
              <p className="empty-state-desc">
                {searchValue || Object.values(filters).some(f => f)
                  ? "Tente ajustar os filtros de busca"
                  : "Os usuários aparecerão aqui quando forem cadastrados"
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
