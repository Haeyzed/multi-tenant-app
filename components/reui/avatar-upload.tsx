"use client"

import { CameraIcon, UploadIcon, XIcon } from "lucide-react"
import * as React from "react"

import { Alert, AlertDescription } from "@/components/reui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload"
import { cn } from "@/lib/utils"

const MAX_SIZE = 2 * 1024 * 1024

type AvatarUploadProps = {
  defaultAvatar?: string | null
  onFileChange?: (file: File | null) => void
  disabled?: boolean
  className?: string
}

function getInitials(value?: string | null): string {
  if (!value) {
    return "?"
  }

  const parts = value.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
  }

  return value.slice(0, 2).toUpperCase()
}

export function AvatarUpload({
  defaultAvatar,
  onFileChange,
  disabled = false,
  className,
}: AvatarUploadProps) {
  const [{ files, isDragging, errors }, actions] = useFileUpload({
    maxFiles: 1,
    maxSize: MAX_SIZE,
    accept: "image/*",
    multiple: false,
    onFilesChange: (nextFiles) => {
      const file = nextFiles[0]?.file
      onFileChange?.(file instanceof File ? file : null)
    },
    onError: () => {
      onFileChange?.(null)
    },
  })

  const preview = files[0]?.preview ?? defaultAvatar ?? undefined
  const label = files[0]?.file instanceof File ? files[0].file.name : "Avatar"

  React.useEffect(() => {
    return () => {
      for (const item of files) {
        if (
          item.preview &&
          item.file instanceof File &&
          item.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(item.preview)
        }
      }
    }
  }, [files])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative flex size-20 items-center justify-center rounded-full border border-dashed transition-colors",
            isDragging && "border-primary bg-primary/5",
            disabled && "pointer-events-none opacity-60"
          )}
          onDragEnter={actions.handleDragEnter}
          onDragLeave={actions.handleDragLeave}
          onDragOver={actions.handleDragOver}
          onDrop={actions.handleDrop}
        >
          <Avatar size="lg" className="size-20">
            {preview ? <AvatarImage src={preview} alt={label} /> : null}
            <AvatarFallback className="text-lg">
              {getInitials(label)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            className="absolute -end-1 -bottom-1 flex size-7 items-center justify-center rounded-full border bg-background shadow-sm"
            onClick={actions.openFileDialog}
            disabled={disabled}
          >
            <CameraIcon className="size-3.5" />
            <span className="sr-only">Upload avatar</span>
          </button>
          <input
            {...actions.getInputProps({
              accept: "image/*",
              disabled,
              className: "sr-only",
            })}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Profile photo</p>
          <p className="text-muted-foreground text-xs">
            PNG, JPG, or GIF up to {formatBytes(MAX_SIZE)}.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={actions.openFileDialog}
              disabled={disabled}
            >
              <UploadIcon className="size-3.5" />
              Choose image
            </Button>
            {files.length > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  actions.clearFiles()
                  onFileChange?.(null)
                }}
                disabled={disabled}
              >
                <XIcon className="size-3.5" />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {errors.length > 0 ? (
        <Alert variant="destructive">
          <AlertDescription>{errors[0]}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
