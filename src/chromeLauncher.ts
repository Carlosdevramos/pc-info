import open from "open";
import os from "os";

export async function tryOpenChromeOrDefault(url: string) {
  try {
    const platform = os.platform();
    const chromePaths =
      platform === "win32"
        ? [
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          ]
        : ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];

    let chromePath = chromePaths.find(path => {
      try {
        require("fs").accessSync(path);
        return true;
      } catch {
        return false;
      }
    });

    if (chromePath) {
      await open(url, { app: { name: chromePath } });
    } else {
      await open(url);
    }
  } catch (error) {
    console.error("Erro ao tentar abrir o navegador:", error);
    await open(url);
  }
}
