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
    JSFILE=$PROJROOT/${PROJNAME}.js
    MINFILE=$PROJROOT/${PROJNAME}-min.js
}

alert () {
    echo Building ku4j
}

openlink () {
    touch $LNKGFILE
    echo "(function($){" >> $LNKGFILE
    echo "if(!$) $ = {};" >> $LNKGFILE
}

linkfile () {
    cat $1 >> $LNKGFILE
    #echo >> $LNKGFILE
}

linkfiles () {
    PROJECTS=${PROJROOT}/projects
    linkfile ${PROJECTS}/base/ku4j-base.js
    linkfile ${PROJECTS}/capabilities/ku4j-capabilities.js
    linkfile ${PROJECTS}/data/ku4j-data.js
    linkfile ${PROJECTS}/periph/ku4j-periph.js
    linkfile ${PROJECTS}/web/ku4j-web.js
    linkfile ${PROJECTS}/widgets/ku4j-widgets.js
    linkfile ${PROJECTS}/canvas/ku4j-canvas.js
    linkfile ${PROJECTS}/multiMedia/ku4j-multiMedia.js
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

sh buildAll.sh

setup ku4j ${PWD}
alert
#openlink
linkfiles ${PWD}
#closelink
compile
exp
teardown