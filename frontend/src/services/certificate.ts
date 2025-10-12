import axiosInstance from '@/utils/api';


const baseUrl = "/certificate";
export const useCertificate = () => {

    const downloadCertificate = async (eventId: string): Promise<number | string> => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/event-edition/${eventId}`, {
                responseType: "blob",
                headers: {
                    "Content-Type": "application/pdf",
                },
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `certificate-${Date.now()}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);

            return 200; 
        } catch (error: any) {       

            if (error.response && error.response.data) {
                // Tenta extrair a mensagem do backend
                const reader = new FileReader();
                return await new Promise<string>((resolve) => {
                    reader.onload = () => {
                        try {
                            const text = reader.result as string;
                            try {
                                const json = JSON.parse(text);
                                resolve(json.message || text);
                            } catch {
                                resolve(text);
                            }
                        } catch {
                            resolve("Erro desconhecido ao processar a mensagem de erro.");
                        }
                    };
                    reader.readAsText(error.response.data);
                });
            }
            return error.message || "Erro desconhecido ao baixar certificado.";
        }
    };

    return { downloadCertificate };
};
