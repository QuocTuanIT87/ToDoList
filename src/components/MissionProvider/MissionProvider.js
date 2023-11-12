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
    const [itemDeleted, setItemDeleted] = useState([]);
    const [itemGifted, setItemGifted] = useState([]);
    const [allMissonCompleted, setAllMissionCompleted] = useState([]);

    // Xử lý xóa phần tử cuối (chung)
    const deleteLastItem = (item) => {
        const updatedArr = item.filter((_, index) => index !== item.length - 1);
        return updatedArr;
    };

    // Xử lý xóa phần tử cuối của list bấm nhầm hoàn thành
    const handleDeleteLastItem = () => {
        const updatedArr = deleteLastItem(itemDone);
        setItemDone(updatedArr);
    };

    // Xử lý xóa phần tử cuối của list bấm nhầm xóa
    const handleDeleteLastItemDeleted = () => {
        const updatedArr = deleteLastItem(itemDeleted);
        setItemDeleted(updatedArr);
    };

    // Xử lý xóa phần tử cuối của listMissionDone khi bấm nhận quà
    const handleDeleteLastItemGift = () => {
        const updatedArr = deleteLastItem(itemGifted);
        setItemGifted(updatedArr);
    };

    const handleDeleteLastItemAllMissionDone = () => {
        const updatedArr = deleteLastItem(allMissonCompleted);
        setAllMissionCompleted(updatedArr);
    };

    // Update lại giao diện
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
        handleDeleteLastItem,
        itemDeleted,
        setItemDeleted,
        handleDeleteLastItemDeleted,
        itemGifted,
        setItemGifted,
        handleDeleteLastItemGift,
        allMissonCompleted,
        setAllMissionCompleted,
        handleDeleteLastItemAllMissionDone,
    };

    return <missionContext.Provider value={value}>{children}</missionContext.Provider>;
}

export default MissionProvider;
