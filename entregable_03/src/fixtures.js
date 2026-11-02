export const LAB_TAG = 'entregable-03';
export const STOCK_TO_SELL = 2;

export const scenarios = Object.freeze({
  commit: Object.freeze({
    key: 'acid-commit-v1',
    sku: 'ACID-COMMIT-001',
    saleId: 'sale:acid-commit-v1',
    name: 'Producto de prueba: commit',
  }),
  rollback: Object.freeze({
    key: 'acid-rollback-v1',
    sku: 'ACID-ROLLBACK-001',
    saleId: 'sale:acid-rollback-v1',
    name: 'Producto de prueba: rollback',
  }),
});

export async function prepareFixtures(db) {
  const products = db.collection('productos');
  const sales = db.collection('ventas');
  const ownedSaleIds = Object.values(scenarios).map(({ saleId }) => saleId);

  for (const name of ['productos', 'ventas']) {
    const exists = await db.listCollections({ name }, { nameOnly: true }).hasNext();
    if (!exists) await db.createCollection(name);
  }

  // Elimina únicamente las dos ventas deterministas que pertenecen a esta práctica.
  await sales.deleteMany({ _id: { $in: ownedSaleIds }, lab: LAB_TAG });

  for (const scenario of Object.values(scenarios)) {
    await products.updateOne(
      { _id: scenario.sku, lab: LAB_TAG },
      {
        $set: {
          name: scenario.name,
          category: 'laboratorio',
          price: 19.95,
          stock: 10,
          active: true,
          tags: ['transacciones', 'prueba'],
          details: { scenario: scenario.key, currency: 'USD' },
          lab: LAB_TAG,
        },
      },
      { upsert: true },
    );
  }
}

