Root has a dev dep on `devdep` and optional dep on `optdep`.

`optdep` has a prod dep on `devopt`.

`devdep` han an prod dep on `devopt`, and an optional dep on `opt-and-dev`.

devdep: optional false, dev true, devOpt false
devopt: optional false, dev false, devOpt true
optdep: optional true, dev false, devOpt false
opt-and-dev: optional true, dev true, devOpt false
