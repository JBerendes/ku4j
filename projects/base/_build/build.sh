NAME=base
UHOME=/Users/$USER
ASSETS=$UHOME/Dev/SourceControl/kodmunki/Portal/Assets
KU4J=$ASSETS/scripts/js/libraries/ku4j
LOCALBLD=$KU4J/projects/${NAME}/_build
BLD=$LOCALBLD/../../../_build

sh $BLD/build.sh $NAME $LOCALBLD