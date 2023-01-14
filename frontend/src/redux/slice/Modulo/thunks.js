import { getApiCantModulos } from "../../../services/apiModulos";
import { changeLoading, setCantidadModulos } from "./moduloSlice";

  export const getCantModulos = () => (dispatch) => {
    dispatch(changeLoading(true));

    getApiCantModulos().then( res => {
        dispatch(setCantidadModulos(res));
        dispatch(changeLoading(false));
    }).catch( err => {
        console.error(err);
        dispatch(changeLoading(false));
    })
  }