a package that depends on a shrinkwrapped dependency whose child dependencies
change between versions. used for a reify test, trees should look as below and
not change when updating all packages.

z@1 depends on a@1 to provide a package with a nested shrinkwrap.

```
a@1
+ -- b@1
+ -- c@1
+ -- d@1

a@2
+ -- b@2
+ -- c@1
+ -- e@1
```
