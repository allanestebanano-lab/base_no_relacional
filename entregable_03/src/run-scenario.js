import { connectMongo, closeMongo } from './connection.js';
import { runScenario } from './transactions.js';

const mode = process.argv[2];
if (!['commit', 'rollback'].includes(mode)) {
  console.error('Uso: node src/run-scenario.js <commit|rollback>. Ejecuta npm run seed primero.');
  process.exit(2);
}

let client;
try {
  const connection = await connectMongo();
  client = connection.client;
  const hello = await client.db('admin').command({ hello: 1 });
  if (hello.setName !== 'rs0' || hello.isWritablePrimary !== true) {
    throw new Error('El miembro rs0 no está PRIMARY. Ejecuta npm run check.');
  }
  await runScenario(client, connection.db, mode);
} catch (error) {
  console.error(`${mode.toUpperCase()}_FAILED: ${error.message}`);
  process.exitCode = 1;
} finally {
  await closeMongo(client);
}
