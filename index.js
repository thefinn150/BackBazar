const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(express.json());

const allowedOrigins = [
  'https://bazarapputl.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const products = require('./products.json');
const logsPath = './logs.json';
const logsMostrar = require(logsPath);



// Middleware para detectar peticiones incorrectas
app.use((req, res, next) => {
  // Verifica si la URL es /api/iem/1 y si el código de estado es 200
  if (req.originalUrl === '/api/iem/1' && res.statusCode === 200) {
    // Actualiza el código de estado y la URL
    res.statusCode = 404;
    req.originalUrl = '/api/item/1';
  }

  next();
});

// Middleware para registro en logs
app.use((req, res, next) => {
  const logData = {
    statusCode: res.statusCode,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    peticionExitosa: res.statusCode === 200,
  };

  const logsPath = 'logs.json';

  if (fs.existsSync(logsPath)) {
    const logs = JSON.parse(fs.readFileSync(logsPath));
    logs.push(logData);
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
  } else {
    fs.writeFileSync(logsPath, JSON.stringify([logData], null, 2));
  }

  next();
});

app.get('/', (req, res) => {
  res.send('Node js api');
});

app.get('/api/items', (req, res) => {
  try {
    if (Math.random() < 0.5) {
      throw new Error('Operación fallida');
    }

    res.status(200).send(products);
    console.log('Operación exitosa - Código 200');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al obtener productos');
    console.log('Operación fallida - Código 400');
  }
});

app.get('/api/logs', (req, res) => {
    try {
  
      res.status(200).send(logsMostrar);
      console.log('Operación exitosa - Código 200');
    } catch (error) {
      console.error(error);
      res.status(400).send('Error al obtener productos');
      console.log('Operación fallida - Código 400');
    }
  });

app.get('/api/items/q', (req, res) => {
  try {
    const { filter } = req.query;

    if (!filter) {
      return res.status(400).send('Se requiere un parámetro "filter" para la búsqueda.');
    }

    const productosFiltrados = products.products.filter(product => {
      return Object.values(product).some(value => {
        if (typeof value === 'string' && value.toLowerCase().includes(filter.toLowerCase())) {
          return true;
        }
        return false;
      });
    });

    res.status(200).send({ productos: productosFiltrados, total: productosFiltrados.length });
    console.log('Operación exitosa - Código 200');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al buscar productos');
    console.log('Operación fallida - Código 400');
  }
});

app.get('/api/item/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.products.find(product => product.id === productId);

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.status(200).send(product);
    console.log('Operación exitosa - Código 200');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al obtener el producto');
    console.log('Operación fallida - Código 400');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
