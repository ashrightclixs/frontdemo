import { createContext } from "react";


export const AuthContext = createContext()

const AuthContextProvider = (props) => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    const ip_address = JSON.parse(localStorage.getItem("ip_address"));
    

    return (
      <AuthContext.Provider value={{ user , ip_address}}>
        {props.children}
      </AuthContext.Provider>
    );
}
 
export default AuthContextProvider;