/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CarLogo from "../../assets/car.png";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import toast from "react-hot-toast";
import { useEffect } from "react";

//criando schema de validação
const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha inválida" }),
});

//tipo do schema(formdata)
type FormData = z.infer<typeof schema>;

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema), //quem vai resolver o schema
    mode: "onChange",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
        await signOut(auth)
    }
    handleLogout()
  },[])

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        toast.success("Login realizado com sucesso !");
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        toast.error("Email ou senha inválidos !");
        console.log(error);
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col">
        <Link to="/">
          <div className="flex justify-center  items-center">
            <img className=" w-24 h-20 px-2" src={CarLogo} alt="carro-logo" />
            <h1 className="text-3xl font-bold text-red-500">RTX</h1>
            <h1 className="text-3xl font-bold">cars</h1>
          </div>
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-red-500 border-2 h-10 text-white font-medium"
          >
            Acessar
          </button>
        </form>
        <Link to="/register">Ainda não possui uma conta? Cadastre-se</Link>
      </div>
    </Container>
  );
}
