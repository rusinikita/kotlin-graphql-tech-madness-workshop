const kotlinCompiler = require('@jetbrains/kotlinc-js-api');

kotlinCompiler
    .compile({
        output: './build-kt/server.js',
        sources: ['src-kt'],
        sourceMaps: true,
        moduleKind: 'commonjs',
        libraries: [
            
        ]
    })
    .then(() => console.log('Compilation successful'))