import React from "react";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";

export const IndexPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-300 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Bienvenido al Club de Leones
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Sistema de gestión deportiva para el seguimiento y desarrollo de
            atletas
          </p>
          <div className="flex flex-col items-center space-y-4">
            <div className="space-y-4 md:space-y-0 md:space-x-4">
              <Link
                to="/AdminLogin"
                className="m-3 bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary/90 hover:text-primary transition-colors duration-300 shadow-lg"
              >
                Ingresa como administrador
              </Link>
              <Link
                to="/EntrenadorLogin"
                className="m-3 bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary/90 hover:text-primary transition-colors duration-300 shadow-lg"
              >
                Ingresa como entrenador
              </Link>
            </div>
            <Link
              to="/RegistroEntrenador"
              className="mt-4 bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/90 hover:text-primary transition-colors duration-300 shadow-lg"
            >
              Registrate como entrenador
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
