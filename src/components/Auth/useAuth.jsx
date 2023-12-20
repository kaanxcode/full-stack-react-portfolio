// useAuth.js
import { useContext, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Bu kısmı kendi kullanıcı durumunuzla değiştirin
  const user = /* Kullanıcı durumunu buradan alın veya kontrol edin */ null;

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook must be used within an AuthProvider");
  }
  return context;
};
