const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yxlxreavyojyczqxekjj.supabase.co/'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bHhyZWF2eW9qeWN6cXhla2pqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTIzMjI4MiwiZXhwIjoyMDcwODA4MjgyfQ.lBhqRYqqBWCX3IAkT1hGEae89N1gFvvW9Zt-CqPC47E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testTables() {
  console.log('🔍 Verificando tabelas existentes...')
  
  const tables = ['categories', 'services', 'notifications', 'users', 'profiles']
  
  for (const table of tables) {
    try {
      console.log(`📋 Testando tabela: ${table}`)
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: OK (${data?.length || 0} registros encontrados)`)
        if (data && data.length > 0) {
          console.log(`   Estrutura:`, Object.keys(data[0]))
        }
      }
    } catch (err) {
      console.log(`💥 ${table}: Erro inesperado - ${err.message}`)
    }
  }
}

testTables()