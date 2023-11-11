import { createContext, useState } from 'react';

export const missionContext = createContext();

function MissionProvider({ children }) {
    const [update, setUpdate] = useState(false);
    const [reset, setReset] = useState(false);
    const [all, setAll] = useState(false);

    const updateNow = () => {
        setUpdate(!update);
    };

    const value = {
        update,
        setUpdate,
        updateNow,
        reset,
        setReset,
        all,
        setAll,
    };

    return <missionContext.Provider value={value}>{children}</missionContext.Provider>;
}

export default MissionProvider;
