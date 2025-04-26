export type PokemonSpecies = {
    [k: string]: any,
    ID: string; // Ejemplo: 'BULBASAUR' (en mayúsculas, sin espacios o caracteres especiales)
    Name: string;
    Types: string[]; // Tuple con 1-2 tipos elementales
    BaseStats: number[];
    GenderRatio: 'AlwaysMale' | 'FemaleOneEighth' | 'Female25Percent' | 'Female50Percent' |
    'Female75Percent' | 'FemaleSevenEighths' | 'AlwaysFemale' | 'Genderless';
    GrowthRate: 'Fast' | 'Medium' | 'MediumFast' | 'Slow' | 'MediumSlow' | 'Parabolic' |
    'Erratic' | 'Fluctuating';
    BaseExp: number;
    EVs: Array<{
        stat: 'HP' | 'ATTACK' | 'DEFENSE' | 'SPEED' | 'SPECIAL_ATTACK' | 'SPECIAL_DEFENSE';
        value: number;
    }>;
    CatchRate: number; // 0-255
    Happiness: number; // 0-255
    Abilities: string[]; // Habilidades normales (1-2)
    HiddenAbilities: string[]; // Habilidades ocultas (hasta 4)
    Moves: Array<{
        level: number;
        move: string;
    }>;
    TutorMoves: string[];
    EggMoves: string[];
    EggGroups: string[];
    HatchSteps: number;
    Offspring: string[];
    Height: number; // metros
    Weight: number; // kg
    Color: 'Black' | 'Blue' | 'Brown' | 'Gray' | 'Green' | 'Pink' |
    'Purple' | 'Red' | 'White' | 'Yellow';
    Shape: 'Head' | 'Serpentine' | 'Finned' | 'HeadArms' | 'HeadBase' |
    'BipedalTail' | 'HeadLegs' | 'Quadruped' | 'Winged' | 'Multiped' |
    'MultiBody' | 'Bipedal' | 'MultiWinged' | 'Insectoid';
    Category: string;
    Pokedex: string;
    FormName?: string;
    Flags: string[];
    Evolutions: Array<{
        species: string;
        method: string;
        param?: string | number;
    }>;
    Incense?: string;
    Habitat?: 'Cave' | 'Forest' | 'Grassland' | 'Mountain' | 'Rare' |
    'RoughTerrain' | 'Sea' | 'Urban' | 'WatersEdge' | '';
    Generation?: number;
}

export const DefaultPokemonSpecies: PokemonSpecies = {
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

export type Move = {
    Name: string;
    Type: string; // puedes ajustar los tipos válidos
    Category: string;
    Power: number;
    Accuracy: number;
    TotalPP: number;
    Target: string;
    FunctionCode: string;
    Flags: string[]; // lista de banderas
    EffectChance: number;
    Description: string;
};

export const DefaultMove: Move = {
    Name: "DEFAULT",
    Type: "BUG",
    Category: "Special",
    Power: 0,
    Accuracy: 0,
    TotalPP: 0,
    Target: "NearOther",
    FunctionCode: "ANYCODE",
    Flags: [],
    EffectChance: 10,
    Description: "DEFAULT"
};