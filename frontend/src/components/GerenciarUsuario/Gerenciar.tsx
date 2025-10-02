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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
          </svg>
          Superadmin
        </span>
      );
    } else if (user.isAdmin) {
      badges.push(
        <span key="admin" className="badge bg-primary me-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L15 14L16.18 21L12 17.77L7.82 21L9 14L4 9L10.91 8.26L12 2Z"/>
          </svg>
          Admin
        </span>
      );
    }
    
    if (user.profile === "Professor") {
      if (user.isTeacherActive) {
        badges.push(
          <span key="teacher" className="badge bg-success me-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
            Professor Aprovado
          </span>
        );
      } else {
        badges.push(
          <span key="pending" className="badge bg-warning text-dark me-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M7 9.5C7 9.5 9 7.5 12 7.5S17 9.5 17 9.5S15 11.5 12 11.5S7 9.5 7 9.5M12 17.23C10.25 17.23 8.71 16.5 7.81 15.42L9.23 14C9.68 14.72 10.75 15.23 12 15.23S14.32 14.72 14.77 14L16.19 15.42C15.29 16.5 13.75 17.23 12 17.23Z"/>
            </svg>
            Professor Pendente
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
          <span className="d-none d-md-inline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
            </svg>
            Aprovar Professor
          </span>
          <span className="d-md-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
            </svg>
          </span>
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
          <span className="d-none d-md-inline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
            </svg>
            Promover a Admin
          </span>
          <span className="d-md-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
            </svg>
          </span>
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
          <span className="d-none d-md-inline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
            </svg>
            Promover a Superadmin
          </span>
          <span className="d-md-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
            </svg>
          </span>
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
          <span className="d-none d-md-inline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
            Rebaixar
          </span>
          <span className="d-md-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
            </svg>
          </span>
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
          <div className="info-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
          </div>
          <div className="info-content">
            <div className="info-title">Professor Pendente</div>
            <div className="info-desc">Professor aguardando aprovação administrativa</div>
          </div>
        </div>
        <div className="info-card info-card-admin">
          <div className="info-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L15 14L16.18 21L12 17.77L7.82 21L9 14L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div className="info-content">
            <div className="info-title">Administrador</div>
            <div className="info-desc">Pode aprovar professores e gerenciar usuários</div>
          </div>
        </div>
        <div className="info-card info-card-superadmin">
          <div className="info-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
            </svg>
          </div>
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
                      <div className="control-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17Z"/>
                        </svg>
                        Status
                      </div>
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
                      <div className="control-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,1L9,9L1,9L7,14L5,22L12,18L19,22L17,14L23,9L15,9L12,1Z"/>
                        </svg>
                        Permissão
                      </div>
                      <div className="permission-badge">
                        <span className={`badge ${
                          userPermission === 'SUPERADMIN' ? 'badge-superadmin' :
                          userPermission === 'ADMIN' ? 'badge-admin' : 'badge-normal'
                        }`}>
                          {userPermission === 'SUPERADMIN' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                            </svg>
                          )}
                          {userPermission === 'ADMIN' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L13.09 8.26L20 9L15 14L16.18 21L12 17.77L7.82 21L9 14L4 9L10.91 8.26L12 2Z"/>
                            </svg>
                          )}
                          {userPermission === 'NORMAL' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                            </svg>
                          )}
                          {userPermission}
                        </span>
                      </div>
                    </div>

                    <div className="control-section">
                      <div className="control-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                        </svg>
                        Ações
                      </div>
                      <div className="action-buttons">
                        {actionButtons.length > 0 ? actionButtons : (
                          <div style={{color: '#6c757d', fontSize: '12px', textAlign: 'center'}}>Nenhuma ação disponível</div>
                        )}
                      </div>
                    </div>
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
