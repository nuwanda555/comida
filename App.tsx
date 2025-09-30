
import React, { useState, useCallback } from 'react';
import { analyzeFoodImage } from './services/geminiService';
import type { AnalysisResult } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { ForkKnifeIcon } from './components/IconComponents';

const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (file: File) => {
        setImageFile(file);
        setAnalysisResult(null);
        setError(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleAnalyzeClick = useCallback(async () => {
        if (!imageFile) {
            setError("Por favor, selecciona una imagen primero.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeFoodImage(imageFile);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Ocurrió un error inesperado al analizar la imagen.");
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    return (
        <div className="min-h-screen bg-slate-100/50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <main className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full p-3 mb-4">
                        <ForkKnifeIcon className="w-8 h-8"/>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Analizador de Platos con IA</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        ¿Qué estás comiendo? Sube una foto y deja que Gemini te revele los secretos de tu plato.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
                    <ImageUploader
                        onImageChange={handleImageChange}
                        imagePreviewUrl={imagePreviewUrl}
                    />

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleAnalyzeClick}
                            disabled={!imageFile || isLoading}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                        >
                            {isLoading ? (
                                <>
                                    <Loader />
                                    <span>Analizando...</span>
                                </>
                            ) : (
                                'Analizar Plato'
                            )}
                        </button>
                    </div>
                </div>

                {error && <ErrorMessage message={error} />}
                
                {analysisResult && !isLoading && (
                   <div className="mt-8">
                       <ResultDisplay result={analysisResult} />
                   </div>
                )}
            </main>
            <footer className="text-center mt-8 text-slate-500 text-sm">
                <p>Desarrollado con React, Tailwind CSS y la API de Gemini.</p>
            </footer>
        </div>
    );
};

export default App;
