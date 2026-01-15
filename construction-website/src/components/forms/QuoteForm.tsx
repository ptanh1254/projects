'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema, type QuoteFormData } from '@/lib/validations'
// Đảm bảo bạn đã có các component này trong project, nếu chưa hãy tạo hoặc thay bằng thẻ HTML thường
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

interface QuoteFormProps {
  className?: string
}

export default function QuoteForm({ className = '' }: QuoteFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const totalSteps = 3

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: '',
      location: '',
      area: undefined,
      budget: '',
      timeline: '',
      message: '',
    }
  })

  const nextStep = async () => {
    let fieldsToValidate: (keyof QuoteFormData)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email', 'phone']
    } else if (currentStep === 2) {
      fieldsToValidate = ['projectType', 'location', 'area']
    }

    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Gọi API route được định nghĩa trong quote/route.ts
      const response = await fetch('/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you! Your quote request has been submitted successfully.',
        })
        // Reset form và quay về bước 1 sau khi gửi thành công
        reset()
        setCurrentStep(1)
        // Cuộn màn hình lên đầu form để user thấy thông báo
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.',
        })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit quote request. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-200 ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors duration-200 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
          <span>Contact Info</span>
          <span className="text-center pl-4">Project Details</span>
          <span className="text-right">Additional Info</span>
        </div>
      </div>

      {/* Status Message */}
      {submitStatus && (
        <div
          className={`p-4 rounded-lg mb-6 animate-in fade-in slide-in-from-top-2 ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center">
            {submitStatus.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{submitStatus.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900">Project Details</h3>

            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                Project Type <span className="text-red-500">*</span>
              </label>
              <Select
                id="projectType"
                error={errors.projectType?.message}
                {...register('projectType')}
              >
                <option value="">Select project type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Renovation">Renovation</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Project Location <span className="text-red-500">*</span>
              </label>
              <Input
                id="location"
                placeholder="City, State/Province"
                error={errors.location?.message}
                {...register('location')}
              />
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                Project Area (m²)
              </label>
              <Input
                id="area"
                type="number"
                step="0.01"
                placeholder="e.g., 150"
                error={errors.area?.message}
                {...register('area', { 
                  // Xử lý chuyển đổi chuỗi rỗng thành undefined để qua được validate optional() của Zod
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v) 
                })}
              />
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900">Additional Information</h3>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <Select id="budget" {...register('budget')}>
                <option value="">Select budget range</option>
                <option value="Under $50,000">Under $50,000</option>
                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                <option value="Over $500,000">Over $500,000</option>
              </Select>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Timeline
              </label>
              <Select id="timeline" {...register('timeline')}>
                <option value="">Select timeline</option>
                <option value="As soon as possible">As soon as possible</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="Flexible">Flexible</option>
              </Select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <Textarea
                id="message"
                placeholder="Tell us more about your project (style, number of rooms, special requirements...)"
                rows={6}
                error={errors.message?.message}
                {...register('message')}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-100 mt-6">
          {currentStep > 1 ? (
            <Button 
              type="button" 
              variant="secondary" // Giả sử Button component hỗ trợ variant
              onClick={prevStep}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Previous
            </Button>
          ) : <div></div>}

          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white">
              Next Step
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Sending...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}