import React from 'react';

const ImagePreview = ({ selectedFiles, onRemove, maxImages = 4 }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
                <label className="block text-slate-700 font-semibold text-sm">
                    Resource Images <span className="text-slate-500 text-xs font-normal">({selectedFiles.length}/{maxImages})</span>
                </label>
            </div>

            {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                            <div className="w-full aspect-square bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200">
                                <img
                                    src={file.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <p className="text-xs text-slate-600 mt-1 truncate">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedFiles.length === 0 && (
                <p className="text-slate-500 text-sm italic">No images selected</p>
            )}
        </div>
    );
};

export default ImagePreview;
