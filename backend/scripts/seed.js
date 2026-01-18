import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to MongoDB')

    const adminEmail = 'admin@campuspapers.com'
    const adminPassword = 'Admin@123'
    const adminName = 'Admin'

    // Create new admin user with hashed password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      stats: {
        totalUploads: 0,
        totalViews: 0,
        approvedPapers: 0
      },
      badges: []
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('Role: admin')
    console.log('\n🔑 Login Credentials:')
    console.log('   Email: admin@campuspapers.com')
    console.log('   Password: Admin@123')
    console.log('\n📊 After login, the Admin Dashboard will open automatically.')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message)
    process.exit(1)
  }
}

seedAdmin()
