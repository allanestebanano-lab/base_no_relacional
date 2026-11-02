import { connectMongo, closeMongo } from './connection.js';
import { prepareFixtures } from './fixtures.js';
import { runScenario } from './transactions.js';

let client;
try {
  const connection = await connectMongo();
  client = connection.client;
  const hello = await client.db('admin').command({ hello: 1 });
  if (hello.setName !== 'rs0' || hello.isWritablePrimary !== true) {
    throw new Error('El miembro rs0 no está PRIMARY. Ejecuta npm run check.');
  }
  await prepareFixtures(connection.db);
  console.log('Fixtures deterministas preparados para esta ejecución.');
  await runScenario(client, connection.db, 'commit');
  await runScenario(client, connection.db, 'rollback');
  console.log('DEMO_OK: commit y rollback comprobados mediante lecturas posteriores.');
} catch (error) {
  console.error(`DEMO_FAILED: ${error.message}`);
  process.exitCode = 1;
} finally {
  await closeMongo(client);
}
