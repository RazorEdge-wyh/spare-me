#!/usr/bin/env node
/**
 * spare-me executable entry.
 * Keep it a thin shell: all logic lives in src/ so it can be tested.
 */
require('../src/cli').main(process.argv.slice(2));
