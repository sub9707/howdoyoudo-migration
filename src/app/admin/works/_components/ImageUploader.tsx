// src/app/admin/works/_components/ImageUploader.tsx 수정
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageFile {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  startIndex?: number;
  showThumbnailBadge?: boolean; // 썸네일 배지 표시 여부
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 20,
  startIndex = 0,
  showThumbnailBadge = false,
}: ImageUploaderProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = filesToAdd.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}은(는) 지원하지 않는 형식입니다.`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name}은(는) 50MB를 초과합니다.`);
        return false;
      }
      return true;
    });

    const newImages: ImageFile[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    onImagesChange([...images, ...newImages]);

    // input 초기화
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label
          htmlFor="image-upload"
          className={`
            flex items-center justify-center space-x-2 px-4 py-3 
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${
              images.length >= maxImages
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
            }
          `}
        >
          <Upload className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            이미지 선택 ({images.length}/{maxImages})
          </span>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          disabled={images.length >= maxImages}
          className="hidden"
        />
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div
              key={img.preview}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
            >
              <Image
                src={img.preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* 순서 표시 */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {startIndex + index + 1}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                  {/* 앞으로 */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="앞으로"
                    >
                      <span className="text-sm">←</span>
                    </button>
                  )}

                  {/* 삭제 */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* 뒤로 */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="뒤로"
                    >
                      <span className="text-sm">→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}