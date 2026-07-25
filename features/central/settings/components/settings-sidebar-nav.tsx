"use client"

import {
    BotIcon,
    Building2Icon,
    CloudIcon,
    CreditCardIcon,
    DatabaseBackupIcon,
    FileTextIcon,
    GlobeIcon,
    HardDriveIcon,
    ImageIcon,
    KeyRoundIcon,
    LockIcon,
    type LucideIcon,
    MailIcon,
    ServerIcon,
    Settings2Icon,
    ShieldIcon,
    SparklesIcon,
    WrenchIcon,
} from "lucide-react"

import {Spinner} from "@/components/ui/spinner"
import {SidebarNav} from "@/features/central/settings/components/sidebar-nav"
import {useSettingGroups} from "@/features/central/settings/hooks/use-setting-query"
import {centralRoutes} from "@/features/central/shell/routes"

export const groupDescriptions: Record<string, string> = {
    billing:
        "Configure payment providers, currency routing, card verification, invoice deadlines, grace and reminder windows, signed-link lifetimes, and plan pricing defaults. Changes apply at runtime.",
    invoice:
        "Company branding and details rendered on the invoice document — logo, address, contact info, tax ID, number prefix, and footer note.",
    mail: "Choose how the platform sends email (log, SMTP, or array). SMTP credentials appear when SMTP is selected and are applied at runtime for scheduled mail too.",
    storage:
        "Choose the default filesystem disk. S3 credentials appear when Amazon S3 is selected and are applied at runtime.",
    tenant:
        "Control tenant onboarding defaults, owner invitation expiry, signup session lifetime, and platform-wide domain behavior.",
    platform: "Public brand name and support contact for the landlord console.",
    localization: "Default locale, timezone, and regional display preferences.",
    security: "Authentication and access security controls.",
    maintenance: "Maintenance mode and operational switches.",
    api: "API rate limits and developer-facing defaults.",
    media: "Media upload and processing defaults.",
    cdn: "CDN and asset delivery settings.",
    ai: "AI provider defaults for platform features.",
    oauth: "OAuth client credentials for social login.",
    captcha: "Bot protection provider settings.",
    backups: "Backup retention and schedule defaults.",
}

const groupIcons: Record<string, LucideIcon> = {
    platform: SparklesIcon,
    mail: MailIcon,
    storage: HardDriveIcon,
    localization: GlobeIcon,
    security: ShieldIcon,
    maintenance: WrenchIcon,
    api: ServerIcon,
    media: ImageIcon,
    cdn: CloudIcon,
    ai: BotIcon,
    oauth: KeyRoundIcon,
    captcha: LockIcon,
    backups: DatabaseBackupIcon,
    billing: CreditCardIcon,
    invoice: FileTextIcon,
    tenant: Building2Icon,
}

export function settingsGroupHref(group: string): string {
    return `${centralRoutes.settings}/${group}`
}

export function SettingsSidebarNav() {
    const {data: groups = [], isLoading} = useSettingGroups()

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                <Spinner/> Loading...
            </div>
        )
    }

    const items = groups.map((group) => {
        const Icon = groupIcons[group.value] ?? Settings2Icon
        return {
            href: settingsGroupHref(group.value),
            title: group.label,
            icon: <Icon className="size-4"/>,
        }
    })

    return (
        <div className="flex h-full min-h-0 flex-col">
            <SidebarNav items={items}/>
        </div>
    )
}
