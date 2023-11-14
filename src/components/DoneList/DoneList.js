import { useContext, useEffect, useRef, useState } from 'react';
import styles from './DoneList.module.scss';
import classNames from 'classnames/bind';
import { missionContext } from '../MissionProvider/MissionProvider';
import Fire from '../Fire';
import sound from '../../assets/audio/sound.mp3';
import sound1 from '../../assets/audio/sound1.mp3';
import AllMission from '../AllMission';

const cx = classNames.bind(styles);

function DoneList() {
    const contextMission = useContext(missionContext);

    const refAudio = useRef();
    const refAudio1 = useRef();

    const [listMissionDone, setListMissionDone] = useState([]);
    const [fire, setFire] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [total, setTotal] = useState();

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

    // Hàm lấy ngày hiện tại
    const getToday = () => {
        const day = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = `on ${daysOfWeek[day.getDay()]} ${day.getDate()} - ${day.getMonth() + 1} - ${day.getFullYear()} `;
        return today;
    };

    // Tạo mảng mới bằng cách loại bỏ mission đã được nhận quà
    const handleDeleteMissionCompleted = (index) => {
        const updatedList = listMissionDone.filter((_, i) => i !== index);
        setListMissionDone(updatedList);
        localSET('listMissionDone', updatedList);

        // Lưu mission đã nhận quà vào bộ nhớ tạm thời
        contextMission.setItemGifted((prev) => [...prev, listMissionDone[index]]);
    };

    // Mission nào đã được nhận quà sẽ được đưa vào listALLMission (mảng chứa tất cả các mission completed)
    const updateAllMissionCompleted = (index) => {
        let allMission = [];
        const resutAllMission = localGET('allMission');
        const aCompleteMission = listMissionDone[index] + ' ' + getToday();

        // Lưu trữ tạm thời nhiệm vụ đã completed mà nhận quà nhầm
        contextMission.setAllMissionCompleted((prev) => [...prev, aCompleteMission]);

        allMission = resutAllMission || [];
        allMission.push(aCompleteMission);
        localSET('allMission', allMission);
    };

    // Sau khi nhận quà thì coin sẽ được tăng lên 1 và lưu vào database
    const handleIncreaseBonus = () => {
        const result = localGET('bonus');
        localSET('bonus', result + 1);
    };

    // Sử dụng hiệu ứng khi nhận quà từ mission completed
    const applyEffect = async () => {
        setFire(true);
        setIsDisable(true);
        await refAudio.current.play();
        await refAudio1.current.play();
        setTimeout(() => {
            setIsDisable(false);
        }, 1000);
    };

    // Xử lý khi nhận quà
    const handleTakeGift = async (index) => {
        // Xóa mission khi đã ấn nút nhận quà
        handleDeleteMissionCompleted(index);

        // Cập nhật danh sách tất cả mission đã hoàn thành
        updateAllMissionCompleted(index);

        // Tăng giá trị quà lên 1 đơn vị
        handleIncreaseBonus();

        // Dòng lệnh này để update giao diện
        contextMission.updateNow();

        // set stack
        contextMission.setStack((prev) => [...prev, 'gift']);

        // Tạo hiệu ứng chúc mừng khi nhận quà
        applyEffect();
    };

    useEffect(() => {
        // Lấy dữ liệu từ db và đưa dữ liệu tạm thời vào các biến state để sử dụng dữ liệu
        const result = localGET('listMissionDone');
        setListMissionDone(result || []);
        const allMission = localGET('allMission');
        setTotal(allMission?.length || 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextMission.update]);

    // Set time chạy hiệu ứng chúc mừng
    useEffect(() => {
        if (fire) {
            setTimeout(() => {
                setFire(false);
            }, 6000);
        }
    }, [fire]);

    return (
        <div className={cx('wrapper')}>
            {fire && <Fire />}
            {contextMission.all && <AllMission />}
            <div className={cx('container')}>
                <audio ref={refAudio1} style={{ display: ' none' }}>
                    <source src={sound1} />
                </audio>
                <audio ref={refAudio} style={{ display: ' none' }}>
                    <source src={sound} />
                </audio>

                <div className={cx('cover-input')}></div>
                <div>
                    <button className={cx('all-completed')} onClick={() => contextMission.setAll(true)}>
                        All
                        <span
                            className={cx(
                                'total',
                                { total0: total === 0 },
                                { total1: 0 < total && total < 10 },
                                { total2: total < 100 },
                                { total100: 100 <= total },
                                { total101: 100 < total },
                            )}
                        >
                            {total <= 100 ? total : '100+'}
                        </span>
                    </button>
                    <h2 className={cx('title-done-list')}>Mission completed</h2>
                </div>

                <div className={cx('list-missions')}>
                    {listMissionDone?.map((mission, index) => (
                        <div className={cx('mission')} key={index}>
                            <i className="fa-solid fa-circle" style={{ marginRight: '8px', fontSize: '8px' }}></i>
                            <span className={cx('mission-name')}>{mission}</span>
                            <div className={cx('control-mission')}>
                                <button
                                    className={cx('btn', 'delete', { disable: isDisable })}
                                    onClick={() => handleTakeGift(index)}
                                >
                                    <i className="fa-solid fa-gift"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DoneList;
