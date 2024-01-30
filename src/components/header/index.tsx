import { Link } from "react-router-dom";
import { FiLogIn, FiUser } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Logo from '../../assets/car.png';
export function Header() {
 const { loadingAuth , signed} = useContext(AuthContext);

  return (
    <div className=" w-full flex items-center justify-center h-16 bg-slate-50 drop-shadow-md mb-4">
      <header className="flex items-center justify-between w-full max-w-7xl px-4 mx-auto">
        <Link to="/" className="flex  items-center gap-1">
          <img src={Logo} className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-slate-900">RTX Cars</h1>
        </Link>

        {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiUser size={24} color="#000" />
            </div>
          </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiLogIn size={24} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
