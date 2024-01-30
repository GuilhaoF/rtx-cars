import { FiTrash2 } from "react-icons/fi";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { deleteObject, ref } from "firebase/storage";

interface CarProps {
  id: string;
  name: string;
  year: string;
  price: string | number;
  city: string;
  km: string;
  images: ImageCarProps[];
  uid: string;
}
interface ImageCarProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]); // Array de carros
  const { user } = useContext(AuthContext); // Dados do usuário logado da context

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) {
        // Se não tiver usuário logado, não carrega os carros
        return;
      }

      const carsRef = collection(db, "cars"); // Referência da coleção cars
      const queryRef = query(carsRef, where("uid", "==", user.uid)); // Query para filtrar os carros pelo uid do usuário logado

      getDocs(queryRef).then((snapshot) => {
        const listcars = [] as CarProps[];
        // Percorre os documentos e adiciona no array
        snapshot.forEach((doc) => {
          listcars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });

        setCars(listcars);
      });
    }
    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarProps) {
    const itemCar = car;
    const carRef = doc(db, "cars", itemCar.id);
    await deleteDoc(carRef);

    itemCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`; // Caminho da imagem no storage
      const imageRef = ref(storage, imagePath); // Referência da imagem no storage

      try {
        await deleteObject(imageRef); // Deleta a imagem do storage
        setCars(cars.filter(car => car.id !== itemCar.id)); // Remove o carro da lista
      } catch (err) {
        console.log(err);
      }
    });
    
  }

  return (
    <Container>
      <DashboardHeader />

      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section className="w-full bg-white rounded-lg relative">
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
            >
              <FiTrash2 size={26} color="#000" />
            </button>

            <img
              className="w-full rounded-lg mb-2 max-h-70"
              src={car.images[0].url}
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                {car.year}| {car.km}
              </span>
              <strong className="text-black font-bold mt-4">
                R$ {car.price}
              </strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
              <span className="text-black">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
