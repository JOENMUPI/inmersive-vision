import { dataAllI } from "@/app/template/utils/interfaces";
import { configAvalonPark } from "@/app/template/config/avalon-park-wesley-chapel";
import { configErna } from "@/app/template/config/erna";

export const configMap: Map<string, dataAllI> = new Map();

configMap.set('avalon-park-wesley-chapel', configAvalonPark);
configMap.set('erna', configErna);