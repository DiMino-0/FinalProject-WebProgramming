const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");
const TABLE_NAME = "DummyTableTest";

async function getAll() {
  const list = await connect().from(TABLE_NAME).select("*");
  if (list.error) {
    throw new CustomError(error.message, statusCodes.INTERNAL_SERVER_ERROR);
  }
  return list;
}

async function create(item) {
  const { data: newItem, error } = await connect()
    .from(TABLE_NAME)
    .insert(item);
  if (error) {
    throw error;
  }
  return {
    message: `Item with ID ${id} successfully created.`,
    data: newItem,
  };
}

async function update(id, item) {
  const { data: updatedItem, error } = await connect()
    .from(TABLE_NAME)
    .update(item)
    .eq("id", id);
  if (error) {
    throw error;
  }
  return {
    message: `Item with ID ${id} successfully updated.`,
    data: updatedItem,
  };
}

async function remove(id) {
  const { data: deletedItem, error } = await connect()
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);
  if (error) {
    throw error;
  }
  return {
    message: `Item with ID ${id} successfully deleted.`,
    data: deletedItem,
  };
}

module.exports = {
  getAll,
  create,
  update,
  remove,
};
