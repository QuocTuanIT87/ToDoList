import Confetti from 'react-confetti';

const Fireworks = () => {
    return (
        <div style={{ position: 'fixed', inset: '0', zIndex: '3' }}>
            <Confetti />
        </div>
    );
};

export default Fireworks;
