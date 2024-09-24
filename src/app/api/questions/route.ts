import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Question from '@/models/question';

// Método POST: Guardar una nueva pregunta
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    console.log('Datos recibidos en la solicitud:', body);
    
    // Desestructurar los campos recibidos
    const { userName, userId, userEmail, question, tag } = body;

   // Validar que se reciban los campos obligatorios
if (!userName || !question || !tag) {
  return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
}


    // Si hay userId, se usa, de lo contrario se usa userEmail
    const idToUse = userId || userEmail;

    // Crear una nueva pregunta usando el userId o userEmail como userId
    const newQuestion = new Question({
      userName,
      userId: idToUse,   // Usar el userId si está disponible, de lo contrario el userEmail
      userEmail,
      question,
      tag,               // Añadir el tag a la pregunta
    });

    // Guardar la nueva pregunta en la base de datos
    await newQuestion.save();

    return NextResponse.json({ success: true, data: newQuestion }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar la pregunta:', error);
    return NextResponse.json({ error: 'Error al guardar la pregunta' }, { status: 500 });
  }
}

// Método GET: Recuperar todas las preguntas
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Recuperar todas las preguntas de la base de datos
    const questions = await Question.find().sort({ createdAt: -1 }); // Ordenar por las preguntas más recientes

    return NextResponse.json({ success: true, data: questions }, { status: 200 });
  } catch (error) {
    console.error('Error al recuperar las preguntas:', error);
    return NextResponse.json({ error: 'Error al recuperar las preguntas' }, { status: 500 });
  }
}
