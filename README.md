# Mongo To SQL Translator
The MongoToSQLTranslator is a straightforward yet powerful TypeScript project that converts MongoDB find queries into SQL select statements. This translator solely supports the `db.find` method. It accommodates the following operators:

- $or
- $and
- $lt
- $lte
- $gt
- $gte
- $ne
- $in
- $eq

### Features:
- Capable of handling any combination of the supported operators within a single query.
- Does not support complex data types such as Date, ObjectId, etc.

### Steps to Run the app:

- Clone the repo.
- Run the `npm install` to install all the dependencies.
- Execute `npm start` to launch the project. The project includes some default MongoDB queries for demonstration. You can add your queries to the `sampleMongoDBQueries` array in `src/index.ts`.
- For Testing you can run the `npm test` command.

### Functions Description:
- `executeSampleQueries`: The primary function that converts MongoDB queries from the `sampleMongoDBQueries` array into SQL queries.
- `convertMongoToSQL`: Responsible for converting each MongoDB query into an SQL query. It parses the original query to generate **fromClause**, **whereClause**, and **selectClause**, then constructs the SQL query based on these clauses.
- `whereClauseGenerator`: Generates the WHERE clause for SQL queries.
- `selectClauseGenerator`: Generates the SELECT clause for SQL queries.
- `SQLBuilder`: Takes **fromClause**, **whereClause**, and **selectClause** as inputs and constructs a coherent SQL query.
