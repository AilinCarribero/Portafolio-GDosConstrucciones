export const API = process.env.REACT_APP_REST;//'http://localhost:5030/api/';  //url de la api 


export const auth = {
    auth: {
        username: 'GDosConstrucciones',
        password: ''
    }
}

export const setAuth = (password) => {
    auth.auth.password = password;
}