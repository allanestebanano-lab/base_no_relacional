import { connectMongo, closeMongo } from './connection.js';

let client;
try {
  ({ client } = await connectMongo());
  const admin = client.db('admin');
  const hello = await admin.command({ hello: 1 });
  const status = await admin.command({ replSetGetStatus: 1 });
  const primary = status.members?.find((member) => member.self)?.stateStr
    ?? status.members?.find((member) => member.name === hello.me)?.stateStr;
  if (hello.setName !== 'rs0' || hello.isWritablePrimary !== true || primary !== 'PRIMARY') {
    throw new Error(`Replica Set no está PRIMARY (setName=${hello.setName ?? 'ausente'}, isWritablePrimary=${hello.isWritablePrimary}, state=${primary ?? 'desconocido'}).`);
  }
  console.log(JSON.stringify({ connection: 'OK', setName: hello.setName, member: hello.me, state: primary }));
} catch (error) {
  console.error(`CHECK_FAILED: ${error.message}`);
  process.exitCode = 1;
} finally {
  await closeMongo(client);
}
