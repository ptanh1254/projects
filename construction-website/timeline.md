# HƯỚNG DẪN THỰC HIỆN DỰ ÁN WEBSITE CÔNG TY XÂY DỰNG
## (Phiên bản đầy đủ với lệnh Terminal và Checklist chi tiết)

---

## 📋 MỤC LỤC

1. [Giai đoạn 1: Chuẩn bị và Cài đặt môi trường](#giai-đoạn-1-chuẩn-bị-và-cài-đặt-môi-trường)
2. [Giai đoạn 2: Thiết lập Database](#giai-đoạn-2-thiết-lập-database)
3. [Giai đoạn 3: Thiết lập Services bên thứ 3](#giai-đoạn-3-thiết-lập-services-bên-thứ-3)
4. [Giai đoạn 4: Xây dựng Backend (API)](#giai-đoạn-4-xây-dựng-backend-api)
5. [Giai đoạn 5: Xây dựng Frontend Public](#giai-đoạn-5-xây-dựng-frontend-public)
6. [Giai đoạn 6: Xây dựng Admin Dashboard](#giai-đoạn-6-xây-dựng-admin-dashboard)
7. [Giai đoạn 7: SEO và Tối ưu hóa](#giai-đoạn-7-seo-và-tối-ưu-hóa)
8. [Giai đoạn 8: Testing](#giai-đoạn-8-testing)
9. [Giai đoạn 9: Deployment](#giai-đoạn-9-deployment)
10. [Giai đoạn 10: Bàn giao và Documentation](#giai-đoạn-10-bàn-giao-và-documentation)
11. [**CHECKLIST THỨ TỰ CODE CHI TIẾT**](#checklist-thứ-tự-code-chi-tiết)

---

## GIAI ĐOẠN 1: CHUẨN BỊ VÀ CÀI ĐẶT MÔI TRƯỜNG

### Bước 1.1: Kiểm tra và cài đặt Node.js

**Kiểm tra Node.js đã cài chưa:**
```bash
node --version
```
> Kết quả mong đợi: v18.17.0 trở lên

**Nếu chưa cài hoặc version thấp, tải từ:** https://nodejs.org/

**Kiểm tra npm:**
```bash
npm --version
```
> Kết quả mong đợi: 9.x trở lên

### Bước 1.2: Cài đặt Git

**Kiểm tra Git:**
```bash
git --version
```

**Nếu chưa cài:**
- Windows: Tải từ https://git-scm.com/
- Mac: 
```bash
brew install git
```
- Linux:
```bash
sudo apt-get install git
```

### Bước 1.3: Khởi tạo dự án Next.js

**Mở Terminal, di chuyển đến thư mục muốn tạo project:**
```bash
cd ~/Documents/Projects
# hoặc thư mục bạn muốn
```

**Tạo project Next.js mới:**
```bash
npx create-next-app@latest construction-website
```

**Khi được hỏi, chọn các tùy chọn sau:**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

**Di chuyển vào thư mục project:**
```bash
cd construction-website
```

**Mở project trong VS Code:**
```bash
code .
```

### Bước 1.4: Cài đặt các Dependencies

**Cài đặt dependencies chính (chạy từng lệnh hoặc gộp lại):**

```bash
# Animation
npm install framer-motion

# Database & ORM
npm install prisma @prisma/client

# Authentication
npm install next-auth

# Form & Validation
npm install react-hook-form zod @hookform/resolvers

# UI Components
npm install @headlessui/react lucide-react

# Image Upload
npm install cloudinary next-cloudinary

# Email
npm install resend

# SEO
npm install next-seo next-sitemap

# Utilities
npm install clsx date-fns bcryptjs

# Rich Text Editor (chọn 1 trong 2)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
# hoặc
npm install react-quill
```

**Cài đặt Dev Dependencies:**
```bash
npm install -D @types/bcryptjs
```

**Hoặc cài tất cả cùng lúc:**
```bash
npm install framer-motion prisma @prisma/client next-auth react-hook-form zod @hookform/resolvers @headlessui/react lucide-react cloudinary next-cloudinary resend next-seo next-sitemap clsx date-fns bcryptjs @tiptap/react @tiptap/starter-kit @tiptap/extension-image

npm install -D @types/bcryptjs
```

### Bước 1.5: Tạo cấu trúc thư mục

**Chạy các lệnh sau để tạo thư mục:**

```bash
# Tạo thư mục trong src/app
mkdir -p src/app/\(public\)/portfolio
mkdir -p src/app/\(public\)/services
mkdir -p src/app/\(public\)/about
mkdir -p src/app/\(public\)/contact
mkdir -p src/app/\(public\)/quote

mkdir -p src/app/admin/login
mkdir -p src/app/admin/dashboard
mkdir -p src/app/admin/projects
mkdir -p src/app/admin/services
mkdir -p src/app/admin/quotes
mkdir -p src/app/admin/contacts
mkdir -p src/app/admin/media
mkdir -p src/app/admin/settings
mkdir -p src/app/admin/account

mkdir -p src/app/api/auth
mkdir -p src/app/api/projects
mkdir -p src/app/api/services
mkdir -p src/app/api/contact
mkdir -p src/app/api/quote
mkdir -p src/app/api/admin/projects
mkdir -p src/app/api/admin/services
mkdir -p src/app/api/admin/quotes
mkdir -p src/app/api/admin/contacts
mkdir -p src/app/api/admin/media
mkdir -p src/app/api/admin/settings
mkdir -p src/app/api/admin/stats
mkdir -p src/app/api/admin/account

# Tạo thư mục components
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/sections
mkdir -p src/components/admin

# Tạo thư mục lib, types, hooks, constants
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/constants
```

**Tạo các file placeholder:**
```bash
# Tạo file trong lib
touch src/lib/db.ts
touch src/lib/auth.ts
touch src/lib/cloudinary.ts
touch src/lib/email.ts
touch src/lib/utils.ts
touch src/lib/validations.ts

# Tạo file types
touch src/types/index.ts

# Tạo file constants
touch src/constants/index.ts
```

### Bước 1.6: Tạo file môi trường

**Tạo file .env.local:**
```bash
touch .env.local
```

**Mở file và thêm nội dung:**
```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""

# Email (Resend)
RESEND_API_KEY=""
ADMIN_EMAIL="admin@yourcompany.com"

# Analytics (optional)
NEXT_PUBLIC_GA_ID=""
```

**Tạo file .env.example (để tham khảo):**
```bash
cp .env.local .env.example
```
> Sau đó xóa các giá trị nhạy cảm trong .env.example

**Kiểm tra .gitignore đã có .env.local chưa:**
```bash
cat .gitignore | grep env
```
> Nếu chưa có, thêm vào:
```bash
echo ".env.local" >> .gitignore
```

### Bước 1.7: Chạy thử project

**Khởi động development server:**
```bash
npm run dev
```

**Mở trình duyệt:** http://localhost:3000

**Dừng server:** `Ctrl + C`

---

## GIAI ĐOẠN 2: THIẾT LẬP DATABASE

### Bước 2.1: Tạo tài khoản Supabase

1. Truy cập: https://supabase.com
2. Click "Start your project"
3. Đăng nhập bằng GitHub
4. Click "New Project"
5. Điền thông tin:
   - Name: `construction-website`
   - Database Password: (tạo password mạnh và LƯU LẠI)
   - Region: `Southeast Asia (Singapore)`
6. Click "Create new project"
7. Đợi 2-3 phút để project khởi tạo

### Bước 2.2: Lấy Connection String

1. Trong Supabase Dashboard, vào **Settings** (icon bánh răng)
2. Click **Database** trong menu trái
3. Scroll xuống **Connection string**
4. Chọn tab **URI**
5. Copy connection string
6. Thay `[YOUR-PASSWORD]` bằng password đã tạo
7. Dán vào `DATABASE_URL` trong file `.env.local`

### Bước 2.3: Khởi tạo Prisma

**Chạy lệnh khởi tạo:**
```bash
npx prisma init
```

**Kết quả:** Tạo thư mục `prisma/` với file `schema.prisma`

**Mở file `prisma/schema.prisma` và thay thế toàn bộ nội dung:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== MODELS ====================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  avatar    String?
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  category    String   // residential, commercial, industrial, renovation
  location    String
  area        Float?
  duration    String?
  client      String?
  images      Image[]
  featured    Boolean  @default(false)
  status      String   @default("draft") // draft, published
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Image {
  id        String   @id @default(cuid())
  url       String
  publicId  String
  projectId String?
  project   Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model Service {
  id               String   @id @default(cuid())
  title            String
  slug             String   @unique
  shortDescription String   @db.VarChar(300)
  description      String   @db.Text
  icon             String?
  imageUrl         String?
  order            Int      @default(0)
  active           Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model Quote {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String
  projectType String
  location    String
  area        Float?
  budget      String?
  timeline    String?
  message     String?  @db.Text
  fileUrl     String?
  status      String   @default("new") // new, viewed, processed
  adminNote   String?  @db.Text
  createdAt   DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String   @db.Text
  status    String   @default("unread") // unread, read
  createdAt DateTime @default(now())
}

model Settings {
  id                String   @id @default(cuid())
  companyName       String
  tagline           String?
  description       String?  @db.Text
  email             String
  phone             String
  address           String
  workingHours      String?
  facebookUrl       String?
  instagramUrl      String?
  linkedinUrl       String?
  youtubeUrl        String?
  logoUrl           String?
  faviconUrl        String?
  googleMapsUrl     String?
  metaTitle         String?
  metaDescription   String?  @db.Text
  googleAnalyticsId String?
  updatedAt         DateTime @updatedAt
}
```

### Bước 2.4: Tạo Prisma Client Singleton

**Mở file `src/lib/db.ts` và thêm code:**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

### Bước 2.5: Chạy Migration

**Tạo và áp dụng migration:**
```bash
npx prisma migrate dev --name init
```

**Kết quả mong đợi:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema.
```

**Kiểm tra database đã tạo tables:**
```bash
npx prisma studio
```
> Mở trình duyệt tại http://localhost:5555 để xem các tables

**Dừng Prisma Studio:** `Ctrl + C`

### Bước 2.6: Tạo Seed Data

**Tạo file `prisma/seed.ts`:**
```bash
touch prisma/seed.ts
```

**Thêm nội dung vào file `prisma/seed.ts`:**

```typescript
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
```

**Cập nhật `package.json`, thêm vào cuối file (trước dấu `}` cuối cùng):**

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Cài đặt ts-node:**
```bash
npm install -D ts-node
```

**Chạy seed:**
```bash
npx prisma db seed
```

**Kết quả mong đợi:**
```
🌱 Seeding database...
✅ Admin user created: admin@company.com
✅ Settings created
✅ Services created: 6
✅ Projects created: 5
🎉 Seeding completed!
```

**Kiểm tra data:**
```bash
npx prisma studio
```

---

## GIAI ĐOẠN 3: THIẾT LẬP SERVICES BÊN THỨ 3

### Bước 3.1: Thiết lập Cloudinary

**Tạo tài khoản:**
1. Truy cập: https://cloudinary.com
2. Click "Sign Up For Free"
3. Đăng ký với email hoặc Google/GitHub
4. Verify email

**Lấy credentials:**
1. Sau khi đăng nhập, vào **Dashboard**
2. Ở phần **Account Details**, copy:
   - Cloud Name
   - API Key
   - API Secret

**Tạo Upload Preset:**
1. Vào **Settings** (icon bánh răng góc trên phải)
2. Click **Upload** trong menu trái
3. Scroll xuống **Upload presets**
4. Click **Add upload preset**
5. Cấu hình:
   - Signing Mode: `Unsigned`
   - Folder: `construction-website`
6. Click **Save**
7. Copy tên preset

**Cập nhật `.env.local`:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-preset-name"
```

**Tạo file `src/lib/cloudinary.ts`:**

```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Helper function to delete image
export async function deleteCloudinaryImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Generate optimized URL
export function getOptimizedUrl(publicId: string, options?: {
  width?: number
  height?: number
  quality?: string
}) {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: options?.quality || 'auto',
    width: options?.width,
    height: options?.height,
    crop: 'fill',
  })
}
```

### Bước 3.2: Thiết lập Resend (Email)

**Tạo tài khoản:**
1. Truy cập: https://resend.com
2. Click "Start Building"
3. Đăng ký với email hoặc GitHub
4. Verify email

**Tạo API Key:**
1. Sau khi đăng nhập, vào **API Keys** trong menu trái
2. Click **Create API Key**
3. Đặt tên: `construction-website`
4. Permission: `Full access`
5. Click **Create**
6. Copy API Key (chỉ hiện 1 lần!)

**Cập nhật `.env.local`:**
```env
RESEND_API_KEY="re_xxxxxxxx"
ADMIN_EMAIL="your-email@domain.com"
```

**Tạo file `src/lib/email.ts`:**

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@company.com'
const FROM_EMAIL = 'noreply@resend.dev' // Dùng domain verify của bạn sau

// Gửi thông báo khi có báo giá mới
export async function sendQuoteNotification(data: {
  name: string
  email: string
  phone: string
  projectType: string
  location: string
  area?: number
  budget?: string
  timeline?: string
  message?: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[Website] Yêu cầu báo giá mới từ ${data.name}`,
      html: `
        <h2>Yêu cầu báo giá mới</h2>
        <p><strong>Khách hàng:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Điện thoại:</strong> ${data.phone}</p>
        <p><strong>Loại dự án:</strong> ${data.projectType}</p>
        <p><strong>Địa điểm:</strong> ${data.location}</p>
        ${data.area ? `<p><strong>Diện tích:</strong> ${data.area} m²</p>` : ''}
        ${data.budget ? `<p><strong>Ngân sách:</strong> ${data.budget}</p>` : ''}
        ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
        ${data.message ? `<p><strong>Ghi chú:</strong> ${data.message}</p>` : ''}
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending quote notification:', error)
    return { success: false, error }
  }
}

// Gửi thông báo khi có tin nhắn liên hệ
export async function sendContactNotification(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[Website] Tin nhắn mới từ ${data.name}`,
      html: `
        <h2>Tin nhắn liên hệ mới</h2>
        <p><strong>Từ:</strong> ${data.name} (${data.email})</p>
        ${data.phone ? `<p><strong>Điện thoại:</strong> ${data.phone}</p>` : ''}
        ${data.subject ? `<p><strong>Chủ đề:</strong> ${data.subject}</p>` : ''}
        <p><strong>Nội dung:</strong></p>
        <p>${data.message}</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending contact notification:', error)
    return { success: false, error }
  }
}

// Gửi email tự động trả lời
export async function sendAutoReply(data: {
  to: string
  name: string
  type: 'quote' | 'contact'
}) {
  const subject = data.type === 'quote' 
    ? 'Cảm ơn bạn đã gửi yêu cầu báo giá'
    : 'Cảm ơn bạn đã liên hệ'

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: subject,
      html: `
        <p>Xin chào ${data.name},</p>
        <p>Cảm ơn bạn đã quan tâm đến dịch vụ của chúng tôi!</p>
        <p>Chúng tôi đã nhận được ${data.type === 'quote' ? 'yêu cầu báo giá' : 'tin nhắn'} của bạn và sẽ phản hồi trong vòng 24 giờ.</p>
        <br>
        <p>Trân trọng,</p>
        <p><strong>Công Ty Xây Dựng ABC</strong></p>
        <p>Hotline: 0909 123 456</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending auto reply:', error)
    return { success: false, error }
  }
}
```

### Bước 3.3: Thiết lập NextAuth

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
> Copy kết quả vào `NEXTAUTH_SECRET` trong `.env.local`

**Hoặc dùng online generator:** https://generate-secret.vercel.app/32

**Tạo file `src/lib/auth.ts`:**

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email và mật khẩu là bắt buộc')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('Email không tồn tại')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Mật khẩu không đúng')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).role = token.role
      }
      return session
    },
  },
}
```

**Tạo API route cho NextAuth:**
```bash
touch src/app/api/auth/\[...nextauth\]/route.ts
```

**Thêm nội dung vào `src/app/api/auth/[...nextauth]/route.ts`:**

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

**Tạo file types cho NextAuth (`src/types/next-auth.d.ts`):**
```bash
touch src/types/next-auth.d.ts
```

```typescript
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
```

### Bước 3.4: Tạo file Validations

**Mở file `src/lib/validations.ts` và thêm:**

```typescript
import { z } from 'zod'

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
})

// Quote Form Schema
export const quoteSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  projectType: z.enum(['residential', 'commercial', 'industrial', 'renovation'], {
    errorMap: () => ({ message: 'Vui lòng chọn loại dự án' }),
  }),
  location: z.string().min(5, 'Địa điểm phải có ít nhất 5 ký tự'),
  area: z.number().positive('Diện tích phải lớn hơn 0').optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
})

// Project Schema (Admin)
export const projectSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
  category: z.enum(['residential', 'commercial', 'industrial', 'renovation']),
  location: z.string().min(5, 'Địa điểm phải có ít nhất 5 ký tự'),
  area: z.number().positive().optional(),
  duration: z.string().optional(),
  client: z.string().optional(),
  status: z.enum(['draft', 'published']),
  featured: z.boolean(),
})

// Service Schema (Admin)
export const serviceSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  shortDescription: z.string().max(300, 'Mô tả ngắn tối đa 300 ký tự'),
  description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().int(),
  active: z.boolean(),
})

// Settings Schema (Admin)
export const settingsSchema = z.object({
  companyName: z.string().min(2, 'Tên công ty là bắt buộc'),
  tagline: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  workingHours: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  googleMapsUrl: z.string().optional(),
})

// Export types
export type ContactFormData = z.infer<typeof contactSchema>
export type QuoteFormData = z.infer<typeof quoteSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
```

### Bước 3.5: Tạo file Utils

**Mở file `src/lib/utils.ts` và thêm:**

```typescript
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
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('vi-VN')
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Category labels
export const categoryLabels: Record<string, string> = {
  residential: 'Nhà Ở',
  commercial: 'Thương Mại',
  industrial: 'Công Nghiệp',
  renovation: 'Cải Tạo',
}

// Status labels
export const statusLabels: Record<string, string> = {
  draft: 'Nháp',
  published: 'Đã xuất bản',
  new: 'Mới',
  viewed: 'Đã xem',
  processed: 'Đã xử lý',
  unread: 'Chưa đọc',
  read: 'Đã đọc',
}
```

---

## GIAI ĐOẠN 4: XÂY DỰNG BACKEND (API)

### Bước 4.1: Tạo Public APIs

**Tạo file `src/app/api/projects/route.ts`:**

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page') || '1'

    const where: any = {
      status: 'published',
    }

    if (category && category !== 'all') {
      where.category = category
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1, // Only get first image for list
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      skip: limit ? (parseInt(page) - 1) * parseInt(limit) : undefined,
    })

    const total = await prisma.project.count({ where })

    return NextResponse.json({
      projects,
      total,
      page: parseInt(page),
      totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Tạo file `src/app/api/projects/[slug]/route.ts`:**

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { 
        slug: params.slug,
        status: 'published',
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get related projects
    const relatedProjects = await prisma.project.findMany({
      where: {
        category: project.category,
        status: 'published',
        id: { not: project.id },
      },
      include: {
        images: { take: 1 },
      },
      take: 4,
    })

    return NextResponse.json({ project, relatedProjects })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Tạo file `src/app/api/projects/featured/route.ts`:**

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: 'published',
        featured: true,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Tạo file `src/app/api/services/route.ts`:**

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Tạo file `src/app/api/settings/route.ts`:**

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Tạo file `src/app/api/contact/route.ts`:**

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { contactSchema } from '@/lib/validations'
import { sendContactNotification, sendAutoReply } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)

    // Save to database
    const contact = await prisma.contactMessage.create({
      data: validatedData,
    })

    // Send notifications
    await sendContactNotification(validatedData)
    await sendAutoReply({
      to: validatedData.email,
      name: validatedData.name,
      type: 'contact',
    })

    return NextResponse.json({
      success: true,
      message: 'Tin nhắn đã được gửi thành công!',
      id: contact.id,
    })
  } catch (error: any) {
    console.error('Error creating contact:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
```

**Tạo file `src/app/api/quote/route.ts`:**

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { quoteSchema } from '@/lib/validations'
import { sendQuoteNotification, sendAutoReply } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = quoteSchema.parse(body)

    // Save to database
    const quote = await prisma.quote.create({
      data: validatedData,
    })

    // Send notifications
    await sendQuoteNotification(validatedData)
    await sendAutoReply({
      to: validatedData.email,
      name: validatedData.name,
      type: 'quote',
    })

    return NextResponse.json({
      success: true,
      message: 'Yêu cầu báo giá đã được gửi thành công!',
      id: quote.id,
    })
  } catch (error: any) {
    console.error('Error creating quote:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
```

### Bước 4.2: Tạo Admin Middleware

**Tạo file `src/lib/admin-auth.ts`:**

```typescript
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from './auth'

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  return { authorized: true, session }
}
```

### Bước 4.3: Tạo Admin APIs

(Tương tự tạo các file API cho admin - do giới hạn độ dài, tôi sẽ liệt kê trong checklist)

---

## GIAI ĐOẠN 5-10: (Tiếp tục với Frontend, Admin Dashboard, SEO, Testing, Deployment)

*Do giới hạn độ dài response, các giai đoạn 5-10 sẽ được hướng dẫn chi tiết trong phần CHECKLIST bên dưới*

---

# ✅ CHECKLIST THỨ TỰ CODE CHI TIẾT

## 📌 NGUYÊN TẮC: Code theo thứ tự sau để đảm bảo các phần phụ thuộc lẫn nhau hoạt động đúng

---

## PHASE 1: SETUP & DATABASE (Ngày 1)

### 1.1 Setup Environment
- [ ] Cài Node.js >= 18.17
- [ ] Cài Git
- [ ] Tạo project Next.js: `npx create-next-app@latest construction-website`
- [ ] Cài tất cả dependencies (xem Bước 1.4)
- [ ] Tạo cấu trúc thư mục (xem Bước 1.5)
- [ ] Tạo file `.env.local`
- [ ] Chạy thử: `npm run dev`

### 1.2 Database Setup
- [ ] Tạo tài khoản Supabase
- [ ] Tạo project trên Supabase
- [ ] Copy connection string vào `.env.local`
- [ ] Chạy: `npx prisma init`
- [ ] Tạo schema trong `prisma/schema.prisma`
- [ ] Tạo file `src/lib/db.ts`
- [ ] Chạy migration: `npx prisma migrate dev --name init`
- [ ] Tạo file `prisma/seed.ts`
- [ ] Chạy seed: `npx prisma db seed`
- [ ] Kiểm tra: `npx prisma studio`

### 1.3 Third-party Services
- [ ] Tạo tài khoản Cloudinary
- [ ] Lấy credentials Cloudinary
- [ ] Tạo Upload Preset
- [ ] Cập nhật `.env.local` với Cloudinary
- [ ] Tạo file `src/lib/cloudinary.ts`
- [ ] Tạo tài khoản Resend
- [ ] Lấy API Key Resend
- [ ] Cập nhật `.env.local` với Resend
- [ ] Tạo file `src/lib/email.ts`
- [ ] Generate NEXTAUTH_SECRET
- [ ] Tạo file `src/lib/auth.ts`
- [ ] Tạo file `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Tạo file `src/types/next-auth.d.ts`

### 1.4 Utility Files
- [ ] Tạo file `src/lib/validations.ts`
- [ ] Tạo file `src/lib/utils.ts`
- [ ] Tạo file `src/lib/admin-auth.ts`

---

## PHASE 2: BACKEND APIs (Ngày 2-3)

### 2.1 Public APIs
- [ ] `src/app/api/projects/route.ts` - GET all projects
- [ ] `src/app/api/projects/[slug]/route.ts` - GET project detail
- [ ] `src/app/api/projects/featured/route.ts` - GET featured projects
- [ ] `src/app/api/services/route.ts` - GET all services
- [ ] `src/app/api/services/[slug]/route.ts` - GET service detail
- [ ] `src/app/api/settings/route.ts` - GET settings
- [ ] `src/app/api/contact/route.ts` - POST contact message
- [ ] `src/app/api/quote/route.ts` - POST quote request

### 2.2 Admin APIs - Projects
- [ ] `src/app/api/admin/projects/route.ts` - GET all, POST create
- [ ] `src/app/api/admin/projects/[id]/route.ts` - GET, PUT, DELETE

### 2.3 Admin APIs - Services
- [ ] `src/app/api/admin/services/route.ts` - GET all, POST create
- [ ] `src/app/api/admin/services/[id]/route.ts` - GET, PUT, DELETE
- [ ] `src/app/api/admin/services/reorder/route.ts` - PUT reorder

### 2.4 Admin APIs - Quotes
- [ ] `src/app/api/admin/quotes/route.ts` - GET all
- [ ] `src/app/api/admin/quotes/[id]/route.ts` - GET, PUT status, DELETE

### 2.5 Admin APIs - Contacts
- [ ] `src/app/api/admin/contacts/route.ts` - GET all
- [ ] `src/app/api/admin/contacts/[id]/route.ts` - PUT read, DELETE

### 2.6 Admin APIs - Media & Settings
- [ ] `src/app/api/admin/upload/route.ts` - POST upload
- [ ] `src/app/api/admin/media/[id]/route.ts` - DELETE
- [ ] `src/app/api/admin/settings/route.ts` - GET, PUT
- [ ] `src/app/api/admin/stats/route.ts` - GET dashboard stats

### 2.7 Admin APIs - Account
- [ ] `src/app/api/admin/account/route.ts` - PUT update profile
- [ ] `src/app/api/admin/account/password/route.ts` - PUT change password

---

## PHASE 3: UI COMPONENTS (Ngày 4)

### 3.1 Basic UI Components (src/components/ui/)
- [ ] `Button.tsx` - Buttons với variants
- [ ] `Input.tsx` - Text input với error state
- [ ] `Textarea.tsx` - Textarea với error state
- [ ] `Select.tsx` - Dropdown select
- [ ] `Card.tsx` - Card container
- [ ] `Badge.tsx` - Status badges
- [ ] `Modal.tsx` - Modal dialog
- [ ] `Spinner.tsx` - Loading spinner
- [ ] `Skeleton.tsx` - Loading skeleton

### 3.2 Layout Components (src/components/layout/)
- [ ] `Header.tsx` - Main header với navigation
- [ ] `Footer.tsx` - Main footer
- [ ] `MobileMenu.tsx` - Mobile navigation drawer
- [ ] `Container.tsx` - Max-width container
- [ ] `Breadcrumb.tsx` - Breadcrumb navigation

---

## PHASE 4: FRONTEND PUBLIC (Ngày 5-7)

### 4.1 Layout & Shared
- [ ] `src/app/(public)/layout.tsx` - Public layout với Header/Footer
- [ ] `src/app/layout.tsx` - Root layout với providers
- [ ] `src/app/globals.css` - Global styles

### 4.2 Homepage Sections (src/components/sections/)
- [ ] `HeroSection.tsx` - Hero banner
- [ ] `StatsSection.tsx` - Statistics counter
- [ ] `ServicesOverview.tsx` - Services grid
- [ ] `FeaturedProjects.tsx` - Featured projects grid
- [ ] `WhyChooseUs.tsx` - Why choose us section
- [ ] `TestimonialsSection.tsx` - Testimonials slider
- [ ] `CTASection.tsx` - Call to action

### 4.3 Homepage
- [ ] `src/app/(public)/page.tsx` - Trang chủ

### 4.4 Portfolio Pages
- [ ] `src/app/(public)/portfolio/page.tsx` - Danh sách dự án
- [ ] `src/app/(public)/portfolio/[slug]/page.tsx` - Chi tiết dự án
- [ ] `src/components/sections/ProjectCard.tsx` - Project card component
- [ ] `src/components/sections/ProjectGallery.tsx` - Image gallery với lightbox
- [ ] `src/components/sections/ProjectFilter.tsx` - Category filter

### 4.5 Services Pages
- [ ] `src/app/(public)/services/page.tsx` - Danh sách dịch vụ
- [ ] `src/components/sections/ServiceCard.tsx` - Service card
- [ ] `src/components/sections/ProcessTimeline.tsx` - Process steps

### 4.6 About Page
- [ ] `src/app/(public)/about/page.tsx` - Giới thiệu

### 4.7 Contact Page
- [ ] `src/app/(public)/contact/page.tsx` - Liên hệ
- [ ] `src/components/forms/ContactForm.tsx` - Contact form

### 4.8 Quote Page
- [ ] `src/app/(public)/quote/page.tsx` - Yêu cầu báo giá
- [ ] `src/components/forms/QuoteForm.tsx` - Multi-step quote form

---

## PHASE 5: ADMIN DASHBOARD (Ngày 8-11)

### 5.1 Admin Layout Components (src/components/admin/)
- [ ] `Sidebar.tsx` - Admin sidebar navigation
- [ ] `TopBar.tsx` - Admin top bar
- [ ] `AdminCard.tsx` - Dashboard stat card
- [ ] `DataTable.tsx` - Reusable data table
- [ ] `Pagination.tsx` - Pagination component
- [ ] `SearchInput.tsx` - Search input
- [ ] `StatusBadge.tsx` - Status badge
- [ ] `ConfirmModal.tsx` - Delete confirmation modal
- [ ] `ImageUploader.tsx` - Image upload component
- [ ] `RichTextEditor.tsx` - Rich text editor wrapper

### 5.2 Admin Layout
- [ ] `src/app/admin/layout.tsx` - Admin layout với auth check

### 5.3 Admin Login
- [ ] `src/app/admin/login/page.tsx` - Login page
- [ ] `src/components/admin/LoginForm.tsx` - Login form

### 5.4 Admin Dashboard
- [ ] `src/app/admin/dashboard/page.tsx` - Dashboard overview
- [ ] `src/components/admin/StatsCards.tsx` - Stats cards row
- [ ] `src/components/admin/RecentQuotes.tsx` - Recent quotes table

### 5.5 Projects Management
- [ ] `src/app/admin/projects/page.tsx` - Projects list
- [ ] `src/app/admin/projects/new/page.tsx` - Create project
- [ ] `src/app/admin/projects/[id]/edit/page.tsx` - Edit project
- [ ] `src/components/admin/ProjectForm.tsx` - Project form
- [ ] `src/components/admin/ImageGalleryManager.tsx` - Manage project images

### 5.6 Services Management
- [ ] `src/app/admin/services/page.tsx` - Services list (với drag reorder)
- [ ] `src/app/admin/services/new/page.tsx` - Create service
- [ ] `src/app/admin/services/[id]/edit/page.tsx` - Edit service
- [ ] `src/components/admin/ServiceForm.tsx` - Service form

### 5.7 Quotes Management
- [ ] `src/app/admin/quotes/page.tsx` - Quotes list với tabs
- [ ] `src/app/admin/quotes/[id]/page.tsx` - Quote detail
- [ ] `src/components/admin/QuoteDetail.tsx` - Quote detail view

### 5.8 Contacts Management
- [ ] `src/app/admin/contacts/page.tsx` - Contacts list
- [ ] `src/components/admin/ContactDetail.tsx` - Contact detail modal

### 5.9 Media Library
- [ ] `src/app/admin/media/page.tsx` - Media library grid
- [ ] `src/components/admin/MediaGrid.tsx` - Media grid component
- [ ] `src/components/admin/MediaDetail.tsx` - Media detail modal

### 5.10 Settings
- [ ] `src/app/admin/settings/page.tsx` - Settings với tabs
- [ ] `src/components/admin/SettingsForm.tsx` - Settings form

### 5.11 Account
- [ ] `src/app/admin/account/page.tsx` - Account settings
- [ ] `src/components/admin/ProfileForm.tsx` - Profile form
- [ ] `src/components/admin/PasswordForm.tsx` - Change password form

---

## PHASE 6: SEO & OPTIMIZATION (Ngày 12)

### 6.1 SEO Setup
- [ ] Cấu hình `next.config.js` cho images
- [ ] Tạo `src/lib/seo.ts` - Default SEO config
- [ ] Thêm metadata cho mỗi page
- [ ] Tạo `next-sitemap.config.js`
- [ ] Thêm postbuild script cho sitemap

### 6.2 Structured Data
- [ ] Tạo `src/components/JsonLd.tsx` - JSON-LD component
- [ ] Thêm Organization schema
- [ ] Thêm Service schema
- [ ] Thêm Project schema

### 6.3 Performance
- [ ] Optimize images với next/image
- [ ] Add loading states/skeletons
- [ ] Dynamic imports cho heavy components
- [ ] Bundle analyzer check

---

## PHASE 7: TESTING (Ngày 13-14)

### 7.1 Functional Testing
- [ ] Test tất cả forms (contact, quote)
- [ ] Test authentication flow
- [ ] Test CRUD operations (projects, services)
- [ ] Test image upload
- [ ] Test email sending

### 7.2 UI Testing
- [ ] Test responsive trên mobile
- [ ] Test responsive trên tablet
- [ ] Test responsive trên desktop
- [ ] Test tất cả hover effects
- [ ] Test modals, dropdowns

### 7.3 Performance Testing
- [ ] Chạy Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test loading times

### 7.4 Cross-browser Testing
- [ ] Test Chrome
- [ ] Test Firefox
- [ ] Test Safari
- [ ] Test Edge

---

## PHASE 8: DEPLOYMENT (Ngày 15)

### 8.1 Pre-deployment
- [ ] Review tất cả environment variables
- [ ] Remove console.logs
- [ ] Test production build locally: `npm run build && npm start`

### 8.2 Deploy
- [ ] Push code lên GitHub
- [ ] Connect repo với Vercel
- [ ] Set environment variables trên Vercel
- [ ] Deploy
- [ ] Setup custom domain

### 8.3 Post-deployment
- [ ] Test website live
- [ ] Submit sitemap to Google Search Console
- [ ] Setup monitoring

---

## PHASE 9: DOCUMENTATION (Ngày 16)

### 9.1 Technical Docs
- [ ] Hoàn thiện README.md
- [ ] Tạo API documentation
- [ ] Document environment variables

### 9.2 User Docs
- [ ] Tạo Admin User Guide (PDF)
- [ ] Tạo video hướng dẫn (optional)

### 9.3 Handover
- [ ] Chuẩn bị tất cả credentials
- [ ] Training session
- [ ] Bàn giao

---

## 📊 TỔNG KẾT CHECKLIST

| Phase | Số tasks | Thời gian |
|-------|----------|-----------|
| Phase 1: Setup & Database | 28 tasks | 1 ngày |
| Phase 2: Backend APIs | 20 tasks | 2 ngày |
| Phase 3: UI Components | 14 tasks | 1 ngày |
| Phase 4: Frontend Public | 19 tasks | 3 ngày |
| Phase 5: Admin Dashboard | 27 tasks | 4 ngày |
| Phase 6: SEO & Optimization | 10 tasks | 1 ngày |
| Phase 7: Testing | 16 tasks | 2 ngày |
| Phase 8: Deployment | 9 tasks | 1 ngày |
| Phase 9: Documentation | 7 tasks | 1 ngày |
| **TỔNG** | **150 tasks** | **16 ngày** |

---

## 🔥 LƯU Ý QUAN TRỌNG

1. **Luôn chạy `npm run dev` để test trong khi code**
2. **Commit thường xuyên sau mỗi feature hoàn thành**
3. **Test API bằng Postman hoặc Thunder Client trước khi làm frontend**
4. **Kiểm tra TypeScript errors trước khi chuyển sang task mới**
5. **Backup database định kỳ khi làm việc với data quan trọng**

---

## 📝 LỆNH TERMINAL THƯỜNG DÙNG

```bash
# Development
npm run dev                    # Chạy dev server
npm run build                  # Build production
npm run start                  # Chạy production build
npm run lint                   # Kiểm tra linting

# Prisma
npx prisma migrate dev         # Tạo migration mới
npx prisma migrate deploy      # Apply migration (production)
npx prisma db seed             # Chạy seed
npx prisma studio              # Mở Prisma Studio
npx prisma generate            # Generate Prisma Client

# Git
git add .                      # Stage all changes
git commit -m "message"        # Commit
git push origin main           # Push to remote
git pull origin main           # Pull from remote

# Package management
npm install <package>          # Cài package
npm install -D <package>       # Cài dev dependency
npm uninstall <package>        # Gỡ package
npm update                     # Update packages
```

---

**Chúc bạn thực hiện dự án thành công! 🚀**
