import { DefaultMove, DefaultPokemonSpecies } from './types';
import stringify from "json-stringify-pretty-compact";
import fs from 'fs'


if (!fs.existsSync('PBS')) {
    { throw new Error('en: the PBS directory must exist; es: deberia existir una carpeta PBS') }
}

export function parse2Json(pbsName: string): void {
    const pbs = fs.readFileSync(`PBS/${pbsName}.txt`, { encoding: 'utf-8' })
    const res: { [k: string]: any } = {}
    let _default: any = null
    switch (pbsName) {
        case 'pokemon':
            _default = DefaultPokemonSpecies
            break
        case 'moves':
            _default = DefaultMove
            break
        default:
            break
    }
    if (_default == null) throw new Error("No existe esquema para este pbs " + pbsName)
    let curr: any = null
    for (const line of pbs.split('\n')) {
        if (line.startsWith('#')) continue
        if (line.startsWith('[')) {
            curr = structuredClone(_default)
            const key = Object.keys(_default)[0]
            curr[key] = line.replace('[', '').replace(']', '')
            res[curr[key]] = curr
            continue
        }
        const par = line.split('=')
        if (par.length < 2) continue
        const key = par[0].trim()
        const value = par[1].trim()

        const valueWithFormat = pbsParse(value)
        if (typeof curr[key] == 'object' && typeof valueWithFormat != 'object') {
            curr[key] = [valueWithFormat]
        } else {
            curr[key] = valueWithFormat
        }
    }
    fs.writeFileSync(`json/${pbsName}.json`, stringify(res, { maxLength: 80 }))
}

const pbsParse = (value: string): string | number | Array<number | String> => {
    const ttoN = (value: string) => {
        const res = parseInt(value)
        return isNaN(res) ? value : res
    }
    if (value.includes(',')) {
        const list = value.split(',')
        return list.map((item: string) => ttoN(item))
    }
    return ttoN(value)
}


