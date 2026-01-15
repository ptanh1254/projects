import { PrismaClient, Role, ProjectStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu...')

  // 1. Xóa dữ liệu cũ (Clean up) để tránh lỗi trùng lặp khi chạy lại
  await prisma.image.deleteMany()
  await prisma.project.deleteMany()
  await prisma.category.deleteMany()
  await prisma.service.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.heroSlide.deleteMany()
  await prisma.settings.deleteMany()
  await prisma.user.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.contactMessage.deleteMany()

  // 2. Tạo Admin User
  const hashedPassword = await bcrypt.hash('123456', 10) // Mật khẩu là 123456
  
  await prisma.user.create({
    data: {
      email: 'admin@ptadev.io.vn',
      name: 'Admin Quản Trị',
      password: hashedPassword,
      role: Role.admin,
      avatar: 'https://ui-avatars.com/api/?name=Admin+Quản+Trị&background=0D8ABC&color=fff',
    },
  })
  console.log('✅ Đã tạo tài khoản Admin: admin@ptadev.io.vn / 123456')

  // 3. Tạo Danh mục (Categories)
  const catResidential = await prisma.category.create({
    data: {
      name: 'Thiết kế nhà phố',
      slug: 'thiet-ke-nha-pho',
      description: 'Các mẫu thiết kế nhà phố hiện đại, tối ưu diện tích.',
      order: 1,
    },
  })

  const catVilla = await prisma.category.create({
    data: {
      name: 'Biệt thự cao cấp',
      slug: 'biet-thu-cao-cap',
      description: 'Không gian sống đẳng cấp, sang trọng và tiện nghi.',
      order: 2,
    },
  })

  const catInterior = await prisma.category.create({
    data: {
      name: 'Thi công nội thất',
      slug: 'thi-cong-noi-that',
      description: 'Hoàn thiện nội thất trọn gói chất lượng cao.',
      order: 3,
    },
  })

  // 4. Tạo Dự án (Projects)
  await prisma.project.create({
    data: {
      title: 'Biệt Thự Vườn Thảo Điền',
      slug: 'biet-thu-vuon-thao-dien',
      description: '<p>Dự án biệt thự nghỉ dưỡng với không gian xanh mát...</p>',
      category: catVilla.id, // Liên kết với ID category
      location: 'Thảo Điền, TP. Thủ Đức',
      area: 350.5,
      duration: '8 tháng',
      client: 'Anh Minh',
      featured: true,
      status: ProjectStatus.published,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600596542815-2a4d04774c13?auto=format&fit=crop&w=800&q=80',
            publicId: 'sample-villa-1',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
            publicId: 'sample-villa-2',
            order: 1,
          },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'Nhà Phố Hiện Đại Quận 7',
      slug: 'nha-pho-hien-dai-quan-7',
      description: '<p>Thiết kế theo phong cách tối giản, đón nắng tự nhiên...</p>',
      category: catResidential.id,
      location: 'Quận 7, TP. HCM',
      area: 120,
      duration: '5 tháng',
      client: 'Chị Lan',
      featured: true,
      status: ProjectStatus.published,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            publicId: 'sample-townhouse-1',
            order: 0,
          },
        ],
      },
    },
  })

  // 5. Tạo Dịch vụ (Services)
  await prisma.service.createMany({
    data: [
      {
        title: 'Thiết Kế Kiến Trúc',
        slug: 'thiet-ke-kien-truc',
        shortDescription: 'Sáng tạo không gian sống độc bản và thẩm mỹ.',
        description: '<p>Chúng tôi cung cấp giải pháp thiết kế toàn diện...</p>',
        icon: 'PencilRuler', // Tên icon (nếu dùng Lucide/FontAwesome)
        order: 1,
      },
      {
        title: 'Thi Công Xây Dựng',
        slug: 'thi-cong-xay-dung',
        shortDescription: 'Chất lượng công trình bền vững theo thời gian.',
        description: '<p>Đội ngũ kỹ sư giàu kinh nghiệm, giám sát chặt chẽ...</p>',
        icon: 'Hammer',
        order: 2,
      },
      {
        title: 'Tư Vấn Phong Thủy',
        slug: 'tu-van-phong-thuy',
        shortDescription: 'Hài hòa năng lượng, mang lại tài lộc cho gia chủ.',
        description: '<p>Tư vấn hướng nhà, bố trí nội thất hợp mệnh...</p>',
        icon: 'Compass',
        order: 3,
      },
    ],
  })

  // 6. Tạo Slide trang chủ (HeroSlide)
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'Kiến Tạo Không Gian Sống Đẳng Cấp',
        subtitle: 'Chúng tôi biến ngôi nhà mơ ước của bạn thành hiện thực với sự tỉ mỉ trong từng chi tiết.',
        buttonText: 'Xem Dự Án',
        buttonLink: '/projects',
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
        order: 0,
      },
      {
        title: 'Uy Tín & Chất Lượng Vượt Trội',
        subtitle: 'Cam kết tiến độ và chất lượng công trình là ưu tiên hàng đầu.',
        buttonText: 'Liên Hệ Ngay',
        buttonLink: '/contact',
        imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=80',
        order: 1,
      },
    ],
  })

  // 7. Tạo Cài đặt chung (Settings)
  await prisma.settings.create({
    data: {
      companyName: 'Công Ty Xây Dựng PTA Dev',
      tagline: 'Vững Xây Công Trình - Trọn Vẹn Niềm Tin',
      description: 'Chuyên thiết kế và thi công nhà phố, biệt thự uy tín tại Việt Nam.',
      email: 'contact@ptadev.io.vn',
      phone: '0909123456',
      address: '123 Đường Số 1, Quận 1, TP. Hồ Chí Minh',
      workingHours: 'Thứ 2 - Thứ 7: 8:00 - 17:30',
      facebookUrl: 'https://facebook.com',
      youtubeUrl: 'https://youtube.com',
      metaTitle: 'PTA Dev Construction - Xây Dựng Uy Tín',
      metaDescription: 'Dịch vụ xây dựng và thiết kế kiến trúc hàng đầu.',
      slideInterval: 5000,
    },
  })

  // 8. Tạo Feedback khách hàng (Testimonial)
  await prisma.testimonial.create({
    data: {
      name: 'Nguyễn Văn A',
      role: 'Giám đốc Marketing',
      content: 'Tôi rất hài lòng với sự chuyên nghiệp của đội ngũ PTA Dev. Ngôi nhà được hoàn thiện đúng tiến độ và rất đẹp.',
      rating: 5,
      featured: true,
      imageUrl: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random',
    },
  })

  console.log('🏁 Seed dữ liệu hoàn tất!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })