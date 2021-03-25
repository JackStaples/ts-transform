import Transformer from "../Transformer.ts";
import Converter from "../types/Converter.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

type stringType = { a: string; b: string; c: string };
type numberType = { a: number; b: number; c: number };
type mixedType = { a: string; b: numberType; c: boolean };

Deno.test("It can convert between a string object and a number object", () => {
  const stringToNumber: Converter<stringType, numberType> = {
    a: (input: stringType) => Number.parseInt(input.a),
    b: (input: stringType) => Number.parseInt(input.b),
    c: (input: stringType) => Number.parseInt(input.c),
  };
  const input = { a: "22", b: "33", c: "44" };
  const transformer = new Transformer(stringToNumber);
  const output = transformer.convertOne(input);
  assertEquals(output, { a: 22, b: 33, c: 44 });
});

Deno.test("It can convert to multiple different types", () => {
  const numberToMixed: Converter<numberType, mixedType> = {
    a: (input) => String(input.a),
    b: (input) => input,
    c: (input) => input.c === 3,
  };
  const input = { a: 22, b: 33, c: 44 };
  const transformer = new Transformer(numberToMixed);
  const output = transformer.convertOne(input);
  assertEquals(output, { a: String(input.a), b: input, c: input.c === 3 });
});

Deno.test("It can use multiple values from input in transformation", () => {
  const numberToNumber: Converter<numberType, numberType> = {
    a: (input) => input.a + input.b,
    b: (input) => input.b + input.c,
    c: (input) => input.c + input.a,
  };
  const input = { a: 22, b: 33, c: 44 };
  const transformer = new Transformer(numberToNumber);
  const output = transformer.convertOne(input);
  assertEquals(output, {
    a: input.a + input.b,
    b: input.b + input.c,
    c: input.c + input.a,
  });
});

Deno.test("It can convert multiple objects", () => {
  type simpleIn = {
    a: string;
  };
  type simpleOut = {
    a: string;
  };
  const converter: Converter<simpleIn, simpleOut> = {
    a: (input: simpleIn) => "world",
  };
  const input = [
    { a: "hello" },
    { a: "hello" },
    { a: "hello" },
  ];
  const transformer = new Transformer(converter);
  const output = transformer.convertMany(input);
  const expected = [
    { a: "world" },
    { a: "world" },
    { a: "world" },
  ];
  assertEquals(expected, output);
});

Deno.test("It can convert many objects", () => {
  type simpleIn = {
    a: string;
  };
  type simpleOut = {
    a: string;
  };
  const converter: Converter<simpleIn, simpleOut> = {
    a: (input: simpleIn) => "world",
  };
  const input: Array<simpleIn> = [];
  const expected: Array<simpleOut> = [];
  for (let i = 0; i < 1000000; i++) {
    input.push({
      a: "hello",
    });
    expected.push({
      a: "world",
    });
  }
  const transformer = new Transformer(converter);
  const output = transformer.convertMany(input);
  assertEquals(expected, output);
});
