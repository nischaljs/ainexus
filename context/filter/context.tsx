"use client"

import { createContext, useContext } from "react";




export type TFilterContext = {
    open: () => void,
    dismiss: () => void
}

export const FiltersContext = createContext<TFilterContext | undefined>(undefined);


export const useFilters = () =>{
    const  context = useContext(FiltersContext);
    if(context ===undefined){
        throw new Error ("useFilters must be used within the Filterprovider");
    }
    return context;
}
