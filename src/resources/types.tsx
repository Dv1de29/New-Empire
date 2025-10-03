export interface CountrySliderValues{
    water : number,
    river : number,
    plain : number,
    mountain : number,
    desert : number,
    forest : number,
    ice : number,
}

export interface Empire{
    id: number,
    name: string,
    settings: CountrySliderValues
}

