# Clean up previous distributions
rm -rf ngc-out
rm -rf dist

# Create a variable that points at the Angular compiler
NGC="node node_modules/.bin/ngc"
ROLLUP="node node_modules/.bin/rollup"

# Compile the source
$NGC -p src/tsconfig-build.json
$ROLLUP -c -o dist/tstack-lib.js

# Compile the source
$NGC -p src/tsconfig-es5-build.json
$ROLLUP -c -o dist/tstack-lib.es5.js

# move everything from build that is not a typescript file and place it in dist
rsync -a --exclude=*.js ngc-out/ dist

# Move over the package.json file
cp src/package.json dist/package.json
