"use client";

import { useState } from "react";
import { 
  Shield, 
  Eye, 
  UserCircle, 
  Heart, 
  ArrowRight, 
  CheckCircle2,
  Stethoscope,
  Brain,
  Apple,
  Baby,
  Sparkles
} from "lucide-react";

interface Pillar {
  id: string;
  label: string;
  icon: any;
  questions: string[];
}

const PILLARS: Pillar[] = [
  {
    id: "posicionamiento",
    label: "Posicionamiento",
    icon: Shield,
    questions: [
      "¿Cuál es tu propuesta de valor única?",
      "¿En qué sub-especialidad quieres ser reconocido como autoridad?",
      "¿Quién es tu competencia directa e indirecta?"
    ]
  },
  {
    id: "visibilidad",
    label: "Visibilidad",
    icon: Eye,
    questions: [
      "¿En qué canales digitales tienes presencia actualmente?",
      "¿Cuál es tu frecuencia de publicación de contenido?",
      "¿Utilizas pauta digital (Ads) para atraer pacientes?"
    ]
  },
  {
    id: "identidad",
    label: "Identidad",
    icon: UserCircle,
    questions: [
      "¿Tu marca personal refleja tus valores profesionales?",
      "¿Tienes una identidad visual coherente (logo, colores, tipografía)?",
      "¿Tu tono de comunicación es consistente en todos los puntos de contacto?"
    ]
  },
  {
    id: "humanizacion",
    label: "Humanización",
    icon: Heart,
    questions: [
      "¿Compartes historias de éxito o testimonios (respetando la ética)?",
      "¿Muestras el 'detrás de escena' de tu práctica clínica?",
      "¿Cómo conectas emocionalmente con tus pacientes antes de la consulta?"
    ]
  }
];

const SPECIALTIES = [
  { id: "neurologo", label: "Neurólogo", icon: Brain },
  { id: "psicologo", label: "Psicólogo", icon: Shield },
  { id: "nutricionista", label: "Nutricionista", icon: Apple },
  { id: "pediatra", label: "Pediatra", icon: Baby },
  { id: "cirujano_estetico", label: "Cirujano Estético", icon: Sparkles },
];

interface Props {
  specialty?: string;
  onComplete: (data: any) => void;
}

export function ProfessionalOnboarding({ specialty: initialSpecialty, onComplete }: Props) {
  const [step, setStep] = useState(initialSpecialty ? 1 : 0);
  const [specialty, setSpecialty] = useState(initialSpecialty || "");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentPillar = PILLARS[step - 1];

  const handleNext = () => {
    if (step < PILLARS.length) {
      setStep(step + 1);
    } else {
      onComplete({ specialty, answers });
    }
  };

  if (step === 0) {
    return (
      <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-xl max-w-2xl mx-auto overflow-hidden relative">
        <div className="absolute -top-24 -right-24 size-48 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 size-48 bg-emerald-500/10 blur-3xl rounded-full" />
        
        <header className="mb-10 text-center relative">
          <div className="inline-flex p-4 bg-blue-50 rounded-2xl mb-6 ring-1 ring-blue-100">
            <Stethoscope className="size-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Bienvenido a Purpose360 AI</h2>
          <p className="text-slate-500">Selecciona tu especialidad para comenzar tu auditoría de marca.</p>
        </header>

        <div className="grid grid-cols-2 gap-4 relative">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec.id}
              onClick={() => {
                setSpecialty(spec.id);
                setStep(1);
              }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-500/50 hover:shadow-lg transition-all group text-left"
            >
              <div className="p-3 bg-white rounded-xl group-hover:bg-blue-50 transition-colors shadow-sm">
                <spec.icon className="size-6 text-blue-600" />
              </div>
              <span className="font-semibold text-slate-700">{spec.label}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-xl max-w-2xl mx-auto overflow-hidden relative">
      <div className="absolute -top-24 -right-24 size-48 bg-blue-500/10 blur-3xl rounded-full" />
      
      <header className="mb-8 relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl ring-1 ring-blue-100">
            <currentPillar.icon className="size-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pilar {step} de 4</h3>
            <h2 className="text-2xl font-bold text-slate-900">{currentPillar.label}</h2>
          </div>
        </div>
        
        <div className="flex gap-1.5">
          {PILLARS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i + 1 <= step ? "bg-blue-600" : "bg-slate-100"}`} 
            />
          ))}
        </div>
      </header>

      <div className="space-y-8 relative">
        {currentPillar.questions.map((q, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <label className="block text-sm font-semibold mb-3 text-slate-700">{q}</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-24 placeholder:text-slate-400 text-slate-800"
              placeholder="Escribe tu respuesta aquí..."
              value={answers[`${currentPillar.id}_${i}`] || ""}
              onChange={(e) => setAnswers({ ...answers, [`${currentPillar.id}_${i}`]: e.target.value })}
            />
          </div>
        ))}

        <button
          onClick={handleNext}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98]"
        >
          {step === 4 ? "Finalizar Auditoría" : "Siguiente Pilar"}
          <ArrowRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
