import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBadge, Upload, Settings, Play } from 'lucide-react';
import api from '../../api/axios';

export default function Certificates() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(20);
    try {
      const response = await api.post('/certificates/generate', {}, { responseType: 'blob' });
      setProgress(100);
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificates.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error(error);
      alert('Failed to generate certificates');
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Certificate Engine</h1>
          <p className="text-muted-foreground mt-1">Bulk generation and cryptographic verification.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/40 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" /> Template Configuration
          </h2>
          <div className="border-2 border-dashed border-border rounded-xl h-48 flex flex-col items-center justify-center bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer mb-4">
            <FileBadge className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-gray-300">Drop PNG/PDF template here</p>
            <p className="text-xs text-muted-foreground">1920x1080 recommended</p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-secondary/30 border border-border rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-gray-300">Data Source (CSV)</span>
              <button className="text-xs bg-secondary px-3 py-1.5 rounded-md hover:bg-white hover:text-black transition-colors font-medium">Upload File</button>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-gray-300">Coordinate Mapping</span>
              <button className="text-xs bg-secondary px-3 py-1.5 rounded-md hover:bg-white hover:text-black transition-colors font-medium flex items-center gap-1"><Settings className="w-3 h-3"/> Configure</button>
            </div>
          </div>
        </div>

        <div className="bg-card/40 border border-border rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" /> Generation Engine
          </h2>
          
          <div className="flex-1 flex flex-col justify-center">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-medium">Processing Batch...</span>
                  <span className="text-white">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">Encrypting and signing certificates...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                  <FileBadge className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">System Ready</h3>
                <p className="text-sm text-muted-foreground mb-6">Template and data source validated.</p>
                <button 
                  onClick={handleGenerate}
                  className="w-full bg-primary hover:bg-destructive text-white py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" /> Execute Batch Build
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
