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
  try {
    await client.connect();
    db = client.db("concesionarios");
    console.log(`Servidor desplegado en puerto: ${port}`);
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
  }
});

// Validación de ObjectId
function validarObjectId(id) {
  return ObjectId.isValid(id);
}

// Obtener todos los concesionarios
app.get("/concesionarios", async (req, res) => {
  try {
    const concesionarios = await db.collection("concesionarios").find({}).toArray();
    res.json(concesionarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener concesionarios", error });
  }
});

// Crear un nuevo concesionario
app.post("/concesionarios", async (req, res) => {
  try {
    const resultado = await db.collection("concesionarios").insertOne(req.body);
    const concesionario = { _id: resultado.insertedId, ...req.body }; // Construimos el objeto con el ID insertado
    res.json({ message: "Concesionario creado", concesionario });
  } catch (error) {
    res.status(500).json({ message: "Error al crear concesionario", error });
  }
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const concesionario = await db.collection("concesionarios").findOne({ _id: new ObjectId(id) });
    if (concesionario) {
      res.json(concesionario);
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener concesionario", error });
  }
});

// Actualizar un concesionario por ID
app.put("/concesionarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const resultado = await db.collection("concesionarios").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (resultado.matchedCount > 0) {
      res.json({ message: "Concesionario actualizado" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar concesionario", error });
  }
});

// Borrar un concesionario por ID
app.delete("/concesionarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const resultado = await db.collection("concesionarios").deleteOne({ _id: new ObjectId(id) });
    if (resultado.deletedCount > 0) {
      res.json({ message: "Concesionario eliminado" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar concesionario", error });
  }
});

// Obtener todos los coches de un concesionario por ID
app.get("/concesionarios/:id/coches", async (req, res) => {
  try {
    const id = req.params.id;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const concesionario = await db.collection("concesionarios").findOne({ _id: new ObjectId(id) });
    if (concesionario) {
      res.json(concesionario.coches || []);
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener coches", error });
  }
});

// Añadir un coche a un concesionario por ID
app.post("/concesionarios/:id/coches", async (req, res) => {
  try {
    const id = req.params.id;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const resultado = await db.collection("concesionarios").updateOne(
      { _id: new ObjectId(id) },
      { $push: { coches: req.body } }
    );

    if (resultado.matchedCount > 0) {
      res.json({ message: "Coche añadido" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al añadir coche", error });
  }
});

// Obtener un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const id = req.params.id;
    const cocheId = req.params.cocheId;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const concesionario = await db.collection("concesionarios").findOne({ _id: new ObjectId(id) });
    if (concesionario && concesionario.coches) {
      const coche = concesionario.coches.find(c => c.id === cocheId);
      if (coche) {
        res.json(coche);
      } else {
        res.status(404).json({ message: "Coche no encontrado" });
      }
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener coche", error });
  }
});

// Actualizar un coche específico de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const id = req.params.id;
    const cocheId = req.params.cocheId;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const concesionario = await db.collection("concesionarios").findOne({ _id: new ObjectId(id) });
    if (concesionario && concesionario.coches) {
      concesionario.coches = concesionario.coches.map(c => (c.id === cocheId ? { ...c, ...req.body } : c));
      await db.collection("concesionarios").updateOne(
        { _id: new ObjectId(id) },
        { $set: { coches: concesionario.coches } }
      );
      res.json({ message: "Coche actualizado" });
    } else {
      res.status(404).json({ message: "Concesionario o coche no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar coche", error });
  }
});

// Borrar un coche específico de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const id = req.params.id;
    const cocheId = req.params.cocheId;
    if (!validarObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const concesionario = await db.collection("concesionarios").findOne({ _id: new ObjectId(id) });
    if (concesionario && concesionario.coches) {
      concesionario.coches = concesionario.coches.filter(c => c.id !== cocheId);
      await db.collection("concesionarios").updateOne(
        { _id: new ObjectId(id) },
        { $set: { coches: concesionario.coches } }
      );
      res.json({ message: "Coche eliminado" });
    } else {
      res.status(404).json({ message: "Concesionario o coche no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar coche", error });
  }
});
