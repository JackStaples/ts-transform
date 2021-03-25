import Converter from "./types/Converter.ts";
type stringType = { a: string; b: string; c: string };
export default class Transformer<
  I extends Record<PropertyKey, unknown>,
  O extends Record<PropertyKey, unknown>,
> {
  private _converter;

  constructor(converter: Converter<I, O>) {
    this._converter = converter;
  }

  convertOne(input: I): O {
    const retVal = {} as O;
    const keys = Object.keys(this._converter) as Array<keyof Converter<I, O>>;
    for (const key of keys) {
      const func = this._converter[key];
      const val = func(input);
      retVal[key] = val;
    }
    return retVal;
  }

  convertMany(inputs: Array<I>): Array<O> {
    const retVal = [] as Array<O>;
    const keys = Object.keys(this._converter) as Array<keyof Converter<I, O>>;
    for (let i = 0; i < inputs.length; i++) {
      retVal[i] = {} as O;
      for (const key of keys) {
        const func = this._converter[key];
        const val = func(inputs[i]);
        retVal[i][key] = val;
      }
    }

    return retVal;
  }
}
