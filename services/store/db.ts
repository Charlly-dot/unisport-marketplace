import { promises as fs } from "fs";
import path from "path";

const STORE_DIR = path.join(process.cwd(), "data", "store");

async function ensureStore() {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

export async function readCollection<T>(name: string, seed: T[]): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(STORE_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    await ensureStore();
    await writeCollection(name, seed);
    return seed;
  }
}

export async function writeCollection<T>(name: string, items: T[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(path.join(STORE_DIR, `${name}.json`), JSON.stringify(items, null, 2), "utf-8");
}
