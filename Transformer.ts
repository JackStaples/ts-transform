import Converter from "./types/Converter.ts";
export default class Transformer<
  I extends Record<PropertyKey, unknown>,
  O extends Record<PropertyKey, unknown>,
> {
  private _converter;
  private _keys: Array<keyof Converter<I, O>>;

  constructor(converter: Converter<I, O>) {
    this._converter = converter;
    this._keys = Object.keys(this._converter);
  }

  convertOne(input: I): O {
    const retVal = {} as O;
    for (const key of this._keys) {
      retVal[key] = this._getTransformedValue(input, key);
    }
    return retVal;
  }

  convertMany(inputs: Array<I>): Array<O> {
    const retVal = [] as Array<O>;
    for (let i = 0; i < inputs.length; i++) {
      retVal[i] = this.convertOne(inputs[i]);
    }
    return retVal;
  }

  private _getTransformedValue(input: I, key: keyof O) {
    const func = this._converter[key];
    return func(input);
  }
}
