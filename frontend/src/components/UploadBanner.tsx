'use client';
import React, { useState } from 'react';
import { Paragraph, Title } from './common';
import '@/styles/UploadBanner.scss';
import { PrimaryButton, SecondaryButton } from './common';
import { UploadIcon } from '@/icons/Upload.icon';
import { PreviewIcon } from '@/icons/Preview.icon';
import { FileInformationData } from '@/types';
import { validateFileInformation } from '@/utils/FileUploadValidation';
import { toast } from 'react-toastify';
import { ModelPreviewModal } from './ModelPreviewModal';

interface Props {
  fileInformation: FileInformationData;
}

export const UploadBanner = ({ fileInformation }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const handleUpload = async () => {
    if (validateFileInformation(fileInformation)) {
      setIsUploading(true);
      try {
        const url = process.env.NEXT_PUBLIC_UPLOAD_URL;
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP: string = ipData.ip;
        const formData = new FormData();
        if (fileInformation.file) {
          formData.append('file', fileInformation.file);
          console.log('File uploaded:', fileInformation.file);
        }

        if (fileInformation.thumbnail) {
          formData.append('thumbnailImage', fileInformation.thumbnail);
          console.log('Thumbnail uploaded:', fileInformation.thumbnail);
        }

        formData.append('title', fileInformation.title);
        formData.append('description', fileInformation.description);
        formData.append('category', fileInformation.category);
        formData.append('license', fileInformation.license);
        formData.append('expiresIn', fileInformation.expiresIn.toString());
        formData.append('userIP', userIP);
        if (url) {
          const response = await fetch(url, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              toast.success('File uploaded successfully!');
              console.log('Upload successful:', result);
            } else {
              toast.error('Upload failed: ' + result.error);
              console.error('Upload failed:', result);
            }
          } else {
            const error = await response.text();
            toast.error('Upload failed: ' + error);
            console.error('Upload failed:', error);
          }
        } else {
          toast.error(
            'We are facing some issues with the server. Please try again later.'
          );
        }
      } catch (error) {
        toast.error('Upload failed: ' + error);
        console.error('Upload error:', error);
      }
      setIsUploading(false);
    }
  };
  const handlePreview = () => {
    if (!fileInformation.file) {
      toast.error('Please upload a file first');
      return;
    }
    setShowPreview(true);
  };

  return (
    <div className="upload-banner">
      <div className="upload-banner-content">
        <Title title="Convert and Share Your 3D File " />
        <Paragraph paragraph="Upload your 3D file to share it with others." />
      </div>
      <div className="button-container">
        <SecondaryButton
          label="Preview"
          className="preview-button"
          onClick={handlePreview}
          icon={<PreviewIcon color="#000" className="svg-icon" />}
        />
        <PrimaryButton
          label={isUploading ? 'Uploading...' : 'Upload'}
          disabled={isUploading}
          onClick={handleUpload}
          icon={<UploadIcon color="#ffffff" />}
        />
      </div>
      <ModelPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        file={fileInformation.file}
      />
    </div>
  );
};
