// Importamos las bibliotecas necesarias.
const express = require("express");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// URL de conexión a MongoDB
const uri = "mongodb+srv://aresdominguezgil:Monesterio95@cluster0.eorfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Configuración de cliente MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// Arrancamos la aplicación y conectamos con la base de datos
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  await client.connect();
  db = client.db("concesionarios");
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Obtener todos los concesionarios
app.get("/concesionarios", async (req, res) => {
  const concesionarios = await db.collection("concesionarios").find({}).toArray();
  res.json(concesionarios);
});

// Crear un nuevo concesionario
app.post("/concesionarios", async (req, res) => {
  const resultado = await db.collection("concesionarios").insertOne(req.body);
  res.json({ message: "Concesionario creado", concesionario: resultado.ops[0] });
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const concesionario = await db.collection("concesionarios").findOne({ _id: id });
  if (concesionario) {
    res.json(concesionario);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualizar un concesionario por ID
app.put("/concesionarios/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const resultado = await db.collection("concesionarios").updateOne(
    { _id: id },
    { $set: req.body }
  );
  if (resultado.matchedCount > 0) {
    res.json({ message: "Concesionario actualizado" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Borrar un concesionario por ID
app.delete("/concesionarios/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const resultado = await db.collection("concesionarios").deleteOne({ _id: id });
  if (resultado.deletedCount > 0) {
    res.json({ message: "Concesionario eliminado" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtener todos los coches de un concesionario por ID
app.get("/concesionarios/:id/coches", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const concesionario = await db.collection("concesionarios").findOne({ _id: id });
  if (concesionario) {
    res.json(concesionario.coches || []);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Añadir un coche a un concesionario por ID
app.post("/concesionarios/:id/coches", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const resultado = await db.collection("concesionarios").updateOne(
    { _id: id },
    { $push: { coches: req.body } }
  );
  if (resultado.matchedCount > 0) {
    res.json({ message: "Coche añadido" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtener un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const cocheId = req.params.cocheId;
  const concesionario = await db.collection("concesionarios").findOne({ _id: id });
  if (concesionario && concesionario.coches) {
    const coche = concesionario.coches[cocheId];
    if (coche) {
      res.json(coche);
    } else {
      res.status(404).json({ message: "Coche no encontrado" });
    }
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualizar un coche específico de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const cocheId = req.params.cocheId;
  const concesionario = await db.collection("concesionarios").findOne({ _id: id });
  if (concesionario && concesionario.coches) {
    concesionario.coches[cocheId] = req.body;
    await db.collection("concesionarios").updateOne(
      { _id: id },
      { $set: { coches: concesionario.coches } }
    );
    res.json({ message: "Coche actualizado" });
  } else {
    res.status(404).json({ message: "Concesionario o coche no encontrado" });
  }
});

// Borrar un coche específico de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const cocheId = req.params.cocheId;
  const concesionario = await db.collection("concesionarios").findOne({ _id: id });
  if (concesionario && concesionario.coches) {
    concesionario.coches = concesionario.coches.filter((_, index) => index != cocheId);
    await db.collection("concesionarios").updateOne(
      { _id: id },
      { $set: { coches: concesionario.coches } }
    );
    res.json({ message: "Coche eliminado" });
  } else {
    res.status(404).json({ message: "Concesionario o coche no encontrado" });
  }
});
