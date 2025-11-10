import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Reemplaza esto con la configuración de TU proyecto de Firebase
// (La que obtuviste en el "Paso 3" de la guía visual)
const firebaseConfig = {
  apiKey: "AIzaSyCyvLWbKHyiojPu44GC4UeSyGtCX1GRz7s",

  authDomain: "wetwo-5418e.firebaseapp.com",

  projectId: "wetwo-5418e",

  storageBucket: "wetwo-5418e.firebasestorage.app",

  messagingSenderId: "455096370370",

  appId: "1:455096370370:web:0c7fce7fdaf86a679ce75b",

  measurementId: "G-XH44LK0440",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta el servicio de Autenticación
export const auth = getAuth(app);
