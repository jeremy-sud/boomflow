/**
 * GitHub Sync Service
 * Handles syncing badges to GitHub profiles
 */

import { logger } from '../lib/logger.js'

const GITHUB_API = 'https://api.github.com'

const ghHeaders = (token) => ({
  Authorization: `token ${token}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
})

/**
 * Update user's badge JSON file in BOOMFLOW repo
 * This triggers the GitHub Action to update their profile README
 */
export async function syncUserBadgesToGitHub(username, userData, githubToken) {
  const repoOwner = process.env.BOOMFLOW_REPO_OWNER || 'jeremy-sud'
  const repoName = process.env.BOOMFLOW_REPO_NAME || 'boomflow'
  const filePath = `users/${username}.json`

  try {
    // Get current file (if exists) to get its SHA
    let sha = null
    try {
      const existingRes = await fetch(
        `${GITHUB_API}/repos/${repoOwner}/${repoName}/contents/${filePath}`,
        { headers: ghHeaders(githubToken) }
      )
      if (existingRes.ok) {
        const existing = await existingRes.json()
        sha = existing.sha
      }
    } catch {
      // File doesn't exist yet, that's OK
    }

    // Prepare file content
    const content = Buffer.from(
      JSON.stringify(userData, null, 2)
    ).toString('base64')

    // Create or update file
    const res = await fetch(
      `${GITHUB_API}/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: ghHeaders(githubToken),
        body: JSON.stringify({
          message: `Update badges for ${username}`,
          content,
          sha, // Include SHA if updating existing file
          branch: 'main'
        })
      }
    )

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.message || `GitHub API error: ${res.status}`)
    }

    const data = await res.json()

    return {
      success: true,
      commit: data.commit.sha,
      url: data.content.html_url
    }
  } catch (error) {
    logger.error('GitHub sync error', { username, message: error.message })
    throw new Error(error.message || 'Failed to sync to GitHub')
  }
}

/**
 * Trigger the BOOMFLOW GitHub Action on user's profile repo
 */
export async function triggerProfileSync(username, githubToken) {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${username}/${username}/dispatches`,
      {
        method: 'POST',
        headers: ghHeaders(githubToken),
        body: JSON.stringify({
          event_type: 'boomflow-sync',
          client_payload: {
            timestamp: new Date().toISOString()
          }
        })
      }
    )

    if (!res.ok && res.status !== 204) {
      throw new Error(`Dispatch failed: ${res.status}`)
    }

    return { success: true }
  } catch (error) {
    logger.error('Profile sync trigger error', { username, message: error.message })
    throw new Error('Failed to trigger profile sync')
  }
}

/**
 * Get user's GitHub profile info
 */
export async function getGitHubProfile(githubToken) {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: ghHeaders(githubToken)
  })

  if (!res.ok) {
    throw new Error('Failed to fetch GitHub profile')
  }

  const data = await res.json()

  return {
    id: data.id,
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    email: data.email,
    bio: data.bio
  }
}

/**
 * Format user data for the GitHub Action JSON file
 */
export function getUserJsonForGitHub(user, badges) {
  return {
    username: user.username,
    displayName: user.displayName,
    role: user.role || 'Member',
    org: user.organization?.name || null,
    joinedAt: user.createdAt?.toISOString().split('T')[0],
    badges: badges.map(b => ({
      id: b.badge.slug,
      awardedAt: b.awardedAt.toISOString().split('T')[0],
      awardedBy: b.awardedBy || 'system'
    }))
  }
}
