import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', userRoutes);


let db;
async function initializeDatabase() {
    const { client, db: database } = await connectToDatabase();
    db = database;
}
initializeDatabase();
const PORT = 3000;

app.get('/profesori', async (req, res) => {
  try {
      const profesori_collection = db.collection('profesori');
      const profesori = await profesori_collection.find({}, { projection: { profesor: 1, fakultet: 1 } }).toArray();
      
      console.log("Dohvaćeni profesori:", profesori); 

      res.status(200).json(profesori);
  } catch (error) {
      console.error("Greška pri dohvaćanju profesora:", error);
      res.status(500).json({ error: "Interna greška servera" });
  }
});


app.get('/profesori/:id', async (req, res) => {
  try {
      let profesori_collection = db.collection('profesori');
      let komentari_collection = db.collection('komentari');

      let profesor = await profesori_collection.findOne({ _id: new ObjectId(req.params.id) });

      if (!profesor) {
          return res.status(404).json({ error: "Profesor nije pronađen" });
      }

      // Dohvati komentare tog profesora
      let komentari = await komentari_collection.find({ profesorId: req.params.id }).toArray();

      // Izračunaj prosječnu ocjenu
      let prosjecnaOcjena = 0;
      if (komentari.length > 0) {
          let suma = komentari.reduce((acc, komentar) => acc + komentar.ocjena, 0);
          prosjecnaOcjena = suma / komentari.length;
      }

      res.status(200).json({
          profesor: profesor.profesor,
          fakultet: profesor.fakultet,
          zvanje: profesor.zvanje,
          slika: profesor.slika,
          prijediplomski_kolegij: profesor.prijediplomski_kolegij || [],
          diplomski_kolegij: profesor.diplomski_kolegij || [],
          ocjena: prosjecnaOcjena.toFixed(1),
          komentari: komentari || []
      });
  } catch (error) {
      console.error("Greška pri dohvaćanju profesora:", error);
      res.status(500).json({ error: "Interna greška servera" });
  }
});

app.post('/komentari', async (req, res) => {
  try {
      const { profesorId, ocjena, tekst } = req.body;

      if (!profesorId || !ocjena || !tekst) {
          return res.status(400).json({ error: "Svi podaci su obavezni" });
      }

      const noviKomentar = {
          profesorId: profesorId,  // Spremi kao string, MongoDB _id je string
          ocjena: parseInt(ocjena),
          tekst: tekst
      };

      const result = await db.collection('komentari').insertOne(noviKomentar);
      res.status(201).json(noviKomentar);
  } catch (error) {
      console.error("Greška pri dodavanju komentara:", error);
      res.status(500).json({ error: "Interna greška servera" });
  }
});

// Dodaj komentar za profesora
app.post('/profesori/:id/komentari', async (req, res) => {
    const { ocjena, tekst } = req.body;
    if (!ocjena || !tekst) {
        return res.status(400).json({ error: "Svi podaci su obavezni" });
    }

    const noviKomentar = {
        profesorId: req.params.id,
        ocjena: parseInt(ocjena),
        tekst
    };

    try {
        await db.collection('komentari').insertOne(noviKomentar);
        res.json(noviKomentar);
    } catch (error) {
        console.error("Greška pri dodavanju komentara:", error);
        res.status(500).json({ error: "Interna greška servera" });
    }
});

app.use('/api', userRoutes);


app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});