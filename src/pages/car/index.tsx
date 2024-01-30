import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../../components/container";
import toast from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { FaWhatsapp } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: ImagesCarProps[];
}
interface ImagesCarProps {
  uid: string;
  name: string;
  url: string;
}

export function CarDetail() {
  const { id } = useParams<{ id: string }>(); // Pega o id do carro pela url
  const [car, setCar] = useState<CarProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2); // Quantidade de slides por view
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        toast.error("Carro não encontrado");
        return;
      }
      const docRef = doc(db, "cars", id); // Referência do documento do carro

      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          toast.error("Carro não encontrado");
          navigate("/notFound");
        }

        // Pega o documento do carro
        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          city: snapshot.data()?.city,
          year: snapshot.data()?.year,
          km: snapshot.data()?.km,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          price: snapshot.data()?.price,
          owner: snapshot.data()?.owner,
          uid: snapshot.data()?.uid,
          whatsapp: snapshot.data()?.whatsapp,
          images: snapshot.data()?.images,
        });
      });
    }
    loadCar();
  }, [id, navigate]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize); // Adiciona o evento de resize
    return () => {
      window.removeEventListener("resize", handleResize); // Remove o evento de resize
    };
  }, []);

  return (
    <Container>
      {/* Slide com as fotos dos carros*/}
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide>
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-96 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">R$ {car?.price}</h1>
          </div>
          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição:</strong>
          <p className="mb-4">{car?.description}</p>

          <strong>Telefone / WhatsApp</strong>
          <p>{car?.whatsapp}</p>

          <a href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}$text=Ola vi esse ${car?.name}`} target="_blank" className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium">
            Conversar com vendedor
            <FaWhatsapp size={26} color="#FFF" />
          </a>
        </main>
      )}
    </Container>
  );
}
