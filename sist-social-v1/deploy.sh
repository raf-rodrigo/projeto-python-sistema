#!/bin/bash

# Sair imediatamente se algum comando falhar
set -e

echo "============================================="
echo "   Iniciando Deploy da Aplicação Sist Social  "
echo "============================================="

# 1. Puxar atualizações do GitHub
echo "1. Puxando atualizações do Git..."
git pull

# 2. Recompilar e atualizar o container Web
echo "2. Recompilando e atualizando o container web..."
sudo docker compose -f docker-compose.prod.yml up -d --build web

# 3. Exibir status dos containers
echo "3. Verificando status dos containers..."
sudo docker compose -f docker-compose.prod.yml ps

echo "============================================="
echo "        Deploy concluído com sucesso!        "
echo "============================================="
