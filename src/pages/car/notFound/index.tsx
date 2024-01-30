import { Container } from "../../../components/container";
import carNotFound from "../../../assets/notFound.svg";

export function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center h-auto">
        <img src={carNotFound} alt="Carro não encontrado" className="w-96 h-96" />
        <h1 className="font-extrabold text-center text-2xl mt-8">Carro nao encontrado !</h1>
      </div>
    </Container>
  );
}
