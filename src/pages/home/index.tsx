/* eslint-disable prefer-const */
import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  km: string;
  price: string | number;
  city: string;
  images: CarImageProps[];
}
interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadingImage, setLoadingImage] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    loadCars();
  }, []);

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryref = query(carsRef, orderBy("created", "desc"));

    getDocs(queryref)
      .then((snapshot) => {
        let listCars = [] as CarsProps[];

        snapshot.forEach((doc) => {
          listCars.push({
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

        setCars(listCars);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleLoadImage(id: string) {
    setLoadingImage((prevImage) => [...prevImage, id]);
  }
  async function handleSearchCars() {
    if (input === "") {
      loadCars();
    }
    setCars([]);
    setLoadingImage([]);
    //query de busca
    const querySearch = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );
    const querySnapshot = await getDocs(querySearch); //executa a query

    let listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
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
    setCars(listCars);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-sm w-full max-w-3xl mx-auto flex">
        <input
          className="w-full border-2 rounded-lg h-9 outline-none px-2 mr-1"
          placeholder="Digite nome do carro"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSearchCars}
          className="bg-red-500 text-white rounded-lg h-9 px-8 font-medium text-lg"
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg">
              <div
                className="w-full h-72 bg-slate-300 rounded-lg"
                style={{
                  display: loadingImage.includes(car.id) ? "none" : "block",
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={car?.images[0]?.url}
                alt="Carro"
                style={{
                  display: loadingImage.includes(car.id) ? "block" : "none",
                }}
                onLoad={() => handleLoadImage(car.id)}
              />
              <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">
                  Ano {car.year} | {car.km} km
                </span>
                <strong className="text-black font-medium text-xl">
                  R$ {car.price}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-black">{car.city}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
