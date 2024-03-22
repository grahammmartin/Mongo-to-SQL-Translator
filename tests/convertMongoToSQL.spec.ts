import { convertMongoToSQL } from "../src/index";

describe("convertMongoToSQL", () => {
  it("converts MongoDB find query with $or operator to SQL", () => {
    const mongoQuery = `db.ticket.find({ $or: [{ status: "active" }, { status: "pending" }] });`;
    const expectedSQL = "SELECT * FROM ticket WHERE (status = 'active' OR status = 'pending');";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with $and operator to SQL", () => {
    const mongoQuery = `db.user.find({ $and: [{ age: { $gt: 18 } }, { status: "active" }] });`;
    const expectedSQL = "SELECT * FROM user WHERE (age > 18 AND status = 'active');";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with $lt operator to SQL", () => {
    const mongoQuery = "db.product.find({ price: { $lt: 100 } });";
    const expectedSQL = "SELECT * FROM product WHERE price < 100;";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with $lte operator to SQL", () => {
    const mongoQuery = "db.product.find({ price: { $lte: 200 } });";
    const expectedSQL = "SELECT * FROM product WHERE price <= 200;";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with $gt operator to SQL", () => {
    const mongoQuery = "db.product.find({ quantity: { $gt: 50 } });";
    const expectedSQL = "SELECT * FROM product WHERE quantity > 50;";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with $gte operator to SQL", () => {
    const mongoQuery = "db.product.find({ quantity: { $gte: 75 } });";
    const expectedSQL = "SELECT * FROM product WHERE quantity >= 75;";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with $ne operator to SQL", () => {
    const mongoQuery = "db.user.find({ status: { $ne: 'inactive' } });";
    const expectedSQL = "SELECT * FROM user WHERE status <> 'inactive';";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with $in operator to SQL", () => {
    const mongoQuery = "db.user.find({ role: { $in: ['admin', 'user'] } });";
    const expectedSQL = "SELECT * FROM user WHERE role IN ('admin', 'user');";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts a complex MongoDB find query with combination of $and and $or operators to SQL", () => {
    const mongoQuery = `db.user.find({
      $and: [
        { age: { $gte: 30 } },
        { $or: [{ status: "active" }, { role: "admin" }] }
      ]
    });`;
    const expectedSQL = "SELECT * FROM user WHERE (age >= 30 AND (status = 'active' OR role = 'admin'));";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });

  it("converts MongoDB find query with nested $in and $ne operators to SQL", () => {
    const mongoQuery = `db.product.find({
      $or: [
        { category: { $in: ['electronics', 'books'] } },
        { stock: { $ne: 0 } }
      ]
    });`;
    const expectedSQL = "SELECT * FROM product WHERE (category IN ('electronics', 'books') OR stock <> 0);";
    expect(convertMongoToSQL(mongoQuery)).toEqual(expectedSQL);
  });
});
