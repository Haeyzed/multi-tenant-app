"use client"

import * as React from "react"
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
  MailIcon,
  type LucideIcon,
  ServerIcon,
  Settings2Icon,
  ShieldIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SettingsGroupForm } from "@/features/central/settings/components/settings-group-form"
import {
  useGroupedSettings,
  useSettingGroups,
} from "@/features/central/settings/hooks/use-setting-query"
import { cn } from "@/lib/utils"
import type { SettingGroupOption } from "@/types/central/setting"

const groupDescriptions: Record<string, string> = {
  billing:
    "Configure payment providers, currency routing, card verification, invoice deadlines, grace and reminder windows, signed-link lifetimes, and plan pricing defaults. Changes apply at runtime.",
  invoice:
    "Company branding and details rendered on the invoice document — logo, address, contact info, tax ID, number prefix, and footer note.",
  mail: "Choose how the platform sends email (log, SMTP, or array). SMTP credentials appear when SMTP is selected and are applied at runtime for scheduled mail too.",
  storage:
    "Choose the default filesystem disk. S3 credentials appear when Amazon S3 is selected and are applied at runtime.",
  tenant:
    "Control tenant onboarding defaults, owner invitation expiry, signup session lifetime, and platform-wide domain behavior.",
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

export function SettingsTabs() {
  const { data: groupData, isLoading: groupsLoading } = useSettingGroups()
  const groups: SettingGroupOption[] = groupData ?? []
  const { data: grouped = {}, isLoading: settingsLoading } =
    useGroupedSettings()
  const defaultGroup = groups[0]?.value ?? "billing"
  const [activeGroup, setActiveGroup] = React.useState<string>(defaultGroup)

  const resolvedGroup = groups.some((group) => group.value === activeGroup)
    ? activeGroup
    : defaultGroup

  if (groupsLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner /> Loading setting groups...
      </div>
    )
  }

  return (
    <Tabs
      value={resolvedGroup}
      onValueChange={(value) => setActiveGroup(value as string)}
      orientation="vertical"
      className="gap-8"
    >
      <TabsList className="h-fit min-w-48 flex-col items-stretch gap-1.5 bg-transparent p-0">
        {groups.map((group) => {
          const Icon = groupIcons[group.value] ?? Settings2Icon
          return (
            <TabsTrigger
              key={group.value}
              value={group.value}
              className={cn(
                "justify-start gap-2.5 rounded-lg border border-transparent px-3 py-2.5 data-active:border-border data-active:bg-muted/60"
              )}
            >
              <Icon className="size-4 shrink-0 opacity-70" />
              <span>{group.label}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {groups.map((group) => (
        <TabsContent
          key={group.value}
          value={group.value}
          className="min-w-0 flex-1"
        >
          <SettingsGroupForm
            group={group.value}
            title={group.label}
            description={groupDescriptions[group.value]}
            settings={grouped[group.value] ?? []}
            isLoading={settingsLoading}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
