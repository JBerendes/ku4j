#!/bin/sh
setup () {
    HOME=/Users/$USER
    KU4J=$HOME/Dev/SourceControl/kodmunki/Portal/Assets/scripts/js/libraries/ku4j
    LIBRARY=jQuery
    PROJNAME=$1
    BLDROOT=$2
    PROJROOT=$BLDROOT/..
    SCRPTROOT=$PROJROOT/scripts
    RELEASE=$KU4J/_release/scripts
    COMPRESSOR=$KU4J/_build/yuicompressor-2.4.6/build/yuicompressor-2.4.6.jar
    LNKGFILE=$BLDROOT/${PROJNAME}-link.js
    COMPFILE=$PROJROOT/${PROJNAME}-comp.js
    JSFILE=$PROJROOT/ku4j-${PROJNAME}.js
    MINFILE=$PROJROOT/ku4j-${PROJNAME}-min.js
}

alert () {
    echo Building $PROJNAME
}

openlink () {
    touch $LNKGFILE
    echo "(function($){" >> $LNKGFILE
    echo "if(!$) $ = {};" >> $LNKGFILE
}

linkfiles () {
    SCRIPTS=`find $SCRPTROOT -regex ".*\.js"`
    for f in $SCRIPTS
    do
    	cat $f >> $LNKGFILE
    	echo "\n" >> $LNKGFILE
    done
}

closelink () {
    echo "})($);" >> $LNKGFILE
}

compile () {
    echo Compiling
    
    touch $COMPFILE
    java -jar $COMPRESSOR $LNKGFILE -o $COMPFILE
    
    rm $MINFILE
    touch $MINFILE
    echo //kodmunki utilities >> $MINFILE
    #cat license.txt >> $MINFILE
    cat $COMPFILE >> $MINFILE
    
    rm $JSFILE
    touch $JSFILE
    cat $LNKGFILE >> $JSFILE
}

exp  () {
	echo Exporting release files
	cp $MINFILE $RELEASE
}

teardown () {
	rm $LNKGFILE
	rm $COMPFILE
}

setup $1 $2
alert
openlink
linkfiles
closelink
compile
exp
teardown
