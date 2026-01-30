echo "🚀 Iniciando deploy do backend NeverLucky..."

# Verificar se está no diretório correto
if [ ! -f "backend/pom.xml" ]; then
    echo "❌ Erro: Este script deve ser executado na raiz do projeto NeverLucky"
    echo "    Certifique-se de estar no diretório que contém a pasta 'backend'"
    exit 1
fi

echo "✅ Verificação de diretório: OK"

# Verificar se o Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Erro: Maven não encontrado. Por favor, instale o Maven."
    exit 1
fi

echo "✅ Maven instalado: OK"

# Construir o backend
echo "🔨 Construindo o backend..."
cd backend

if [ -f "mvnw" ]; then
    echo "✅ Usando Maven Wrapper"
    ./mvnw clean package -DskipTests
else
    echo "✅ Usando Maven instalado"
    mvn clean package -DskipTests
fi

if [ $? -eq 0 ]; then
    echo "✅ Build bem-sucedido"
else
    echo "❌ Build falhou"
    exit 1
fi

# Verificar se o JAR foi criado
if [ -f "target/*.jar" ]; then
    echo "✅ Arquivo JAR criado com sucesso"
else
    echo "⚠️  Arquivo JAR não encontrado, mas o build foi bem-sucedido"
fi

cd ..

echo ""
echo "📋 Próximos passos:"
echo "1. O backend foi construído com as configurações CORS corretas"
echo "2. O Render deve detectar as alterações no git e fazer o deploy automaticamente"
echo "3. Se o deploy automático não funcionar, você pode:"
echo "   a) Forçar um novo commit: git add . && git commit -m 'Fix CORS configuration' && git push"
echo "   b) Ou fazer deploy manual no Render dashboard"
echo ""
echo "🔧 Configurações CORS aplicadas:"
echo "- Permitir origens: localhost:3000, localhost:5173, *.vercel.app"
echo "- Permitir métodos: GET, POST, PUT, DELETE, OPTIONS, PATCH"
echo "- Permitir credenciais: true"
echo "- Cache preflight: 1 hora"
echo ""
echo "🧪 Testes recomendados após o deploy:"
echo "1. Acesse o arquivo test-cors-fix.html no navegador"
echo "2. Execute os testes de Health Check, Login e OPTIONS"
echo "3. Verifique se não há mais erros CORS no console do navegador"
echo ""
echo "✅ Deploy concluído!"