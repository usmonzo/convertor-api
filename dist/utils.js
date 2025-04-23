import { readFileSync, writeFileSync } from "fs";
const FILE_PATH = "./data.json";
export function readData() {
    const raw = readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(raw);
}
export function writeData(data) {
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
