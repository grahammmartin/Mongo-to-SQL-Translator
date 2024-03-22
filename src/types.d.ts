export interface ImongoDBQueries extends Array<string> {}
export interface Part {
  field?: string | undefined;
  operator?: string;
  operand?: string | Array<string> | number;
  parts?: Array<Part> | [];
  implicitField?: string | undefined;
}

export interface IParsedQuery {
  parts: Array<Part>;
}

export interface IOperatorsDictionary {
  [key: string]: string;
}

export interface ISQLBuilder {
  selectClause: (string | undefined)[];
  fromClause: string;
  whereClause: Array<string> | any[];
}

export interface IQuerySimple {
  field: string;
  operator: string;
  operand: string;
}

export interface IQueryComplex {
  operand: string | IQuerySimple[] | any;
  operator: string | null;
  field: string | null;
}

export interface IQuerySimpleParsed {
  field: string;
  operator: string;
  operand: IParsedQuery[];
}

export interface IQueryComplexParsed {
  field: string | undefined;
  operator: string | undefined;
  operand: string | number | string[] | undefined;
}
