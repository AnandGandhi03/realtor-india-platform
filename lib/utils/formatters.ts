/**
 * Format price in Indian currency format (Lakh/Crore)
 */
export function formatIndianPrice(price: number, includeSymbol = true): string {
  const symbol = includeSymbol ? '₹' : ''
  
  if (price >= 10000000) {
    return `${symbol}${(price / 10000000).toFixed(2)} Cr`
  } else if (price >= 100000) {
    return `${symbol}${(price / 100000).toFixed(2)} L`
  } else if (price >= 1000) {
    return `${symbol}${(price / 1000).toFixed(2)} K`
  }
  
  return `${symbol}${price.toLocaleString('en-IN')}`
}

/**
 * Format area in square feet
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString('en-IN')} sq.ft`
}

/**
 * Format date in Indian format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Format phone number in Indian format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  
  return phone
}

/**
 * Calculate price per square foot
 */
export function calculatePricePerSqft(price: number, area: number): number {
  if (area === 0) return 0
  return Math.round(price / area)
}

/**
 * Get property type display name
 */
export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: 'Apartment',
    villa: 'Villa',
    independent_house: 'Independent House',
    plot: 'Plot',
    commercial: 'Commercial',
    office: 'Office Space',
    shop: 'Shop',
    warehouse: 'Warehouse',
    farmhouse: 'Farmhouse',
    penthouse: 'Penthouse',
    studio: 'Studio Apartment'
  }
  
  return labels[type] || type
}

/**
 * Get listing type display name
 */
export function getListingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    sale: 'For Sale',
    rent: 'For Rent',
    lease: 'For Lease',
    pg: 'PG/Hostel'
  }
  
  return labels[type] || type
}

/**
 * Generate property URL slug
 */
export function generatePropertySlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return `${slug}-${id.slice(0, 8)}`
}

/**
 * Parse budget range string
 */
export function parseBudgetRange(budget: string): { min: number; max: number } | null {
  if (!budget) return null
  
  const [min, max] = budget.split('-').map(Number)
  return { min, max }
}

/**
 * Format time ago
 */
export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }
  
  return 'Just now'
}