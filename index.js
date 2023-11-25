const express = require('express');
const app = express();

app.use(express.json());


const cors = require('cors');


app.use(cors({
  origin: 'https://bazarapputl.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

http://localhost:5173/

app.use(cors({
  origin: 'http://localhost:5173/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));



const products = require('./products.json');

app.get('/', (req, res) => {
    res.send('Node js api');
});

// Obtener todos los productos
app.get('/api/items', (req, res) => {
    res.send(products);
});

// Buscar productos por parámetros (por ejemplo, /api/products?brand=Apple)
app.get('/api/items/q', (req, res) => {
    const { filter } = req.query;

    if (!filter) {
        return res.status(400).send('Se requiere un parámetro "filter" para la búsqueda.');
    }

    // Filtramos por cualquier campo
    const productosFiltrados = products.products.filter(product => {
        return Object.values(product).some(value => {
            if (typeof value === 'string' &&  value.toLowerCase().includes(filter.toLowerCase())) {
                return true;
            }
            return false;
        });
    });

    // Devolvemos la lista filtrada y la cantidad encontrada
    res.send({ productos: productosFiltrados, total: productosFiltrados.length });
});



// Obtener un producto por ID
app.get('/api/item/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.products.find(product => product.id === productId);

    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }

    res.send(product);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));