"use client";
import React, { useRef, useState } from "react";
import "../styles/converter.scss";
import { MdUploadFile } from "react-icons/md";
import { InputFormats, MaxFileSize, OutputFormats } from "../constants/formats";
import { toast, ToastContainer } from "react-toastify";

const ConverterPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string>();
  const [isConverting, setIsConverting] = useState(false);
  const [inputFileExtension, setInputFileExtension] = useState<string>();
  const [outputFileExtension, setOutputFileExtension] = useState<string>();
  const [downloadUrl, setDownloadUrl] = useState<string>();

  const handleCustomButton = () => {
    if (uploadedFiles) {
      setUploadedFiles(undefined);
      setOutputFileExtension(undefined);
      setDownloadUrl(undefined);
      setInputFileExtension(undefined);
    } else {
      fileInputRef.current?.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > MaxFileSize) {
      toast.error("File size exceeds limit");
      setUploadedFiles(undefined);
      return;
    }
    if (file) {
      setUploadedFiles(file.name);
      const fileName: string = file.name;
      const fileExtension: string = fileName.split(".").pop() || "";
      setInputFileExtension(fileExtension);
    }
  };
  const handleOutputFormatChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const format = event.target.value;
    setOutputFileExtension(format);
  };

  const handleConvert = async () => {
    console.log(inputFileExtension, outputFileExtension);
    if (!InputFormats.includes(inputFileExtension || "")) {
      toast.error("Invalid input format");
      return;
    }
    if (!outputFileExtension) {
      toast.error("Please select an output format");
      return;
    }
    if (!OutputFormats.includes(outputFileExtension)) {
      toast.error("Invalid output format");
      return;
    }
    const APIURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!APIURL) {
      toast.error("Try again later");
      return;
    }
    const data = new FormData();
    if (fileInputRef.current?.files?.[0]) {
      data.append("file", fileInputRef.current?.files?.[0]);
    }
    data.append("outputFormat", outputFileExtension);
    setIsConverting(true);
    try {
      toast.info("Converting file...");
      const response = await fetch(APIURL, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      }
      setIsConverting(false);
      toast.success("File converted successfully available to download");
    } catch (e) {
      console.error("Failed to convert file", e);
      setIsConverting(false);
      toast.error("Failed to convert file");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="parent">
        <div className="headings">
          <h1 className="main-heading">OGV</h1>
          <h5 className="tagline">by BRL-CAD</h5>
        </div>
        <div className="converter-container">
          <div className="converter">
            <input
              type="file"
              className="file-input"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button className="convert-button" onClick={handleCustomButton}>
              {uploadedFiles ? "Reset" : "Upload File"}
            </button>
          </div>
          {uploadedFiles && (
            <div className="uploaded-files-container">
              <div className="uploaded-file">
                <div className="file-icon">
                  <MdUploadFile size={25} color="#d0245e" />
                  {uploadedFiles}
                </div>
                <div className="file-output-option">
                  <select
                    onChange={(e) => handleOutputFormatChange(e)}
                    className="output-formats"
                  >
                    <option value="" className="option">
                      Select Output Format
                    </option>
                    {OutputFormats.filter(
                      (format) => format !== inputFileExtension
                    ).map((format, index) => (
                      <option key={index} value={format} className="option">
                        .{format}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="file-buttons">
                  <button
                    className="file-convert-button"
                    onClick={handleConvert}
                    disabled={isConverting}
                  >
                    {isConverting ? "Converting..." : "Convert"}
                  </button>
                  <a
                    href={downloadUrl || "#"}
                    download={`converted_file.${outputFileExtension}`}
                  >
                    <button
                      className="file-download-button"
                      disabled={!downloadUrl}
                    >
                      Download
                    </button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConverterPage;
