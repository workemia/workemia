'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

export default function SolicitarServicoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Carregar categorias do banco
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('active', true)
          .order('name')
        
        if (error) {
          console.error('Erro ao carregar categorias:', error)
        } else {
          setCategories(data || [])
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar categorias:', err)
      }
    }
    
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Verificar se o usuário está logado
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para solicitar um serviço",
          variant: "destructive"
        })
        router.push('/login')
        return
      }

      // Coletar dados do formulário
      const formData = new FormData(e.currentTarget)
      
      type ServiceInsert = Database['public']['Tables']['services']['Insert']

      const serviceData: ServiceInsert = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category_id: (formData.get('category') as string) || null,
        client_id: user.id,
        location: formData.get('location') as string,
        budget_min: formData.get('budget') ? parseFloat(formData.get('budget') as string) : null,
        budget_max: formData.get('budget') ? parseFloat(formData.get('budget') as string) : null,
        preferred_date: (formData.get('preferred_date') as string) || null
      }

      // Inserir na tabela services (agora funcionando!)
      console.log('Salvando serviço no Supabase:', serviceData)
      
      const { error } = await supabase
        .from('services')
        .insert(serviceData as any)
      
      if (error) {
        console.error('Erro detalhado do Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Supabase error: ${error.message || 'Erro desconhecido'}`)
      }

      toast({
        title: "Sucesso!",
        description: "Sua solicitação foi enviada com sucesso. Em breve prestadores entrarão em contato."
      })

      // Redirecionar para o dashboard
      router.push('/dashboard/cliente')

    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Solicitar Serviço</CardTitle>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para solicitar um serviço
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoria do Serviço *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título do Serviço *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Limpeza completa de apartamento"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição Detalhada *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva detalhadamente o que precisa ser feito..."
                  rows={4}
                  required
                />
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="location">Endereço/Localização *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Rua, número, bairro, cidade"
                  required
                />
              </div>

              {/* Orçamento */}
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento Estimado (R$)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-muted-foreground">
                  Opcional - ajuda os prestadores a entenderem sua expectativa
                </p>
              </div>

              {/* Data preferencial */}
              <div className="space-y-2">
                <Label htmlFor="preferred_date">Data Preferencial</Label>
                <Input
                  id="preferred_date"
                  name="preferred_date"
                  type="date"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Serviço'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}