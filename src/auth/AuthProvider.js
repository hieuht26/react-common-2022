import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const signIn = async (data) => {
    // call api
    setToken("token")
  }

  const signOut = async () => {
    // call api
  }

  const value = { token, signIn, signOut };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;