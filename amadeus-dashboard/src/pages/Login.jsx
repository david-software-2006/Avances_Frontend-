import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object({
  username: yup.string().required("El username es requerido."),
  password: yup.string().required("El password es requerido."),
}).required();

const Login = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = data => {
    console.log(data);
    navigate("/dashboard")
  }

  return (
    <div className="flex h-screen">
    <div className="w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-3xl font-bold mb-4">AMADEUS SELLING PLATFORM CONNECT</h1>
      </div>
    </div>
    <div className="w-1/2 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Inicio de sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Nombre de usuario *</label>
            <input
              type="text"
              className={
                errors.username ? "w-full p-2 border border-red-500 focus:ring-red-500 rounded" : "w-full p-2 border border-gray-300 rounded"
              }
              {...register("username")} 
            />
            <p className='text-red-500 text-sm mt-1'>{errors.username?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Contraseña *</label>
            <input
              type="password"
              className={
                errors.password ? "w-full p-2 border border-red-500 focus:ring-red-500 rounded" : "w-full p-2 border border-gray-300 rounded"
              }
              {...register("password")} 
            />
            <p className='text-red-500 text-sm mt-1'>{errors.password?.message}</p>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span className="text-gray-700">Recuérdame</span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Inicio de sesión
          </button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Login
