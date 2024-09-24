import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const SupportQuestion = () => {
  const [email, setEmail] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false); // Estado para enviar el correo

  // Cargar el correo desde localStorage al cargar el componente
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      setIsConfirmed(true); // Si ya hay un correo almacenado, lo consideramos confirmado
    }
  }, []);

  // Actualizar el correo en localStorage cuando el correo cambia
  useEffect(() => {
    if (email) {
      localStorage.setItem('email', email); // Siempre sobrescribir el correo en localStorage
    }
  }, [email]);

  // Verificar y enviar el correo al lobby en la base de datos
  const sendToLobby = async () => {
    if (!email) {
      toast.error('Por favor ingresa un correo válido');
      return;
    }

    setEmailSending(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: email, // Usar el correo como userName
          userEmail: email,
          question: `${email} está en el lobby.`,
          tag: 'lobby',
        }),
      });

      if (res.ok) {
        setIsConfirmed(true); // Confirmamos que el correo está verificado
        localStorage.setItem('email', email); // Guardar en localStorage
        toast.success('Correo verificado y notificación enviada al lobby.');
      } else {
        toast.error('Error al enviar la notificación al lobby.');
      }
    } catch (err) {
      toast.error('Error al conectar con el servidor.');
    } finally {
      setEmailSending(false); // Desactivar estado de carga del email
    }
  };

  // Enviar mensaje de soporte
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Por favor escribe tu mensaje.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: email, // Usar el correo almacenado como userName
          userEmail: email,
          question: message,
          tag: 'support',
        }),
      });

      if (res.ok) {
        setMessage('');
        toast.success('Mensaje de soporte enviado correctamente.');
      } else {
        toast.error('Error al enviar el mensaje.');
      }
    } catch (err) {
      toast.error('Error al enviar el mensaje.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Toaster position="top-right" />

      {/* Mostrar campo para ingresar el correo si no está confirmado */}
      {!isConfirmed ? (
        <div>
          <h2 className="text-lg font-bold mb-4">Introduce tu correo para soporte:</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={sendToLobby}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 ${emailSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={emailSending}
          >
            {emailSending ? 'Enviando...' : 'Enviar al lobby'}
          </button>
        </div>
      ) : (
        <div>
             <h2 className="text-lg font-bold mb-4">Si necesitas soporte, ingresa tu número y mensaje</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleSendMessage}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SupportQuestion;
