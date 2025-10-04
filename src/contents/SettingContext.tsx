import React, { useState, useContext, createContext, useMemo, useCallback, ReactNode } from 'react';

// --- 1. TYPESCRIPT INTERFACES & INITIAL VALUES ---

export interface CountrySliderValues{
    water : number,
    river : number,
    plain : number,
    mountain : number,
    desert : number,
    forest : number,
    ice : number,
}

export interface EmpireConfig{
    id: number,
    name: string,
    settings: CountrySliderValues,
}



export interface SettingsContextType{
    draftEmpires: EmpireConfig[],
    committedEmpires: EmpireConfig[], 
    activeEmpireId: number,  
    activeMap: string,      

    updateDraftSetting: (empireID: number, key: keyof CountrySliderValues, value: number) => void;
    setActiveEmpireID: (id: number) => void;
    addEmpire: () => void;
    setActiveMap: (mapName: string) => void;

    commitSettings: () => void;
}

export const initialEmpireConfig: CountrySliderValues = {
    water : 1.0,
    river : 1.5,
    plain : 2.0,
    mountain : 6.0,
    desert : 4.0,
    forest : 3.0,
    ice : 7.0,
}

export const initialEmpires: EmpireConfig[] = [
    { id: 1, name: "Emmpire1 Miau", settings: initialEmpireConfig},
    { id: 2, name: "Empire2 Ben", settings: {...initialEmpireConfig, mountain: 8}}
]

export const initialContext: SettingsContextType = {
    draftEmpires: initialEmpires,
    committedEmpires: initialEmpires,
    activeEmpireId: 1,
    activeMap: "world",

    updateDraftSetting: () => {},
    setActiveEmpireID: () => {},
    addEmpire: () => {},
    setActiveMap: () => {},

    commitSettings: () => {},
}

export const SettingsContext = createContext<SettingsContextType>(initialContext)

export const useMapSettings = () => {
    const context = useContext(SettingsContext);

    return { 
        committedEmpires: context.committedEmpires,
        activeMap: context.activeMap,
    } 
}

export const useMenuMapSettings = () => {
    const context = useContext(SettingsContext)

    return {
        activeMap: context.activeMap,
        setActiveMap: context.setActiveMap,
    }
}

export const useMenuSettings = () => {
    const context = useContext(SettingsContext);
    return {
        draftEmpires: context.draftEmpires, 
        activeEmpireId: context.activeEmpireId,
        updateDraftSetting: context.updateDraftSetting, 
        setActiveEmpireId: context.setActiveEmpireID,
        addEmpire: context.addEmpire,
        commitSettings: context.commitSettings
    }
}






export interface SettingsProviderProps{
    children: ReactNode,
}

export const SettingsProvider = ({ children }: SettingsProviderProps ) => {
    const [ draftEmpires, setDraftEmpires ] = useState<EmpireConfig[]>(initialEmpires);
    const [ committedEmpires, setCommittedEmpires ] = useState<EmpireConfig[]>(initialEmpires); 
    const [ activeEmpireID, setActiveEmpireID ] = useState<number>(1);
    const [ activeMap, setActiveMap ] = useState<string>("world");

    const updateDraftSetting = useCallback((id: number, key: keyof CountrySliderValues, value: number) => {
        const auxValue = Math.min(100, Math.max(1, value))

        setDraftEmpires(prevEmpires => prevEmpires.map(empire => {
            if ( empire.id === id){
                return {
                    ...empire,
                    settings: {
                        ...empire.settings,
                        [key]: auxValue,
                    }
                }
            }
            return empire
        }))
    }, [])

    const addEmpire = useCallback(() => {
        const newID = draftEmpires.length + 1
        const newEmpire = {
            id: newID,
            name: `Empire${newID} Miau`,
            settings: initialEmpireConfig,
        }

        setDraftEmpires(prevEmpires => [...prevEmpires, newEmpire])
        setActiveEmpireID(newID)
    }, [draftEmpires])

    const commitSettings = useCallback(() =>{
        setCommittedEmpires(draftEmpires) 
    }, [draftEmpires])

    const contextValue = useMemo(() => ({
        draftEmpires,
        committedEmpires,
        activeEmpireId: activeEmpireID,
        activeMap,
        updateDraftSetting,
        setActiveEmpireID,
        addEmpire,
        setActiveMap,
        commitSettings,
    }), [draftEmpires, committedEmpires, activeEmpireID, activeMap, updateDraftSetting, addEmpire, setActiveMap, commitSettings])

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    )
}
