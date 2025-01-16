"use client"

import { reactnode, usestate } from "react"
import { filterscontext } from "./context"
import { commanddialog, commandempty, commandgroup, commandinput, commanditem, commandlist } from "@/components/ui/command"
import { usechatsession } from "@/hooks/use-chat-session"

export type tfiltersprovider = {
    children: reactnode
}

export const filtersprovider = ({ children }: tfiltersprovider) => {
    const [isfilteropen, setisfilteropen] = usestate(false)

    const open = () => setisfilteropen(true);
    const dismiss = () => setisfilteropen(false);
    const {sessions, createsessions} = usechatsession()


    return (
        <filterscontext.provider value={{ open, dismiss }}>
            {children}
            <CommandDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CommandInput placeholder="Search ...." />
                <CommandList>
                    <CommandEmpty> No results found  </CommandEmpty>
                    <CommandGroup headings="Actions">
                        <CommandItem className="gap-3" value="new" onselect={()=>{

                        }}>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </FiltersContext.Provider>
    )
}
