import { Datastore } from '@google-cloud/datastore';
import { API_URL } from '../constants.js';
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

// Get an entity by ID
const view = async (kind, id) => {
  const key = getKey(kind, id);
  const [ entity ] = await datastore.get(key);
  return entity;
}

// Get all entities (with pagination)
const viewAll = async (kind, numPerPage, pageCursor) => {

  const count = (await queryAll(kind)).length;

  let query = datastore.createQuery(kind).limit(numPerPage);
  if (pageCursor) {
    query = query.start(decodeURIComponent(pageCursor));
  }
  const [ entities, info ] = await datastore.runQuery(query);

  const results = { total: count };
  results[`${kind}s`] = entities.map(entity => 
    displayEntity(getId(entity), entity, kind)
  );

  if (info.moreResults === 'MORE_RESULTS_AFTER_LIMIT') {
    results.next = getNextUrl(kind, info.endCursor);
  }

  return results;
}

// Query all entities matching a particular attribute
const queryAll = async (kind, attribute, value) => {

  let query = datastore.createQuery(kind);
  if (attribute && value)
    query = query.filter(attribute, '=', value);
  
  const [ entities ] = await datastore.runQuery(query);
  return entities;
}

// Update an entity in Datastore
const update = async (kind, data) => {
  const id = data[Datastore.KEY].id;
  const key = getKey(kind, id);
  await datastore.save({ key: key, data: data });
}

// Remove an entity in datastore
const remove = async (kind, id) => {
  const key = getKey(kind, id);
  return (await datastore.delete(key))[0].indexUpdates > 0;
}

const displayEntity = (id, data, kind) => {

  const entityId = {};
  entityId[`${kind}Id`] = id;

  return {
    ...entityId,
    ...data,
    self: `${API_URL}${kind}s/${id}`
  }
}

const getNextUrl = (kind, endCursor) => {
  let nextUrl = `${API_URL}${kind}s`;
  nextUrl += `?cursor=${encodeURIComponent(endCursor)}`;
  return nextUrl;
}

export {
  getId,
  create,
  view,
  viewAll,
  update,
  remove,
  queryAll,
  displayEntity,
}