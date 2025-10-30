
import axiosInstance from "@/utils/api";

const baseUrl = "/presentation";
const instance = axiosInstance;
  
export const presentationApi = {
    getPresentations: async (eventEditionId: string): Promise<Presentation[]> => {
        const { data } = await instance.get(`${baseUrl}`, {
            params: { eventEditionId },
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data;
    },

    getPresentationBookmark: async (params: PresentationBookmarkRegister): Promise<PresentationBookmark> => {
        const { data } = await instance.get(`${baseUrl}/bookmark`, {
            params,
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data;
    },

    getPresentationBookmarks: async (): Promise<any> => {
        const { data } = await instance.get(`${baseUrl}/bookmarks`, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        return data;
    },

    postPresentationBookmark: async (body: PresentationBookmarkRegister) => {
        const { data } = await instance.post(`${baseUrl}/bookmark`, body);

        return data;
    },

    deletePresentationBookmark: async (params: PresentationBookmarkRegister) => {
        const { data } = await instance.delete(`${baseUrl}/bookmark`, {params});

        return data;
    },

    calculateAllScores: async (eventEditionId: string) => {
        const { data } = await instance.post(`${baseUrl}/calculate-all-scores/${eventEditionId}`);

        return data;
    },

    resetEvaluatorsScores: async (eventEditionId: string) => {
        const { data } = await instance.post(`${baseUrl}/reset-evaluators-scores/${eventEditionId}`);

        return data;
    },

    resetPublicScores: async (eventEditionId: string) => {
        const { data } = await instance.post(`${baseUrl}/reset-public-scores/${eventEditionId}`);

        return data;
    },
}