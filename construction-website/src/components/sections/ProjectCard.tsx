import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface ProjectImage {
  url: string
  publicId: string
}

interface ProjectCardProps {
  id: string
  title: string
  slug: string
  category: string
  location: string
  area?: number | null
  duration?: string | null
  images: ProjectImage[]
}

const categoryLabels: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  renovation: 'Renovation',
}

const categoryColors: Record<string, 'info' | 'success' | 'warning' | 'secondary'> = {
  residential: 'info',
  commercial: 'success',
  industrial: 'warning',
  renovation: 'secondary',
}

export default function ProjectCard({
  title,
  slug,
  category,
  location,
  area,
  duration,
  images,
}: ProjectCardProps) {
  return (
    <Link href={`/portfolio/${slug}`}>
      <Card hover className="overflow-hidden group cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {images[0] ? (
            <Image
              src={images[0].url}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-colors" />

          {/* Category Badge */}
          <Badge
            variant={categoryColors[category] || 'info'}
            className="absolute top-4 left-4 z-10"
          >
            {categoryLabels[category] || category}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="space-y-2">
            {/* Location */}
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="line-clamp-1">{location}</span>
            </div>

            {/* Area and Duration */}
            {(area || duration) && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {area && (
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    <span>{area.toLocaleString()} m²</span>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{duration}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* View Details Link */}
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
            <span>View Details</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
