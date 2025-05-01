const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");

const TABLE_NAME = "comments";

const BaseQuery = () => connect().from(TABLE_NAME).select("*");

async function getAll(limit = 30, offset = 0, sort = "id", order = "desc") {
  const list = await BaseQuery()
    .order(sort, { ascending: order === "asc" })
    .range(offset, offset + limit - 1); // 0 based index but range is inclusive
  if (list.error) {
    throw list.error;
  }
  return {
    items: list.data,
    total: list.count,
  };
}

async function get(id) {
  const { data: item, error } = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id);
  if (!item.length) {
    throw new CustomError("Friend not found", statusCodes.NOT_FOUND);
  }
  if (error) {
    throw error;
  }
  return item[0];
}

async function create(item) {
  const { data: newItem, error } = await connect()
    .from(TABLE_NAME)
    .insert(item)
    .select("*");
  if (error) {
    throw error;
  }
  return newItem;
}

async function update(id, item) {
  const { data: updatedItem, error } = await connect()
    .from(TABLE_NAME)
    .update(item)
    .eq("id", id)
    .select("*");
  if (error) {
    throw error;
  }
  return updatedItem;
}

async function remove(id) {
  const { data: deletedItem, error } = await connect()
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);
  if (error) {
    throw error;
  }
  return deletedItem;
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
};
