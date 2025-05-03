import fs from 'fs'
import { parse2Json, parseRegionalDexes } from './utils'



class Config {

    public nomenclature: 'snake_case' | 'camelCase' | 'PascalCase'
    public betterMoveset: boolean = false
    public breakDown: boolean = false
    public enums: boolean = false

    private static _instance: Config
    private constructor() {
        this.nomenclature = 'PascalCase'
    }
    public static getInstance(): Config {
        if (Config._instance == null) {
            Config._instance = new Config()
            Config._instance.nomenclature = process.argv[2] as 'snake_case' | 'camelCase' | 'PascalCase'
            Config._instance.betterMoveset = process.argv.includes('betterMoveset')
            Config._instance.breakDown = process.argv.includes('breakDown')
            Config._instance.enums = process.argv.includes('enum')
        }
        return Config._instance
    }
    public getKeyWithFormat(key: string): string {
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
        const toCamel = (key: string) => {
            if (key.length <= 3) return key.toLowerCase()
            return key.split('').map((e, i) => i == 0 ? e.toLowerCase() : e).join('')
        }

        return this.nomenclature == 'PascalCase' ? key :
            this.nomenclature == 'camelCase' ? toCamel(key) : toSnacke(key)

    }
}
export { Config };

parse2Json('pokemon')
parse2Json('moves')
parse2Json('items')
parseRegionalDexes()