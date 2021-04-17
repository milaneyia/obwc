export type ErrorResponse = { error: string };

export function isError<T>(error: T | ErrorResponse): error is ErrorResponse {
    if (!error) return false;

    return (error as ErrorResponse).error !== undefined;
}
