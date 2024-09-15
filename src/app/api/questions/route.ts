import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Question from '@/models/question';

// Método POST: Guardar una nueva pregunta
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    console.log('Datos recibidos en la solicitud:', body);
    const { userName, userId, question } = body;

    if (!userName || !userId || !question) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const newQuestion = new Question({ userName, userId, question });
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
