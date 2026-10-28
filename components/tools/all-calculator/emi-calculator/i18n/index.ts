import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { it } from "./it";
import { pt } from "./pt";
import { ar } from "./ar";
import { ja } from "./ja";

export const translations = { en, es, fr, de, it, pt, ar, ja };
export type Language = keyof typeof translations;