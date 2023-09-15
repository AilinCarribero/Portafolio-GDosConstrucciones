import { useContext } from "react";
import { UserContext } from "../contexts/UserProvider";
import { configToken } from "../services/apiServices";
import { useEffect, useState } from "react";
import { getUser } from "../services/apiAuth";

export const useUser = () => {
    const contextUserValue = useContext(UserContext);
    if(contextUserValue.user.token) configToken(contextUserValue.user.token);

    return contextUserValue
}

export const useGetUser = () => {
    const [ users, setUsers ] = useState([]);
    const [ showSpinner, setShowSpinner ] = useState(false);

    useEffect(() => {
        (async () => {
            setShowSpinner(true);
            const resGetUser = await getUser();
            
            setShowSpinner(false);
            setUsers(resGetUser);
        })()
    }, [])
    return { users, setUsers, showSpinner, setShowSpinner }
}