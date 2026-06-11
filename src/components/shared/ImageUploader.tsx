// src/components/shared/ImageUploader.tsx

import { useState, useRef, useCallback } from 'react';
import {
  Box, Button, HStack, IconButton, Input, Stack, Text, Spinner,
} from '@chakra-ui/react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { toaster } from '@/components/ui/toaster';
import { uploadImage } from '@/lib/api/upload';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  placeholder?: string;
}

export function ImageUploader({ value, onChange, onRemove, placeholder }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadImage(file);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'שגיאה בהעלאה');
      }

      onChange(result.data.url);
      toaster.create({ title: 'התמונה הועלתה בהצלחה', type: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      toaster.create({ 
        title: error instanceof Error ? error.message : 'שגיאה בהעלאת התמונה', 
        type: 'error' 
      });
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUrlSubmit = useCallback(() => {
    if (urlValue.trim()) {
      onChange(urlValue.trim());
      setShowUrlInput(false);
      setUrlValue('');
    }
  }, [urlValue, onChange]);

  // If we have a value, show preview
  if (value) {
    return (
      <Box position="relative" borderRadius="lg" overflow="hidden" bg="bg.muted">
        <img
          src={value}
          alt="תמונה שהועלתה"
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
          }}
        />
        {onRemove && (
          <IconButton
            aria-label="הסר תמונה"
            position="absolute"
            top={2}
            right={2}
            size="sm"
            colorPalette="red"
            variant="solid"
            onClick={onRemove}
            borderRadius="full"
          >
            <X size={16} />
          </IconButton>
        )}
      </Box>
    );
  }

  // URL input mode
  if (showUrlInput) {
    return (
      <Stack gap={2}>
        <HStack gap={2}>
          <Input
            placeholder="הדבק כתובת URL של תמונה"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            size="sm"
          />
          <Button size="sm" bg="btn.primary.bg" color="btn.primary.fg" _hover={{ bg: 'btn.primary.hover' }} borderRadius="lg" onClick={handleUrlSubmit}>
            אישור
          </Button>
          <IconButton
            aria-label="ביטול"
            size="sm"
            variant="ghost"
            onClick={() => setShowUrlInput(false)}
          >
            <X size={16} />
          </IconButton>
        </HStack>
      </Stack>
    );
  }

  // Upload zone
  return (
    <Box
      border="2px dashed"
      borderColor={isUploading ? 'brand.300' : 'border.default'}
      borderRadius="lg"
      p={6}
      textAlign="center"
      bg={isUploading ? 'bg.brand.subtle' : 'bg.subtle'}
      cursor={isUploading ? 'wait' : 'pointer'}
      _hover={{ bg: 'bg.brand.subtle', borderColor: 'brand.300' }}
      transition="all 0.2s"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {isUploading ? (
        <Stack gap={2} align="center">
          <Spinner size="lg" color="brand.500" />
          <Text color="fg.brand" fontWeight="medium">מעלה תמונה...</Text>
        </Stack>
      ) : (
        <Stack gap={3} align="center">
          <Box p={3} bg="bg.surface" rounded="full">
            <Upload size={22} color="var(--chakra-colors-brand-500)" />
          </Box>
          <Stack gap={1}>
            <Text fontWeight="medium" color="fg.default" fontSize="sm">
              {placeholder || 'לחץ להעלאת תמונה או גרור לכאן'}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              JPG, PNG, WebP או GIF עד 5MB
            </Text>
          </Stack>
          <Button
            size="xs"
            variant="ghost"
            color="fg.muted"
            onClick={(e) => {
              e.stopPropagation();
              setShowUrlInput(true);
            }}
          >
            <LinkIcon size={14} />
            <Text ms={1}>או הדבק URL</Text>
          </Button>
        </Stack>
      )}
    </Box>
  );
}
