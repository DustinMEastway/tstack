const { resolve } = require('path');

const ROOT_PATH = resolve(__dirname, '..');
const DOCS_OUTPUT_PATH = resolve(ROOT_PATH, 'src/assets/generated/docs');
const PROJECTS_PATH = resolve(ROOT_PATH, 'projects');
const TEMPLATES_PATH = resolve(ROOT_PATH, 'tools/docs/templates');

module.exports = { DOCS_OUTPUT_PATH, PROJECTS_PATH, ROOT_PATH, TEMPLATES_PATH };
