#!/bin/bash

# Cores para o output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Subindo os containers do sist-social-v2 (Postgres, Django Backend e React Frontend)...${NC}"

# Constrói e inicializa os containers em segundo plano
docker compose up --build -d
