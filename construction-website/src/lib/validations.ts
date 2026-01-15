import { z } from 'zod'

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Quote Form Schema
export const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  // projectType vẫn giữ nguyên vì đây là input từ form khách hàng, không nhất thiết phải khớp ID category
  projectType: z.string().min(1, 'Please select a project type'), 

  location: z.string().min(5, 'Location must be at least 5 characters'),
  area: z.number().positive('Area must be greater than 0').optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
})

// Project Schema (Admin)
export const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'), 
  location: z.string().min(5, 'Location must be at least 5 characters'),
  area: z.number().positive().optional(),
  duration: z.string().optional(),
  client: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  // FIX: Thêm validation cho images
  images: z.array(z.object({
    url: z.string().url(),
    order: z.number().int()
  })).optional()
})

// Service Schema (Admin)
export const serviceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  shortDescription: z.string().max(300, 'Short description must be maximum 300 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().int(),
  active: z.boolean(),
})

// Settings Schema (Admin)
export const settingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  workingHours: z.string().nullable().optional(),
  facebookUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  whatsappUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  linkedinUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  youtubeUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  logoUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  faviconUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  googleMapsUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  googleAnalyticsId: z.string().nullable().optional(),
  slideInterval: z.number().int().positive().optional(),
})

// Quote Status Update Schema (Admin)
export const updateQuoteStatusSchema = z.object({
  // FIX 3: Cập nhật đúng trạng thái mới trong DB
  status: z.enum(['new', 'contacted', 'closed'], {
    message: 'Status must be new, contacted, or closed',
  }),
  adminNote: z.string().max(1000, 'Admin note must be maximum 1000 characters').optional(),
})

// Contact Status Update Schema (Admin)
export const updateContactStatusSchema = z.object({
  // Có thể thêm 'replied' nếu muốn hỗ trợ đủ
  status: z.enum(['unread', 'read', 'replied'], {
    message: 'Status must be unread, read or replied',
  }),
})

// Service Reorder Schema (Admin)
export const reorderServicesSchema = z.object({
  services: z.array(
    z.object({
      id: z.string().cuid('Invalid service ID'),
      order: z.number().int().nonnegative('Order must be a non-negative integer'),
    })
  ).min(1, 'At least one service is required'),
})

// Image Reorder Schema
export const reorderImagesSchema = z.object({
  images: z.array(
    z.object({
      id: z.string().cuid('Invalid image ID'),
      order: z.number().int().nonnegative('Order must be a non-negative integer'),
    })
  ).min(1, 'At least one image is required'),
})

// câp nhật thông tin cá nhân (Admin)
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
})

// cập nhật mật khẩu (Admin)
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
})
// Type Exports
export type CategoryFormData = z.infer<typeof categorySchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type QuoteFormData = z.infer<typeof quoteSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
export type UpdateQuoteStatusData = z.infer<typeof updateQuoteStatusSchema>
export type UpdateContactStatusData = z.infer<typeof updateContactStatusSchema>
export type ReorderServicesData = z.infer<typeof reorderServicesSchema>
export type ReorderImagesData = z.infer<typeof reorderImagesSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>