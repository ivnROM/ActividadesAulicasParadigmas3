#!/usr/bin/env bash

n_ejercicios=$1
path=$2

for ((i=1; i<=n_ejercicios; i++))
do
  touch "$path/ejercicio$i.html"
done
