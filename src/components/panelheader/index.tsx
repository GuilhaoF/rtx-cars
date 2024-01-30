import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="w-full items-center flex h-10 shadow-md bg-red-500 gap-4 text-white font-medium px-4 mb-4 rounded-lg">
      <Link to="/dashboard">
        Dashboard
      </Link>
      <Link to="/dashboard/new">
       Cadastrar carro
      </Link>
      <button className="ml-auto" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
