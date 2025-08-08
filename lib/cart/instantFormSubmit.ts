// Instant form submission for hosting products (like WordPress plugin)
export interface FormSubmitResult {
  success: boolean
  message: string
}

export class InstantFormSubmit {
  private static plid = process.env.NEXT_PUBLIC_PLID || '590175'
  
  /**
   * Submit hosting product instantly via form
   * This bypasses the mixed cart issue by submitting hosting separately
   */
  static submitHosting(
    productId: string, 
    quantity: number = 1,
    period?: number,
    periodUnit?: string
  ): FormSubmitResult {
    try {
      // Create form that submits in a new minimal window
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `https://www.secureserver.net/api/v1/cart/${this.plid}/`
      form.target = `godaddy_submit_${Date.now()}`
      form.style.display = 'none'
      
      // Add redirect parameter
      const redirectInput = document.createElement('input')
      redirectInput.type = 'hidden'
      redirectInput.name = 'redirect'
      redirectInput.value = '1'
      form.appendChild(redirectInput)
      
      // Add plid
      const plidInput = document.createElement('input')
      plidInput.type = 'hidden'
      plidInput.name = 'plid'
      plidInput.value = this.plid
      form.appendChild(plidInput)
      
      // Build item data
      const item: { id: string; quantity: number; period?: number; periodUnit?: string } = {
        id: productId,
        quantity: quantity
      }
      
      // Add period if specified (for hosting plans)
      if (period && periodUnit) {
        item.period = period
        item.periodUnit = periodUnit
      }
      
      // Add items as JSON
      const itemsInput = document.createElement('input')
      itemsInput.type = 'hidden'
      itemsInput.name = 'items'
      itemsInput.value = JSON.stringify([item])
      form.appendChild(itemsInput)
      
      // Add tracking parameter (like WordPress plugin)
      const iscInput = document.createElement('input')
      iscInput.type = 'hidden'
      iscInput.name = 'isc'
      iscInput.value = 'flickmax'
      form.appendChild(iscInput)
      
      // Open a minimal window for the form submission
      const submitWindow = window.open('', form.target, 'width=1,height=1,left=-1000,top=-1000')
      
      // Append form to body and submit
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
      // Close window after a delay to ensure submission completes
      if (submitWindow) {
        setTimeout(() => {
          try {
            submitWindow.close()
          } catch (e) {
            // Window might already be closed
          }
        }, 2000)
      }
      
      return {
        success: true,
        message: 'Hosting plan added to GoDaddy cart'
      }
    } catch (error) {
      console.error('Failed to submit hosting form:', error)
      return {
        success: false,
        message: 'Failed to submit hosting plan'
      }
    }
  }
  
  /**
   * Submit domain instantly via form
   */
  static submitDomain(domain: string): FormSubmitResult {
    try {
      // Create form that submits in a new minimal window
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `https://www.secureserver.net/api/v1/cart/${this.plid}/`
      form.target = `godaddy_submit_${Date.now()}`
      form.style.display = 'none'
      
      // Add redirect parameter
      const redirectInput = document.createElement('input')
      redirectInput.type = 'hidden'
      redirectInput.name = 'redirect'
      redirectInput.value = '1'
      form.appendChild(redirectInput)
      
      // Add plid
      const plidInput = document.createElement('input')
      plidInput.type = 'hidden'
      plidInput.name = 'plid'
      plidInput.value = this.plid
      form.appendChild(plidInput)
      
      // Build domain item
      const item = {
        id: 'domain',
        domain: domain
      }
      
      // Add items as JSON
      const itemsInput = document.createElement('input')
      itemsInput.type = 'hidden'
      itemsInput.name = 'items'
      itemsInput.value = JSON.stringify([item])
      form.appendChild(itemsInput)
      
      // Add tracking parameter
      const iscInput = document.createElement('input')
      iscInput.type = 'hidden'
      iscInput.name = 'isc'
      iscInput.value = 'flickmax'
      form.appendChild(iscInput)
      
      // Open a minimal window for the form submission
      const submitWindow = window.open('', form.target, 'width=1,height=1,left=-1000,top=-1000')
      
      // Append form to body and submit
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
      // Close window after a delay to ensure submission completes
      if (submitWindow) {
        setTimeout(() => {
          try {
            submitWindow.close()
          } catch (e) {
            // Window might already be closed
          }
        }, 2000)
      }
      
      return {
        success: true,
        message: 'Domain added to GoDaddy cart'
      }
    } catch (error) {
      console.error('Failed to submit domain form:', error)
      return {
        success: false,
        message: 'Failed to submit domain'
      }
    }
  }
  
  /**
   * Check if a product should be submitted instantly
   * (Currently only hosting products)
   */
  static shouldSubmitInstantly(productId: string): boolean {
    // All hosting products should be submitted instantly
    const hostingProductIds = [
      'cpanel-starter',
      'cpanel-economy',
      'cpanel-deluxe', 
      'cpanel-ultimate',
      'business-launch',
      'business-enhance',
      'business-grow',
      'business-expand'
    ]
    
    return hostingProductIds.includes(productId.toLowerCase())
  }
}