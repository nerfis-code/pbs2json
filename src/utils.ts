import { DefaultItem, DefaultMove, DefaultPokemonSpecies } from './types';
import stringify from "json-stringify-pretty-compact";
import fs from 'fs'
import { Config } from './main';


if (!fs.existsSync('PBS')) {
    { throw new Error('en: the PBS directory must exist; es: deberia existir una carpeta PBS') }
}

export function parse2Json(pbsName: string): void {
    const pbs = fs.readFileSync(`PBS/${pbsName}.txt`, { encoding: 'utf-8' })
    const res: { [k: string]: any } = {}
    let _default: any = null
    const temp: { [k: string]: any } = { 'pokemon': DefaultPokemonSpecies, 'moves': DefaultMove, 'items': DefaultItem }
    _default = temp[pbsName]
    if (_default == null) throw new Error("No existe esquema para este pbs " + pbsName)

    let curr: any = null
    for (const line of pbs.split('\n')) {
        if (line.startsWith('#')) continue
        if (line.startsWith('[')) {
            validatePBSObj(curr, pbsName)
            curr = structuredClone(_default)
            let key = Object.keys(_default)[0]
            curr[key] = line.replace('[', '').replace(']', '')
            res[curr[key]] = curr
            continue
        }
        const par = line.split('=')
        if (par.length < 2) continue
        const key = par[0].trim()
        const value = par[1].trim()

        let valueWithFormat = pbsParse(value)
        if (typeof curr[key] == 'object' && typeof valueWithFormat != 'object') {
            valueWithFormat = [valueWithFormat]
        }
        curr[key] = valueWithFormat
    }
    validatePBSObj(curr, pbsName)
    save(pbsName, res)
}

function validatePBSObj(obj: any, pbsName: string) {
    if (obj == null) return null
    switch (pbsName) {
        case 'pokemon':
            break
        case 'moves':
            break
        case 'items':
            obj["SellPrice"] = obj["Price"]
            if (obj["SellPrice"] == 0) {
            }
            break
        default:
            break
    }
    return obj
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

export function parseRegionalDexes() {
    const pbs = fs.readFileSync(`PBS/regional_dexes.txt`, { encoding: 'utf-8' })
    const res: { [k: number]: Array<string> } = {}
    let pokedex = 0
    for (let line of pbs.split('\n')) {
        line = line.trim()
        if (line.startsWith('#') || line.startsWith(' #')) continue
        if (line.startsWith('[')) {
            pokedex = parseInt(line.replace('[', '').replace(']', ''))
            res[pokedex] = []
            continue
        }
        const value = line
        res[pokedex].push(value)
    }
    fs.writeFileSync(`json/regional_dexes.json`, stringify(res, { maxLength: 80 }))
}

export function save(pbsName: string, obj: { [k: string]: any }) {

    if (Config.getInstance().betterMoveset && pbsName == 'pokemon') {
        for (let key of Object.keys(obj)) {
            let pkm = obj[key]
            const better_moveset = []
            for (let i = 0; i < pkm.Moves.length; i += 2) {
                const level = pkm.Moves[i]
                const moveName = pkm.Moves[i + 1]
                better_moveset.push({
                    [Config.getInstance().getKeyWithFormat('Level')]: level,
                    [Config.getInstance().getKeyWithFormat('Move')]: moveName
                })
            }
            pkm.Moves = better_moveset
        }
    }

    if (Config.getInstance().breakDown && pbsName == 'pokemon') {
        const MoveSets: { [k: string]: any } = {}
        for (let key of Object.keys(obj)) {
            const pkm = obj[key]
            MoveSets[pkm.ID] = {
                [Config.getInstance().getKeyWithFormat('Moves')]: pkm.Moves,
                [Config.getInstance().getKeyWithFormat('TutorMoves')]: pkm.TutorMoves,
                [Config.getInstance().getKeyWithFormat('EggMoves')]: pkm.EggMoves
            }
            pkm.Moves = undefined
            pkm.TutorMoves = undefined
            pkm.EggMoves = undefined

            fs.writeFileSync(`json/moveset.json`, stringify(MoveSets, { maxLength: 80 }))
        }
    }
    for (let key of Object.keys(obj)) {
        const newObj: { [k: string]: any } = {}
        const pkmn = obj[key]
        for (let att of Object.keys(pkmn)) {
            newObj[Config.getInstance().getKeyWithFormat(att)] = pkmn[att]
        }
        obj[key] = newObj
    }

    fs.writeFileSync(`json/${pbsName}.json`, stringify(obj, { maxLength: 80 }))
}

