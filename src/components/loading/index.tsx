export function Loading(){
  return(
    <div className="flex items-center justify-center mx-auto flex-col">
         <div className="border-gray-100  h-44 w-44 animate-spin rounded-full border-8 border-t-red-500" ></div>
         <h1 className="mt-8 font-medium">Carregando...</h1>
    </div>
   
  )
}