import { clsx, type ClassValue } from 'clsx'

// Combine class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Generate slug from string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
}

// Format date
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

// vercel --prod
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Category labels
export const categoryLabels: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  renovation: 'Renovation',
}

// Status labels
export const statusLabels: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  new: 'New',
  viewed: 'Viewed',
  processed: 'Processed',
  unread: 'Unread',
  read: 'Read',
}

// Generate unique slug by checking database
export async function generateUniqueSlug(
  baseSlug: string,
  excludeId?: string,
  model: 'project' | 'service' = 'project'
): Promise<string> {
  const prisma = (await import('./db')).default

  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await (model === 'project'
      ? prisma.project.findUnique({ where: { slug }, select: { id: true } })
      : prisma.service.findUnique({ where: { slug }, select: { id: true } }))

    if (!existing || existing.id === excludeId) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

// Validate image file type and size
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    }
  }

  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.',
    }
  }

  return { valid: true }
}

// Sanitize HTML string
export function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}