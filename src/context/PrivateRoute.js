import { useContext } from "react"
import { AuthContext } from "./AuthContext"

const PrivateRoute=({children})=>{
    const {authState}=useContext(AuthContext)
    if(authState.isAuth){
        return children
    }
    window.location.pathname='./'
}
export default PrivateRoute;