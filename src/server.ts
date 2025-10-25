import express from "express";
import path from "path";
import si from "systeminformation";
import { tryOpenChromeOrDefault } from "./chromeLauncher";

const app = express();
const PORT = 3000;

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/info", async (_req, res) => {
  try {
    const [cpu, mem, memLayout, disks, fs, os] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.memLayout(),
      si.diskLayout(),
      si.fsSize(),
      si.osInfo(),
    ]);

    const info = {
      cpu,
      memory: { total: mem.total, layout: memLayout },
      disks,
      filesystems: fs,
      os,
    };

    res.json(info);
  } catch (error) {
    console.error("Erro ao coletar informações:", error);
    res.status(500).json({ error: "Erro ao coletar informações da máquina" });
  }
});

app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  await tryOpenChromeOrDefault(`http://localhost:${PORT}`);
});
