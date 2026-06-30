import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { useState } from "react";

export default function App() {
  const { currentUser } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (!currentUser) {
    return showRegister
      ? <Register onSwitch={() => setShowRegister(false)} />
      : <Login onSwitch={() => setShowRegister(true)} />;
  }

  return <Chat />;
}
