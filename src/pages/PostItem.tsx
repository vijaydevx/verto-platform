import React, { useState, useRef, useEffect } from "react";
import imageCompression from "browser-image-compression";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Camera, 
  MapPin, 
  Tag, 
  Calendar, 
  Clock, 
  UploadCloud, 
  X, 
  Lightbulb, 
  ShieldCheck, 
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  Search,
  Gift,
  Check
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateItem } from "@/hooks/useItems";
import { useUpload } from "@/hooks/useUpload";

// --- Types ---
type ItemType = "lost" | "found";

interface FormState {
  type: ItemType;
  title: string;
  location: string;
  description: string;
  date: string;
  time: string;
  images: File[];
  phone: string;
  reward: string;
}

const STEPS = ["Item Details", "Additional Info", "Review & Publish"];

export function PostItemPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { user, profile } = useAuth();
  const createItemMutation = useCreateItem();
  const uploadMutation = useUpload();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    type: "lost",
    title: "",
    location: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    time: "",
    images: [],
    phone: "",
    reward: ""
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // --- Handlers ---
  const updateForm = (updates: Partial<FormState>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isValidType) showToast({ variant: "error", title: "Invalid file type", description: `${file.name} is not JPG/PNG/WebP` });
      if (!isValidSize) showToast({ variant: "error", title: "File too large", description: `${file.name} exceeds 5MB` });
      return isValidType && isValidSize;
    });

    const newImages = [...form.images, ...validFiles].slice(0, 5);
    updateForm({ images: newImages });

    // Update previews
    const newPreviews = newImages.map(f => URL.createObjectURL(f));
    setImagePreviews(newPreviews);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    updateForm({ images: newImages });

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // --- Validation ---
  const isStep1Valid = form.title.trim() && form.location.trim() && form.description.trim() && form.date && form.images.length > 0;

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) {
      showToast({ variant: "error", title: "Incomplete details", description: "Please fill all required fields and upload at least one image." });
      return;
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!user) {
      showToast({ variant: "error", title: "Authentication required", description: "Please sign in to post an item." });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload images (with compression)
      const uploadedImageUrls: string[] = [];
      
      const compressionOptions = {
        maxSizeMB: 0.2, // Max size 200KB
        maxWidthOrHeight: 1280,
        useWebWorker: true
      };

      for (const file of form.images) {
        // Compress image before upload
        const compressedFile = await imageCompression(file, compressionOptions);
        
        // Upload compressed file
        const result = await uploadMutation.mutateAsync(compressedFile);
        uploadedImageUrls.push(result.publicUrl);
      }


      // 2. Create item in database
      await createItemMutation.mutateAsync({
        type: form.type,
        title: form.title,
        location: form.location,
        description: form.description,
        reported_date: form.date,
        // Using the first image for now as per schema
        image_url: uploadedImageUrls[0] || "",
        user_id: user.id,
        campus_id: profile?.campus_id || null,
        is_active: true
      });

      showToast({ variant: "success", title: "Report Published", description: "Your item has been successfully reported." });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Submission error:", error);
      showToast({ 
        variant: "error", 
        title: "Submission failed", 
        description: error.message || "An error occurred while publishing your report." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-900 selection:bg-[#2E7D5B]/20">
        
        {/* --- HERO HEADER --- */}
        <header className="pt-12 pb-8 px-6 lg:px-8 max-w-[1500px] mx-auto overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-[#2E7D5B] font-bold tracking-[0.2em] uppercase text-xs mb-3">Post Item</h3>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              Report a <span className="text-[#E53935]">lost</span> or <span className="text-[#2E7D5B]">found</span> item
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              Add the details someone needs to recognize the item and connect with you.
            </p>
          </div>
          
          {/* Header Illustration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden md:block"
               style={{
                 WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 100%)",
                 backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80')",
                 backgroundSize: "cover",
                 backgroundPosition: "center right"
               }}
          />
        </header>

        {/* --- MAIN CONTENT --- */}
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8 flex flex-col xl:flex-row gap-8 items-start relative z-20">
          
          {/* LEFT: FORM AREA */}
          <div className="flex-1 w-full xl:max-w-[850px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-12 relative">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-slate-100 -z-10 -translate-y-1/2" />
              <div className="absolute left-0 top-1/2 h-[2px] bg-[#2E7D5B] -z-10 -translate-y-1/2 transition-all duration-500 ease-out" 
                   style={{ width: `${((step - 1) / 2) * 100}%` }} />
              
              {STEPS.map((label, i) => {
                const s = i + 1;
                const isActive = step === s;
                const isPast = step > s;
                return (
                  <div key={label} className="flex items-center gap-3 bg-white px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                      isActive ? "bg-[#2E7D5B] text-white shadow-md shadow-[#2E7D5B]/30" :
                      isPast ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      {s}
                    </div>
                    <span className={`text-sm font-bold hidden sm:block transition-colors duration-300 ${
                      isActive ? "text-[#2E7D5B]" : isPast ? "text-slate-900" : "text-slate-400"
                    }`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* FORM CONTENT */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Item Type Toggle */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Item type</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => updateForm({ type: "lost" })}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 border-2 ${
                            form.type === "lost" 
                              ? "border-[#E53935] bg-[#E53935]/5 text-[#E53935]" 
                              : "border-slate-100 bg-transparent text-slate-500 hover:border-slate-200"
                          }`}
                        >
                          <Search className="w-5 h-5" />
                          Lost
                        </button>
                        <button
                          onClick={() => updateForm({ type: "found" })}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 border-2 ${
                            form.type === "found" 
                              ? "border-[#2E7D5B] bg-[#2E7D5B]/5 text-[#2E7D5B]" 
                              : "border-slate-100 bg-transparent text-slate-500 hover:border-slate-200"
                          }`}
                        >
                          <Gift className="w-5 h-5" />
                          Found
                        </button>
                      </div>
                    </div>

                    {/* Title & Location */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Title <span className="text-[#E53935]">*</span></label>
                        <div className="relative group">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2E7D5B] transition-colors" />
                          <input 
                            type="text" 
                            placeholder="e.g. Black Leather Wallet"
                            value={form.title}
                            onChange={(e) => updateForm({ title: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Location <span className="text-[#E53935]">*</span></label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2E7D5B] transition-colors" />
                          <input 
                            type="text" 
                            placeholder="e.g. Main Library, Floor 2"
                            value={form.location}
                            onChange={(e) => updateForm({ location: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-[#E53935]">*</span></label>
                      <div className="relative group">
                        <textarea 
                          placeholder="Mention colors, brand, identifying marks, and where it was seen..."
                          value={form.description}
                          onChange={(e) => updateForm({ description: e.target.value.slice(0, 500) })}
                          rows={4}
                          className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900 placeholder:text-slate-400 resize-none"
                        />
                        <div className="absolute bottom-3 right-4 text-xs font-bold text-slate-400">
                          {form.description.length}/500
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Reported date <span className="text-[#E53935]">*</span></label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2E7D5B] transition-colors" />
                          <input 
                            type="date" 
                            max={new Date().toISOString().slice(0, 10)}
                            value={form.date}
                            onChange={(e) => updateForm({ date: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900 text-left"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Time (approx.)</label>
                        <div className="relative group">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2E7D5B] transition-colors" />
                          <input 
                            type="time" 
                            value={form.time}
                            onChange={(e) => updateForm({ time: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Upload Area */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-bold text-slate-700">Images <span className="text-[#E53935]">*</span></label>
                        <span className="text-xs font-semibold text-slate-400">{form.images.length}/5 uploaded</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">Add clear images from multiple angles to help others recognize the item.</p>
                      
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => form.images.length < 5 && fileInputRef.current?.click()}
                        className={`w-full min-h-[160px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300 ${
                          form.images.length >= 5 
                            ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-75" 
                            : "border-[#2E7D5B]/30 bg-[#2E7D5B]/[0.02] hover:bg-[#2E7D5B]/[0.04] hover:border-[#2E7D5B]/50 cursor-pointer"
                        }`}
                      >
                        <input 
                          type="file" 
                          multiple 
                          accept="image/jpeg,image/png,image/webp" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={(e) => handleFileSelect(e.target.files)}
                        />

                        {form.images.length === 0 ? (
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-[#2E7D5B]">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-slate-700 mb-1">Drag & drop images here or browse</p>
                            <p className="text-xs font-semibold text-slate-400">JPG, PNG, or WebP. Up to 5MB per image. Max 5 images.</p>
                          </motion.div>
                        ) : (
                          <div className="w-full flex flex-wrap gap-4" onClick={(e) => e.stopPropagation()}>
                            {imagePreviews.map((url, i) => (
                              <motion.div 
                                key={url} 
                                initial={{ opacity: 0, scale: 0.8 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-sm group"
                              >
                                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                  <button onClick={() => removeImage(i)} className="w-8 h-8 bg-white/20 hover:bg-[#E53935] text-white rounded-full flex items-center justify-center transition-colors">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                            
                            {form.images.length < 5 && (
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-[#2E7D5B] hover:border-[#2E7D5B]/50 hover:bg-[#2E7D5B]/5 transition-all group"
                              >
                                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                  <Camera className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-xl font-bold mb-6">Additional Information</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone (Optional)</label>
                          <input 
                            type="tel" 
                            placeholder="+1 (555) 000-0000"
                            value={form.phone}
                            onChange={(e) => updateForm({ phone: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Reward (Optional)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. $50 or Coffee"
                            value={form.reward}
                            onChange={(e) => updateForm({ reward: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-xl font-bold mb-6">Review & Publish</h3>
                      
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${form.type === 'lost' ? 'bg-[#E53935]/10 text-[#E53935]' : 'bg-[#2E7D5B]/10 text-[#2E7D5B]'}`}>
                            {form.type}
                          </span>
                          <h4 className="text-lg font-bold">{form.title}</h4>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Location</span>
                            <span className="font-semibold text-slate-900">{form.location}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Date</span>
                            <span className="font-semibold text-slate-900">{form.date} {form.time && `• ${form.time}`}</span>
                          </div>
                        </div>

                        <div>
                          <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Description</span>
                          <p className="font-medium text-slate-700 text-sm leading-relaxed">{form.description}</p>
                        </div>

                        {imagePreviews.length > 0 && (
                          <div>
                            <span className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Attached Images ({imagePreviews.length})</span>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {imagePreviews.map((url, i) => (
                                <img key={i} src={url} alt="preview" className="w-16 h-16 rounded-lg object-cover shadow-sm shrink-0" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FORM FOOTER */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex w-full sm:w-auto gap-3">
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <span className="hidden sm:inline">Back</span>
                    <ArrowLeft className="w-5 h-5 sm:hidden mx-auto" />
                  </button>
                )}
                
                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    disabled={step === 1 && !isStep1Valid}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#2E7D5B] hover:bg-[#1B5E3B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2E7D5B]/25 hover:shadow-xl hover:shadow-[#2E7D5B]/30"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#2E7D5B] hover:bg-[#1B5E3B] transition-colors disabled:opacity-70 shadow-lg shadow-[#2E7D5B]/25 hover:shadow-xl hover:shadow-[#2E7D5B]/30 relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Publishing...
                      </span>
                    ) : (
                      "Publish Item"
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full xl:w-[380px] space-y-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#2E7D5B]/[0.03] border border-[#2E7D5B]/10 rounded-3xl p-6"
            >
              <div className="w-10 h-10 rounded-full bg-[#2E7D5B]/10 flex items-center justify-center text-[#2E7D5B] mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-4 text-lg">Tips for better results</h4>
              <ul className="space-y-3">
                {[
                  "Provide accurate and detailed information.",
                  "Add clear images from multiple angles.",
                  "Mention unique marks or characteristics.",
                  "Choose the exact location and time."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium text-slate-600">
                    <Check className="w-4 h-4 shrink-0 text-[#2E7D5B] mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-3xl p-6"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2 text-lg">Your safety is important</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Do not share personal information like your phone number or address in the public description. Meet in public campus locations to return items.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#E8F3ED] rounded-3xl p-6 border border-[#2E7D5B]/20"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2E7D5B] mb-4 shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#1B5E3B] mb-2 text-lg">Make a difference</h4>
              <p className="text-sm font-medium text-[#2E7D5B]/80 leading-relaxed mb-6">
                Your report can help someone reunite with something important. Thank you for keeping the campus community strong!
              </p>
              <button onClick={nextStep} disabled={step === 3} className="w-full bg-[#2E7D5B] hover:bg-[#1B5E3B] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#2E7D5B]/25 hover:shadow-xl hover:shadow-[#2E7D5B]/30 transition-all disabled:opacity-50">
                Submit & Help
              </button>
            </motion.div>

            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> All reports are reviewed
              </span>
            </div>

          </div>
        </div>

      </div>
    </PageTransition>
  );
}
