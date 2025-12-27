import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PixelCard } from './PixelCard';

export const GameScreen = ({ userId, onFinish }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currIndex, setCurrIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { qId: option }
    const [score, setScore] = useState(0);
    // Optional: Track attempts per question if we want instant feedback?
    // Requirement says: "Score calculation... send to GAS". Usually implies one-shot or until correct?
    // "Pass Threshold" implies we count correct answers.

    const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || 5);

    useEffect(() => {
        const init = async () => {
            try {
                const data = await api.fetchQuestions(QUESTION_COUNT);
                setQuestions(data);
            } catch (err) {
                console.error("Failed to load questions", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleAnswer = (optionKey) => {
        // Record answer
        const currentQ = questions[currIndex];
        // Simple logic: Check answer locally to show visual feedback, but final "Score" might be server side?
        // Requirement: "Calculate score ... record to backend".
        // I can calculate score locally for the "Result" screen and also send it.

        // Check correctness (assuming 'answer' field exists in data, usually A, B, C, D)
        const isCorrect = optionKey === currentQ.answer;

        // Update local state
        const nextAnswers = { ...userAnswers, [currentQ.id]: optionKey };
        setUserAnswers(nextAnswers);

        // If correct, increment score
        let newScore = score;
        if (isCorrect) newScore += 1;
        setScore(newScore);

        // Delay for effect then next
        setTimeout(() => {
            if (currIndex + 1 < questions.length) {
                setCurrIndex(currIndex + 1);
            } else {
                // Finished
                onFinish({
                    score: newScore,
                    maxScore: questions.length,
                    answers: nextAnswers,
                    attempts: 1 // hardcoded for now, or track retries?
                });
            }
        }, 300);
    };

    if (loading) {
        return <div className="floating">LOADING LEVEL...</div>;
    }

    if (questions.length === 0) {
        return <div>NO LEVELS FOUND. ERROR.</div>;
    }

    const currentQ = questions[currIndex];
    // Boss Image seed based on ID to be consistent
    const bossUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${currentQ.id}`;

    return (
        <div className="game-screen" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>LVL {currIndex + 1}/{questions.length}</span>
                <span>SCORE: {score}</span>
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img
                    src={bossUrl}
                    alt="Boss"
                    style={{ width: '120px', height: '120px', imageRendering: 'pixelated' }}
                    className="floating"
                />
                <div style={{
                    height: '10px',
                    background: '#555',
                    marginTop: '10px',
                    border: '2px solid white'
                }}>
                    {/* Fake HP Bar */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'var(--color-primary-light)'
                    }}></div>
                </div>
            </div>

            <PixelCard className="question-box">
                <p style={{ lineHeight: '1.5' }}>{currentQ.question}</p>
            </PixelCard>

            <div className="options-grid" style={{ display: 'grid', gap: '10px' }}>
                {currentQ.options && Object.entries(currentQ.options).map(([key, text]) => (
                    <button
                        key={key}
                        className="pixel-btn secondary"
                        onClick={() => handleAnswer(key)}
                        style={{ textAlign: 'left', fontSize: '12px' }}
                    >
                        {key}: {text}
                    </button>
                ))}
            </div>
        </div>
    );
};
