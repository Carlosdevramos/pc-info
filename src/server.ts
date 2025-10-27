import express from "express";
import path from "path";
import si from "systeminformation";
import { tryOpenChromeOrDefault } from "./chromeLauncher";

const app = express();
const PORT = 3000;

// Detecta se está rodando dentro de um executável pkg
const isPkg = typeof (process as any).pkg !== "undefined";

// Caminho correto da pasta public (sem "dist" no modo .exe)
const publicDir = isPkg
  ? path.join(path.dirname(process.execPath), "public")
  : path.join(__dirname, "public");

app.use(express.static(publicDir));

// Endpoint com as informações do sistema
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

    res.json({
      cpu,
      memory: { total: mem.total, layout: memLayout },
      disks,
      filesystems: fs,
      os,
    });
  } catch (error) {
    console.error("Erro ao coletar informações:", error);
    res.status(500).json({ error: "Erro ao coletar informações da máquina" });
  }
});

// Serve o index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Inicializa o servidor e abre o navegador
app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  await tryOpenChromeOrDefault(`http://localhost:${PORT}`);
});