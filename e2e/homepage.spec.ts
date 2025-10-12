import { test, expect } from '@playwright/test'

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Workemia|Workemia/)
    await expect(page.getByText('Encontre o serviço perfeito perto de você')).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    await page.click('text=Buscar Serviços')
    await expect(page).toHaveURL('/servicos')
    await expect(page.getByText('Descubra Serviços Incríveis')).toBeVisible()
  })

  test('should scroll to sections smoothly', async ({ page }) => {
    // Test scroll to categories
    await page.click('button:has-text("Ver Como Funciona")')
    
    // Wait for scroll animation
    await page.waitForTimeout(1000)
    
    // Check if the "Como Funciona" section is in view
    const howItWorksSection = page.locator('#como-funciona')
    await expect(howItWorksSection).toBeInViewport()
  })

  test('should display category cards correctly', async ({ page }) => {
    const categories = ['Limpeza', 'Reparos', 'Pintura', 'Técnico', 'Beleza', 'Educação']
    
    for (const category of categories) {
      await expect(page.getByText(category)).toBeVisible()
    }
  })

  test('should handle category navigation', async ({ page }) => {
    await page.click('text=Limpeza')
    await expect(page).toHaveURL(/servicos\?categoria=limpeza/)
  })

  test('should display animated GIFs', async ({ page }) => {
    // Check if GIF images are loaded
    const limpezaGif = page.locator('img[alt="Limpeza"]')
    await expect(limpezaGif).toBeVisible()
    await expect(limpezaGif).toHaveAttribute('src', '/animated/home/limpeza.gif')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile navigation is visible
    const menuButton = page.locator('button[aria-label="Menu"]').or(page.locator('button:has(svg)').first())
    await expect(menuButton).toBeVisible()
    
    // Check if desktop navigation is hidden
    const desktopNav = page.locator('nav.hidden.lg\\:flex')
    await expect(desktopNav).not.toBeVisible()
  })

  test('should have proper accessibility', async ({ page }) => {
    // Check for main landmark
    await expect(page.locator('main')).toBeVisible()
    
    // Check for proper heading hierarchy
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h2').first()).toBeVisible()
    
    // Check for button accessibility
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    expect(buttonCount).toBeGreaterThan(0)
  })

  test('should load statistics correctly', async ({ page }) => {
    // Wait for stats to load (they might be async)
    await page.waitForSelector('text=Usuários Ativos')
    
    // Check that stats are displayed
    await expect(page.getByText('Usuários Ativos')).toBeVisible()
    await expect(page.getByText('Prestadores')).toBeVisible()
    await expect(page.getByText('Serviços Concluídos')).toBeVisible()
    await expect(page.getByText('Avaliação Média')).toBeVisible()
  })

  test('should handle CTA section interactions', async ({ page }) => {
    // Scroll to CTA section
    await page.locator('text=Junte-se a milhares de clientes satisfeitos').scrollIntoViewIfNeeded()
    
    // Click CTA button
    await page.click('text=Solicitar Serviço Agora')
    
    // Should navigate to services page
    await expect(page).toHaveURL('/servicos')
  })
})