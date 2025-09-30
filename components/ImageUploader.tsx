
import React, { useCallback } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
    onImageChange: (file: File) => void;
    imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreviewUrl }) => {
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageChange(event.target.files[0]);
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            onImageChange(event.dataTransfer.files[0]);
        }
    }, [onImageChange]);

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };


    return (
        <div>
            <label 
                htmlFor="file-upload" 
                className="relative block w-full h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors duration-300 bg-slate-50 flex items-center justify-center overflow-hidden"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Vista previa del plato" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center text-slate-500 p-4">
                        <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <span className="mt-2 block font-semibold">Haz clic para subir una imagen</span>
                        <span className="block text-sm">o arrastra y suelta</span>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</p>
                    </div>
                )}
            </label>
            <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
            />
        </div>
    );
};
