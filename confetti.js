const throwConffeti = () => {
  const config = {
    particleCount: 1500,
    spread: 300,
    origin: { y: 0.6 },
  };

  confetti(config);
};

export { throwConffeti };
