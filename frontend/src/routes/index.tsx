import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CircleAlert,
  HeartPulse,
  Loader2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HealthGuard AI — AI-Powered Health Risk Assessment" },
      {
        name: "description",
        content:
          "HealthGuard AI is a student hackathon prototype that demonstrates an AI-powered health risk assessment dashboard using synthetic data.",
      },
      { property: "og:title", content: "HealthGuard AI — AI-Powered Health Risk Assessment" },
      {
        property: "og:description",
        content:
          "AI-powered health risk assessment dashboard. Student hackathon prototype using synthetic data — demo only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ------------------------------------------------------------------ */
/* Types & mock prediction                                             */
/* ------------------------------------------------------------------ */

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

interface PatientForm {
  age: string;
  bmi: string;
  bloodPressure: string;
  glucose: string;
  cholesterol: string;
  smoking: "no" | "yes" | "";
  activity: "inactive" | "active" | "";
  history: "no" | "yes" | "";
}

interface Prediction {
  level: RiskLevel;
  probabilities: { high: number; medium: number; low: number };
}

const EMPTY_FORM: PatientForm = {
  age: "",
  bmi: "",
  bloodPressure: "",
  glucose: "",
  cholesterol: "",
  smoking: "",
  activity: "",
  history: "",
};

/**
 * MOCK prediction — placeholder heuristic for UI demonstration only.
 * Will be replaced by the real backend API call (handled by another team member).
 */
async function Predictrisk(form: PatientForm): Promise<Prediction> {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      age: Number(form.age),
      bmi: Number(form.bmi),
      blood_pressure: Number(form.bloodPressure),
      glucose: Number(form.glucose),
      cholesterol: Number(form.cholesterol),
      smoking: form.smoking === "yes" ? 1 : 0,
      activity: form.activity === "active" ? 1 : 0,
      medical_history: form.history === "yes" ? 1 : 0,
    }),
  });

  if (!response.ok) {
    throw new Error("Backend prediction failed");
  }

  const data = await response.json();

  return {
    level: data.risk_level.toUpperCase() as RiskLevel,
    probabilities: {
      high: data.probabilities.High * 100,
      medium: data.probabilities.Medium * 100,
      low: data.probabilities.Low * 100,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function validate(form: PatientForm): string | null {
  if (Object.values(form).some((v) => v === "")) {
    return "Please complete all required fields.";
  }
  const num = (v: string) => Number(v);
  if (!Number.isFinite(num(form.age)) || num(form.age) < 1 || num(form.age) > 120) {
    return "Please enter a valid age.";
  }
  if (!Number.isFinite(num(form.bmi)) || num(form.bmi) < 10 || num(form.bmi) > 80) {
    return "Please enter a valid BMI (10–80).";
  }
  if (
    !Number.isFinite(num(form.bloodPressure)) ||
    num(form.bloodPressure) < 50 ||
    num(form.bloodPressure) > 260
  ) {
    return "Please enter a valid blood pressure value.";
  }
  if (!Number.isFinite(num(form.glucose)) || num(form.glucose) < 40 || num(form.glucose) > 500) {
    return "Please enter a valid glucose value.";
  }
  if (
    !Number.isFinite(num(form.cholesterol)) ||
    num(form.cholesterol) < 80 ||
    num(form.cholesterol) > 500
  ) {
    return "Please enter a valid cholesterol value.";
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

function Field({
  label,
  unit,
  children,
}: {
  label: string;
  unit?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-baseline justify-between text-sm font-semibold text-foreground">
        {label}
        {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/60 hover:border-ring/50 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60";

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  name,
  disabled,
}: {
  value: T | "";
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  name: string;
  disabled?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="grid grid-cols-2 gap-1 rounded-lg border border-input bg-muted/60 p-1"
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60 ${
              selected
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const RISK_STYLES: Record<
  RiskLevel,
  { badge: string; bar: string; icon: React.ReactNode; label: string }
> = {
  LOW: {
    badge: "bg-risk-low/15 text-risk-low-foreground ring-risk-low/30",
    bar: "bg-risk-low",
    icon: <ShieldCheck className="size-5" aria-hidden />,
    label: "Low Risk",
  },
  MEDIUM: {
    badge: "bg-risk-medium/20 text-risk-medium-foreground ring-risk-medium/40",
    bar: "bg-risk-medium",
    icon: <AlertTriangle className="size-5" aria-hidden />,
    label: "Medium Risk",
  },
  HIGH: {
    badge: "bg-risk-high/12 text-risk-high-foreground ring-risk-high/30",
    bar: "bg-risk-high",
    icon: <CircleAlert className="size-5" aria-hidden />,
    label: "High Risk",
  },
};

function ProbabilityBar({
  label,
  percent,
  colorClass,
}: {
  label: string;
  percent: number;
  colorClass: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="tabular-nums font-semibold text-muted-foreground">
          {percent.toFixed(2)}%
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} probability`}
      >
        <div
          className={`h-full rounded-full ${colorClass} transition-[width] duration-700 ease-out`}
          style={{ width: `${Math.max(percent, percent > 0 ? 1.5 : 0)}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function Index() {
  const [form, setForm] = useState<PatientForm>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<Prediction | null>(null);

  const set = (key: keyof PatientForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setValidationError(null);
  };

  const loading = status === "loading";

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    const error = validate(form);
    if (error) {
      setValidationError(error);
      return;
    }

    setStatus("loading");
    setResult(null);
    try {
      const prediction = await Predictrisk(form);
      setResult(prediction);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
              <HeartPulse className="size-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                HealthGuard AI
              </h1>
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                AI-Powered Health Risk Assessment
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-accent px-3 py-1 text-[11px] font-bold tracking-wide text-accent-foreground uppercase">
            <Sparkles className="size-3" aria-hidden />
            Demo • Synthetic Data
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <form onSubmit={handlePredict} noValidate>
          <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
            {/* Patient information */}
            <section
              aria-labelledby="patient-info-heading"
              className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8 lg:col-span-3"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <Stethoscope className="size-5" aria-hidden />
                </div>
                <div>
                  <h2
                    id="patient-info-heading"
                    className="font-display text-lg font-bold text-foreground"
                  >
                    Patient Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter the clinical measurements below.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Age" unit="years">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    placeholder="e.g. 45"
                    value={form.age}
                    onChange={set("age")}
                    disabled={loading}
                    className={inputClass}
                  />
                </Field>
                <Field label="BMI" unit="kg/m²">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder="e.g. 24.5"
                    value={form.bmi}
                    onChange={set("bmi")}
                    disabled={loading}
                    className={inputClass}
                  />
                </Field>
                <Field label="Blood Pressure" unit="mmHg systolic">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 120"
                    value={form.bloodPressure}
                    onChange={set("bloodPressure")}
                    disabled={loading}
                    className={inputClass}
                  />
                </Field>
                <Field label="Glucose" unit="mg/dL">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 95"
                    value={form.glucose}
                    onChange={set("glucose")}
                    disabled={loading}
                    className={inputClass}
                  />
                </Field>
                <Field label="Cholesterol" unit="mg/dL">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 180"
                    value={form.cholesterol}
                    onChange={set("cholesterol")}
                    disabled={loading}
                    className={inputClass}
                  />
                </Field>
                <Field label="Smoking">
                  <SegmentedControl
                    name="Smoking"
                    value={form.smoking}
                    disabled={loading}
                    onChange={(v) => {
                      setForm((f) => ({ ...f, smoking: v }));
                      setValidationError(null);
                    }}
                    options={[
                      { value: "no", label: "No" },
                      { value: "yes", label: "Yes" },
                    ]}
                  />
                </Field>
                <Field label="Physical Activity">
                  <SegmentedControl
                    name="Physical Activity"
                    value={form.activity}
                    disabled={loading}
                    onChange={(v) => {
                      setForm((f) => ({ ...f, activity: v }));
                      setValidationError(null);
                    }}
                    options={[
                      { value: "inactive", label: "Inactive" },
                      { value: "active", label: "Active" },
                    ]}
                  />
                </Field>
                <Field label="Medical History">
                  <SegmentedControl
                    name="Medical History"
                    value={form.history}
                    disabled={loading}
                    onChange={(v) => {
                      setForm((f) => ({ ...f, history: v }));
                      setValidationError(null);
                    }}
                    options={[
                      { value: "no", label: "No" },
                      { value: "yes", label: "Yes" },
                    ]}
                  />
                </Field>
              </div>

              {validationError && (
                <p
                  role="alert"
                  className="mt-5 flex items-center gap-2 rounded-lg border border-destructive/25 bg-destructive/8 px-3.5 py-2.5 text-sm font-medium text-destructive"
                >
                  <CircleAlert className="size-4 shrink-0" aria-hidden />
                  {validationError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-display text-base font-bold text-primary-foreground shadow-card transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="size-5" aria-hidden />
                    Predict Risk
                  </>
                )}
              </button>
            </section>

            {/* Risk assessment */}
            <section
              aria-labelledby="risk-heading"
              aria-live="polite"
              className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8 lg:sticky lg:top-6 lg:col-span-2"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <Activity className="size-5" aria-hidden />
                </div>
                <h2 id="risk-heading" className="font-display text-lg font-bold text-foreground">
                  Risk Assessment
                </h2>
              </div>

              {/* Empty state */}
              {status === "idle" && (
                <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
                  <div className="mb-4 grid size-12 place-items-center rounded-full bg-secondary text-secondary-foreground">
                    <BrainCircuit className="size-6" aria-hidden />
                  </div>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Enter patient information and click{" "}
                    <span className="font-semibold text-foreground">Predict Risk</span> to generate
                    an assessment.
                  </p>
                </div>
              )}

              {/* Loading state */}
              {status === "loading" && (
                <div className="flex flex-col items-center rounded-xl border border-border bg-muted/40 px-6 py-12 text-center">
                  <Loader2 className="mb-4 size-8 animate-spin text-primary" aria-hidden />
                  <p className="text-sm font-semibold text-foreground">Analyzing patient data…</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Running the risk model on synthetic inputs.
                  </p>
                </div>
              )}

              {/* Error state */}
              {status === "error" && (
                <div
                  role="alert"
                  className="flex flex-col items-center rounded-xl border border-destructive/25 bg-destructive/8 px-6 py-12 text-center"
                >
                  <CircleAlert className="mb-4 size-8 text-destructive" aria-hidden />
                  <p className="text-sm font-semibold text-foreground">
                    Something went wrong. Please try again.
                  </p>
                </div>
              )}

              {/* Result state */}
              {status === "success" && result && (
                <div className="space-y-6">
                  <div
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 ring-1 ${RISK_STYLES[result.level].badge}`}
                  >
                    {RISK_STYLES[result.level].icon}
                    <div>
                      <p className="text-[11px] font-bold tracking-wider uppercase opacity-80">
                        Risk Level
                      </p>
                      <p className="font-display text-lg font-bold">{result.level}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      Probability Breakdown
                    </p>
                    <ProbabilityBar
                      label="High"
                      percent={result.probabilities.high}
                      colorClass={RISK_STYLES.HIGH.bar}
                    />
                    <ProbabilityBar
                      label="Medium"
                      percent={result.probabilities.medium}
                      colorClass={RISK_STYLES.MEDIUM.bar}
                    />
                    <ProbabilityBar
                      label="Low"
                      percent={result.probabilities.low}
                      colorClass={RISK_STYLES.LOW.bar}
                    />
                  </div>

                  <p className="rounded-lg bg-muted/60 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
                    This assessment is generated from synthetic data by a demonstration model and is
                    not a medical diagnosis.
                  </p>
                </div>
              )}
            </section>
          </div>
        </form>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            HealthGuard AI is a student hackathon prototype using synthetic data. Results are for
            demonstration purposes only and should not be used for medical decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
