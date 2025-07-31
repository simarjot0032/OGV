import React from 'react';
import { Paragraph, Title } from './common';
import '@/styles/UploadBanner.scss';
import { PrimaryButton, SecondaryButton } from './common';
import { UploadIcon } from '@/icons/Upload.icon';
import { PreviewIcon } from '@/icons/Preview.icon';
import { FileInformationData } from '@/types';
import { validateFileInformation } from '@/utils/FileUploadValidation';
import { toast } from 'react-toastify';

interface Props {
  fileInformation: FileInformationData;
}

export const UploadBanner = ({ fileInformation }: Props) => {
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
          onClick={() => {}}
          icon={<PreviewIcon color="#000" className="svg-icon" />}
        />
        <PrimaryButton
          label="Upload"
          onClick={() => {
            if (validateFileInformation(fileInformation)) {
              toast.success('File information is valid');
            }
          }}
          icon={<UploadIcon color="#ffffff" />}
        />
      </div>
    </div>
  );
};
