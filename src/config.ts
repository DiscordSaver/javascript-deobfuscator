export default interface Config {
    arrays: ArraysConfig;
    objects: ObjectsConfig;
    proxyFunctions: ProxyFunctionsConfig;
    expressions: ExpressionsConfig;
    miscellaneous: MiscellaneousConfig;
}

interface ArraysConfig {
    unpackArrays: boolean;
    removeArrays: boolean;
}

interface ObjectsConfig {
    unpackObjects: boolean;
    removeObjects: boolean;
}

interface ProxyFunctionsConfig {
    replaceProxyFunctions: boolean;
    removeProxyFunctions: boolean;
}

interface ExpressionsConfig {
    simplifyExpressions: boolean;
}

interface MiscellaneousConfig {
    beautify: boolean;
    simplifyProperties: boolean;
    renameHexIdentifiers: boolean;
}