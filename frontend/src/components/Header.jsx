import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="grid grid-cols-1 h-20 bg-primary place-items-center p-5">
      <div className="flex items-center">
        <img 
          src="/logo.png" 
          alt="Club de Leones Logo" 
          className="h-10 w-auto"
        />
        <div className="bg-clip-text bg-gradient-to-r from-secondary to-accent text-transparent text-2xl font-bold">Club de Leones</div>
      </div>
    </div>
  );
};
