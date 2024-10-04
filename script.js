let currentTurnIndex = 0; // Índice del turno actual
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Alfabeto
const maxNumber = 99; // Número máximo
let currentNumber = 1; // Número actual
const turnDisplay = document.getElementById('turno');
const inputField = document.getElementById('startTurn');
const textInput = document.getElementById('textToSpeak');
let selectedVoice;

// Obtener y seleccionar la voz femenina en español
function setVoice() {
    const voices = window.speechSynthesis.getVoices();
    // Filtrar por una voz femenina de Google en español (España o Latinoamérica)
    selectedVoice = voices.find(voice => 
        (voice.lang === 'es-ES' || voice.lang === 'es-419') && 
        voice.name.toLowerCase().includes('femenina')
    );
    if (!selectedVoice) {
        console.error('No se encontró una voz femenina en español.');
    }
}

// Función para actualizar la pantalla y anunciar el turno
function updateTurnDisplay() {
    const currentTurn = `${letters[currentTurnIndex]}${currentNumber.toString().padStart(2, '0')}`;
    turnDisplay.textContent = `Turno: ${currentTurn}`;
    speakTurn(currentTurn); // Anunciar el turno
}

// Función para convertir el texto a voz con ajustes de sonido
function speakTurn(turn) {
    // Añadir pausas entre "Turno", "A", y "01" usando comas
    const turnUtterance = new SpeechSynthesisUtterance(`Turno, ${turn.charAt(0)}, ${turn.slice(1)}`);
    
    turnUtterance.lang = 'es-ES';
    turnUtterance.volume = 1; // Volumen (0 a 1)
    turnUtterance.rate = 0.7; // Velocidad ligeramente más baja
    turnUtterance.pitch = 1; // Tono (0 a 2)
    turnUtterance.voice = selectedVoice;

    // Hablar todo el turno con pausas (comas) entre "Turno", "Letra", y "Número"
    window.speechSynthesis.speak(turnUtterance);
}

// Reproducir el turno actual
document.getElementById('replayTurn').addEventListener('click', function() {
    const currentTurn = `${letters[currentTurnIndex]}${currentNumber.toString().padStart(2, '0')}`;
    speakTurn(currentTurn);
});

document.getElementById('prev').addEventListener('click', function() {
    if (currentNumber > 1) {
        currentNumber--;
    } else if (currentTurnIndex > 0) {
        currentTurnIndex--;
        currentNumber = maxNumber; // Reiniciar el número a 99
    }
    updateTurnDisplay();
});

document.getElementById('next').addEventListener('click', function() {
    if (currentNumber < maxNumber) {
        currentNumber++;
    } else if (currentTurnIndex < letters.length - 1) {
        currentTurnIndex++;
        currentNumber = 1; // Reiniciar el número a 01
    } else {
        currentTurnIndex = 0; // Reiniciar al primer turno
        currentNumber = 1; // Reiniciar el número a 01
    }
    updateTurnDisplay();
});

// Ir a un turno específico
document.getElementById('setTurn').addEventListener('click', function() {
    const inputValue = inputField.value.toUpperCase().trim();
    const letter = inputValue.charAt(0);
    const number = parseInt(inputValue.slice(1), 10);

    if (letters.includes(letter) && number >= 1 && number <= maxNumber) {
        currentTurnIndex = letters.indexOf(letter);
        currentNumber = number;
        updateTurnDisplay();
        // Borrar el campo de entrada
        inputField.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Formato de turno inválido. Use la letra A-Z seguida de dos números (por ejemplo, A01).');
    }
});

// Reproducir texto ingresado
document.getElementById('reproduceText').addEventListener('click', function() {
    const text = textInput.value.trim();
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.voice = selectedVoice;
        utterance.rate = 0.7; // Reducir velocidad para mejor comprensión
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Por favor, ingrese texto para reproducir.');
    }
});

// Reiniciar turnos
document.getElementById('reset').addEventListener('click', function() {
    currentTurnIndex = 0;
    currentNumber = 1;
    updateTurnDisplay();
});

// Cargar voces al inicio
window.speechSynthesis.onvoiceschanged = setVoice;

// Inicializar la pantalla
updateTurnDisplay();
