/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Modelo de datos
let concesionarios = [
  {
    nombre: "Concesionario Central",
    direccion: "Calle Principal 123",
    coches: [
      { modelo: "Corsa", cv: 90, precio: 15000 },
      { modelo: "Astra", cv: 120, precio: 20000 },
    ],
  },
];

// Obtener todos los concesionarios
app.get("/concesionarios", (req, res) => {
  res.json(concesionarios);
});

// Crear un nuevo concesionario
app.post("/concesionarios", (req, res) => {
  concesionarios.push(req.body);
  res.json({ message: "Concesionario creado" });
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", (req, res) => {
  const id = req.params.id;
  const concesionario = concesionarios[id];
  if (concesionario) {
    res.json(concesionario);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualizar un concesionario por ID
app.put("/concesionarios/:id", (req, res) => {
  const id = req.params.id;
  if (concesionarios[id]) {
    concesionarios[id] = req.body;
    res.json({ message: "Concesionario actualizado" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Borrar un concesionario por ID
app.delete("/concesionarios/:id", (req, res) => {
  const id = req.params.id;
  if (concesionarios[id]) {
    concesionarios = concesionarios.filter((_, index) => index != id);
    res.json({ message: "Concesionario eliminado" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtener todos los coches de un concesionario por ID
app.get("/concesionarios/:id/coches", (req, res) => {
  const id = req.params.id;
  const concesionario = concesionarios[id];
  if (concesionario) {
    res.json(concesionario.coches);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Añadir un coche a un concesionario por ID
app.post("/concesionarios/:id/coches", (req, res) => {
  const id = req.params.id;
  const concesionario = concesionarios[id];
  if (concesionario) {
    concesionario.coches.push(req.body);
    res.json({ message: "Coche añadido" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtener un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = req.params.id;
  const cocheId = req.params.cocheId;
  const concesionario = concesionarios[id];
  if (concesionario && concesionario.coches[cocheId]) {
    res.json(concesionario.coches[cocheId]);
  } else {
    res.status(404).json({ message: "Coche o concesionario no encontrado" });
  }
});

// Actualizar un coche específico de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = req.params.id;
  const cocheId = req.params.cocheId;
  const concesionario = concesionarios[id];
  if (concesionario && concesionario.coches[cocheId]) {
    concesionario.coches[cocheId] = req.body;
    res.json({ message: "Coche actualizado" });
  } else {
    res.status(404).json({ message: "Coche o concesionario no encontrado" });
  }
});

// Borrar un coche específico de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = req.params.id;
  const cocheId = req.params.cocheId;
  const concesionario = concesionarios[id];
  if (concesionario && concesionario.coches[cocheId]) {
    concesionario.coches = concesionario.coches.filter(
      (_, index) => index != cocheId
    );
    res.json({ message: "Coche eliminado" });
  } else {
    res.status(404).json({ message: "Coche o concesionario no encontrado" });
  }
});
