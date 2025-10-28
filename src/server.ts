import express from "express";
import path from "path";
import si from "systeminformation";
import { tryOpenChromeOrDefault } from "./chromeLauncher";

const app = express();
const PORT = 3000;

// Detecta se está rodando dentro de um executável pkg
const isPkg = typeof (process as any).pkg !== "undefined";

// --- CORREÇÃO AQUI ---
// No modo PKG, 'public' é acessado diretamente via __dirname, 
// pois o PKG configura __dirname para apontar para a raiz dos assets virtuais.
// Em modo DEV, __dirname aponta para 'dist', e 'public' está dentro de 'dist'.
const publicDir = isPkg
  ? path.join(__dirname, "public") // Simplesmente use __dirname/public para acessar o asset virtual
  : path.join(__dirname, "public"); // Mantém igual para DEV (já que public está em dist/public)

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
  // Certifique-se de que tryOpenChromeOrDefault está lidando com o 'open' corretamente
  // e que 'open' está instalado (já está em suas dependências).
  await tryOpenChromeOrDefault(`http://localhost:${PORT}`);
});
