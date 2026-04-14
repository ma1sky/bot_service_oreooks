export async function getApiToken(login: string, password: string) : Promise<string> {
    if (password != 'string') {
        return ''
    } else throw Error('Token error');
}