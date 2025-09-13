const { exec } = require('child_process')
const fs = require('fs')

// Configurações do banco (extraídas do projeto)
const DB_HOST = 'aws-0-us-east-1.pooler.supabase.com'
const DB_PORT = '6543'
const DB_NAME = 'postgres'
const DB_USER = 'postgres.yxlxreavyojyczqxekjj'
const DB_PASSWORD = 'ServiceHub2024@'

async function setupDatabase() {
  console.log('🚀 Tentando conectar diretamente ao PostgreSQL...')
  
  // Ler o arquivo SQL
  const sqlContent = fs.readFileSync('./scripts/create-tables.sql', 'utf8')
  
  // Comando psql
  const psqlCommand = `PGPASSWORD="${DB_PASSWORD}" psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -c "${sqlContent.replace(/"/g, '\\"')}"`
  
  exec(psqlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Erro ao executar psql:', error.message)
      console.log('ℹ️ psql não está disponível ou credenciais incorretas')
      console.log('📋 Para executar manualmente:')
      console.log('1. Acesse o dashboard do Supabase')
      console.log('2. Vá para SQL Editor')
      console.log('3. Cole o conteúdo do arquivo scripts/create-tables.sql')
      console.log('4. Execute o SQL')
      return
    }
    
    if (stderr) {
      console.error('⚠️ Avisos:', stderr)
    }
    
    console.log('✅ Tabelas criadas com sucesso!')
    console.log(stdout)
  })
}

setupDatabase()