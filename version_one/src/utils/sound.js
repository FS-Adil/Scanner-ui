// Создаем аудиоконтекст для Web Audio API
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Генерация звукового сигнала
const playTone = (frequency, duration, type = 'sine') => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.value = 0.3;

  oscillator.start(ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  oscillator.stop(ctx.currentTime + duration);
};

// Звук успешного сканирования (два коротких высоких сигнала)
export const playSuccess = () => {
  playTone(880, 0.1); // Первый сигнал
  setTimeout(() => playTone(1100, 0.15), 100); // Второй сигнал
};

// Звук ошибки (низкий гул)
export const playError = () => {
  playTone(200, 0.5, 'sawtooth');
  setTimeout(() => playTone(150, 0.3, 'sawtooth'), 300);
};

// Предупреждающий звук (средний тон)
export const playWarning = () => {
  playTone(660, 0.15, 'triangle');
};

// Звук включения/выключения фонарика
export const playToggle = () => {
  playTone(440, 0.05);
};