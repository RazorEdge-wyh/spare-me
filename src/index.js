/**
 * spare-me public API (for require('spare-me'); the CLI still goes through bin/spare-me.js).
 */
const phrases = require('./phrases');
const memory = require('./memory');
const { runDoctor } = require('./doctor');
const { runInit } = require('./init');
const { listSkills, installSkills } = require('./skills');

module.exports = { phrases, memory, runDoctor, runInit, listSkills, installSkills };
