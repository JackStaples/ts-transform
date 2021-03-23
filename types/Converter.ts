type Converter<
  I extends Record<PropertyKey, unknown>,
  O extends Record<PropertyKey, unknown>,
> = {
  [P in keyof O]: (input: I) => O[P];
};

export default Converter;
