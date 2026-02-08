
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onAnalyze: (text: string, fileName: string) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, isProcessing }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    // @ts-ignore
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';
    }
    return fullText;
  };

  const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    // @ts-ignore
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setFileName(file.name);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const reader = new FileReader();

      if (extension === 'pdf') {
        reader.onload = async (event) => {
          try {
            const result = await extractTextFromPDF(event.target?.result as ArrayBuffer);
            setText(result);
          } catch (err) {
            console.error(err);
            alert('Failed to parse PDF. The file might be encrypted or corrupted.');
          } finally {
            setIsExtracting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (extension === 'docx') {
        reader.onload = async (event) => {
          try {
            const result = await extractTextFromDocx(event.target?.result as ArrayBuffer);
            setText(result);
          } catch (err) {
            console.error(err);
            alert('Failed to parse DOCX. Please try a different file.');
          } finally {
            setIsExtracting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (extension === 'txt' || file.type === 'text/plain') {
        reader.onload = (event) => {
          setText(event.target?.result as string);
          setIsExtracting(false);
        };
        reader.readAsText(file);
      } else {
        alert('Unsupported file format. Please upload PDF, DOCX, or TXT.');
        setIsExtracting(false);
        setFileName(null);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during file upload.');
      setIsExtracting(false);
      setFileName(null);
    }
  };

  const handleReset = () => {
    setText('');
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!text.trim() || isExtracting) return;
    onAnalyze(text, fileName || 'Pasted Content');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Submit Document
        </h3>
        {fileName && (
          <button 
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear Submission
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => !isProcessing && !isExtracting && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
              fileName ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
            } ${isProcessing || isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />
            
            {isExtracting ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                <p className="font-bold text-indigo-900">Extracting content...</p>
                <p className="text-xs text-indigo-500 mt-1">Reading document structure</p>
              </div>
            ) : (
              <>
                <div className={`p-4 rounded-full mb-4 ${fileName ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                  <Upload className={`w-8 h-8 ${fileName ? 'text-indigo-600' : 'text-slate-400'}`} />
                </div>
                <p className="font-medium text-slate-700 text-center">
                  {fileName ? fileName : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-slate-400 mt-2">Supported: PDF, DOCX, TXT</p>
              </>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Or Paste Content Directly</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the document text here for analysis..."
              className="w-full h-[180px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm resize-none custom-scrollbar"
              disabled={isProcessing || isExtracting}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Analysis typically takes 15-30 seconds.</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isProcessing || isExtracting}
            className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
              !text.trim() || isProcessing || isExtracting
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Engine...
              </>
            ) : (
              'Run Integrity Check'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
