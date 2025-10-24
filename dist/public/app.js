"use strict";
async function fetchInfo() {
    const res = await fetch("/api/info");
    if (!res.ok)
        throw new Error("Erro ao buscar info: " + res.statusText);
    const data = await res.json();
    return data;
}
function humanBytes(n) {
    if (!n && n !== 0)
        return "Desconhecido";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let value = n;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(2)} ${units[i]}`;
}
function render(data) {
    const el = document.getElementById("content");
    el.innerHTML = "";
    const cpuBox = document.createElement("div");
    cpuBox.innerHTML = `<h3>CPU</h3>
    <div class="kv"><div class="k">Marca/Modelo</div><div class="v">${data.cpu.manufacturer} ${data.cpu.brand}</div></div>
    <div class="kv"><div class="k">Velocidade</div><div class="v">${data.cpu.speed} GHz</div></div>
    <div class="kv"><div class="k">Cores / Físicos</div><div class="v">${data.cpu.cores} / ${data.cpu.physicalCores}</div></div>`;
    el.appendChild(cpuBox);
    const memBox = document.createElement("div");
    memBox.innerHTML = `<h3>Memória</h3>
    <div class="kv"><div class="k">Total</div><div class="v">${humanBytes(data.memory.total)}</div></div>`;
    const memList = document.createElement("div");
    memList.innerHTML = `<h4>Pentes</h4>`;
    data.memory.layout.forEach((m, idx) => {
        const item = document.createElement("div");
        item.className = "kv";
        item.innerHTML = `<div class="k">Slot ${m.bank || idx}</div>
      <div class="v">${m.size ? humanBytes(m.size) : "Desconhecido"} — ${m.type || ""} — ${m.clockSpeed ? m.clockSpeed + " MHz" : ""} ${m.partNum ? " — " + m.partNum : ""}</div>`;
        memList.appendChild(item);
    });
    el.appendChild(memBox);
    el.appendChild(memList);
    const diskBox = document.createElement("div");
    diskBox.innerHTML = `<h3>Discos</h3>`;
    data.disks.forEach((d) => {
        const item = document.createElement("div");
        item.className = "kv";
        item.innerHTML = `<div class="k">${d.name || d.vendor || d.interfaceType}</div>
      <div class="v">${d.type || "Desconhecido"} — ${d.interfaceType || ""} — ${d.size ? humanBytes(d.size) : "Desconhecido"}</div>`;
        diskBox.appendChild(item);
    });
    el.appendChild(diskBox);
    const fsBox = document.createElement("div");
    fsBox.innerHTML = `<h3>Filesystems</h3>`;
    data.filesystems.forEach((f) => {
        const item = document.createElement("div");
        item.className = "kv";
        item.innerHTML = `<div class="k">${f.mount}</div><div class="v">${f.fs} — ${f.type} — ${humanBytes(f.size)}</div>`;
        fsBox.appendChild(item);
    });
    el.appendChild(fsBox);
    const osBox = document.createElement("div");
    osBox.innerHTML = `<h3>Sistema Operacional</h3>
    <div class="kv"><div class="k">Distro</div><div class="v">${data.os.distro} ${data.os.release}</div></div>
    <div class="kv"><div class="k">Plataforma</div><div class="v">${data.os.platform} — ${data.os.arch}</div></div>`;
    el.appendChild(osBox);
}
async function loadAndRender() {
    const btn = document.getElementById("refresh");
    btn.disabled = true;
    btn.textContent = "Carregando...";
    try {
        const info = await fetchInfo();
        render(info);
    }
    catch (e) {
        document.getElementById("content").innerHTML = `<pre>${String(e)}</pre>`;
    }
    finally {
        btn.disabled = false;
        btn.textContent = "Atualizar";
    }
}
document.getElementById("refresh").addEventListener("click", () => loadAndRender());
loadAndRender();
