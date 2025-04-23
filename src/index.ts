import express from "express";
import cors from "cors";
import { readFileSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "../data.json");

interface Entry {
  id: string;
  distance: number;
  fuel: number;
  comment?: string;
  date: string;
}

function readData(): Entry[] {
  const raw = readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: Entry[]) {
  writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Получение всех записей
app.get("/stats", (req, res) => {
  const data = readData();
  res.json(data);
});

// Добавление новой записи
app.post("/stats", (req, res) => {
  const body = req.body;
  if (typeof body.distance !== "number" || typeof body.fuel !== "number") {
    return res.status(400).json({ error: "Неверные данные" });
  }

  const newEntry: Entry = {
    id: randomUUID(),
    distance: body.distance,
    fuel: body.fuel,
    comment: body.comment,
    date: body.date || new Date().toISOString(),
  };

  const data = readData();
  data.push(newEntry);
  writeData(data);

  res.status(201).json(newEntry);
});

// Удаление по ID
app.delete("/stats/:id", (req, res) => {
  const data = readData();
  const updated = data.filter(entry => entry.id !== req.params.id);

  if (data.length === updated.length) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  writeData(updated);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Backend is running at http://localhost:${PORT}`);
});
