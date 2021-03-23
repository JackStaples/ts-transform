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
