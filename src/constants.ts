import { IOperatorsDictionary } from "./types";

export const MongoDBQuery: string = "NESTED_QUERY";
export const operatorsDictionary: IOperatorsDictionary = {
  $eq: "=",
  $or: "OR",
  $and: "AND",
  $lt: "<",
  $lte: "<=",
  $gt: ">",
  $gte: ">=",
  $ne: "<>",
  $in: "IN",
};
