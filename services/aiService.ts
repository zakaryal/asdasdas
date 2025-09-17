import { GoogleGenAI } from "@google/genai";
import { Project } from '../types';
import { formatCurrency, formatDate } from "../utils/formatters";

const SYSTEM_INSTRUCTION = `You are an expert construction cost management assistant named CiviCost AI. 
Your role is to analyze project data and provide clear, concise, and actionable insights.
When asked for analysis, respond in well-structured Markdown format. 
Use headings, lists, and bold text to improve readability.
Base your answers strictly on the provided project data.`;

const buildProjectContext = (project: Project): string => {
    let context = `Project Name: ${project.name}\n`;
    context += `Description: ${project.description}\n`;
    context += `Budget: ${formatCurrency(project.budget)}\n`;
    context += `Start Date: ${formatDate(project.startDate)}\n`;
    context += `End Date: ${formatDate(project.endDate)}\n\n`;

    project.phases.forEach(phase => {
        context += `Phase: ${phase.name} (${formatDate(phase.startDate)} to ${formatDate(phase.endDate)})\n`;
        
        context += "  Materials:\n";
        phase.materials.forEach(m => {
            context += `    - ${m.name}: ${m.quantity} units @ ${formatCurrency(m.unitPrice)}/unit = ${formatCurrency(m.quantity * m.unitPrice)}\n`;
        });

        context += "  Labor:\n";
        phase.labor.forEach(l => {
            context += `    - ${l.role}: ${l.hours} hours @ ${formatCurrency(l.rate)}/hr = ${formatCurrency(l.hours * l.rate)}\n`;
        });
        context += "\n";
    });

    return context;
};

export const getCostInsightsStream = async (project: Project, prompt: string) => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const fullPrompt = `
        Project Data:
        ---
        ${buildProjectContext(project)}
        ---

        User Request: "${prompt}"
    `;
    
    const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        }
    });

    return responseStream;
};