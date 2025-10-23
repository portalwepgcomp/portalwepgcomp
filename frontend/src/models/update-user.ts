export interface UpdateUserRequest {
  name?: string;
  email?: string;
  registrationNumber?: string;
  registrationNumberType?: RegistrationNumberType;
  photoFilePath?: string;
  profile?: ProfileType;
  level?: RoleType;
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  registrationNumber: string | null;
  registrationNumberType: 'CPF' | 'MATRICULA' | null;
  photoFilePath: string | null;
  profile: 'Presenter' | 'Professor' | 'Listener';
  level: 'Superadmin' | 'Admin' | 'Default';
  isActive: boolean;
  isVerified: boolean;
  isTeacherActive: boolean;
  isPresenterActive: boolean;
  isAdmin: boolean;
  isSuperadmin: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}
