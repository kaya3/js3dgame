#!/bin/sh
tsc
closure-compiler --js build/game.js --js_output_file build/game.min.js
