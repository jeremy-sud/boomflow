import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { GitHubSyncService } from '@/lib/github-sync-service'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const stats = await GitHubSyncService.getStats(session.user.id)
  const needsSync = await GitHubSyncService.needsSync(session.user.id)

  return NextResponse.json({
    stats,
    needsSync,
    lastSync: stats?.lastSyncAt,
  })
}

export async function POST() {
  const session = await auth()
  if (!session?.user?.id || !session.accessToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const username = session.user.username || session.user.name || ''
  
  try {
    const syncService = new GitHubSyncService(
      session.accessToken,
      session.user.id,
      username
    )

    const stats = await syncService.sync()

    return NextResponse.json({
      success: true,
      stats,
      syncedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('GitHub sync error:', error)
    return NextResponse.json(
      { error: 'Error sincronizando GitHub', details: String(error) },
      { status: 500 }
    )
  }
}
