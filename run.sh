#!/usr/bin/env bash

TASK=$1

case $TASK in
'build')
  mkdocs build --config-file mkdocs.production.yml
  tidy -m site/**/*.html
  ;;
'dev')
  mkdocs serve -a 0.0.0.0:8000
  ;;
esac
