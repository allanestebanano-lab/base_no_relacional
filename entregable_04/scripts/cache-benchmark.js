import { readFileSync } from 'node:fs';
import { createConnection } from 'node:net';
import { once } from 'node:events';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const passwordFile = resolve(projectDir, 'secrets', 'redis_password.txt');
const password = readFileSync(passwordFile, 'utf8').trim();
if (!/^[A-Fa-f0-9_-]{32,}$/.test(password)) {
  throw new Error('El secreto local no cumple el formato esperado. No se imprime su contenido.');
}

function parseReply(buffer) {
  if (buffer.length < 3) return null;
  const marker = String.fromCharCode(buffer[0]);
  const lineEnd = buffer.indexOf('\r\n');
  if (lineEnd < 0) return null;
  const line = buffer.subarray(1, lineEnd).toString('utf8');
  if (marker === '+' || marker === '-' || marker === ':') {
    if (marker === '-') throw new Error(`Redis respondió error: ${line}`);
    return { value: marker === ':' ? Number(line) : line, bytes: lineEnd + 2 };
  }
  if (marker === '$') {
    const length = Number(line);
    if (length === -1) return { value: null, bytes: lineEnd + 2 };
    const end = lineEnd + 2 + length;
    if (buffer.length < end + 2) return null;
    return { value: buffer.subarray(lineEnd + 2, end).toString('utf8'), bytes: end + 2 };
  }
  throw new Error(`Tipo de respuesta RESP no soportado: ${marker}`);
}

function encodeCommand(parts) {
  const chunks = [`*${parts.length}\r\n`];
  for (const part of parts) {
    const value = String(part);
    chunks.push(`$${Buffer.byteLength(value)}\r\n${value}\r\n`);
  }
  return chunks.join('');
}

class RedisConnection {
  constructor() {
    this.socket = createConnection({ host: '127.0.0.1', port: Number(process.env.REDIS_PORT || 6379) });
    this.buffer = Buffer.alloc(0);
    this.pending = [];
    this.socket.on('data', (chunk) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this.drain();
    });
    this.socket.on('error', (error) => {
      for (const request of this.pending.splice(0)) request.reject(error);
    });
  }

  async connect() {
    await once(this.socket, 'connect');
    await this.command(['AUTH', 'default', password]);
  }

  drain() {
    while (this.pending.length > 0) {
      let parsed;
      try {
        parsed = parseReply(this.buffer);
      } catch (error) {
        this.pending.shift().reject(error);
        continue;
      }
      if (!parsed) return;
      this.buffer = this.buffer.subarray(parsed.bytes);
      this.pending.shift().resolve(parsed.value);
    }
  }

  command(parts) {
    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
      this.socket.write(encodeCommand(parts));
      this.drain();
    });
  }

  close() {
    this.socket.end();
  }
}

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const connection = new RedisConnection();
try {
  await connection.connect();
  const originKey = 'e04:cache:origen';
  const cacheKey = 'e04:cache:resultado';
  const originValue = JSON.stringify({ sku: 'CACHE-001', nombre: 'Producto para demo', precio: 24.5 });
  await connection.command(['SET', originKey, originValue]);
  await connection.command(['DEL', cacheKey]); // Solo elimina la clave temporal de cache de esta práctica.

  const originRead = async () => {
    await pause(40); // Latencia de origen simulada, explicada en el documento.
    return connection.command(['GET', originKey]);
  };
  const samples = 5;
  const noCacheTimes = [];
  for (let i = 0; i < samples; i += 1) {
    const start = performance.now();
    await originRead();
    noCacheTimes.push(performance.now() - start);
  }

  const missStart = performance.now();
  let cachedValue = await connection.command(['GET', cacheKey]);
  if (cachedValue === null) {
    cachedValue = await originRead();
    await connection.command(['SET', cacheKey, cachedValue, 'EX', 60]);
  }
  const cacheMissMs = performance.now() - missStart;

  const cacheHitTimes = [];
  for (let i = 0; i < samples; i += 1) {
    const start = performance.now();
    const value = await connection.command(['GET', cacheKey]);
    if (value === null) throw new Error('La clave cache desapareció antes de completar la medición.');
    cacheHitTimes.push(performance.now() - start);
  }

  const average = (values) => Number((values.reduce((sum, item) => sum + item, 0) / values.length).toFixed(3));
  console.log(JSON.stringify({
    keyPrefix: 'e04:',
    backendSimulation: 'Redis origin key plus fixed 40 ms delay; no external database is measured',
    samplesPerPath: samples,
    noCacheAverageMs: average(noCacheTimes),
    cacheMissMs: Number(cacheMissMs.toFixed(3)),
    cacheHitAverageMs: average(cacheHitTimes),
    note: 'Mediciones de esta ejecución; no se presupone ni se declara una mejora antes de observar los valores.',
  }, null, 2));
} finally {
  connection.close();
}
