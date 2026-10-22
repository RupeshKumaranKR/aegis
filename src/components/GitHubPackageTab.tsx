import React, { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Folder,
  FileCode,
  Github,
  Terminal,
  Sparkles,
  BookOpen,
  Settings,
  Layers,
} from 'lucide-react';
import { generateRepoFiles, RepoFile } from '../data/repoPackageFiles';

interface GitHubPackageTabProps {
  authorName: string;
  setAuthorName: (name: string) => void;
  githubUsername: string;
  setGithubUsername: (user: string) => void;
  onExportZip: () => void;
  isExporting: boolean;
}

export const GitHubPackageTab: React.FC<GitHubPackageTabProps> = ({
  authorName,
  setAuthorName,
  githubUsername,
  setGithubUsername,
  onExportZip,
  isExporting,
}) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('README.md');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState<boolean>(false);

  // Generate file objects dynamically from author details
  const repoFiles = useMemo(() => {
    return generateRepoFiles(authorName, githubUsername);
  }, [authorName, githubUsername]);

  const activeFile = repoFiles.find((f) => f.path === selectedFilePath) || repoFiles[0];

  const handleCopyContent = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gitCommands = `cd aegischurn-ml
git init
git add .
git commit -m "feat: complete enterprise ML churn engine with SHAP and FastAPI"
git branch -M main
git remote add origin https://github.com/${githubUsername}/aegischurn-ml.git
git push -u origin main`;

  const handleCopyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Personalization */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Full GitHub Repository Package</span>
              <span aria-hidden="true">·</span>
              <span>Production Ready</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              GitHub Repository Explorer & One-Click Package Export
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Everything required for a top-tier Data Science GitHub showcase: complete README with shields &
              LaTeX math, valid Jupyter notebooks with execution cells, scikit-learn transformers, Optuna tuning,
              FastAPI Docker container, Pytest suite, Model Card, and GitHub Actions CI/CD.
            </p>
          </div>

          <button
            onClick={onExportZip}
            disabled={isExporting}
            className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer self-start lg:self-auto shrink-0"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Packaging Archive...' : 'Download Complete Repo (.zip)'}
          </button>
        </div>

        {/* Author Details Customizer */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Your Name (Author):
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Rupesh"
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Your GitHub Username:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-slate-500 font-mono">@</span>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. rupeshk0392"
                className="w-full pl-7 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 mt-2 font-mono">
          * Updating your name or username automatically updates all badge URLs, license headers, and citation metadata across the repository.
        </div>
      </div>

      {/* Main File Browser & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Repository File Tree (4 cols) */}
        <div className="lg:col-span-4 border border-slate-800 bg-slate-900/40 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Repository Tree
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {repoFiles.length} files
            </span>
          </div>

          <div className="space-y-1">
            {repoFiles.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="truncate">{file.path}</span>
                  </div>

                  <span className="text-[10px] text-slate-500 uppercase ml-2 shrink-0">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Terminal Guide Card */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-semibold">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Push to GitHub in 30 Seconds
              </span>
              <button
                onClick={handleCopyGitCommands}
                className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedGitCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedGitCmd ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto leading-relaxed">
              {gitCommands}
            </pre>
          </div>
        </div>

        {/* Right Column: Code & Markdown Inspector (8 cols) */}
        <div className="lg:col-span-8 border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
          {/* File Tab Header */}
          <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-semibold text-white">
                {activeFile.path}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {activeFile.language}
              </span>
            </div>

            <button
              onClick={handleCopyContent}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy File Content'}
            </button>
          </div>

          {/* File Content Body */}
          <div className="p-5 max-h-[640px] overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed whitespace-pre select-text">
            {activeFile.content}
          </div>
        </div>
      </div>
    </div>
  );
};
