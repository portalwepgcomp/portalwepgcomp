/**
 * Aplica uma máscara de CPF (000.000.000-00) a uma string.
 * @param value A string contendo os dígitos do CPF.
 * @returns A string formatada.
 */
export const maskCPF = (value: string): string => {
    if (!value) return "";
    value = value.replace(/\D/g, ''); // Remove todos os não-dígitos
    value = value.slice(0, 11); // Limita a 11 dígitos
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // 123.4
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3'); // 123.456.7
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4'); // 123.456.789-00
    return value;
};

/**
 * Remove todos os caracteres não numéricos de uma string (CPF, telefone, etc.).
 * @param value A string com máscara.
 * @returns A string contendo apenas dígitos.
 */
export const unmask = (value: string): string => {
    if (!value) return "";
    return value.replace(/\D/g, '');
};