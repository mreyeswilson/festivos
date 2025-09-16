const throwConffeti = () => {
  // Función para lanzar múltiples efectos de confetti
  const launchFireworks = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fuegos artificiales desde diferentes posiciones
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff6b35', '#ffd23f', '#004e89', '#667eea', '#764ba2']
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff6b35', '#ffd23f', '#004e89', '#667eea', '#764ba2']
      });
    }, 250);
  };

  // Efecto inicial grande
  confetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.6 },
    colors: ['#ff6b35', '#ffd23f', '#004e89'],
    gravity: 0.8,
    drift: 0,
    startVelocity: 45
  });

  // Lanzar fuegos artificiales después de un pequeño delay
  setTimeout(launchFireworks, 500);

  // Efecto de lluvia dorada
  setTimeout(() => {
    confetti({
      particleCount: 300,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: ['#ffd23f', '#ffed4e', '#fff2a6']
    });

    confetti({
      particleCount: 300,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors: ['#ffd23f', '#ffed4e', '#fff2a6']
    });
  }, 1000);
};

export { throwConffeti };
