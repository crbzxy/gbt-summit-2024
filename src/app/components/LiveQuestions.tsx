import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Spinner Component
const Spinner = () => (
    <svg
        className="animate-spin h-5 w-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
        ></path>
    </svg>
);

const LiveQuestions = () => {
    const [newQuestion, setNewQuestion] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [isButtonVisible, setIsButtonVisible] = useState(true); // Para la visibilidad del botón
    const [hasError, setHasError] = useState(false); // Controla si hay error en el textarea
    const cooldownRef = useRef<NodeJS.Timeout | null>(null);
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Para manejar la inactividad
    const COOLDOWN_DURATION = 62;
    const COOLDOWN_STORAGE_KEY = 'liveQuestionsCooldownStart';
    const drawerRef = useRef<HTMLDivElement | null>(null);

    // Recuperar userName y userId de localStorage
    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        const storedUserId = localStorage.getItem('userId');
        if (storedUserName) setUserName(storedUserName);
        if (storedUserId) setUserId(storedUserId);
    }, []);

    // Iniciar Cooldown
    const startCooldown = (remainingTime: number) => {
        if (cooldownRef.current) clearInterval(cooldownRef.current);

        setIsCooldown(true);
        setCooldownTime(remainingTime);

        cooldownRef.current = setInterval(() => {
            setCooldownTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(cooldownRef.current!);
                    cooldownRef.current = null;
                    setIsCooldown(false);
                    localStorage.removeItem(COOLDOWN_STORAGE_KEY);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    // Verificar Cooldown activo
    useEffect(() => {
        const storedCooldownStart = localStorage.getItem(COOLDOWN_STORAGE_KEY);
        if (storedCooldownStart) {
            const cooldownStartTime = parseInt(storedCooldownStart, 10);
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - cooldownStartTime) / 1000);
            const remainingTime = COOLDOWN_DURATION - elapsedTime;

            if (remainingTime > 0) {
                startCooldown(remainingTime);
            } else {
                localStorage.removeItem(COOLDOWN_STORAGE_KEY);
            }
        }

        return () => {
            if (cooldownRef.current) {
                clearInterval(cooldownRef.current);
            }
        };
    }, []);

    // Iniciar temporizador de inactividad
    const resetInactivityTimeout = () => {
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

        inactivityTimeoutRef.current = setTimeout(() => {
            setIsButtonVisible(false); // Oculta el botón tras 5 segundos de inactividad
        }, 5000);
    };

    useEffect(() => {
        // Restablecer el temporizador de inactividad en interacciones del usuario
        const resetTimer = () => {
            setIsButtonVisible(true); // Muestra el botón al detectar interacción
            resetInactivityTimeout();
        };

        // Escuchar eventos de interacción
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);

        resetInactivityTimeout(); // Inicia el temporizador al cargar

        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, []);

    // Agregar pregunta
    const handleAddQuestion = async () => {
        if (!userName || !userId || !newQuestion.trim()) {
            setHasError(true); // Marca el textarea como con error
            toast.error('Faltan campos obligatorios');
            return;
        }

        setIsLoading(true);
        setHasError(false); // Elimina el error si todo está correcto

        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, userId, question: newQuestion }),
            });

            if (res.ok) {
                setNewQuestion('');
                setIsDrawerOpen(false);
                localStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());
                startCooldown(COOLDOWN_DURATION);
                toast.success('Pregunta enviada correctamente');
            } else {
                const error = await res.json();
                toast.error(`Error: ${error.message}`);
            }
        } catch (err) {
            toast.error('Hubo un problema al enviar tu pregunta. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Abrir/Cerrar el Drawer
    const toggleDrawer = () => {
        if (isCooldown) {
            toast.error(`Espera ${formatTime(cooldownTime)} antes de enviar otra pregunta.`);
            return;
        }
        setIsDrawerOpen(!isDrawerOpen);
    };

    // Formatear tiempo
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
    };

    return (
        <div className="relative">
            {/* Toaster Notifications */}
            <Toaster position="top-right" />

            {/* Botón Flotante */}
            <button
                onClick={toggleDrawer}
                className={`absolute bottom-20 right-16 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer transition-transform transform hover:scale-105 z-50 flex items-center justify-center space-x-2 ${isCooldown ? 'opacity-50 cursor-not-allowed' : ''} ${isButtonVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            >
                <span className="text-lg">💬 Preguntas</span>
                {isCooldown && <span className="text-xs">{formatTime(cooldownTime)}</span>}
            </button>

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed bottom-0 right-0 bg-white shadow-lg transition-transform transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} w-80 md:w-96 h-auto p-6 z-50 rounded-l-lg overflow-y-auto`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                {userName ? (
                    <>
                        <p className="text-sm mb-4">
                            Hola <strong>{userName}</strong>, ¿Qué te gustaría preguntar hoy?
                        </p>
                        <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Escribe tu pregunta"
                            disabled={isLoading}
                            className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 mb-4 ${
                                hasError ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'
                            }`}
                            rows={4}
                        />

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleAddQuestion}
                                disabled={isLoading}
                                className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? <Spinner /> : 'Enviar Pregunta'}
                            </button>
                            <button
                                onClick={toggleDrawer}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-red-500 mb-4">No se encontró el nombre de usuario. Inicia sesión.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={toggleDrawer}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Overlay para cerrar Drawer */}
            {isDrawerOpen && <div onClick={toggleDrawer} className="fixed inset-0 bg-black opacity-50 z-40"></div>}
        </div>
    );
};

export default LiveQuestions;
