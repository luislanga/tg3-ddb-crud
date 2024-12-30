import { response } from "./utils/response";
import {
  create,
  update,
  getByEmail,
  fetchMany,
  deleteByEmail,
} from "./utils/dynamodb";
export const createUser = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const res = await create(body, "UsersTable");

    return {
      ...response.success,
      body: JSON.stringify(res),
    };
  } catch (error) {
    return {
      ...response.error,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

export const updateUser = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const res = await update(body, "UsersTable");

    return {
      ...response.success,
      body: JSON.stringify(res),
    };
  } catch (error) {
    return {
      ...response.error,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

export const getUser = async (event) => {
  try {
    const email = event.pathParameters?.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email parameter is required" }),
      };
    }

    const res = await getByEmail(email, "UsersTable");

    return {
      ...response.success,
      body: JSON.stringify(res),
    };
  } catch (error) {
    return {
      ...response.error,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

export const fetchUsers = async (event) => {
  try {
    const res = await fetchMany("UsersTable");
    return { ...response.success, body: JSON.stringify(res) };
  } catch (error) {
    console.log(error);
    return {
      ...response.error,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export const deleteUser = async (event) => {
  try {
    const email = event.pathParameters?.email;
    const res = await deleteByEmail(email, "UsersTable");
    return { ...response.success, body: JSON.stringify(res) };
  } catch (error) {
    console.log(error);
    return {
      ...response.error,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
