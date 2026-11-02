import { MongoClient } from 'mongodb';
import { config } from './config.js';

export async function connectMongo() {
  const client = new MongoClient(config.uri, {
    auth: { username: config.username, password: config.password },
    appName: 'entregable-03-acid-lab',
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  return { client, db: client.db(config.databaseName) };
}

export async function closeMongo(client) {
  if (client) await client.close();
}
