import mongoose, { Schema, model, models } from 'mongoose';

// Definir el esquema de Question
const questionSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
});

// Verificar si el modelo ya está definido para evitar el error de sobreescritura
const Question = models.Question || model('Question', questionSchema);

export default Question;
