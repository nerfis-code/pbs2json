export interface PokemonSpecies {
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

// BaseStats: {
//     HP: number;
//     Attack: number;
//     Defense: number;
//     Speed: number;
//     SpecialAttack: number;
//     SpecialDefense: number;
// };