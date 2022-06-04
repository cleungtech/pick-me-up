import { Datastore } from '@google-cloud/datastore'
const datastore = new Datastore();

// Get the Datastore key
const getKey = (kind, id=null) => {
  if (id)
    return datastore.key([kind, parseInt(id)]);

  return datastore.key(kind);
}

// Get the ID of an entity
const getId = (entity) => {
  return entity[Datastore.KEY].id;
}

// Create a Datastore Entity
const createEntity = (key, data) => {
  return { 
    key: key, 
    data: data 
  };
}

// Create and save an entity in Datastore
const create = async (kind, data) => {
  const key = getKey(kind);
  const newEntity = createEntity(key, data);
  await datastore.insert(newEntity);
  return key.id;
}

// // Get an entity by ID
// const view = async (kind, id) => {
//   const key = getKey(kind, id);
//   const [ entity ] = await datastore.get(key);
//   return entity;
// }

// Query all entities matching a particular attribute
const query = async (kind, attribute, value) => {
  const query = datastore.createQuery(kind).filter(attribute, '=', value);
  const [ entities ] = await datastore.runQuery(query);
  return entities;
}

// // Update an entity in Datastore
// const update = async (kind, data) => {
//   const id = data[Datastore.KEY].id;
//   const key = getKey(kind, id);
//   await datastore.save({ key: key, data: data });
// }

// // Remove an entity in datastore
// const remove = async (kind, id) => {
//   const key = getKey(kind, id);
//   await datastore.delete(key);
// }

export {
  getId,
  create,
  // view,
  // update,
  // remove,
  query
}