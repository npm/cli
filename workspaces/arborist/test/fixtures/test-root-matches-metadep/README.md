When a root node matches a metadep being added to the tree, the
loop-detection link deduplication made in a lot of problems as a result of
the link going to the root node from the /virtual-tree temp tree,
ultimately resulting in the root node being reified in place and deleting
its existing contents (which is very bad!)
