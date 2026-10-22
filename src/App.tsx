import React, { useState } from 'react';
import JSZip from 'jszip';
import { Header, ActiveTab } from './components/Header';
import { ExecutiveSummaryTab } from './components/ExecutiveSummaryTab';
import { EdaTab } from './components/EdaTab';
import { ModelBenchmarkTab } from './components/ModelBenchmarkTab';
import { ExplainableAiTab } from './components/ExplainableAiTab';
import { MlOpsMonitoringTab } from './components/MlOpsMonitoringTab';
import { GitHubPackageTab } from './components/GitHubPackageTab';
import { generateRepoFiles } from './data/repoPackageFiles';
import { Check, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [authorName, setAuthorName] = useState<string>('Rupesh');
  const [githubUsername, setGithubUsername] = useState<string>('rupeshk0392');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();
      const files = generateRepoFiles(authorName, githubUsername);

      // Add each file to the zip archive preserving directory structure
      for (const file of files) {
        zip.file(file.path, file.content);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(content);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `aegischurn-ml-${githubUsername}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      triggerToast(`Exported complete GitHub repository as aegischurn-ml-${githubUsername}.zip!`);
    } catch (err) {
      console.error('Failed to export zip:', err);
      triggerToast('Error packaging repository ZIP. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportZip={handleExportZip}
        isExporting={isExporting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <ExecutiveSummaryTab onNavigateToTab={(tab: ActiveTab) => setActiveTab(tab)} />
        )}

        {activeTab === 'eda' && <EdaTab />}

        {activeTab === 'benchmark' && <ModelBenchmarkTab />}

        {activeTab === 'xai' && <ExplainableAiTab />}

        {activeTab === 'mlops' && <MlOpsMonitoringTab />}

        {activeTab === 'package' && (
          <GitHubPackageTab
            authorName={authorName}
            setAuthorName={setAuthorName}
            githubUsername={githubUsername}
            setGithubUsername={setGithubUsername}
            onExportZip={handleExportZip}
            isExporting={isExporting}
          />
        )}
      </main>

      {/* Quiet, Clean Footer adhering to frontend-design */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>AegisChurn Machine Learning Portfolio Package</span>
            <span aria-hidden="true">·</span>
            <span>Authored by {authorName}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('package')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Browse Code Files
            </button>
            <button
              onClick={handleExportZip}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Export Repository (.zip)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
