import axiosInstance from "@/utils/api";

interface SendGroupEmailDto {
    subject: string;
    message: string;
    filters: {
        profiles?: string[];
        roles?: string[];
        subprofiles?: string[];
    };
}

interface SendGroupEmailResponse {
    success: boolean;
    sentCount: number;
    failedCount: number;
    message: string;
}

export const emailApi = {
    sendGroupEmail: async (
        data: SendGroupEmailDto
    ): Promise<SendGroupEmailResponse> => {
        const response = await axiosInstance.post("/mailing/send-group", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },
};
