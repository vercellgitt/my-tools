import { en } from "./en";
import { de } from "./de";
import { fr } from "./fr";
import { it } from "./it";
import { da } from "./da";
import { no } from "./no";
import { ga } from "./ga";
import { lb } from "./lb";
import { fi } from "./fi";
import { sv } from "./sv";
import { nl } from "./nl";
import { is } from "./is";
import { bn } from "./bn";
import { ar } from "./ar";
import { es } from "./es";
import { pt } from "./pt";
import { hi } from "./hi";
import { ja } from "./ja";
import { ru } from "./ru";
import { pl } from "./pl";
import { tr } from "./tr";
import { fa } from "./fa";
import { ko } from "./ko";
import { id } from "./id";

export const translations = {
  en, de, fr, it, da, no, ga, lb, fi, sv, nl, is, bn, ar, es, pt, hi, ja, ru, pl, tr, fa, ko, id
} as const;

export type Language = keyof typeof translations;
export type AgeCalcDictionary = typeof en;
