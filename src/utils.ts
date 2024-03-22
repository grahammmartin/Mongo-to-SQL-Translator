import { Part, IParsedQuery, ISQLBuilder, IQuerySimple, IQueryComplex, IQuerySimpleParsed, IQueryComplexParsed } from "./types";
import { MongoDBQuery, operatorsDictionary } from "./constants";
const JSON5 = require("json5");
const mongoParse = require("mongo-parse");

export const parseJSON = (input: string) => {
  const obj = JSON5.parse(input);
  return obj;
};

export const queryParser = (input: string) => {
  if (input.length < 1) {
    throw new Error("Empty query");
  }
  let index = input.indexOf(".");
  if (index === -1) {
    throw new Error("Invalid format");
  }
  const prefix = input.slice(0, index);
  if (prefix !== "db") {
    throw new Error("Invalid format, Please start with db");
  }

  let rest = input.slice(index + 1);
  index = rest.indexOf(".");
  if (index === -1) {
    throw new Error("Invalid format");
  }
  const fromClause = rest.slice(0, index);
  if (fromClause.length < 1) {
    throw new Error("Invalid Collection");
  }

  rest = rest.slice(index + 1);
  index = rest.indexOf("(");
  const method = rest.slice(0, index);
  if (method !== "find") {
    throw new Error("Only find method is supported");
  }

  let lastChar = rest.length;
  if (rest[lastChar - 1] === ";") {
    lastChar -= 1;
  }
  const queryPart = rest.slice(index, lastChar);

  if (queryPart[0] !== "(" || queryPart[queryPart.length - 1] !== ")") {
    throw new Error("Invalid format, parenthesis incorrect");
  }

  const queryToJSON = "[" + queryPart.slice(1, queryPart.length - 1) + "]";
  const query = parseJSON(queryToJSON);
  return {
    fromClause,
    query,
  };
};

export const whereClauseGenerator = (input: IParsedQuery): (IQuerySimpleParsed | IQueryComplexParsed)[] => {
  const whereClause = input.parts.reduce((prev: (IQuerySimpleParsed | IQueryComplexParsed)[], curr: Part) => {
    const whereClausePart: IQuerySimpleParsed | IQueryComplexParsed = prepareWhereClause(curr);

    return [...prev, whereClausePart];
  }, []);
  return whereClause;
};

export const selectClauseGenerator = (input: IParsedQuery) => {
  const selectClause: (string | undefined)[] = input.parts.reduce((prev: (string | undefined)[], curr: Part) => {
    if (curr.operand === 1 && curr.field) {
      return [...prev, curr.field];
    } else {
      return prev;
    }
  }, []);
  return selectClause;
};

const prepareWhereClause = (input: Part) => {
  const { field, operator, operand } = input;

  if (typeof field === "undefined" && Array.isArray(operand) && typeof operator !== "undefined") {
    const nested: IParsedQuery[] = operand.reduce((prev: any, curr: string) => {
      const parsed = mongoParse.parse(curr);
      return [...prev, prepareWhereClause(parsed.parts[0])];
    }, []);

    return {
      field: MongoDBQuery,
      operator: operatorsDictionary[operator],
      operand: nested,
    };
  }
  return {
    field,
    operator: operator ? operatorsDictionary[operator] : undefined,
    operand,
  };
};

export const SQLBuilder = (queryObject: ISQLBuilder) => {
  const { selectClause, fromClause, whereClause } = queryObject;

  const whereClauseSQL = whereClause.reduce((prev: string, curr: any) => {
    const clause = whereBuilder(curr);
    return prev + (prev ? " AND " : "") + clause;
  }, "");

  const select = "SELECT " + (selectClause.length > 0 ? selectClause.join(", ") : "*");
  const from = "FROM " + fromClause;
  const where = "WHERE " + whereClauseSQL;

  return `${select} ${from} ${where};`;
};

const operandBuilder = (input: IQueryComplex) => {
  let { operand, operator, field } = input;
  if (typeof operand === "string") {
    return `'${operand}'`;
  } else if (field === MongoDBQuery) {
    return operand
      .reduce((prev: IQuerySimpleParsed[], curr: IQuerySimple) => {
        return [...prev, whereBuilder(curr)];
      }, [])
      .join(" " + operator + " ");
  } else if (operator === "IN") {
    operand = operand
      .map((op: string) => {
        const inp = {
          operand: op,
          operator: null,
          field: null,
        };
        return operandBuilder(inp);
      })
      .join(", ");

    return "(" + operand + ")";
  } else {
    return operand;
  }
};

export const whereBuilder = (input: IQuerySimple) => {
  const { field, operator, operand } = input;
  let inp = { operand, operator, field };

  if (field === MongoDBQuery) {
    return `(${operandBuilder(inp)})`;
  } else {
    return `${field} ${operator} ${operandBuilder(inp)}`;
  }
};
