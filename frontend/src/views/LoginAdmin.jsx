import { useState } from "react"
import { Header } from "../components/Header"
import { Link } from "react-router-dom"

export const LoginAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
        <Header/>
        <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <Link
                to="/" 
                className="flex items-center text-neutral-dark hover:text-primary transition-colors mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Volver
            </Link>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-dark">Iniciar Sesión</h2>
              <p className="mt-2 text-sm text-neutral">Panel de entrenadores</p>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-dark"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neutral/30 placeholder-neutral/50 text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm mt-1"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-dark"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neutral/30 placeholder-neutral/50 text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm mt-1"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg- focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
      </>
  )
}
