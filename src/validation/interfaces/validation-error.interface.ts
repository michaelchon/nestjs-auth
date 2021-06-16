export interface IValidationError {
    id: string;
    message: string;
}

export const isValidationError = (value: any) => {
    return value.id && value.message;
};
