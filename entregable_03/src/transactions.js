import { LAB_TAG, STOCK_TO_SELL, scenarios } from './fixtures.js';

class ControlledRollback extends Error {
  constructor() {
    super('Fallo controlado solicitado para demostrar abortTransaction().');
    this.name = 'ControlledRollback';
  }
}

function assertInvariant(condition, message) {
  if (!condition) throw new Error(message);
}

export async function runScenario(client, db, mode) {
  const scenario = scenarios[mode];
  if (!scenario) throw new Error(`Escenario desconocido: ${mode}`);

  const products = db.collection('productos');
  const sales = db.collection('ventas');
  const session = client.startSession();
  let controlledErrorCaught = false;

  try {
    const initial = await products.findOne(
      { _id: scenario.sku, lab: LAB_TAG },
      { session },
    );
    assertInvariant(initial?.stock === 10, `${mode}: el stock inicial debe ser 10; prepara los datos con npm run seed.`);
    console.log(`${mode.toUpperCase()}_INITIAL ${JSON.stringify({ sku: scenario.sku, stock: initial.stock })}`);

    session.startTransaction();
    const update = await products.updateOne(
      { _id: scenario.sku, lab: LAB_TAG, stock: { $gte: STOCK_TO_SELL } },
      { $inc: { stock: -STOCK_TO_SELL } },
      { session },
    );
    assertInvariant(update.matchedCount === 1 && update.modifiedCount === 1,
      `${mode}: inventario insuficiente o el producto de laboratorio no existe.`);

    await sales.insertOne({
      _id: scenario.saleId,
      lab: LAB_TAG,
      scenario: scenario.key,
      sku: scenario.sku,
      quantity: STOCK_TO_SELL,
      total: 39.9,
      paid: true,
      createdAt: new Date(),
      items: [{ sku: scenario.sku, quantity: STOCK_TO_SELL, unitPrice: 19.95 }],
    }, { session });

    if (mode === 'rollback') throw new ControlledRollback();
    await session.commitTransaction();
    console.log('COMMIT_TRANSACTION confirmado.');
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    if (mode === 'rollback' && error instanceof ControlledRollback) {
      controlledErrorCaught = true;
      console.log(`CONTROLLED_ERROR capturado: ${error.message}`);
      console.log('ABORT_TRANSACTION ejecutado.');
    } else {
      throw error;
    }
  } finally {
    await session.endSession();
  }

  const product = await products.findOne({ _id: scenario.sku, lab: LAB_TAG });
  const saleCount = await sales.countDocuments({ _id: scenario.saleId, lab: LAB_TAG });
  const expectedStock = mode === 'commit' ? 8 : 10;
  const expectedSales = mode === 'commit' ? 1 : 0;
  assertInvariant(product?.stock === expectedStock,
    `${mode}: stock esperado ${expectedStock}, observado ${product?.stock}.`);
  assertInvariant(saleCount === expectedSales,
    `${mode}: ventas esperadas ${expectedSales}, observadas ${saleCount}.`);
  if (mode === 'rollback') assertInvariant(controlledErrorCaught, 'No se capturó el error controlado.');

  const result = {
    scenario: mode,
    initialStock: 10,
    finalStock: product.stock,
    expectedSales,
    observedSales: saleCount,
    transaction: mode === 'commit' ? 'committed' : 'aborted',
    invariant: 'PASS',
  };
  console.log(`${mode.toUpperCase()}_RESULT ${JSON.stringify(result)}`);
  return result;
}


