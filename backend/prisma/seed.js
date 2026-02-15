/**
 * Database seed script
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client'
import { seedDefaultBadges } from '../src/services/badgeEngine.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding BOOMFLOW database...\n')

  // Seed default badges
  await seedDefaultBadges()

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { slug: 'sistemas-ursol' },
    update: {},
    create: {
      name: 'SistemasUrsol',
      slug: 'sistemas-ursol',
      description: 'Desarrollo de software a medida',
      plan: 'PRO'
    }
  })
  console.log(`✅ Organization: ${org.name}`)

  // Create demo team
  const team = await prisma.team.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: 'Engineering'
      }
    },
    update: {},
    create: {
      name: 'Engineering',
      description: 'Core development team',
      color: '#3B82F6',
      organizationId: org.id
    }
  })
  console.log(`✅ Team: ${team.name}`)

  // Create demo users
  const users = [
    {
      email: 'jeremy@sistemasursol.com',
      username: 'jeremy-sud',
      displayName: 'Jeremy Alva',
      role: 'ADMIN'
    },
    {
      email: 'demo@sistemasursol.com',
      username: 'ursolcr',
      displayName: 'Ursol CR',
      role: 'MEMBER'
    }
  ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: {
        ...userData,
        organizationId: org.id,
        teamId: team.id
      }
    })
    console.log(`✅ User: ${user.displayName} (@${user.username})`)
  }

  console.log('\n🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
