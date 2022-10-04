import { getApiCantModulos } from "../../../services/apiModulos";
import { setCantidadModulos } from "./moduloSlice";

  export const getCantModulos = () => (dispatch) => {
    getApiCantModulos().then( res => {
        dispatch(setCantidadModulos(res));
    }).catch( err => {
        console.error(err);
    })
  }