#!/bin/bash

set -e

if [[ $TRAVIS_BRANCH != 'master' ]]
then
  exit
fi

git checkout master

git config user.name "AwesomeConferenceBot"
git config user.email "awesomeconferencebot@users.noreply.github.com"

echo add readme
git add README.md

echo add past
git add PAST.md

echo add last
git add last.json

echo add content
git add contents.json

echo commit
git commit -m "[auto] [ci skip] Generate README, JSON and Last"

echo push
git push --quiet "https://${GH_TOKEN}@github.com/matteocrippa/awesome-mobile-conferences" master:master > /dev/null 2>&1
