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
    const cpu = await si.cpu();
    const mem = await si.mem();
    const disk = await si.diskLayout();
    const os = await si.osInfo();

    const info = {
      cpu: `${cpu.brand} (${cpu.speed} GHz, ${cpu.cores} cores)`,
      memory: `${(mem.total / 1073741824).toFixed(2)} GB`,
      storage: disk.map(d => `${d.name} ${d.size / 1073741824} GB`).join(", "),
      os: `${os.distro} ${os.arch}`,
    };

    res.json(info);
  } catch (error) {
    res.status(500).json({ error: "Erro ao coletar informações da máquina" });
  }
});

app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  await tryOpenChromeOrDefault(`http://localhost:${PORT}`);
});
