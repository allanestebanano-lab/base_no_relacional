import { connectMongo, closeMongo } from './connection.js';
import { prepareFixtures } from './fixtures.js';

let client;
try {
  const connection = await connectMongo();
  client = connection.client;
  const hello = await client.db('admin').command({ hello: 1 });
  if (hello.setName !== 'rs0' || hello.isWritablePrimary !== true) {
    throw new Error('El miembro rs0 no está PRIMARY. Ejecuta npm run check antes de preparar datos.');
  }
  await prepareFixtures(connection.db);
  console.log('SEED_OK: fixtures exclusivos de entregable-03 preparados; stock inicial 10 y ventas previas del laboratorio retiradas.');
} catch (error) {
  console.error(`SEED_FAILED: ${error.message}`);
  process.exitCode = 1;
} finally {
  await closeMongo(client);
}

