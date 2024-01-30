import { Link , useNavigate } from "react-router-dom";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CarLogo from "../../assets/car.png";
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import toast from "react-hot-toast";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  
  const { handleInfoUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
        await signOut(auth)
    }
    handleLogout()
  },[])

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password).then(async (user)=>{
        await updateProfile(user.user, {
            displayName: data.name
        })
        handleInfoUser({
          name : data.name,
          email : data.email,
          uid : user.user.uid
        })
        toast.success('Cadastro realizado com sucesso !',{ position: 'top-center'})
        navigate('/dashboard', {replace: true})
    })
    .catch((error)=>{ 
        toast.error('Erro ao cadastrar !')
        console.log(error)
    })  
  }
  return (
    <Container>
      <div className=" w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/">
          <div className="flex justify-center items-center">
             <img className=" w-24 h-20 px-2" src={CarLogo} alt="carro-logo" />
            <h1 className="text-3xl font-bold text-red-500">RTX</h1>
            <h1 className="text-3xl font-bold">cars</h1>
          </div>
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

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
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Cadastrar
          </button>
        </form>
        <Link to="/login">Já possui uma conta? Faça o login!</Link>
      </div>
    </Container>
  );
}

