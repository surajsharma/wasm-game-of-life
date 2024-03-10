## wasm-game-of-life

![wgol](wgol.jpg)

![Rust Badge](https://img.shields.io/badge/Rust-000?logo=rust&logoColor=fff&style=flat-square)
![WebAssembly Badge](https://img.shields.io/badge/WebAssembly-654FF0?logo=webassembly&logoColor=fff&style=flat-square)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=flat-square)
![Webpack Badge](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=000&style=flat-square)


### to run locally

1. Install [wasm-pack](https://rustwasm.github.io/wasm-pack/)
2. `npm install`
3. `npm run runall`

---

if you get `error:0308010C:digital envelope routines::unsupported` you need to run the following 

- `set NODE_OPTIONS=--openssl-legacy-provider` (windows)
- `export NODE_OPTIONS=--openssl-legacy-provider` (*nix)