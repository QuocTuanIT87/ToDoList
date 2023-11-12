import { createContext, useState } from 'react';

export const missionContext = createContext();

function MissionProvider({ children }) {
    const [update, setUpdate] = useState(false);
    const [reset, setReset] = useState(false);
    const [all, setAll] = useState(false);

    // Xử lý stack
    const [stack, setStack] = useState([]);

    // Lưu trữ tạm thời dữ liệu vào stack
    const [itemDone, setItemDone] = useState([]);
    const [indexDone, setIndexDone] = useState([]);

    const handleDelteLastItem = () => {
        const updatedArr = itemDone.filter((_, index) => index !== itemDone.length - 1);
        setItemDone(updatedArr);
    };

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
        stack,
        setStack,
        itemDone,
        setItemDone,
        indexDone,
        setIndexDone,
        handleDelteLastItem,
    };

    return <missionContext.Provider value={value}>{children}</missionContext.Provider>;
}

export default MissionProvider;
