import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import SucursalForm from "../formularioSucursal/SucursalForm";

const SucursalContainer = () => {
  const [error, setError] = useState(null);

  const agregarSucursal = async (sucursal) => {
    try {
      const sucursalRef = collection(db, "sucursales");
      await addDoc(sucursalRef, {
        ...sucursal,
        fechaCreacion: Timestamp.now(),
      });
      console.log("Sucursal agregada correctamente:", sucursal);
    } catch (error) {
      console.error("Error al agregar la sucursal:", error);
      setError("Error al agregar la sucursal");
    }
  };

  return (
    <div>
      <h2>Agregar Sucursal</h2>
      {error && <div>{error}</div>}
      <SucursalForm agregarSucursal={agregarSucursal} />
    </div>
  );
};

export default SucursalContainer;
