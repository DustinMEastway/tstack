# Clean up previous distributions
rm -rf dist

# Create a variable that points at the Angular compiler
NGC="node node_modules/.bin/ngc"

# Compile the source
$NGC -p src/tsconfig-build.json

# Move over the package.json file
cp src/package.json dist/package.json
