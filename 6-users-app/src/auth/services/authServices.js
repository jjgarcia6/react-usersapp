//podriamos desestructurar el objeto userLogin en username y password
//para hacerlo mas legible
export const loginUser = (userLogin) => {

    return (userLogin.username === 'admin' && userLogin.password === '12345');
}
