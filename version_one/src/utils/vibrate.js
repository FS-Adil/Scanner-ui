// Проверка поддержки вибрации
const canVibrate = () => 'vibrate' in navigator;

// Успешная вибрация (короткая)
export const vibrateSuccess = () => {
  if (canVibrate()) {
    navigator.vibrate(100);
  }
};

// Вибрация ошибки (двойная)
export const vibrateError = () => {
  if (canVibrate()) {
    navigator.vibrate([200, 100, 200]);
  }
};

// Предупреждающая вибрация
export const vibrateWarning = () => {
  if (canVibrate()) {
    navigator.vibrate(50);
  }
};

// Длинная вибрация для важных уведомлений
export const vibrateHeavy = () => {
  if (canVibrate()) {
    navigator.vibrate([100, 50, 100, 50, 300]);
  }
};