import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PixelCard } from './PixelCard';
import { api } from '../services/api'; // For submitting results

export const ResultScreen = ({ results, userId, onRestart }) => {
    const [submitting, setSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState(null);

    const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3);
    const isPass = results.score >= PASS_THRESHOLD;

    useEffect(() => {
        if (isPass) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        const submit = async () => {
            try {
                await api.submitResult({
                    userId: userId,
                    score: results.score,
                    // Add other metrics as needed by the requirement
                    maxScore: results.maxScore, // total questions
                    passed: isPass
                });
                setSubmitting(false);
            } catch (e) {
                console.error(e);
                setSubmitError("SAVE FAILED");
                setSubmitting(false);
            }
        };
        submit();
    }, [userId, results, isPass]);

    return (
        <div className="result-screen" style={{ textAlign: 'center' }}>
            <h1 className="floating" style={{
                color: isPass ? 'var(--color-accent-2)' : 'var(--color-primary-light)',
                fontSize: '32px'
            }}>
                {isPass ? 'VICTORY!' : 'GAME OVER'}
            </h1>

            <PixelCard>
                <div style={{ marginBottom: '20px' }}>
                    <p>PLAYER: {userId}</p>
                    <div style={{ margin: '20px 0', fontSize: '24px' }}>
                        SCORE: {results.score} / {results.maxScore}
                    </div>
                    <p style={{ color: isPass ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                        {isPass ? 'Congratulations! You cleared the level.' : 'Try again to pass the threshold!'}
                    </p>
                </div>

                {submitting && <p>SAVING SCORE...</p>}
                {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
                {!submitting && (
                    <p style={{ fontSize: '10px' }}>SCORE RECORDED</p>
                )}
            </PixelCard>

            <button className="pixel-btn" onClick={onRestart}>
                PLAY AGAIN
            </button>
        </div>
    );
};
