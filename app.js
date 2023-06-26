const express = require('express');
const app = express();

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

// Ruta para manejar la solicitud entrante del webhook
app.post('/webhook', (req, res) => {
  // Aquí puedes manejar la lógica de negocio de tu webhook
  // El cuerpo de la solicitud estará disponible en req.body
  console.log('Solicitud recibida:', req.body);

  // Puedes enviar una respuesta al remitente del webhook si es necesario
  //res.send('Solicitud recibida con éxito');
});

app.get('/webhook', (req, res) => {
  // Aquí puedes manejar la lógica de negocio de tu webhook
  // El cuerpo de la solicitud estará disponible en req.body
  console.log('Solicitud recibida:', req.body);

  // Puedes enviar una respuesta al remitente del webhook si es necesario
  //res.send('Solicitud recibida con éxito');
});

// Inicia el servidor en un puerto específico
app.listen(3000, () => {
  console.log('Servidor webhook escuchando en el puerto 3000');
});
