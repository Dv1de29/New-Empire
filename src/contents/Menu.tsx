
import '../style/Menu.css'

import MenuEmpires from './MenuEmpires';
import MenuMapSelect from './MenuMapSelect';

import { useMenuSettings, CountrySliderValues } from './SettingContext';

interface MenuProps{

}


function Menu({}: MenuProps){

    const { 
        draftEmpires,
        activeEmpireId,    
        updateDraftSetting, 
        setActiveEmpireId, 
        addEmpire,
        commitSettings,   
    } = useMenuSettings();

    const activeEmpire = draftEmpires.find(empire => empire.id === activeEmpireId)
    const sliderKeys: (keyof CountrySliderValues)[] = activeEmpire ? Object.keys(activeEmpire.settings) as (keyof CountrySliderValues)[] : [];

    return (
        <>
            <div className="menu_container">
                <MenuMapSelect />
                <MenuEmpires />
            </div>
        </>
    )
}

export default Menu;