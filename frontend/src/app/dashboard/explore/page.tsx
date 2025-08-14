'use client';
import React, { useEffect, useState } from 'react';
import { ModelCard, Paragraph, SearchBar } from '@/components';
import { ModelData, ModelsApiResponse } from '@/types/ModelData';
import { FileSize } from '@/utils/FileSize';
import '@/styles/Explore.scss';

const ExplorePage = () => {
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_GET_ALL_MODELS_URL;
        console.log(url);
        if (!url) {
          setError('No URL found');
          return;
        }
        const response = await fetch(url);
        const data: ModelsApiResponse = await response.json();

        if (data.success) {
          setModels(data.data);
        } else {
          setError('Failed to fetch models');
        }
      } catch (err) {
        setError('Error fetching models');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);


  return (
      <div className="explore-page">
        <div className="explore-page-header">
          <SearchBar/>
          <div className="explore-page-count-container">
            <Paragraph paragraph={` Total Models: ${models.length}`} />
          </div>
        </div>
      <div className="explore-page-container">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            modelId={model.id}
            image={model.thumbnailUrl}
            title={model.title}
            category={model.category}
            orifinalFileType={model.originalFileFormat}
            fileSize={FileSize(model.originalFileSize.toString())}
            uploadDate={model.createdAt}
            license={model.license}
            expirationTime={model.expiresIn.toString()}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
