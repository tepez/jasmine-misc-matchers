// Without this typescript won't require tslib
export {};

/*
    This is can be used to make html-differ work in the browser using the NormalModuleReplacementPlugin
    webpack plugin:

    new NormalModuleReplacementPlugin(
        /chalk/,
        (resource: any): void => {
            info('Replace chalk with browser-chalk for browser compatibility');
            resource.request = '@tepez/jasmine-misc-matchers/dist/browser-chalk.js';
        }
    )

    It makes all the functions of chalk return the same string, i.e. do thing

    Based on the API of https://github.com/chalk/chalk/blob/v4.1.0/readme.md
 */

const identity: any = function (str: any): any {
    return str;
}

const colorFn: any = function (str: any): any {
    return str;
}

const modifiers = [
    'reset',
    'bold',
    'dim',
    'italic',
    'underline',
    'inverse',
    'hidden',
    'strikethrough',
    'visible',
];

for (const modifier of modifiers) {
    colorFn[modifier] = identity;
}

const colors = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'blackBright',
    'gray',
    'grey',
    'redBright',
    'greenBright',
    'yellowBright',
    'blueBright',
    'magentaBright',
    'cyanBright',
    'whiteBright',
    'bgBlack',
    'bgRed',
    'bgGreen',
    'bgYellow',
    'bgBlue',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgBlackBright',
    'bgGray',
    'bgGrey',
    'bgRedBright',
    'bgGreenBright',
    'bgYellowBright',
    'bgBlueBright',
    'bgMagentaBright',
    'bgCyanBright',
    'bgWhiteBright',
]

module.exports = {};

for (const color of colors) {
    module.exports[color] = colorFn;
}