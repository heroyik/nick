import React, { useState } from 'react';


interface ReminderSelectorProps {
    onSelectReminder: (date: string | undefined) => void;
    onClose: () => void;
}

export const ReminderSelector: React.FC<ReminderSelectorProps> = ({ onSelectReminder, onClose }) => {
    const [customDate, setCustomDate] = useState('');

    const handlePredefined = (type: 'today' | 'tomorrow' | 'next-week') => {
        const date = new Date();
        if (type === 'today') {
            date.setHours(20, 0, 0, 0); // 8:00 PM
            if (date <= new Date()) {
                // If already past 8PM, maybe do tomorrow? Or just allow it (it will trigger immediately/be overdue)
                // Google Keep usually disables "Today" if it's late. For now, let's just set it.
            }
        } else if (type === 'tomorrow') {
            date.setDate(date.getDate() + 1);
            date.setHours(8, 0, 0, 0); // 8:00 AM
        } else if (type === 'next-week') {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1) + 7; // Next Monday
            date.setDate(diff);
            date.setHours(8, 0, 0, 0);
        }
        onSelectReminder(date.toISOString());
        onClose();
    };

    const handleCustom = () => {
        if (customDate) {
            onSelectReminder(new Date(customDate).toISOString());
            onClose();
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
            padding: '10px 0',
            width: '250px',
            color: 'var(--color-text-primary)',
            zIndex: 1000
        }}>
            <div style={{ padding: '0 12px 8px', fontSize: '14px', fontWeight: 500 }}>Reminders</div>
            <div
                className="reminder-option"
                onClick={() => handlePredefined('today')}
                style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px' }}
            >
                <span>Later today</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>8:00 PM</span>
            </div>
            <div
                className="reminder-option"
                onClick={() => handlePredefined('tomorrow')}
                style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px' }}
            >
                <span>Tomorrow</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>8:00 AM</span>
            </div>
            <div
                className="reminder-option"
                onClick={() => handlePredefined('next-week')}
                style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px' }}
            >
                <span>Next week</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>Mon, 8:00 AM</span>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0', paddingTop: '8px', paddingLeft: '12px', paddingRight: '12px' }}>
                <div style={{ fontSize: '12px', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Pick date & time</div>
                <input
                    type="datetime-local"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '4px',
                        marginBottom: '8px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        background: 'transparent',
                        color: 'var(--color-text-primary)'
                    }}
                />
                <button
                    onClick={handleCustom}
                    disabled={!customDate}
                    style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: !customDate ? 'default' : 'pointer',
                        color: customDate ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
                        textAlign: 'right',
                        fontWeight: 500
                    }}
                >
                    Save
                </button>
            </div>
            <style>{`
                .reminder-option:hover {
                    background-color: var(--color-hover);
                }
            `}</style>
        </div>
    );
};
