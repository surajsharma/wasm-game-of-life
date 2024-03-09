## wasm-game-of-life

![wgol](wgol.jpg)

![Rust Badge](https://img.shields.io/badge/Rust-000?logo=rust&logoColor=fff&style=flat-square)
![WebAssembly Badge](https://img.shields.io/badge/WebAssembly-654FF0?logo=webassembly&logoColor=fff&style=flat-square)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=flat-square)



### to run locally

0. Install [wasm-pack](https://rustwasm.github.io/wasm-pack/)
1. `npm install`
2. `npm run runall`


if you get `"error:0308010C:digital envelope routines::unsupported"` you need to run the following 
- on windows
`set NODE_OPTIONS=--openssl-legacy-provider`

- on *nix `export NODE_OPTIONS=--openssl-legacy-provider`