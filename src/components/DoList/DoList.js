import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './DoList.module.scss';
import { missionContext } from '../MissionProvider/MissionProvider';
import sound from '../../assets/audio/sound.mp3';
import Congratulation from '../Congratulation';

const cx = classNames.bind(styles);

function DoList() {
    const contextMission = useContext(missionContext);

    const myRef = useRef();
    const refAudio = useRef();

    const [mission, setMission] = useState('');
    const [listMission, setListMission] = useState([]);
    const [isDisable, setIsDisable] = useState(false);

    const [progress, setProgress] = useState();

    // Đổi kiểu khi lấy dữ liệu từ localStorage
    const praseJSON = (item) => {
        return JSON.parse(item);
    };

    // Đổi kiểu khi đẩy dữ liệu lên localStorage
    const stringifyJSON = (item) => {
        return JSON.stringify(item);
    };

    // Lấy dữ liệu từ localStorage
    const localGET = (name) => {
        const result = localStorage.getItem(name);
        return praseJSON(result);
    };

    // set dữ liệu lên localStorage
    const localSET = (name, item) => {
        return localStorage.setItem(name, stringifyJSON(item));
    };

    // Thêm mission vào list
    const handleAddMission = () => {
        if (mission) {
            const updatedList = [...listMission, mission];
            setListMission((prev) => [...prev, mission]);
            localSET('listMission', updatedList);

            const result = localGET('total');
            localSET('total', result + 1);
            handleTakeProgress();

            setMission('');
            myRef.current.focus();
        } else {
            myRef.current.focus();
        }
    };

    // Xóa mission khi mission completed
    const handleRemoveMission = (index) => {
        const updatedList = listMission.filter((_, i) => i !== index);
        setListMission(updatedList);
        localSET('listMission', updatedList);
    };

    // Xóa mission khi không muốn làm mission đó nữa
    const handleDeleteMission = (index) => {
        // Loại bỏ mission đó và cập nhật lại mảng mới
        const updatedList = listMission.filter((_, i) => i !== index);
        setListMission(updatedList);
        localSET('listMission', updatedList);

        contextMission.setItemDeleted((prev) => [...prev, listMission[index]]);

        // Set stack
        contextMission.setStack((prev) => [...prev, 'delete']);

        // Giảm total mission xuống 1 đơn vị
        const result = localGET('total');
        if (result > 0) {
            localSET('total', result - 1);
        }

        // Cập nhật lại thanh progress
        handleTakeProgress();
    };

    // Xử lý lấy % hoàn thành mission
    const handleTakeProgress = () => {
        const total = localGET('total');
        const completed = localGET('completed');
        setProgress(completed / total);
    };

    // Xử lý khi hoàn thành nhiệm vụ
    const handleCompleteMission = (index) => {
        // Lấy ra nhiệm vụ vừa được đánh dấu hoàn thành rồi thêm vào danh sách đã hoàn thành
        const result = listMission.filter((_, i) => i === index).toString();
        const listDone = localGET('listMissionDone') || [];
        localSET('listMissionDone', [...listDone, result]);

        // Đưa dữ liệu tạm thời vào stack để lưu trữ
        contextMission.setItemDone((prev) => [...prev, result]);

        // Tăng số nhiệm vụ đã hoàn thành lên 1
        const completed = localGET('completed');
        localSET('completed', completed + 1);

        // Cập nhật lại danh sách nhiệm vụ bằng cách xóa nhiệm vụ vừa hoàn thành
        handleRemoveMission(index);
        // Cập nhật thanh trạng thái hoàn thành
        handleTakeProgress();

        // Set stack
        contextMission.setStack((prev) => [...prev, 'completed']);

        // Cập nhật lại giao diện
        contextMission.updateNow();

        // Âm thanh khi người dùng ấn hoàn thành nhiệm vụ
        refAudio.current.play();

        // Khi bấm hoàn thành sẽ hoãn 1s trước khi bấm hoàn thành nhiệm tiếp theo để âm thanh được chạy hết trong 1s (tránh tình trạng âm thanh bị delay)
        setIsDisable(true);
        setTimeout(() => {
            setIsDisable(false);
        }, 1000);

        // nếu tất cả nhiệm vụ đã được hoàn thành thì sẽ hiển thị thông báo chúc mừng
        const totalCheck = localGET('total');
        const completedCheck = localGET('completed');
        if (totalCheck / completedCheck === 1) {
            contextMission.setCongratulation(true);
        }
    };

    // Cập nhật listMission và giao diện mỗi khi có thêm mới mission và biến update được gọi
    useEffect(() => {
        const total = localGET('total');
        const completed = localGET('completed');
        setProgress(completed / total);

        const result = localGET('listMission');
        setListMission(result || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextMission.update, mission]);

    // Xóa phần tử cuối mảng
    const deleteLastItem = (arr) => {
        const updatedArr = arr.filter((_, index) => index !== arr.length - 1);
        contextMission.setStack(updatedArr);
    };

    // Reset thanh progress
    const handleResetBar = () => {
        // Lấy dữ liệu trước khi reset
        const completed = localGET('completed');
        const total = localGET('total');

        // Đưa dữ liệu tạm thời vào stack để lưu trữ
        contextMission.setTotal(total);
        contextMission.setCompleted(completed);

        // Reset the progress bar
        localSET('completed', 0);
        localSET('total', 0);
        handleTakeProgress();

        // Set stack
        contextMission.setStack((prev) => [...prev, 'reset-bar']);
    };

    // Xử lý back hành động ấn hoàn thành nhiệm vụ
    const handelBackCompleted = () => {
        // Xóa phần tử cuối của danh sách đã hoàn thành
        const listDone = localGET('listMissionDone') || [];
        const updatedListDone = listDone.slice(0, -1);
        localSET('listMissionDone', updatedListDone);

        // Hoàn tác lại nhiệm vụ đã bị xóa do bấm nhầm hoàn thành
        const itemDoneStack = contextMission.itemDone;
        const result = localGET('listMission') || [];
        const updatedList = [itemDoneStack[itemDoneStack.length - 1], ...result];
        setListMission(updatedList);
        localSET('listMission', updatedList);

        // Xóa phần tử cuối mảng của listMission lưu trữ tạm thời tại state sau khi đã hoàn tác
        contextMission.handleDeleteLastItem();

        // Giảm số nhiệm vụ đã hoàn thành xuống 1
        const completed = localGET('completed');
        if (completed > 0) {
            localSET('completed', completed - 1);
        }

        // Cập nhật thanh trạng thái hoàn thành
        handleTakeProgress();

        // Cập nhật lại giao diện
        contextMission.updateNow();
    };

    // Xử lý back delete (người dùng lỡ xóa)
    const handleBackDelete = () => {
        // Hoàn tác lại nhiệm vụ đã bị xóa do bấm nhầm nút xóa
        const itemDeleteStack = contextMission.itemDeleted;
        const result = localGET('listMission') || [];
        const updatedList = [...result, itemDeleteStack[itemDeleteStack.length - 1]];
        setListMission(updatedList);
        localSET('listMission', updatedList);

        // Tăng total mission lên 1 đơn vị
        const total = localGET('total');
        localSET('total', total + 1);

        contextMission.handleDeleteLastItemDeleted();
        // Cập nhật lại thanh progress
        handleTakeProgress();
    };

    const handleBackGift = () => {
        const itemGifted = contextMission.itemGifted;
        const result = localGET('listMissionDone') || [];
        const updatedList = [itemGifted[itemGifted.length - 1], ...result];
        localSET('listMissionDone', updatedList);

        // Giảm giá trị tiền thưởng xuống 1 đơn vị
        const coin = localGET('bonus');
        if (coin > 0) {
            localSET('bonus', coin - 1);
        }

        // Cập nhật lại danh sách tất cả mission đã hoàn thành
        const allMissonCompleted = contextMission.allMissonCompleted;
        const allMission = localGET('allMission');
        const newAllMission = allMission.filter((item) => item !== allMissonCompleted[allMissonCompleted.length - 1]);
        localSET('allMission', newAllMission);

        // Xử lý xóa phần tử cuối tạm thời ở stack
        contextMission.handleDeleteLastItemGift();
        contextMission.handleDeleteLastItemAllMissionDone();

        // Cập nhật lại giao diện
        contextMission.updateNow();
    };

    const handelBackResetBar = () => {
        localSET('total', contextMission.total);
        localSET('completed', contextMission.completed);
        handleTakeProgress();
    };

    // Hoàn tác lại những hành động người dùng vừa làm (dùng Stack)
    const handleBackAction = () => {
        const stack = contextMission.stack;

        if (stack[stack.length - 1] === 'completed') {
            handelBackCompleted();
            deleteLastItem(stack);
        } else if (stack[stack.length - 1] === 'gift') {
            handleBackGift();
            deleteLastItem(stack);
        } else if (stack[stack.length - 1] === 'delete') {
            handleBackDelete();
            deleteLastItem(stack);
        } else if (stack[stack.length - 1] === 'reset-bar') {
            handelBackResetBar();
            deleteLastItem(stack);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {contextMission.congratulation && <Congratulation />}
            <audio ref={refAudio} style={{ display: ' none' }}>
                <source src={sound} />
            </audio>
            <div className={cx('container')}>
                <button className={cx('btn-back')} onClick={handleBackAction}>
                    <i className="fa-solid fa-rotate-left"></i>
                </button>
                <h2 className={cx('title-do-list')}>Today mission</h2>
                <div className={cx('cover-bar')}>
                    <progress value={progress} className={cx('progress-bar')}></progress>
                    <span className={cx('percent-progress')}>{`${Math.round(progress * 100) || 0}%`}</span>
                    <i className={cx('fa-solid fa-power-off', 'icon-reset-bar')} onClick={handleResetBar}></i>
                </div>
                <div className={cx('cover-input')}>
                    <input
                        ref={myRef}
                        className={cx('form-input-mission')}
                        type="text"
                        placeholder="Your mission"
                        value={mission}
                        onChange={(e) => {
                            setMission(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddMission();
                            }
                        }}
                        spellCheck={false}
                    />
                    <button className={cx('btn-add')} onClick={handleAddMission}>
                        <i className={cx('fa-solid fa-plus', 'icon-plus')}></i>
                    </button>
                </div>
                <div className={cx('list-missions')}>
                    {listMission?.map((mission, index) => (
                        <div className={cx('mission')} key={index}>
                            <span className={cx('index-mission')}>{index + 1}</span>
                            <i className="fa-solid fa-circle" style={{ marginRight: '8px', fontSize: '8px' }}></i>
                            <span className={cx('mission-name')}>{mission}</span>
                            <div className={cx('control-mission')}>
                                <button className={cx('btn', 'delete')} onClick={() => handleDeleteMission(index)}>
                                    <i className="fa-regular fa-trash-can"></i>
                                </button>
                                <button
                                    className={cx('btn', 'complete', { disable: isDisable })}
                                    onClick={() => handleCompleteMission(index)}
                                >
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DoList;
