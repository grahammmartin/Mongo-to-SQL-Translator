const mongoParse = require("mongo-parse");
import { whereClauseGenerator, selectClauseGenerator, queryParser, SQLBuilder } from "./utils";
import { ImongoDBQueries } from "./types";

const sampleMongoDBQueries: ImongoDBQueries = [
  "db.user.find({name: 'john'});",
  "db.user.find({_id: 23113},{name: 1, age: 1})",
  "db.user.find({age: {$gte: 21}},{name: 1, _id: 1});",
  `db.ticket.find({
    $or: [
        { name: "t1" },
        { status: "active" }
    ]
    })`,
  `db.ticket.find({
        $and: [
            { name: "t1" },
            { status: "active" }
        ]
    })`,
  "db.user.find({ age: { $gte: 20 } })",
  "db.user.find({ age: { $ne: 20 } })",
  "db.user.find({ age: { $in: [18, 21,25] } })",
  `db.user.find({
    $or: [
      { age: { $gte: 18 } },
      {
        $and: [
          { status: "active" },
          { role: "admin" }
        ]
      }
    ]
  })
  `,
];

const executeSampleQueries = () => {
  sampleMongoDBQueries.forEach((query: string, index: number) => {
    try {
      console.log(`---------------------< Query : ${index + 1} >--------------------- \n`);
      console.log("Input :", query, "\n");
      console.log("Output :", convertMongoToSQL(query.trim()), "\n");
    } catch (error) {
      console.log("Error:", error);
    }
  });
};

executeSampleQueries();

export function convertMongoToSQL(input: string) {
  const { fromClause, query } = queryParser(input);

  const whereClause = whereClauseGenerator(mongoParse.parse(query[0]));
  const selectClause = selectClauseGenerator(mongoParse.parse(query[1]));

  const queryObj = {
    selectClause,
    fromClause,
    whereClause,
  };
  return SQLBuilder(queryObj);
}
