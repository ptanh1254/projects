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
      companyName: 'Công Ty Xây Dựng ABC',
      tagline: 'Xây Dựng Ước Mơ - Kiến Tạo Tương Lai',
      description: 'Chuyên gia xây dựng với hơn 15 năm kinh nghiệm trong lĩnh vực xây dựng dân dụng và công nghiệp.',
      email: 'contact@company.com',
      phone: '0909 123 456',
      address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
      workingHours: 'Thứ 2 - Thứ 7: 8:00 - 17:30',
      facebookUrl: 'https://facebook.com/company',
      googleMapsUrl: 'https://maps.google.com/?q=...',
    },
  })
  console.log('✅ Settings created')

  // Seed Services
  const services = [
    {
      title: 'Xây Dựng Dân Dụng',
      slug: 'xay-dung-dan-dung',
      shortDescription: 'Xây dựng nhà ở, biệt thự, căn hộ với thiết kế hiện đại và chất lượng cao.',
      description: 'Chúng tôi cung cấp dịch vụ xây dựng nhà ở toàn diện từ thiết kế đến hoàn thiện. Với đội ngũ kỹ sư giàu kinh nghiệm và quy trình làm việc chuyên nghiệp.',
      icon: 'Home',
      order: 1,
    },
    {
      title: 'Xây Dựng Công Nghiệp',
      slug: 'xay-dung-cong-nghiep',
      shortDescription: 'Thi công nhà xưởng, kho bãi, nhà máy theo tiêu chuẩn công nghiệp.',
      description: 'Chuyên xây dựng các công trình công nghiệp quy mô lớn với tiêu chuẩn kỹ thuật cao.',
      icon: 'Factory',
      order: 2,
    },
    {
      title: 'Thiết Kế Kiến Trúc',
      slug: 'thiet-ke-kien-truc',
      shortDescription: 'Thiết kế kiến trúc sáng tạo, tối ưu không gian và công năng sử dụng.',
      description: 'Đội ngũ kiến trúc sư của chúng tôi sẽ tư vấn và thiết kế không gian sống hoàn hảo cho bạn.',
      icon: 'PenTool',
      order: 3,
    },
    {
      title: 'Sửa Chữa & Cải Tạo',
      slug: 'sua-chua-cai-tao',
      shortDescription: 'Sửa chữa, cải tạo, nâng cấp công trình hiện có.',
      description: 'Dịch vụ sửa chữa và cải tạo giúp làm mới không gian sống của bạn với chi phí hợp lý.',
      icon: 'Wrench',
      order: 4,
    },
    {
      title: 'Tư Vấn Giám Sát',
      slug: 'tu-van-giam-sat',
      shortDescription: 'Tư vấn kỹ thuật và giám sát thi công chuyên nghiệp.',
      description: 'Chúng tôi cung cấp dịch vụ tư vấn và giám sát để đảm bảo dự án của bạn được thực hiện đúng tiến độ và chất lượng.',
      icon: 'ClipboardCheck',
      order: 5,
    },
    {
      title: 'Thi Công Nội Thất',
      slug: 'thi-cong-noi-that',
      shortDescription: 'Thiết kế và thi công nội thất theo phong cách riêng.',
      description: 'Dịch vụ thiết kế và thi công nội thất trọn gói, mang đến không gian sống đẳng cấp.',
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
      title: 'Biệt Thự Hiện Đại Quận 2',
      slug: 'biet-thu-hien-dai-quan-2',
      description: 'Dự án biệt thự cao cấp tại Quận 2 với thiết kế hiện đại, tối ưu ánh sáng tự nhiên và không gian xanh.',
      category: 'residential',
      location: 'Quận 2, TP. Hồ Chí Minh',
      area: 450,
      duration: '12 tháng',
      client: 'Gia đình Nguyễn Văn A',
      featured: true,
      status: 'published',
    },
    {
      title: 'Văn Phòng Công Ty ABC',
      slug: 'van-phong-cong-ty-abc',
      description: 'Thiết kế và thi công văn phòng làm việc hiện đại cho Công ty ABC với không gian mở, sáng tạo.',
      category: 'commercial',
      location: 'Quận 1, TP. Hồ Chí Minh',
      area: 800,
      duration: '6 tháng',
      client: 'Công ty ABC',
      featured: true,
      status: 'published',
    },
    {
      title: 'Nhà Xưởng Khu CN Tân Bình',
      slug: 'nha-xuong-kcn-tan-binh',
      description: 'Thi công nhà xưởng sản xuất quy mô lớn tại Khu Công Nghiệp Tân Bình.',
      category: 'industrial',
      location: 'KCN Tân Bình, TP. Hồ Chí Minh',
      area: 5000,
      duration: '18 tháng',
      client: 'Công ty Sản Xuất XYZ',
      featured: false,
      status: 'published',
    },
    {
      title: 'Cải Tạo Căn Hộ Landmark 81',
      slug: 'cai-tao-can-ho-landmark-81',
      description: 'Cải tạo và nâng cấp căn hộ cao cấp tại Landmark 81 theo phong cách minimalist.',
      category: 'renovation',
      location: 'Landmark 81, Bình Thạnh',
      area: 120,
      duration: '3 tháng',
      client: 'Anh Trần Văn B',
      featured: true,
      status: 'published',
    },
    {
      title: 'Trung Tâm Thương Mại D1',
      slug: 'trung-tam-thuong-mai-d1',
      description: 'Dự án trung tâm thương mại quy mô lớn tại Quận 1 với đầy đủ tiện ích.',
      category: 'commercial',
      location: 'Quận 1, TP. Hồ Chí Minh',
      area: 15000,
      duration: '24 tháng',
      client: 'Tập đoàn D1',
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
      name: 'Nguyễn Văn An',
      role: 'Chủ nhà',
      company: null,
      content: 'Đội ngũ thi công rất chuyên nghiệp, công trình hoàn thành đúng tiến độ và chất lượng vượt mong đợi. Tôi rất hài lòng với ngôi nhà mới của mình!',
      rating: 5,
      featured: true,
      active: true,
      order: 1,
    },
    {
      name: 'Trần Thị Bích',
      role: 'Giám đốc',
      company: 'Công ty ABC',
      content: 'Văn phòng mới được thiết kế rất đẹp và hiện đại. Nhân viên của tôi đều rất thích không gian làm việc mới này. Cảm ơn đội ngũ đã tư vấn tận tình!',
      rating: 5,
      featured: true,
      active: true,
      order: 2,
    },
    {
      name: 'Lê Minh Tuấn',
      role: 'Chủ đầu tư',
      company: 'Tập đoàn XYZ',
      content: 'Dự án nhà xưởng được hoàn thành đúng hạn với chất lượng tốt. Rất ấn tượng với khả năng quản lý dự án và giải quyết vấn đề của đội ngũ.',
      rating: 5,
      featured: true,
      active: true,
      order: 3,
    },
    {
      name: 'Phạm Thu Hương',
      role: 'Chủ nhà',
      company: null,
      content: 'Cải tạo căn hộ của tôi với chi phí hợp lý và kết quả vượt ngoài mong đợi. Không gian sống bây giờ thoáng đãng và hiện đại hơn rất nhiều.',
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