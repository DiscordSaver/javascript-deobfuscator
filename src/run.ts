import { deobfuscate } from "./index";
import fs from 'fs';

const source = fs.readFileSync('input/source.js').toString();
const config = {
    arrays: {
        unpackArrays: true,
        removeArrays: true
    },
    objects: {
        unpackObjects: true,
        removeObjects: true
    },
    proxyFunctions: {
        replaceProxyFunctions: true,
        removeProxyFunctions: true
    },
    expressions: {
        simplifyExpressions: true
    },
    miscellaneous: {
        beautify: true,
        simplifyProperties: true,
        renameHexIdentifiers: true
    }
};

const output = deobfuscate(source, config);
fs.writeFileSync('output/output.js', output);
