export function response(data, error, message = "ok", status = 200) {
    return {
        status,
        message,
        data,
        error
    }
}
