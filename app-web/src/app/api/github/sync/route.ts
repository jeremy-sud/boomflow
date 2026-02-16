import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { GitHubSyncService } from '@/lib/github-sync-service'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const stats = await GitHubSyncService.getStats(session.user.id)
    const needsSync = await GitHubSyncService.needsSync(session.user.id)

    return NextResponse.json({
      stats,
      needsSync,
      lastSync: stats?.lastSyncAt,
    })
  } catch (error) {
    console.error('GitHub stats fetch error:', error)
    return NextResponse.json(
      { error: 'Error fetching GitHub stats' },
      { status: 500 }
    )
  }
}

export async function POST() {
  const session = await auth()
  if (!session?.user?.id || !session.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const username = session.user.username || session.user.name || ''
  
  try {
    // accessToken is passed directly — never log or expose it
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
      { error: 'Error syncing GitHub' },
      { status: 500 }
    )
  }
}
