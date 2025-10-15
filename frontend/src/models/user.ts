/* eslint-disable @typescript-eslint/no-unused-vars */

type ProfileType = "Professor" | "Presenter" | "Listener";
type RoleType = "Superadmin" | "Admin" | "Default";
type StatusType = "Active" | "Inactive";

interface GetUserParams {
    profiles?: ProfileType;
    roles?: RoleType;
    status?: StatusType;
}

interface SetPermissionParams{
    requestUserId: string,
    targetUserId: string
}

interface RegisterUserParams {
    name: string,
    email: string,
    password: string,
    photoFilePath?: string,
    profile: ProfileType,
    areaExpertise?: string,
    biography?: string,
    registrationNumber?: string
}

interface User extends RegisterUserParams {
    id: string,
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
    level: RoleType;
    isActive: boolean;
    isTeacherActive: boolean;
    isPresenterActive: boolean;
    isAdmin: boolean; 
    isSuperadmin: boolean; 
}

interface ResetPasswordSendEmailParams {
    email: string,
}

interface ResetPasswordParams {
    token: string,
    newPassword: string,
}

interface CreateProfessorBySuperadminParams {
    name: string,
    email: string,
    registrationNumber: string
}

interface UserLogin {
    email: string,
    password: string
}

interface UserProfile {
    id: string;
    name: string;
    profile: ProfileType;
    level: RoleType;
    isActive: boolean;
}