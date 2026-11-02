import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable requerida ${name}. Copia .env.example a .env y complétala.`);
  return value;
}

export const config = Object.freeze({
  uri: required('MONGODB_URI'),
  username: required('MONGO_ROOT_USERNAME'),
  password: required('MONGO_ROOT_PASSWORD'),
  databaseName: process.env.MONGODB_DATABASE || 'universidad_transacciones',
});

const uri = new URL(config.uri);
if (uri.searchParams.get('replicaSet') !== 'rs0') {
  throw new Error('MONGODB_URI debe incluir replicaSet=rs0.');
}
if (uri.searchParams.get('directConnection') !== 'true') {
  throw new Error('MONGODB_URI debe incluir directConnection=true para esta topología local.');
}
if (config.databaseName !== 'universidad_transacciones') {
  throw new Error('La práctica solo opera en universidad_transacciones.');
}
