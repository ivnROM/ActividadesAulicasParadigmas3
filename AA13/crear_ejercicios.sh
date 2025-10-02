#!/usr/bin/env bash

n_ejercicios=$1
path=$2
content="
<!DOCTYPE html>
<html>
    <head>
      <title></title>
    </head>
    <body>
      <h1>Ejercicio : </h1>

      <script>
      </script>
    </body>
  </html>
"

for ((i=1; i<=n_ejercicios; i++))
do
  ejercicio="$path/ejercicio$i.html"
  touch "$ejercicio"
  echo "$content" > "$ejercicio"
done
