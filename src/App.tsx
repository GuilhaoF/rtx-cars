import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CarDetail } from "./pages/car";
import { Home } from "./pages/home";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { NewCar } from "./pages/dashboard/new";
import { Private } from "./routes/Private";
import { NotFound } from "./pages/car/notFound";

const router = createBrowserRouter([
  {
    element: <Layout />, //usando o componente Layout como um container para as rotas
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <CarDetail />,
      },
      {
        path: "/notFound",
        element: <NotFound />,
      },
      {
        path: "/dashboard",
        element: ( //rota privada
          <Private>
            <Dashboard />
          </Private>
        ),
      },
      {
        path: "/dashboard/new",
        element: ( //rota privada
          <Private>
            <NewCar />
          </Private>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export { router };
