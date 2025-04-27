import fs from 'fs'
import { parse2Json, parseRegionalDexes } from './utils'

parse2Json('pokemon')
parse2Json('moves')
parse2Json('items')
parseRegionalDexes()

