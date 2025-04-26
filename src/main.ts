import { PokemonSpecies } from './types';
import stringify from "json-stringify-pretty-compact";
import fs from 'fs'

const DefaultPokemonSpecies: PokemonSpecies = {
    ID: '',
    Name: '',
    Types: [],
    BaseStats: [],
    GenderRatio: 'Genderless',
    GrowthRate: 'MediumFast',
    BaseExp: 1,
    EVs: [],
    CatchRate: 45,
    Happiness: 70,
    Abilities: [],
    HiddenAbilities: [],
    Moves: [],
    TutorMoves: [],
    EggMoves: [],
    EggGroups: [],
    HatchSteps: 1,
    Offspring: [],
    Height: 0.1,
    Weight: 0.1,
    Color: 'Red',
    Shape: 'Head',
    Category: '',
    Pokedex: '',
    Flags: [],
    Evolutions: [],
    Incense: '',
    Habitat: '',
    Generation: 1,
    FormName: '',
};
const toN = (value: string) => Number(value)
const ttoN = (value: string) => {
    try { return parseInt(value) }
    catch (error) { return value }
}
const toL = (value: string) => value.split(',')
const scheme: { [k: string]: (arg0: string) => any } = {
    'BaseStats': (value: string) => { return value.split(',').map(Number) },
    'BaseExp': toN,
    'EVs': (value: string) => { return value.split(',').map((item, i) => (i + 1) % 2 == 0 ? Number(item) : item) },
    'CatchRate': toN,
    'Happiness': toN,
    'Moves': (value: string) => { return value.split(',').map((item, i) => (i + 1) % 2 == 0 ? item : Number(item)) },
    'HatchSteps': toN,
    'Height': toN,
    'Weight': toN,
    'Generation': toN,
    'Evolutions': (value: string) => { return value.split(',').map((item, i) => (i + 1) % 3 == 0 ? ttoN(item) : item) },
    'Types': toL,
    'Abilities': toL,
    'HiddenAbilities': toL,
    'TutorMoves': toL,
    'EggMoves': toL,
    'EggGroups': toL,
    'Offspring': toL,
    'Flags': toL,
}
if (!fs.existsSync('PBS')) {
    { throw new Error('en: the PBS directory must exist; es: deberia existir una carpeta PBS') }
}
const pokemonTxt = fs.readFileSync('PBS/pokemon.txt', { encoding: 'utf-8' })
const species: { [k: string]: PokemonSpecies } = {}
let curr: any = structuredClone(DefaultPokemonSpecies)

for (const line of pokemonTxt.split('\n')) {
    if (line.startsWith('#')) continue
    if (line.startsWith('[')) {
        if (curr.ID.length != 0) species[curr.ID] = curr
        curr = structuredClone(DefaultPokemonSpecies)
        curr.ID = line.replace('[', '').replace(']', '')
        continue
    }
    const par = line.split('=')
    const key = par[0].trim()
    const value = par[1].trim()
    if (key in scheme) {
        curr[key] = scheme[key](value)
    } else {
        curr[key] = value
    }
}
fs.writeFileSync('json/species.json', stringify(species, { maxLength: 80 }))
