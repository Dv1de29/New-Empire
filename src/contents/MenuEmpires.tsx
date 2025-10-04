import { useState } from "react";
import CountrySlider from "./CountrySlider";

import { useMenuSettings } from "./SettingContext";

function MenuEmpires(){
    const { 
        draftEmpires,
        activeEmpireId,    
        updateDraftSetting, 
        setActiveEmpireId, 
        addEmpire,
        commitSettings,   
    } = useMenuSettings();

    const activeEmpire = draftEmpires.find(empire => empire.id === activeEmpireId)

    const [ expandList, setExpandList ] = useState<boolean>(false)

    return(
        <>
            <div className="empire_container">
                <div className="empire_header">
                    {"Terrain & empires settings"}
                </div>
                <div 
                    className="empire_list"
                    onClick={() => {
                        setExpandList(!expandList)
                    }}
                    style={expandList ? {height: 'auto'} : {height: "15vh"}}
                >
                     {draftEmpires.map(empire => (
                        <div
                            className="empire_box"
                            style={(empire.id === activeEmpireId) ? {backgroundColor: 'green'} : {backgroundColor: '#051d3485'}}
                            onClick={() => {
                                setActiveEmpireId(empire.id)
                            }}
                            >
                            <span>{empire.name}</span>
                        </div>
                     ))}
                </div>
                <div className="empire_settings">
                    { activeEmpire && (
                    <>
                    <div className="empire_name">{activeEmpire.name}</div>
                    <div className="empire_sliders">
                        <CountrySlider 
                            value={activeEmpire.settings.water}
                            setValue={(newValue: number) => {updateDraftSetting(activeEmpireId, "water", newValue)}}
                            label={"water"}
                        />
                        <CountrySlider 
                            value={activeEmpire.settings.river}
                            setValue={(newValue: number) => {updateDraftSetting(activeEmpireId, "river", newValue)}}
                            label={"river"}
                        />
                        <CountrySlider 
                            value={activeEmpire.settings.plain}
                            setValue={(newValue: number) => {updateDraftSetting(activeEmpireId, "plain", newValue)}}
                            label={"plain"}
                        />
                        <CountrySlider 
                            value={activeEmpire.settings.forest}
                            setValue={(newValue: number) => {updateDraftSetting(activeEmpireId, "forest", newValue)}}
                            label={"forest"}
                        />
                        <CountrySlider 
                            value={activeEmpire.settings.mountain}
                            setValue={(newValue: number) => {updateDraftSetting(activeEmpireId, "mountain", newValue)}}
                            label={"mountain"}
                        />
                        <CountrySlider 
                            value={activeEmpire.settings.desert}
                            setValue={(newValue: number) => {updateDraftSetting(activeEmpireId, "desert", newValue)}}
                            label={"desert"}
                        />
                        <CountrySlider 
                            value={activeEmpire.settings.ice}
                            setValue={(newValue: number) => {updateDraftSetting(activeEmpireId, "ice", newValue)}}
                            label={"ice"}
                        />
                    </div>
                    <div className="empire_details">
                        <input 
                            type="text"
                            id="name_input"
                            value={activeEmpire.name} 
                        />
                        <input 
                            type="color" 
                            name="color_input" 
                            id="color_input" 
                        />
                    </div>
                    </>
                    )}
                </div>
            </div>
        </>
    )
}

export default MenuEmpires;