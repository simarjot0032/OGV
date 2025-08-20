'use client';
import React, { useEffect, useState } from 'react';
import { ModelCard, Paragraph, SearchBar } from '@/components';
import { ModelData, ModelsApiResponse } from '@/types/ModelData';
import { FileSize } from '@/utils/FileSize';
import '@/styles/Explore.scss';

const ExplorePage = () => {
  const [models, setModels] = useState<ModelData[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          setFilteredModels(data.data);
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

    void fetchModels();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredModels(models);
    } else {
      const filtered = models.filter(
        (model) =>
          model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  }, [searchTerm, models]);

  if (loading) {
    return (
      <div className="explore-page">
        <div className="explore-page-model-loading-container">
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Loading Models...
          </div>
          <div style={{ fontSize: '16px', color: '#666' }}>
            Please wait while we fetch your 3D models
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="explore-page">
        <div className="explore-page-model-loading-error-container">
          <div
            style={{ fontSize: '24px', fontWeight: 'bold', color: '#d0245e' }}
          >
            Error Loading Models
          </div>
          <div style={{ fontSize: '16px', color: '#666' }}>{error}</div>
          <button
            className="explore-page-model-loading-error"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <div className="explore-page-header">
        <SearchBar onSearch={setSearchTerm} searchTerm={searchTerm} />
        <div className="explore-page-count-container">
          <Paragraph
            paragraph={` Total Models: ${filteredModels.length} of ${models.length}`}
          />
        </div>
      </div>
      <div className="explore-page-models-container">
        {filteredModels.length === 0 && searchTerm.trim() !== '' ? (
          <div className="explore-page-search-not-found">
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              No Models Found
            </div>
            <div style={{ fontSize: '16px', color: '#666' }}>
              No models match your search for "{searchTerm}"
            </div>
          </div>
        ) : (
          filteredModels.map((model) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
