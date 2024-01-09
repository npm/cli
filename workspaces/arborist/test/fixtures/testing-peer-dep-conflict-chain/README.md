A chain of peer deps.  Installing v1 of any of them requires v1 of all of
them.  v2 of any requires v2 of all.  No v1 can coexist with any v2.

`a-e`: each has a peerDep on the next one in the loop.  `a -> b`, `b -> c`,
and so on.  Version 1 depends on version 1 of the next one in line.
Version 2 depends on version 2 of the next one in line.  Version 3 depends
on version 3, _but_ `d@3` depends on `a@3` and there is no `e@3`.

`i-m`: each has a regular dep on the corresponding item in the loop.  `i ->
a`, `j -> b`, and so on.

`ii - mm`: each has a regular dep on the `i - m` module.  `ii -> i`, `jj ->
j`, etc.

`p - t`: each has a peerDep on v1 the corresponding `a-e` package, _and_ a
peerDep on v2 of the next package in the loop.  So, `p -> PEER(a@1, b@2)`

`v-z`: each has a peerDep on the corresponding item in the loop.  `v ->
a`, `w -> b`, and so on.  Version 3 each has a peerDep on the corresponding
one in the `a-e` version 1 package in the loop loop _and_ the one two steps
down the chain.  So `v@3 -> a@1,c@1`, etc.  Version 4 each has a peerDep on
_either_ version 1 _or_ version 2 of the corresponding item in the loop.
