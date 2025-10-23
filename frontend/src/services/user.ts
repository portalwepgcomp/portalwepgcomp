"use client";
import axiosInstance from "@/utils/api";
import { UpdateUserRequest } from "@/models/update-user";

const baseUrl = "/users";
const authBaseUrl = "/auth";
const instance = axiosInstance;

export const userApi = {
  getUsers: async (params: GetUserParams) => {
    const { data } = await instance.get(`${baseUrl}`, { params });

    return data;
  },

  getAdvisors: async () => {
    const { data } = await instance.get(`${baseUrl}/advisors`);

    return data;
  },

  getAdmins: async () => {
    const { data } = await instance.get(`${baseUrl}/admins`);

    return data;
  },

  switchActiveUser: async (userId: string, activate: boolean) => {
    const { data } = await instance.patch(
      `${baseUrl}/toggle-activation/${userId}?activate=${activate}`,
    );

    return data;
  },

  markAsDefaultUser: async (body: SetPermissionParams) => {
    const { data } = await instance.post(`${baseUrl}/set-default`, body);

    return data;
  },

  markAsAdminUser: async (body: SetPermissionParams) => {
    const { data } = await instance.post(`${baseUrl}/set-admin`, body);

    return data;
  },

  markAsSpAdminUser: async (body: SetPermissionParams) => {
    const { data } = await instance.post(`${baseUrl}/set-super-admin`, body);

    return data;
  },

  approveTeacher: async (userId: string) => {
    const { data } = await instance.patch(`${baseUrl}/${userId}/approve`);
    return data;
  },

  approvePresenter: async (userId: string) => {
    const { data } = await instance.patch(
      `${baseUrl}/${userId}/approve-presenter`,
    );
    return data;
  },

  promoteToAdmin: async (userId: string) => {
    const { data } = await instance.patch(`${baseUrl}/${userId}/promote-admin`);
    return data;
  },

  promoteToSuperadmin: async (userId: string) => {
    const { data } = await instance.patch(
      `${baseUrl}/${userId}/promote-superadmin`,
    );
    return data;
  },

  demoteUser: async (userId: string) => {
    const { data } = await instance.patch(`${baseUrl}/${userId}/demote`);
    return data;
  },

  demoteUserToLevel: async (userId: string, targetLevel: string) => {
    const { data } = await instance.patch(
      `${baseUrl}/${userId}/demote-to/${targetLevel}`,
    );
    return data;
  },

  registerUser: async (body: RegisterUserParams) => {
    const { data } = await instance.post(`${baseUrl}/register`, body);

    return data;
  },

  createProfessorBySuperadmin: async (
    body: CreateProfessorBySuperadminParams,
  ) => {
    const { data } = await instance.post(`${baseUrl}/create-professor`, body);

    return data;
  },

  resetPasswordSendEmail: async (body: ResetPasswordSendEmailParams) => {
    const { data } = await instance.post(
      `${authBaseUrl}/forgot-password`,
      body,
    );

    return data;
  },

  resetPassword: async (body: ResetPasswordParams) => {
    const { data } = await instance.post(
      `${authBaseUrl}/reset-password?token=${body.token}`,
      { newPassword: body.newPassword },
    );

    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await instance.delete(`${baseUrl}/delete/${userId}`);

    return data;
  },

  updateUser: async (email: string, updateData: UpdateUserRequest) => {
    const encodedEmail = encodeURIComponent(email);
    const { data } = await instance.patch(
      `${baseUrl}/edit/${encodedEmail}`,
      updateData,
    );

    return data;
  },
};
