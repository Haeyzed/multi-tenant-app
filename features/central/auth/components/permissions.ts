/**
 * Centralized registry of all system permissions.
 * Mirrors Laravel backend Gate / Policy definitions.
 */
export const permissions = {
    ai: {
        manage: "ai.manage",
        view: "ai.view",
    },
    announcements: {
        create: "announcements.create",
        delete: "announcements.delete",
        publish: "announcements.publish",
        update: "announcements.update",
        view: "announcements.view",
    },
    api: {
        clients: {
            manage: "api.clients.manage",
            view: "api.clients.view",
        },
        webhooks: {
            manage: "api.webhooks.manage",
            view: "api.webhooks.view",
        },
    },
    audit: {
        export: "audit.export",
        view: "audit.view",
    },
    backups: {
        manage: "backups.manage",
        view: "backups.view",
    },
    billing: {
        addresses: {
            manage: "billing.addresses.manage",
        },
        gateways: {
            view: "billing.gateways.view",
        },
        invoices: {
            manage: "billing.invoices.manage",
            view: "billing.invoices.view",
        },
        payments: {
            charge: "billing.payments.charge",
            refund: "billing.payments.refund",
            view: "billing.payments.view",
        },
    },
    dashboard: {
        health: "dashboard.health",
        view: "dashboard.view",
    },
    domains: {
        create: "domains.create",
        delete: "domains.delete",
        managePrimary: "domains.manage-primary",
        manageSsl: "domains.manage-ssl",
        update: "domains.update",
        verify: "domains.verify",
        view: "domains.view",
    },
    features: {
        create: "features.create",
        delete: "features.delete",
        manageCategories: "features.manage-categories",
        restore: "features.restore",
        update: "features.update",
        view: "features.view",
    },
    integrations: {
        manage: "integrations.manage",
        view: "integrations.view",
    },
    monitoring: {
        manage: "monitoring.manage",
        view: "monitoring.view",
    },
    notifications: {
        broadcast: "notifications.broadcast",
        create: "notifications.create",
        delete: "notifications.delete",
        inbox: "notifications.inbox",
        update: "notifications.update",
        view: "notifications.view",
    },
    permissions: {
        create: "permissions.create",
        delete: "permissions.delete",
        update: "permissions.update",
        view: "permissions.view",
    },
    plans: {
        create: "plans.create",
        delete: "plans.delete",
        manageFeatures: "plans.manage-features",
        recordUsage: "plans.record-usage",
        restore: "plans.restore",
        update: "plans.update",
        view: "plans.view",
        viewUsage: "plans.view-usage",
    },
    roles: {
        assignPermissions: "roles.assign-permissions",
        create: "roles.create",
        delete: "roles.delete",
        update: "roles.update",
        view: "roles.view",
    },
    sessions: {
        revoke: "sessions.revoke",
        view: "sessions.view",
    },
    settings: {
        create: "settings.create",
        delete: "settings.delete",
        update: "settings.update",
        view: "settings.view",
    },
    subscriptions: {
        create: "subscriptions.create",
        manage: "subscriptions.manage",
        update: "subscriptions.update",
        view: "subscriptions.view",
    },
    support: {
        categories: {
            manage: "support.categories.manage",
        },
        tickets: {
            assign: "support.tickets.assign",
            create: "support.tickets.create",
            delete: "support.tickets.delete",
            reply: "support.tickets.reply",
            update: "support.tickets.update",
            view: "support.tickets.view",
        },
    },
    tenants: {
        activate: "tenants.activate",
        archive: "tenants.archive",
        create: "tenants.create",
        delete: "tenants.delete",
        impersonate: "tenants.impersonate",
        manageMetadata: "tenants.manage-metadata",
        manageNotes: "tenants.manage-notes",
        manageTags: "tenants.manage-tags",
        restore: "tenants.restore",
        suspend: "tenants.suspend",
        update: "tenants.update",
        view: "tenants.view",
        viewActivity: "tenants.view-activity",
        viewHealth: "tenants.view-health",
        viewStats: "tenants.view-stats",
    },
    themes: {
        manage: "themes.manage",
        view: "themes.view",
    },
    tokens: {
        create: "tokens.create",
        revoke: "tokens.revoke",
        view: "tokens.view",
    },
    users: {
        assignPermissions: "users.assign-permissions",
        assignRoles: "users.assign-roles",
        create: "users.create",
        delete: "users.delete",
        manageStatus: "users.manage-status",
        resetPassword: "users.reset-password",
        restore: "users.restore",
        update: "users.update",
        view: "users.view",
        viewActivity: "users.view-activity",
    },
    versions: {
        manage: "versions.manage",
        view: "versions.view",
    },
    world: {
        create: "world.create",
        delete: "world.delete",
        update: "world.update",
        view: "world.view",
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