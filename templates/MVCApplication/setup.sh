#!/bin/bash

APPNAME=$1
ROOTLOC=$2

add(){
    echo $1 >> $2
}

mkgroup(){
    clear $1
    A=${APPNAME}
    F=$1.js
    NS=$A.$1.$A
    R=$2

    cd $R
    mkdir $1
    cd $1
    touch $F

    add "${NS} = function() {" $F
    add "}" $F
    add "${NS}.prototype = {" $F
    add "}" $F
    add "$.ext(${NS},$.Class);" $F
}

mkroot() {
    F=base.js
    touch $F
    add "var ${APPNAME} = {" $F
    add "model: { }," $F
    add "views: { }," $F
    add "controllers: { }" $F
    add "};" $F
}

mkdir ${ROOTLOC}
cd ${ROOTLOC}
D=${PWD}

mkroot
mkgroup model $D
mkgroup views $D
mkgroup controllers $D