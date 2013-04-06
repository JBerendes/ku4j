@echo off
CALL "buildAll.cmd"
CALL :setup
CALL :alert
REM CALL :openlink
CALL :link
REM CALL :closelink
CALL :compile
CALL :export
CALL :teardown
@echo DONE

:setup
SET pwd=%~dp0
SET library=jQuery
SET compressor="%pwd%yuicompressor-2.4.6\build\yuicompressor-2.4.6.jar"
SET projectName=ku4j
SET buildRoot=%pwd%..\
SET projectRoot=%buildRoot%
SET release=%pwd%..\_release\scripts
SET compFile="%projectRoot%%projectName%.js"
SET minFile="%projectRoot%%projectName%-min.js"

GOTO :eof

:alert
@echo Building ku4j-complete
GOTO :eof

:openlink
SET linkingFile="%buildRoot%%projectName%-link.js"
echo (function($){>> %linkingFile%
echo if(!$) $ = {};>> %linkingFile%
GOTO :eof

:link
@echo Linking
SET projects=%buildRoot%projects\
CALL :linkfile "%projects%base\ku4j-base.js"
CALL :linkfile "%projects%capabilities\ku4j-capabilities.js"
CALL :linkfile "%projects%data\ku4j-data.js"
CALL :linkfile "%projects%periph\ku4j-periph.js"
CALL :linkfile "%projects%web\ku4j-web.js"
CALL :linkfile "%projects%widgets\ku4j-widgets.js"
CALL :linkfile "%projects%canvas\ku4j-canvas.js"
CALL :linkfile "%projects%multiMedia\ku4j-multiMedia.js"
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
copy %compFile% %release% /y

copy %minFile% D:\Dev\SourceControl\_deploy\assets\scripts\js\libraries\ku4j /y
copy %compFile% D:\Dev\SourceControl\_deploy\assets\scripts\js\libraries\ku4j /y

GOTO :eof

:teardown
@echo Cleaning up build files
del %linkingFile%
del %comp%
GOTO :eof