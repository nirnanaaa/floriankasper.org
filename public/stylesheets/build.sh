#!/bin/bash

rm style.css

for file in $(find source -type f); do

  asset-pipeline $file >> style.css
done

