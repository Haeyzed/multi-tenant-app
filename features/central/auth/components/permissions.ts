/**
 * Centralized registry of all system permissions.
 * Mirrors Laravel backend Gate / Policy definitions.
 */
export const permissions = {
    dashboard: {
        view: "dashboard.view",
    },
    tenants: {
        view: "tenants.view",
        create: "tenants.create",
        update: "tenants.update",
        delete: "tenants.delete",
        manage: "tenants.manage",
    },
    billing: {
        manage: "billing.manage",
        plans: {
            view: "plans.view",
            create: "plans.create",
            update: "plans.update",
            delete: "plans.delete",
        },
        features: {
            view: "features.view",
            create: "features.create",
            update: "features.update",
            delete: "features.delete",
        },
        subscriptions: {
            view: "subscriptions.view",
            create: "subscriptions.create",
            update: "subscriptions.update",
            delete: "subscriptions.delete",
            manage: "subscriptions.manage",
        },
        invoices: {
            view: "invoices.view",
            create: "invoices.create",
            update: "invoices.update",
            delete: "invoices.delete",
        },
        payments: {
            view: "payments.view",
            create: "payments.create",
            update: "payments.update",
            delete: "payments.delete",
        },
    },
    users: {
        manage: "users.manage",
        accounts: {
            view: "users.view",
            create: "users.create",
            update: "users.update",
            delete: "users.delete",
        },
        roles: {
            view: "roles.view",
            create: "roles.create",
            update: "roles.update",
            delete: "roles.delete",
            assignPermission: "roles.assign-permissions"
        },
        permissions: {
            view: "permissions.view",
            create: "permissions.create",
            update: "permissions.update",
            delete: "permissions.delete",
        },
    },
    platform: {
        monitoring: {
            view: "monitoring.view",
        },
        world: {
            view: "world.view",
            manage: "world.manage",
        },
        settings: {
            view: "settings.view",
            manage: "settings.manage",
        },
    },
} as const

// --- TypeScript Magic: Extract all string values into a strict union type ---
type ValueOf<T> = T[keyof T]
type DeepValues<T> = T extends object
    ? ValueOf<{ [K in keyof T]: DeepValues<T[K]> }>
    : T

/**
 * Type representing any valid permission string in the system.
 * e.g., "subscriptions.view" | "billing.manage" | "tenants.create" | ...
 */
export type Permission = DeepValues<typeof permissions>