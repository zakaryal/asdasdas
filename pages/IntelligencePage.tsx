import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { getProjects } from '../services/api';
import { getCostInsightsStream } from '../services/aiService';
import { parseMarkdown } from '../utils/markdown';
import Card from '../components/shared/Card';
import { SparklesIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';

const suggestionPrompts = [
    "Identify top 3 cost drivers for this project.",
    "Suggest 3 potential cost-saving measures.",
    "What are the biggest risks to the budget?",
    "Summarize the labor costs for the entire project.",
];

const IntelligencePage = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const responseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user) return;
            const data = await getProjects(user);
            setProjects(data);
            if (data.length > 0) {
                setSelectedProjectId(data[0].id);
            }
        };
        fetchProjects();
    }, [user]);

    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [response]);

    const handlePromptSubmit = async (currentPrompt: string) => {
        if (!currentPrompt || !selectedProjectId) return;

        const selectedProject = projects.find(p => p.id === selectedProjectId);
        if (!selectedProject) return;
        
        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            const stream = await getCostInsightsStream(selectedProject, currentPrompt);
            let accumulatedText = "";
            for await (const chunk of stream) {
                accumulatedText += chunk.text;
                const html = await parseMarkdown(accumulatedText);
                setResponse(html);
            }
        } catch (e: any) {
            setError(`An error occurred: ${e.message}. Ensure your API key is configured.`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handlePromptSubmit(prompt);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion);
        handlePromptSubmit(suggestion);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Cost Intelligence</h2>
                    <p className="text-sm text-slate-600 mb-4">Select a project and ask our AI for insights, cost-saving suggestions, and risk analysis.</p>
                    
                    <div>
                        <label htmlFor="project-select" className="block text-sm font-medium text-slate-700">
                            Select a Project
                        </label>
                        <select
                            id="project-select"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm"
                            disabled={projects.length === 0}
                        >
                            {projects.length === 0 && <option>No projects available</option>}
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </Card>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-700">
                                Your Question
                            </label>
                            <textarea
                                id="ai-prompt"
                                rows={4}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., 'Summarize the material costs for the facade phase.'"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                disabled={isLoading || !selectedProjectId}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !prompt.trim() || !selectedProjectId}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold transition-colors disabled:bg-slate-400"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            {isLoading ? 'Analyzing...' : 'Get Insights'}
                        </button>
                    </form>
                </Card>

                <Card title="Suggestions">
                    <div className="flex flex-wrap gap-2">
                        {suggestionPrompts.map(suggestion => (
                            <button
                                key={suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                                disabled={isLoading || !selectedProjectId}
                                className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </Card>

            </div>

            <div className="lg:col-span-2">
                <Card className="h-full">
                     <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-primary-500" />
                        AI Insights
                    </h3>
                    <div 
                        ref={responseRef} 
                        className="prose prose-sm max-w-none h-[calc(100vh-15rem)] overflow-y-auto p-4 bg-slate-50 rounded-lg border"
                    >
                        {isLoading && !response && (
                             <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <SparklesIcon className="w-12 h-12 text-primary-400 animate-pulse mx-auto" />
                                    <p className="mt-2 text-slate-600">Analyzing project data...</p>
                                </div>
                             </div>
                        )}
                        {error && <p className="text-red-500">{error}</p>}
                        {!isLoading && !error && !response && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-slate-500">Your AI-generated insights will appear here.</p>
                            </div>
                        )}
                        <div dangerouslySetInnerHTML={{ __html: response }} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default IntelligencePage;