"use client";

import { Button, ButtonProps } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChangeLocale, useCurrentLocale } from "../client";
import { localeSettings, localeSettingsList } from "../locales/_index";
import { use } from "react";

type LocaleSwitcherProps = ButtonProps

export default function LocaleSwitcher(props: LocaleSwitcherProps) {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()
  const current = use(localeSettings[locale]);
  const locales = use(localeSettingsList);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Select theme" {...props}>
          <span>{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-32">
        {
          locales.map((locale) => {
            return (
              <DropdownMenuItem key={locale.code} onClick={() => changeLocale(locale.code)}>
                <span>{ locale.flag }</span>
                <span>{ locale.native }</span>
              </DropdownMenuItem>
          )})
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
