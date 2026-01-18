// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Pega el bloque de código aquí
const firebaseConfig = {
  apiKey: "AIzaSyCjToz31WKbe-UYx99iQ1qQx2DT83BRBaM",
  authDomain: "EDAv1.firebaseapp.com",
  projectId: "EDAv1",
  storageBucket: "EDAv1.firebasestorage.app",
  messagingSenderId: "735400327770",
  appId: "1:735400327770:web:f93c7bb3e8db86c13af663",
  measurementId: "G-LBYK86LSR4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén una referencia al servicio de Storage
export const storage = getStorage(app);