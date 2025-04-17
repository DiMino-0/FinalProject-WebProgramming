const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");
const TABLE_NAME = "DummyTableTest";

async function getAll() {
  const list = await connect().from(TABLE_NAME).select("*");
  if (list.error) {
    throw new CustomError(error.message, statusCodes.INTERNAL_SERVER_ERROR);
  }
  return {
    data: list.data,
  };
}

async function create(item) {
  const { data: newItem, error } = await connect()
    .from(TABLE_NAME)
    .insert(item);
  if (error) {
    throw error;
  }
  return newItem;
}

module.exports = {
  getAll,
  create,
};
