export function getApiToken(login: string, password: string) : string {
    if (password != 'string') {
        return ''
    } else throw Error('Token error');
}