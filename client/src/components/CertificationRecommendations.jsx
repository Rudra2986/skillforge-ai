import React from 'react';
import { Award, ExternalLink, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const DEFAULT_ROLE_CERTS = {
  data: [
    {
      id: "cert-ds-1",
      title: "AWS Certified Machine Learning — Specialty",
      issuer: "Amazon Web Services",
      level: "Advanced",
      impact: "Top Tier-1 Placement ROI",
      focus: "Amazon SageMaker, Feature Engineering, Production MLOps"
    },
    {
      id: "cert-ds-2",
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      level: "Intermediate",
      impact: "Direct AI Benchmark Match",
      focus: "Deep Learning, Neural Networks, Computer Vision & NLP"
    },
    {
      id: "cert-ds-3",
      title: "Databricks Certified Associate Developer for Apache Spark",
      issuer: "Databricks",
      level: "Associate",
      impact: "Production Data Engineering",
      focus: "Distributed Computing, PySpark, Data Lakehouse Architectures"
    }
  ],
  devops: [
    {
      id: "cert-devops-1",
      title: "Certified Kubernetes Administrator (CKA)",
      issuer: "Linux Foundation / CNCF",
      level: "Advanced",
      impact: "Top Infrastructure ROI",
      focus: "Cluster Orchestration, Ingress Networking, Production Pod Scheduling"
    },
    {
      id: "cert-devops-2",
      title: "AWS Certified Solutions Architect — Associate",
      issuer: "Amazon Web Services",
      level: "Associate",
      impact: "High Placement ROI",
      focus: "Multi-AZ Cloud VPCs, Auto-scaling, CloudFront & IAM Security"
    },
    {
      id: "cert-devops-3",
      title: "HashiCorp Certified: Terraform Associate",
      issuer: "HashiCorp",
      level: "Associate",
      impact: "Infrastructure as Code (IaC)",
      focus: "Declarative Cloud Provisioning, State Management & Cloud Modules"
    }
  ],
  fullstack: [
    {
      id: "cert-fs-1",
      title: "AWS Certified Developer — Associate",
      issuer: "Amazon Web Services",
      level: "Associate",
      impact: "High Placement ROI",
      focus: "Serverless Compute, AWS Lambda, API Gateway, DynamoDB"
    },
    {
      id: "cert-fs-2",
      title: "Generative AI with Large Language Models",
      issuer: "DeepLearning.AI / AWS",
      level: "Advanced",
      impact: "Direct AI Benchmark Match",
      focus: "Vector Databases, RAG Architectures, Fine-Tuning & Quantization"
    },
    {
      id: "cert-fs-3",
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta",
      level: "Professional",
      impact: "Full-Stack Benchmark Match",
      focus: "Advanced React, State Management, Responsive Design & REST APIs"
    }
  ]
};

export default function CertificationRecommendations({ certifications = [], targetRole = "" }) {
  let certList = Array.isArray(certifications) && certifications.length > 0 ? certifications : [];

  if (certList.length === 0) {
    const roleLower = (targetRole || "").toLowerCase();
    if (roleLower.includes("data") || roleLower.includes("machine") || roleLower.includes("ml") || roleLower.includes("ai")) {
      certList = DEFAULT_ROLE_CERTS.data;
    } else if (roleLower.includes("cloud") || roleLower.includes("devops") || roleLower.includes("platform")) {
      certList = DEFAULT_ROLE_CERTS.devops;
    } else {
      certList = DEFAULT_ROLE_CERTS.fullstack;
    }
  }

  return (
    <div className="bg-canvas-subtle border border-border rounded-xl p-6 space-y-4 shadow-sm text-left font-sans">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Recommended Industry Certifications</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            High-ROI certifications aligned with benchmark hiring requirements for {targetRole || "your target role"}.
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {certList.length} High-Impact Certs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {certList.map((cert) => (
          <div
            key={cert.id}
            className="p-4 rounded-xl bg-canvas-surface border border-border hover:border-border-strong interactive-transition flex flex-col justify-between space-y-2.5"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-canvas border border-border-subtle text-amber-400 font-semibold">
                  {cert.issuer}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                  {cert.impact}
                </span>
              </div>
              <h3 className="text-xs font-bold text-neutral-100 line-clamp-2">
                {cert.title}
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Focus Areas: <span className="text-neutral-300 font-medium">{cert.focus}</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-[11px] font-mono text-neutral-400">
              <span>Level: <strong className="text-neutral-200">{cert.level}</strong></span>
              <span className="text-accent-text flex items-center gap-1 font-sans font-medium text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Placement Aligned
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
