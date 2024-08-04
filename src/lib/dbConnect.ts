import mongoose from 'mongoose';

// Usar operador de coalescencia nula para manejar valores nulos
const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI en .env.local');
}

// Usar los tipos extendidos de global
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Verifica si cached ya existe o inicializarlo.
let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached; // Asegura que cached esté definido en global

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Configura mongoose para usar Promises
    mongoose.Promise = global.Promise;

    cached.promise = mongoose.connect(MONGODB_URI, {
      // Eliminamos opciones obsoletas y utilizamos las nuevas opciones
      dbName: 'TestGbt', // Nombre de la base de datos
    }).then((mongoose) => {
      return mongoose.connection; // Devuelve la conexión
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
