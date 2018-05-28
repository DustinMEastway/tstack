# Clean up previous distributions
rm -rf ngc-out
rm -rf dist

# Create a variable that points at the Angular compiler
NGC="node node_modules/.bin/ngc"
ROLLUP="node node_modules/.bin/rollup"

# Compile the source
$NGC -p src/tsconfig-build.json
$ROLLUP ngc-out/tstack-lib.js -f es -o dist/tstack-lib.js

# Move over the package.json file
cp src/package.json dist/package.json
