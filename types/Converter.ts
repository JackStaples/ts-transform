type Converter<I, O> = {
  [P in keyof O]: (input: I) => O[P];
};

export default Converter;
