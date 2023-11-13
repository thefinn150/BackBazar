const express = require('express');

const app = express();

app.use(express.json());

const students = [
    {
        id: 1, name:"yo"
    },
];

app.get('/', (req, res) => {
    res.send('Node js api');
});

app.get('/api/info', (req, res) =>
{
    res.send(students);
});


app.get('/api/info/:id', (req, res) =>
{
   const student = students.find(c => c.id === parseInt(req.params.id));
   if (!student) return res.status(404).send('info no encontrada');
   else res.send(student);
});


const port = process.env.port || 3000;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));