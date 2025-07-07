import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Page Components
import HomePage from '../pages/HomePage';
import TimerPage from '../pages/TimerPage';
import TasksPage from '../pages/TasksPage';
import StatsPage from '../pages/StatsPage';
import NotesPage from '../pages/NotesPage';
import SettingsPage from '../pages/SettingsPage';
import MusicPage from '../pages/MusicPage';

// Transition Components
import PageTransition from './PageTransition';
import PageTransitionWrapper from './PageTransitionWrapper';

// Types for transition effects
type TransitionType = 'fade' | 'slide' | 'zoom' | 'flip' | 'ripple' | 'sweep' | 'particles' | 'random';

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    const [transitionType, setTransitionType] = useState<TransitionType>('fade');

    // Use a consistent fade transition for all routes to ensure smoothness
    useEffect(() => {
        // Keep transition type as 'fade' for all routes to maintain consistency
        // This prevents competing animations and ensures smooth transitions
        setTransitionType('fade');
    }, [location.pathname]);

    return (
        <div className="animated-routes-container h-full">
            <PageTransition transitionType={transitionType}>
                <Routes location={location}>
                    <Route path="/" element={
                        <PageTransitionWrapper scrollAnimation={true}>
                            <HomePage />
                        </PageTransitionWrapper>
                    } />
                    <Route path="/timer" element={
                        <PageTransitionWrapper scrollAnimation={false}>
                            <TimerPage />
                        </PageTransitionWrapper>
                    } />
                    <Route path="/tasks" element={
                        <PageTransitionWrapper scrollAnimation={true}>
                            <TasksPage />
                        </PageTransitionWrapper>
                    } />
                    <Route path="/stats" element={
                        <PageTransitionWrapper scrollAnimation={true}>
                            <StatsPage />
                        </PageTransitionWrapper>
                    } />
                    <Route path="/notes" element={
                        <PageTransitionWrapper scrollAnimation={true}>
                            <NotesPage />
                        </PageTransitionWrapper>
                    } />
                    <Route path="/music" element={
                        <PageTransitionWrapper scrollAnimation={true}>
                            <MusicPage />
                        </PageTransitionWrapper>
                    } />
                    <Route path="/settings" element={
                        <PageTransitionWrapper scrollAnimation={true}>
                            <SettingsPage />
                        </PageTransitionWrapper>
                    } />
                </Routes>
            </PageTransition>
        </div>
    );
};

export default AnimatedRoutes;
