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
        const [cpu, mem, memLayout, disks, fs, os] = await Promise.all([
            systeminformation_1.default.cpu(),
            systeminformation_1.default.mem(),
            systeminformation_1.default.memLayout(),
            systeminformation_1.default.diskLayout(),
            systeminformation_1.default.fsSize(),
            systeminformation_1.default.osInfo(),
        ]);
        const info = {
            cpu,
            memory: { total: mem.total, layout: memLayout },
            disks,
            filesystems: fs,
            os,
        };
        res.json(info);
    }
    catch (error) {
        console.error("Erro ao coletar informações:", error);
        res.status(500).json({ error: "Erro ao coletar informações da máquina" });
    }
});
app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    await (0, chromeLauncher_1.tryOpenChromeOrDefault)(`http://localhost:${PORT}`);
});
