import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';

interface Quote {
    text: string;
    author: string;
    category: string;
}

const quotes: Quote[] = [
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "motivation" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "persistence" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi", category: "productivity" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss", category: "focus" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "focus" },
    { text: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell", category: "concentration" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", category: "consistency" },
    { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey", category: "productivity" },
    { text: "Time blocking is the most effective productivity method.", author: "Cal Newport", category: "time-management" },
    { text: "Deep work is becoming increasingly valuable—and increasingly rare.", author: "Cal Newport", category: "deep-work" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "action" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln", category: "discipline" },
];

const QuoteDisplay: React.FC = () => {
    const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
    const [isVisible, setIsVisible] = useState(true);

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    };

    const changeQuote = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentQuote(getRandomQuote());
            setIsVisible(true);
        }, 300);
    };

    useEffect(() => {
        setCurrentQuote(getRandomQuote());

        // Change quote every 30 seconds
        const interval = setInterval(() => {
            changeQuote();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <QuoteIcon className="h-5 w-5 text-purple-400" />
                    Daily Inspiration
                </h3>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={changeQuote}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                </motion.button>
            </div>

            <motion.div
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <blockquote className="text-lg text-white/90 mb-4 italic leading-relaxed">
                    "{currentQuote.text}"
                </blockquote>
                <footer className="text-white/60">
                    <cite className="font-medium">— {currentQuote.author}</cite>
                </footer>
                <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full text-xs font-medium">
                        {currentQuote.category}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default QuoteDisplay;
