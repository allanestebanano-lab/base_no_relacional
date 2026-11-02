import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { connectMongo, closeMongo } from '../src/connection.js';
import { prepareFixtures } from '../src/fixtures.js';
import { runScenario } from '../src/transactions.js';

let client;
let db;

before(async () => {
  const connection = await connectMongo();
  client = connection.client;
  db = connection.db;
  const hello = await client.db('admin').command({ hello: 1 });
  assert.equal(hello.setName, 'rs0', 'MongoDB debe pertenecer al Replica Set rs0');
  assert.equal(hello.isWritablePrimary, true, 'el miembro debe estar PRIMARY');
  await prepareFixtures(db);
});

after(async () => {
  await closeMongo(client);
});

test('commit modifica stock y persiste exactamente una venta', async () => {
  const result = await runScenario(client, db, 'commit');
  assert.equal(result.finalStock, 8);
  assert.equal(result.observedSales, 1);
  assert.equal(result.transaction, 'committed');
});

test('abort revierte stock y no persiste la venta', async () => {
  const result = await runScenario(client, db, 'rollback');
  assert.equal(result.finalStock, 10);
  assert.equal(result.observedSales, 0);
  assert.equal(result.transaction, 'aborted');
});
