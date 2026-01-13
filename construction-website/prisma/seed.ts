import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123456', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Seed Settings
  const settings = await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      companyName: 'ABC Construction Company',
      tagline: 'Building Dreams - Creating the Future',
      description: 'Construction experts with over 15 years of experience in residential and industrial construction.',
      email: 'phamtuananh1254@gmail.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, Downtown District',
      workingHours: 'Monday - Saturday: 8:00 AM - 5:30 PM',
      facebookUrl: 'https://facebook.com/company',
      googleMapsUrl: 'https://maps.google.com/?q=...',
    },
  })
  console.log('✅ Settings created')

  // Seed Services
  const services = [
    {
      title: 'Residential Construction',
      slug: 'residential',
      shortDescription: 'Build homes, villas, and apartments with modern design and high quality.',
      description: 'We provide comprehensive residential construction services from design to completion. With experienced engineers and professional work processes.',
      icon: 'Home',
      order: 1,
    },
    {
      title: 'Commercial Construction',
      slug: 'commercial',
      shortDescription: 'Construct warehouses, storage facilities, and factories to industrial standards.',
      description: 'Specialized in building large-scale industrial projects with high technical standards.',
      icon: 'Factory',
      order: 2,
    },
    {
      title: 'Industrial Construction',
      slug: 'industrial',
      shortDescription: 'Large-scale industrial projects including warehouses, factories, and manufacturing facilities.',
      description: 'Our team excels in delivering complex industrial construction projects on time and within budget.',
      icon: 'PenTool',
      order: 3,
    },
    {
      title: 'Renovation & Remodeling',
      slug: 'renovation',
      shortDescription: 'Repair, renovate, and upgrade existing structures.',
      description: 'Renovation and remodeling services that refresh your living space at a reasonable cost.',
      icon: 'Wrench',
      order: 4,
    },
    {
      title: 'Project Management',
      slug: 'project-management',
      shortDescription: 'Technical consulting and professional construction supervision.',
      description: 'We provide consulting and supervision services to ensure your project is completed on time and with quality.',
      icon: 'ClipboardCheck',
      order: 5,
    },
    {
      title: 'Interior Design',
      slug: 'interior-design',
      shortDescription: 'Design and construct interiors with your unique style.',
      description: 'Full-service interior design and construction, bringing you a premium living space.',
      icon: 'Sofa',
      order: 6,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }
  console.log('✅ Services created:', services.length)

  // Seed Projects
  const projects = [
    {
      title: 'Modern Villa Downtown',
      slug: 'modern-villa-downtown',
      description: 'Luxury villa project in downtown area with modern design, optimized natural light and green space.',
      category: 'residential',
      location: 'Downtown District',
      area: 450,
      duration: '12 months',
      client: 'Smith Family',
      featured: true,
      status: 'published',
    },
    {
      title: 'ABC Corporate Office',
      slug: 'abc-corporate-office',
      description: 'Design and construction of modern office workspace for ABC Company with open, creative space.',
      category: 'commercial',
      location: 'Business District',
      area: 800,
      duration: '6 months',
      client: 'ABC Corporation',
      featured: true,
      status: 'published',
    },
    {
      title: 'Industrial Park Warehouse',
      slug: 'industrial-park-warehouse',
      description: 'Large-scale manufacturing warehouse construction at Industrial Park.',
      category: 'industrial',
      location: 'Industrial Park Zone',
      area: 5000,
      duration: '18 months',
      client: 'XYZ Manufacturing Inc.',
      featured: false,
      status: 'published',
    },
    {
      title: 'Luxury Apartment Renovation',
      slug: 'luxury-apartment-renovation',
      description: 'Renovation and upgrade of luxury apartment in minimalist style.',
      category: 'renovation',
      location: 'Riverside Tower',
      area: 120,
      duration: '3 months',
      client: 'Mr. Johnson',
      featured: true,
      status: 'published',
    },
    {
      title: 'D1 Shopping Center',
      slug: 'd1-shopping-center',
      description: 'Large-scale shopping center project with full amenities.',
      category: 'commercial',
      location: 'City Center',
      area: 15000,
      duration: '24 months',
      client: 'D1 Group',
      featured: false,
      status: 'published',
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    })
  }
  console.log('✅ Projects created:', projects.length)

  // Seed Testimonials
  const testimonials = [
    {
      name: 'John Smith',
      role: 'Homeowner',
      company: null,
      content: 'The construction team was very professional, the project was completed on schedule and the quality exceeded expectations. I am very satisfied with my new home!',
      rating: 5,
      featured: true,
      active: true,
      order: 1,
    },
    {
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'ABC Corporation',
      content: 'The new office was designed beautifully and modernly. My employees all love the new workspace. Thank you to the team for their dedicated consulting!',
      rating: 5,
      featured: true,
      active: true,
      order: 2,
    },
    {
      name: 'Michael Brown',
      role: 'Project Owner',
      company: 'XYZ Group',
      content: 'The warehouse project was completed on time with good quality. Very impressed with the team\'s project management and problem-solving capabilities.',
      rating: 5,
      featured: true,
      active: true,
      order: 3,
    },
    {
      name: 'Emily Davis',
      role: 'Homeowner',
      company: null,
      content: 'Renovated my apartment at a reasonable cost and the results exceeded expectations. The living space is now much more spacious and modern.',
      rating: 5,
      featured: false,
      active: true,
      order: 4,
    },
  ]

  for (let i = 0; i < testimonials.length; i++) {
    await prisma.testimonial.create({
      data: testimonials[i],
    })
  }
  console.log('✅ Testimonials created:', testimonials.length)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })