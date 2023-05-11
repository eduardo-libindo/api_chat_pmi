module.exports = {
    secret: "pmi-secret-key",
    jwtExpiration: 3600,           // 1 hora
    jwtRefreshExpiration: 86400,   // 24 horas
  
    /* test */
    // jwtExpiration: 60,          // 1 minuto
    // jwtRefreshExpiration: 120,  // 2 minutos
  };