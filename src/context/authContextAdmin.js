import { createContext } from "react";


export const AuthContext = createContext()

const AuthContextAdminProvider = (props) => {
    
    const admin = JSON.parse(localStorage.getItem("admin"));

    return (
      <AuthContext.Provider value={{ admin }}>
        {props.children}
      </AuthContext.Provider>
    );
}
 
export default AuthContextAdminProvider;