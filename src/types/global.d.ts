// src/types/global.d.ts

import mongoose from 'mongoose';

// Definimos una interfaz para la caché de mongoose
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

export {};
