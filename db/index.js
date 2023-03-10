// https://github.com/vitaly-t/pg-promise/issues/175
import pgPromise from 'pg-promise';

const pgp = pgPromise();

const createSingleton = (name, create) => {
  const s = Symbol.for(name);
  let scope = global[s];
  if (!scope) {
    scope = { ...create() };
    global[s] = scope;
  }
  return scope;
};

export const client = () => createSingleton('my-app-db-space', () => pgp(process.env.DATABASE_URL));
