
import React from 'react';
import type { AnalysisResult } from '../types';
import { IngredientIcon, RecipeIcon, AllergenIcon } from './IconComponents';

interface ResultDisplayProps {
    result: AnalysisResult;
}

const ResultCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center">
            <span className="text-indigo-500">{icon}</span>
            <h3 className="text-xl font-bold text-slate-800 ml-3">{title}</h3>
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    return (
        <div className="space-y-6">
            <ResultCard title="Ingredientes" icon={<IngredientIcon className="w-6 h-6" />}>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                    {result.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </ResultCard>

            <ResultCard title="Receta" icon={<RecipeIcon className="w-6 h-6" />}>
                <ol className="list-decimal list-inside space-y-3 text-slate-700">
                    {result.recipe.map((step, index) => (
                        <li key={index} className="pl-2">{step}</li>
                    ))}
                </ol>
            </ResultCard>

            <ResultCard title="Posibles Alérgenos" icon={<AllergenIcon className="w-6 h-6" />}>
                 {result.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {result.allergens.map((allergen, index) => (
                            <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                                {allergen}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-600">No se identificaron alérgenos comunes.</p>
                )}
            </ResultCard>
        </div>
    );
};
