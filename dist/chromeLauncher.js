"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryOpenChromeOrDefault = tryOpenChromeOrDefault;
const open_1 = __importDefault(require("open"));
const os_1 = __importDefault(require("os"));
async function tryOpenChromeOrDefault(url) {
    try {
        const platform = os_1.default.platform();
        const chromePaths = platform === "win32"
            ? [
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            ]
            : ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
        let chromePath = chromePaths.find(path => {
            try {
                require("fs").accessSync(path);
                return true;
            }
            catch {
                return false;
            }
        });
        if (chromePath) {
            await (0, open_1.default)(url, { app: { name: chromePath } });
        }
        else {
            await (0, open_1.default)(url);
        }
    }
    catch (error) {
        console.error("Erro ao tentar abrir o navegador:", error);
        await (0, open_1.default)(url);
    }
}
