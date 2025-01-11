import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const SingupEntrenador = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:5000/api/signup/entrenador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      Swal.fire({
        title: 'Éxito',
        text: 'Registro exitoso',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
        }
      });

      navigate('/');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Header />
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
              <h2 className="text-3xl font-bold text-neutral-dark">Registro de Entrenador</h2>
              <p className="mt-2 text-sm text-neutral">Completa tus datos para registrarte</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="text-sm font-medium text-neutral-dark">
                  Nombre Completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neutral/30 placeholder-neutral/50 text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm mt-1"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-neutral-dark">
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
                <label htmlFor="password" className="text-sm font-medium text-neutral-dark">
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

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-dark">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neutral/30 placeholder-neutral/50 text-neutral-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm mt-1"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
