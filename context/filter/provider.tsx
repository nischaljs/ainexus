"use client"

import { ReactNode, useState } from "react"
import { FiltersContext } from "./context"
import { CommandDialog, CommandInput } from "@/components/ui/command"

export type TFiltersProvider = {
    children: ReactNode
}

export const FiltersProvider = ({ children }: TFiltersProvider) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const open = () => setIsFilterOpen(true)
    const dismiss = () => setIsFilterOpen(false)

    return (
        <FiltersContext.Provider value={{ open, dismiss }}>
            {children}
            <CommandDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CommandInput placeholder="Search ...." />
            </CommandDialog>
        </FiltersContext.Provider>
    )
}
