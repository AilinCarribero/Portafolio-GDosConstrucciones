import { useEffect, useState } from "react";
import { getStock } from "../services/apiStock";

export const useGetStock = () => {
    const [ stock, setStock ] = useState([]);

    useEffect(async() => {
        (async () => {
            const resStock = await getStock();
            setStock(resStock);
        })()
    }, []);
    
    return { stock, setStock }
}