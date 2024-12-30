import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const create = async (item, tableName) => {
  try {
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        email: item.email,
      },
    });

    const userExists = await docClient.send(getCommand);

    if (userExists.Item) {
      throw new Error("User already exists");  
    }

    const timestamp = new Date().toISOString();

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        ...item,
        createdAt: timestamp,
      },
    });

    const res = await docClient.send(putCommand);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const update = async (item, tableName) => {
  try {
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        email: item.email,
      },
    });
  
    const userExists = await docClient.send(getCommand);
  
    if (!userExists.Item) {
      throw new Error("User does not exist");
    }

    // implement whitelist/blacklist for desired fields, eg: const allowedFields = ['name', 'age', 'country']; 

    const updateExpression: string[] = [];
    const expressionValues = {};

    Object.keys(item).forEach((key) => {
      if (key !== 'email') {                          //check whitelist, eg: if (allowedFields.includes(key)) {
        updateExpression.push(`${key} = :${key}`);
        expressionValues[`:${key}`] = item[key];
      }
    });

    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: {
        email: item.email,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionValues,
    });
    
    const res = await docClient.send(updateCommand);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getByEmail = async (email, tableName) => {
  try{
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        email: email,
      },
    })

    const {Item: user} = await docClient.send(getCommand);

    if (!user?.email) {
      throw new Error("User does not exist"); 
    }

    return user;
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchMany = async (tableName) => {
  try{
    const scanCommand = new ScanCommand({
      TableName: tableName,
    })
    const result = await docClient.send(scanCommand);

    return result.Items
  } 

  catch (error){
    console.log(error)
    throw new Error("Error fetching users")
  }
 }

 export const deleteByEmail = async (email, tableName) => {
   try{
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        email: email,
      },
    })

    const {Item: user} = await docClient.send(getCommand);

    if (!user?.email) {
      throw new Error("User does not exist"); 
    }
     const deleteCommand = new DeleteCommand({
       TableName: tableName,
       Key: {
         email: email,
       },
     })
     const res = await docClient.send(deleteCommand);
     return res
   }
   catch (error){
    console.log(error)
    throw new Error("Error deleting user")
   }
 }