/**
 * GitHub Sync Service
 * Handles syncing badges to GitHub profiles
 */

import axios from 'axios'

const GITHUB_API = 'https://api.github.com'

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
      const { data: existing } = await axios.get(
        `${GITHUB_API}/repos/${repoOwner}/${repoName}/contents/${filePath}`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      )
      sha = existing.sha
    } catch (e) {
      // File doesn't exist yet, that's OK
    }

    // Prepare file content
    const content = Buffer.from(
      JSON.stringify(userData, null, 2)
    ).toString('base64')

    // Create or update file
    const { data } = await axios.put(
      `${GITHUB_API}/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        message: `Update badges for ${username}`,
        content,
        sha, // Include SHA if updating existing file
        branch: 'main'
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    )

    return {
      success: true,
      commit: data.commit.sha,
      url: data.content.html_url
    }
  } catch (error) {
    console.error('GitHub sync error:', error.response?.data || error.message)
    throw new Error(
      error.response?.data?.message || 'Failed to sync to GitHub'
    )
  }
}

/**
 * Trigger the BOOMFLOW GitHub Action on user's profile repo
 */
export async function triggerProfileSync(username, githubToken) {
  try {
    // Trigger workflow dispatch on user's profile repo
    await axios.post(
      `${GITHUB_API}/repos/${username}/${username}/dispatches`,
      {
        event_type: 'boomflow-sync',
        client_payload: {
          timestamp: new Date().toISOString()
        }
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Profile sync trigger error:', error.response?.data || error.message)
    throw new Error('Failed to trigger profile sync')
  }
}

/**
 * Get user's GitHub profile info
 */
export async function getGitHubProfile(githubToken) {
  try {
    const { data } = await axios.get(`${GITHUB_API}/user`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    return {
      id: data.id,
      login: data.login,
      name: data.name,
      avatarUrl: data.avatar_url,
      email: data.email,
      bio: data.bio
    }
  } catch (error) {
    throw new Error('Failed to fetch GitHub profile')
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
