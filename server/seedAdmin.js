const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@cyberkavach.com';
  const password = 'adminPassword123!';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    console.log('Admin already exists!');
    console.log(`Email: ${existingAdmin.email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'FACULTY_COORDINATOR',
      isApproved: true,
      points: 9999
    }
  });

  console.log('Successfully seeded admin user!');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
