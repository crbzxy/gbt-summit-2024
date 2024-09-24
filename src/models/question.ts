import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userId: { type: String, default: 'anonymous' }, // Default para usuarios no autenticados
    userEmail: { type: String, default: '' },       // Opcional, solo si el usuario no está autenticado
    question: { type: String, required: true },
    tag: { type: String, required: true },          // Nuevo campo para identificar el origen
  },
  { timestamps: true }  // Para incluir createdAt y updatedAt automáticamente
);

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
export default Question;
