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
// Detecta se está rodando dentro de um executável pkg
const isPkg = typeof process.pkg !== "undefined";
// Caminho correto da pasta public (sem "dist" no modo .exe)
const publicDir = isPkg
    ? path_1.default.join(path_1.default.dirname(process.execPath), "public")
    : path_1.default.join(__dirname, "public");
app.use(express_1.default.static(publicDir));
// Endpoint com as informações do sistema
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
        res.json({
            cpu,
            memory: { total: mem.total, layout: memLayout },
            disks,
            filesystems: fs,
            os,
        });
    }
    catch (error) {
        console.error("Erro ao coletar informações:", error);
        res.status(500).json({ error: "Erro ao coletar informações da máquina" });
    }
});
// Serve o index.html
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(publicDir, "index.html"));
});
// Inicializa o servidor e abre o navegador
app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    await (0, chromeLauncher_1.tryOpenChromeOrDefault)(`http://localhost:${PORT}`);
});
