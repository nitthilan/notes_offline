

Steps to create application:
============================
- checkout the code from git
- Install node/npm and bower
- run npm install and bower install
- download nodewebkit from http://nwjs.io/
- Copy the contents of the unziped folder into the git checked out folder
- rename the nw.exe to the value of "name" in package.json i.e. "smart_notes"


Major Components used:
======================
- nedb database to store the notes
- ace editor for ui
- angular framework

A Simple Note Taking application
================================
- Create new notes
- Search already existing notes
- Use Tabs to edit multiple notes
- Uses a local file to store and retrive notes NeDB
- Uses node-web-kit to run the application as a offline application

Future Features:
================
- Ability to add the nedb database file from a already existing path so that we can use dropbox to synchronise across desktops
- Ability to add security by using username password
- Importing multiple nedb databases
- deleting notes
- android app for viewing notes
- having different views for the notes
    - seeing project list
    - seeing links for learning
    - todo list
-
