/* eslint-disable @typescript-eslint/no-unused-vars */
import { FiTrash, FiUpload } from "react-icons/fi";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../../components/input";
import { v4 as uuidV4 } from 'uuid';
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../contexts/AuthContext";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage'
import { db, storage } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";


const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    model: z.string().nonempty("O modelo é obrigatório"),
    year: z.string().nonempty("O Ano do carro é obrigatório"),
    km: z.string().nonempty("O KM do carro é obrigatório"),
    price: z.string().nonempty("O preço é obrigatório"),
    city: z.string().nonempty("A cidade é obrigatória"),
    //refine é para validar o campo com uma expressão regular
    whatsapp: z.string().min(1, "O Telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Numero de telefone invalido."
    }),
    description: z.string().nonempty("A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageCarProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function NewCar() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const [imagesCar, setImagesCar] = useState<ImageCarProps[]>([]);
    const { user } = useContext(AuthContext);

    //funcao de selecionar imagem
    async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUploadImage(image);
            } else {
                toast.error('Tipo de imagem não suportada');
                return;
            }
        }
    }
    async function handleUploadImage(image: File) {
        if (!user?.uid) {
            toast.error('Usuario não autenticado');
            return;
        }
        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`); //pegand a referencia da imagem

        uploadBytes(uploadRef, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                const newImage = {
                    uid: currentUid,
                    name: uidImage,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadURL
                }
                setImagesCar((images) => [...images, newImage]);
            })
        })
    }
    async function handleDeleteImage(item: ImageCarProps) {
        const imagePath = `images/${item.uid}/${item.name}`;
        const imageRef = ref(storage, imagePath);

        try{
          await deleteObject(imageRef)
          setImagesCar(imagesCar.filter((car) => car.url !== item.url))
        }catch(err){
          console.log("ERRO AO DELETAR")
        }
    }
    
    function onSubmit(data: FormData) {
        if(imagesCar.length === 0){
            toast.error('Envie alguma imagem !')
            return;
        }
        const cartList = imagesCar.map(car => {
            return {
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })
        addDoc(collection(db, 'cars'),{
            name: data.name.toUpperCase(),
            model: data.model,
            year: data.year,
            km: data.km,
            price: data.price,
            city: data.city,
            whatsapp: data.whatsapp,
            description: data.description,
            owner : user?.name,
            uid: user?.uid,
            created: new Date(),
            images: cartList,
        }).then(() => {
            reset();
            setImagesCar([]);
            toast.success('Veiculo cadastrado com sucesso !')
        })
        .catch((err) => { 
            toast.error('Erro ao cadastrar veiculo !')
            console.error(err)
         })
    }

    return (
        <Container>
            <DashboardHeader />
            <div className="w-full  bg-slate-100 p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 h-32 border-gray-600 md:w-48 rounded-lg flex items-center justify-center cursor-pointer">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input type="file" accept="image/*" className="opacity-0 cursor-pointer" onChange={handleFile} />
                    </div>
                </button>

                {imagesCar.map(item => (
                    <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={() => handleDeleteImage(item)}>
                            <FiTrash size={28} color="#FFF" />
                        </button>
                        <img
                            src={item.previewUrl}
                            className="rounded-lg w-full h-32 object-cover"
                            alt="Foto do carro"
                        />
                    </div>
                ))}

            </div>
            <div className="w-full bg-slate-100 p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                    className="w-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Onix 1.0..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Ex: 1.0 Flex PLUS MANUAL..."
                        />
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano</p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="Ex: 2016/2016..."
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">KM rodados</p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Ex: 23.900..."
                            />
                        </div>

                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone / Whatsapp</p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Ex: (99)99999-9999..."
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Ex: Campo Grande - MS..."
                            />
                        </div>

                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: R$69.000..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-2 w-full rounded-md h-24 px-2"
                            {...register("description")}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o carro..."
                        />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                    </div>

                    <button type="submit" className="w-full rounded-md bg-zinc-900 text-white font-medium h-10">
                        Cadastrar Veiculo
                    </button>

                </form>
            </div>
        </Container>
    )
}