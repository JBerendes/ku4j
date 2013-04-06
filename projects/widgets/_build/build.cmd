@echo off

SET projectName=widgets
SET pwd=%~dp0
SET rootBuild=%pwd%..\..\..\_build\build.cmd

CALL %rootBuild% %projectName% %pwd%