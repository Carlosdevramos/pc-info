"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const systeminformation_1 = __importDefault(require("systeminformation"));
const chromeLauncher_1 = require("./chromeLauncher");
const app = (0, express_1.default)();
const PORT = 3000;
// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/api/info", async (_req, res) => {
    try {
        const cpu = await systeminformation_1.default.cpu();
        const mem = await systeminformation_1.default.mem();
        const disk = await systeminformation_1.default.diskLayout();
        const os = await systeminformation_1.default.osInfo();
        const info = {
            cpu: `${cpu.brand} (${cpu.speed} GHz, ${cpu.cores} cores)`,
            memory: `${(mem.total / 1073741824).toFixed(2)} GB`,
            storage: disk.map(d => `${d.name} ${d.size / 1073741824} GB`).join(", "),
            os: `${os.distro} ${os.arch}`,
        };
        res.json(info);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao coletar informações da máquina" });
    }
});
app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    await (0, chromeLauncher_1.tryOpenChromeOrDefault)(`http://localhost:${PORT}`);
});
