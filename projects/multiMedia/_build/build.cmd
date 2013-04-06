@echo off

SET projectName=multiMedia
SET pwd=%~dp0
SET rootBuild=%pwd%..\..\..\_build\build.cmd

CALL %rootBuild% %projectName% %pwd%
