@echo off
CALL :setup %1 %2
CALL :alert
CALL :openlink
CALL :link
CALL :closelink
CALL :compile
CALL :export
CALL :teardown
@echo DONE

:setup
SET pwd=%~dp0
SET library=jQuery
SET compressor="%pwd%yuicompressor-2.4.6\build\yuicompressor-2.4.6.jar"
SET projectName=%1
SET buildRoot=%2
SET projectRoot=%buildRoot%..\
SET scriptsRoot=%projectRoot%scripts
SET release=%pwd%..\_release\scripts
SET compFile="%projectRoot%ku4j-%projectName%.js"
SET minFile="%projectRoot%ku4j-%projectName%-min.js"
GOTO :eof

:alert
@echo Building ku4j
GOTO :eof

:openlink
SET linkingFile="%buildRoot%%projectName%-link.js"
echo (function($){>> %linkingFile%
echo if(!$) $ = {};>> %linkingFile%
GOTO :eof

:link
@echo Linking
FOR /R %scriptsRoot% %%D IN (*.js) DO CALL :linkfile %%D 
GOTO :eof

:closelink
echo })($);>> %linkingFile%
GOTO :eof

:linkfile
type %1 >> %linkingFile%
echo. >> %linkingFile%
GOTO :eof

:compile
@echo Compiling

SET comp="%projectRoot%%projectName%-comp.js"

del %compFile%
del %minFile%

java -jar %compressor% %linkingFile% -o %comp%

echo //kodmunki utilities>> %minFile%
type %pwd%properties\license.txt>> %minFile%
type %comp%>> %minFile%
type %linkingFile%>> %compFile%
GOTO :eof

:export
@echo Exporting release files to...
copy %minFile% %release% /y
REM copy %compFile% %release% /y
GOTO :eof

:teardown
@echo Cleaning up build files
del %linkingFile%
del %comp%
GOTO :eof