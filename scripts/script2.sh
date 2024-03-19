#!/bin/bash

echo "Start script2.sh" >> log.txt
# Restul comenzilor
echo "Execuție mai îndelungată" >> log.txt
sleep 10
echo "End script2.sh" >> log.txt

fake_command "Execuție mai îndelungată" >> log.txt

