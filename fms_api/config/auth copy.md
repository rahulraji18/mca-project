import type { AuthConfig, OATGuardConfig } from '@ioc:Adonis/Addons/Auth'
import Staff from 'App/Models/Staff'

// Define a custom guard for staff
type StaffGuardConfig = OATGuardConfig<"staff">

// Extend the guards object to include the staff guard
interface ExtendedAuthConfig extends AuthConfig {
  guards: {
    api: OATGuardConfig<"user">,
    staff: StaffGuardConfig,
  }
}

// Define the authConfig object with the extended type
const authConfig: ExtendedAuthConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'api_tokens',
        foreignKey: 'user_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('App/Models/User'),
      },
    },
    staff: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'staff_tokens',
        foreignKey: 'staff_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => Staff,
      },
    },
  },
}

export default authConfig
