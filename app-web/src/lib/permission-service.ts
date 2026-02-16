/**
 * BOOMFLOW Permission Service
 * Handles role-based access control for badge operations
 */

import prisma from '@/lib/prisma'
import * as fs from 'node:fs'
import * as path from 'node:path'

export type Permission = 'grant_badges' | 'revoke_badges' | 'manage_users' | 'manage_admins'

export interface AdminInfo {
  username: string
  displayName: string
  role: string
  permissions: Permission[]
  addedAt: string
  addedBy: string
}

interface AdminsConfig {
  admins: AdminInfo[]
  settings: {
    requireApproval: boolean
    allowSelfAssignment: boolean
    auditLog: boolean
  }
}

// Load admins config
function loadAdminsConfig(): AdminsConfig {
  try {
    const configPath = path.join(process.cwd(), '..', 'config', 'admins.json')
    const configData = fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(configData)
  } catch {
    // Fallback to empty config if file doesn't exist
    return {
      admins: [],
      settings: {
        requireApproval: true,
        allowSelfAssignment: false,
        auditLog: true,
      }
    }
  }
}

const adminsConfig = loadAdminsConfig()

/**
 * Permission Service - Role-based access control
 */
export class PermissionService {
  /**
   * Check if a user is an admin
   */
  static isAdmin(username: string): boolean {
    return adminsConfig.admins.some(
      (admin: AdminInfo) => admin.username.toLowerCase() === username.toLowerCase()
    )
  }

  /**
   * Get admin info for a user
   */
  static getAdminInfo(username: string): AdminInfo | null {
    const admin = adminsConfig.admins.find(
      (admin: AdminInfo) => admin.username.toLowerCase() === username.toLowerCase()
    )
    return admin || null
  }

  /**
   * Check if a user has a specific permission
   */
  static hasPermission(username: string, permission: Permission): boolean {
    const admin = this.getAdminInfo(username)
    if (!admin) return false
    return admin.permissions.includes(permission)
  }

  /**
   * Check if a user can grant badges (manual award)
   */
  static canGrantBadges(username: string): boolean {
    return this.hasPermission(username, 'grant_badges')
  }

  /**
   * Check if a user can revoke badges
   */
  static canRevokeBadges(username: string): boolean {
    return this.hasPermission(username, 'revoke_badges')
  }

  /**
   * Check if a user can manage users
   */
  static canManageUsers(username: string): boolean {
    return this.hasPermission(username, 'manage_users')
  }

  /**
   * Check if a user can manage other admins
   */
  static canManageAdmins(username: string): boolean {
    return this.hasPermission(username, 'manage_admins')
  }

  /**
   * Get all admins
   */
  static getAllAdmins(): AdminInfo[] {
    return adminsConfig.admins
  }

  /**
   * Get settings
   */
  static getSettings() {
    return adminsConfig.settings
  }

  /**
   * Check if the user is an organization admin or team lead
   * Uses config file admins as the source of truth
   * 
   * @param userId - Database user ID
   * @param permission - Permission to check
   * @returns True if user has the permission
   */
  static async hasOrgPermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
      }
    })

    if (!user) return false

    // Check config file admins
    if (user.username && this.hasPermission(user.username, permission)) {
      return true
    }

    // Non-admin users don't have special permissions by default
    return false
  }
}

export default PermissionService
