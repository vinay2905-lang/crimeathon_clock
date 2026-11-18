import type { InvestigationTrack, MilestoneItem } from '../types/timer';

export const EVENT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const LOGOS = {
  crimeathon: '/assets/aistudio/crimelog_242617f8.jpeg',
  sentrix: '/assets/aistudio/senrtric_log_d0085b60.jpeg',
  simats: '/assets/aistudio/saveetha_logo_for_report_998094ef.jpg',
} as const;

export const EVENT_MILESTONES: MilestoneItem[] = [
  {
    id: 'kickoff',
    hourOffset: 0,
    hourLabel: 'Hour 00',
    title: 'Opening Briefing & Case Dossier Release',
    description:
      'Official 24-hour clock begins. Teams receive encrypted evidence archives, network packet captures, and case problem statements.',
    deliverable: 'Team Check-in & Environment Setup',
  },
  {
    id: 'triage',
    hourOffset: 4,
    hourLabel: 'Hour 04',
    title: 'Initial Evidence Triage & Timeline Reconstruction',
    description:
      'First mentor round across investigation desks. Teams establish initial attack vectors, artifact hashes, and suspect timelines.',
    deliverable: 'Preliminary Findings Log',
  },
  {
    id: 'midnight-checkpoint',
    hourOffset: 10,
    hourLabel: 'Hour 10',
    title: 'Mid-Investigation Checkpoint & Intelligence Sync',
    description:
      'Mid-event evaluation with Sentrix Cyber Club leads. Secondary forensic clues and OSINT leads unlock for active teams.',
    deliverable: 'Checkpoint Verification',
  },
  {
    id: 'deep-forensics',
    hourOffset: 16,
    hourLabel: 'Hour 16',
    title: 'Deep Forensics & Threat Attribution',
    description:
      'Memory dumps, malware indicators, and cross-referenced logs are consolidated into verifiable chains of custody.',
    deliverable: 'Chain-of-Custody Draft',
  },
  {
    id: 'freeze',
    hourOffset: 21,
    hourLabel: 'Hour 21',
    title: 'Evidence Lock & Executive Report Compilation',
    description:
      'Final three-hour sprint. Teams freeze forensic artifacts, verify IOC tables, and prepare jury defense decks.',
    deliverable: 'Submission Portal Staging',
  },
  {
    id: 'finale',
    hourOffset: 24,
    hourLabel: 'Hour 24',
    title: '24-Hour Clock Zero & Final Submission Lock',
    description:
      'Portal closes automatically at 00:00:00. Top teams present root-cause findings and incident response briefs before the jury.',
    deliverable: 'Final Case Report & Jury Defense',
  },
];

export const INVESTIGATION_TRACKS: InvestigationTrack[] = [
  {
    number: '01',
    title: 'Digital Forensics & Disk Analysis',
    summary:
      'Extract deleted payloads, analyze filesystem timelines, and reconstruct tamper-evident artifacts from compromised host images.',
    focusAreas: ['Memory & Disk Imaging', 'Registry & Event Logs', 'Chain of Custody'],
    featured: true,
  },
  {
    number: '02',
    title: 'Network Intrusion & PCAP Hunting',
    summary:
      'Trace lateral movement, decode exfiltration tunnels, and isolate command-and-control traffic across multi-gigabyte packet captures.',
    focusAreas: ['Packet Inspection', 'C2 Traffic Profiling', 'DNS & TLS Artifacts'],
  },
  {
    number: '03',
    title: 'OSINT & Cyber Threat Intelligence',
    summary:
      'Connect public infrastructure footprints, leaked credentials, and threat-actor personas to map out the full operational campaign.',
    focusAreas: ['Infrastructure Pivoting', 'Actor Attribution', 'IOC Enrichment'],
  },
  {
    number: '04',
    title: 'Incident Report & Jury Defense',
    summary:
      'Synthesize technical evidence into an executive incident brief with clear remediation steps and defensible proof under questioning.',
    focusAreas: ['Executive Briefing', 'Root-Cause Matrix', 'Remediation Plan'],
    featured: true,
  },
];
