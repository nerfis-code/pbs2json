import { DefaultItem, DefaultMove, DefaultPokemonSpecies } from './types';
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
            _default = DefaultPokemonSpecies // national pokedex
            break
        case 'moves':
            _default = DefaultMove
            break
        case 'items':
            _default = DefaultItem
            break
        default:
            break
    }
    if (_default == null) throw new Error("No existe esquema para este pbs " + pbsName)
    let curr: any = null
    for (const line of pbs.split('\n')) {
        if (line.startsWith('#')) continue
        if (line.startsWith('[')) {
            validatePBSObj(curr, pbsName)
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
    for (let i = 2; i < process.argv.length; i++) {
        const prop = process.argv[i]
        switch (prop) {
            case 'snake_case':
                for (let key of Object.keys(obj)) {
                    obj[key] = objKey2SnakeCase(obj[key])
                }
                break
            case 'better_moveset':
                if (pbsName != 'pokemon') break
                for (let key of Object.keys(obj)) {
                    let pkm = obj[key]
                    const better_moveset = []
                    for (let i = 0; i < pkm.moves.length; i += 2) {
                        const level = pkm.moves[i]
                        const moveName = pkm.moves[i + 1]
                        process.argv.includes('snake_case')
                            ? better_moveset.push({ learned_at: level, move: moveName })
                            : better_moveset.push({ LearnedAt: level, Move: moveName })
                    }
                    pkm.moves = better_moveset
                }

                break
            case 'break_up':
                if (pbsName != 'pokemon') break
                const MoveSets: { [k: string]: any } = {}
                for (let key of Object.keys(obj)) {
                    const pkm = obj[key]
                    MoveSets[pkm.id] = {
                        moves: pkm.moves,
                        tutor_moves: pkm.tutor_moves,
                        egg_moves: pkm.egg_moves
                    }
                    pkm.moves = undefined
                    pkm.tutor_moves = undefined
                    pkm.egg_moves = undefined
                }
                fs.writeFileSync(`json/moveset.json`, stringify(MoveSets, { maxLength: 80 }))
                break
        }
    }
    fs.writeFileSync(`json/${pbsName}.json`, stringify(obj, { maxLength: 80 }))
}

export function objKey2SnakeCase(obj: { [k: string]: any }) {
    const toSnacke = (name: string) => {
        let res: string = ''
        let arr = name.split("")
        if (arr.length <= 3) return name.toLowerCase()
        arr.map((char, index) => {
            if (char.toUpperCase() == char) {
                res += (index == 0 || index == arr.length - 1) ? char.toLowerCase() : `_${char.toLowerCase()}`
            }
            else {
                res += char
            }
        })
        return res
    }
    const res: { [k: string]: any } = {}
    for (const [key, value] of Object.entries(obj)) {
        res[toSnacke(key)] = value
    }
    return res
}