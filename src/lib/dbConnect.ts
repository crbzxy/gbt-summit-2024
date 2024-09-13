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
      dbName: 'ProdGbt', // Nombre de la base de datos
    }).then((mongoose) => {
      console.log('Conexión a la base de datos establecida');
      return mongoose.connection; // Devuelve la conexión
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Función para verificar la actualización de la base de datos
async function verifyDatabaseUpdate(model: mongoose.Model<any>, docId: string, expectedData: any): Promise<boolean> {
  console.log(`Iniciando verificación de actualización para el documento ID: ${docId}`);
  try {
    await dbConnect();

    // Obtener los datos más recientes de la base de datos
    const doc = await model.findById(docId);
    if (!doc) {
      console.error(`Error: Documento con ID ${docId} no encontrado en la base de datos`);
      return false;
    }
    console.log(`Documento encontrado en la colección ${model.collection.name}`);

    // Comparar los datos esperados con los datos de la base de datos
    let allFieldsMatch = true;
    Object.keys(expectedData).forEach(key => {
      const expectedValue = expectedData[key];
      const actualValue = doc[key];
      if (expectedValue !== actualValue) {
        console.error(`Discrepancia encontrada en el campo '${key}':`);
        console.error(`  Valor esperado: ${expectedValue}`);
        console.error(`  Valor actual: ${actualValue}`);
        allFieldsMatch = false;
      } else {
        console.log(`Campo '${key}' verificado correctamente`);
      }
    });

    if (allFieldsMatch) {
      console.log('Éxito: Todos los campos se actualizaron correctamente');
    } else {
      console.error('Error: La actualización no se reflejó completamente en la base de datos');
    }

    return allFieldsMatch;

  } catch (error) {
    console.error('Error crítico al verificar la actualización de la base de datos:', error);
    return false;
  }
}

// Función para actualizar y verificar un documento
async function updateAndVerifyDocument(model: mongoose.Model<any>, docId: string, updateData: any) {
  console.log(`Iniciando proceso de actualización y verificación para el documento ID: ${docId}`);
  try {
    await dbConnect();

    // Actualizar el documento
    const updatedDoc = await model.findByIdAndUpdate(docId, updateData, { new: true });
    if (!updatedDoc) {
      console.error(`Error: No se pudo encontrar o actualizar el documento con ID ${docId}`);
      return;
    }
    console.log(`Documento actualizado en la colección ${model.collection.name}`);

    // Verificar la actualización
    console.log('Iniciando verificación de la actualización...');
    const isVerified = await verifyDatabaseUpdate(model, docId, updateData);

    if (isVerified) {
      console.log('Éxito: La actualización se verificó correctamente');
    } else {
      console.error('Error: La verificación de la actualización falló');
      console.log('Se recomienda revisar manualmente los datos del documento en la base de datos');
    }

  } catch (error) {
    console.error('Error crítico al actualizar y verificar el documento:', error);
    console.log('Se recomienda verificar la conexión a la base de datos y la integridad de los datos');
  }
}

export { dbConnect, verifyDatabaseUpdate, updateAndVerifyDocument };