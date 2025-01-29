import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db.js';
import { ObjectId } from 'mongodb';
const app = express();
app.use(express.json());
app.use(cors());
const db = await connectToDatabase();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Spremni za autentifikaciju!');
});



app.get('/profesori/:id', async (req, res) => {
    try {
        let profesori_collection = db.collection('profesori');
        let profesor = await profesori_collection.findOne({ _id: new ObjectId(req.params.id) });

        if (!profesor) {
            return res.status(404).json({ error: "Profesor nije pronađen" });
        }

        res.status(200).json(profesor);
    } catch (error) {
        console.error("Greška pri dohvaćanju profesora:", error);
        res.status(500).json({ error: "Interna greška servera" });
    }
});

app.get('/profesori', async (req, res) => {
    let profesori_collection = db.collection('profesori');
    let naziv_param = req.params.naziv;
    let profesori = await profesori_collection.find().toArray();
    console.log(profesori);
  
    res.status(200).json(profesori);
  });

  
  

  app.get('/komentari', async (req, res) => {
    const { profesorId } = req.query;
    if (!profesorId) {
      return res.status(400).json({ error: "profesorId je obavezan" });
    }
  
    const komentari = await db.collection('komentari').find({ profesorId }).toArray();
    res.json(komentari);
  });
  
  app.post('/komentari', async (req, res) => {
    const { profesorId, ocjena, tekst } = req.body;
    if (!profesorId || !ocjena || !tekst) {
      return res.status(400).json({ error: "Svi podaci su obavezni" });
    }
  
    const noviKomentar = { profesorId, ocjena: parseInt(ocjena), tekst };
    await db.collection('komentari').insertOne(noviKomentar);
    res.json(noviKomentar);
  });

app.listen(PORT, () => {
  console.log(`Poslužitelj dela na portu ${PORT}`);
});