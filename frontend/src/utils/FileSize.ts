export const FileSize = (fileSize: string) => {
  if (fileSize) {
    return `${(parseInt(fileSize, 10) / (1024 * 1024)).toFixed(2)} MB`;
  }
  return 'File Not Found';
};