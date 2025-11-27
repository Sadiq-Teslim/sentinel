// src/hooks/useAudioAlert.ts
import { useRef, useState, useEffect } from 'react';
import type { SecurityStatus } from '../lib/scanner';

// This hook manages the YarnGPT audio playback
export const useAudioAlert = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Initialize the Audio object once when the component mounts
    useEffect(() => {
        audioRef.current = new Audio();
        
        // Cleanup when leaving
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playAlert = (status: SecurityStatus, language: string) => {
        if (!audioRef.current) return;
        
        // 1. Safety Check: Don't play audio for "idle" or "scanning" states
        if (status === 'idle' || status === 'scanning' || status === 'unknown') return;

        // 2. Map Status to Filename
        // We map 'high' risk or 'unsafe' status to the 'danger' audio file
        let fileType = 'safe'; // default
        if (status === 'unsafe') fileType = 'danger';
        if (status === 'caution') fileType = 'caution';

        // 3. Construct the path
        // e.g. "/audio/hausa_danger.mp3"
        // Note: We use the 'public/audio' folder structure
        const filePath = `/audio/${language}_${fileType}.mp3`;

        // 4. Reset and Play
        audioRef.current.pause(); // Stop any currently playing sound
        audioRef.current.src = filePath;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(error => {
                    console.warn(`Sentinel Audio Error: Could not play ${filePath}. File might be missing.`, error);
                    // This prevents the app from crashing if an mp3 is missing
                    setIsPlaying(false); 
                });
        }

        // 5. Handle "End of Track"
        audioRef.current.onended = () => setIsPlaying(false);
    };

    const stopAlert = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return { playAlert, stopAlert, isPlaying };
};