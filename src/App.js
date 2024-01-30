import Main from "./main";
import { BrowserRouter as Router } from "react-router-dom"
import AuthContextProvider from "./context/authContextProvicer";
import AuthContextAdminProvider from "./context/authContextAdmin";
import MainAdmin from "./main_admin";


function App() {
  return (
      <AuthContextProvider>
        <Router>
          <Main />
        </Router>
      </AuthContextProvider>
  );
}

export default App;
