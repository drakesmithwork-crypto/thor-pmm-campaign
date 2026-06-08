# School Security Dashboard Mockup Specification

## Purpose
Define high-fidelity UI requirements for a Fusus-integrated School Security Dashboard that unifies Sentry alerts, drone operations, and dock/system status while maintaining trust-forward communication and clear role boundaries.

## Design Principles
- Clarity under stress: prioritize critical information hierarchy.
- Human accountability: always show who made key decisions and when.
- Privacy-aware by default: expose only role-appropriate data.
- Confidence signaling: indicate data quality and source confidence.
- Calm visual language: avoid fear-amplifying wording and color overuse.

## Primary User Roles
- GSOC Operator
- District Safety Lead
- School Administrator (view-limited)
- Public Safety Liaison (incident-scoped)

## Core Dashboard Information Architecture

### Top Navigation
- Incident Queue
- Live Operations
- Assets (Sentry/Drone/Dock)
- Audit & Timeline
- Reports
- Admin & Policy

### Global Header Elements
- School/district context selector.
- Current system state: Normal, Elevated, Active Incident.
- Role and permissions indicator.
- Last data refresh timestamp.
- Policy mode badge (e.g., Incident-Only Data Access).

## Required Screens

### 1) Normal Operations Overview
Purpose: readiness and system health outside active incidents.

Required components:
- School status card: "No active critical incidents".
- Asset readiness panel:
  - Drone availability
  - Dock health
  - Sentry alert channel status
- Camera network health summary.
- Recent drills/tests log.
- Policy compliance quick indicators (audit log operational, retention jobs healthy).

### 2) Active Alert Triage Screen
Purpose: first response decision support after alert ingestion.

Required components:
- Alert summary card (type, source, timestamp, location confidence).
- Correlated data preview (camera snapshots, sensor metadata).
- Human review panel with required checklist before escalation.
- "Decision actions" area:
  - Continue monitoring
  - Escalate to incident
  - Initiate launch workflow (authorized roles only)

### 3) Live Incident Command View
Purpose: active incident situational awareness and coordination.

Required components:
- Live map with drone position and geofenced school zones.
- Live feed panel (drone + selected camera feeds).
- Timeline rail (alerts, decisions, dispatch updates, stand-down events).
- Dispatch coordination panel with current responder status.
- Operator notes and structured hand-off notes.

### 4) Escalation and Dispatch Coordination Screen
Purpose: support communication and legal/policy-safe data sharing.

Required components:
- Incident summary package ready for dispatch hand-off.
- Confirmed vs unconfirmed observations tag.
- Dispatch contact workflow and status confirmation.
- Jurisdiction/policy checklist prior to external data sharing.

### 5) Post-Incident Review and Audit Screen
Purpose: after-action transparency and governance compliance.

Required components:
- Incident chronology with actor and timestamp.
- Decision log (who approved launch/escalation and why).
- Data access audit (who viewed what and when).
- Retention/deletion schedule status.
- Lessons learned and action items.

## Trust-Forward Labeling Guidelines

### Preferred UI Labels
- "Critical Incident Support" instead of "Threat Hunt"
- "Authorized Access" instead of "Open Feed"
- "Human Decision Required" instead of "Auto-Execute"
- "Incident-Limited Data" instead of "Full Monitoring"
- "Policy Checkpoint" instead of "Override Warning"

### Labels to Avoid
- "Persistent Surveillance"
- "Target Tracking"
- "Autonomous Enforcement"
- "Always On Campus Feed"

## State and Status Definitions
- Normal: no active critical incident.
- Under Review: alert received, pending operator validation.
- Active Incident: validated incident with active response workflow.
- Stabilizing: immediate threat reduced; response winding down.
- Closed: incident ended; governance workflow active.

## Permission and Access Model (UI Behavior)
- Role-gated action buttons (launch/escalate/dispatch).
- Redacted views for non-authorized roles.
- Data access prompts tied to incident ID.
- In-UI audit hint when sensitive media is accessed.

## Required Alerts and Nudges
- Missing policy prerequisites before launch.
- Feed confidence degradation warnings.
- Unauthorized action attempts.
- Retention deadline and legal-hold flags.
- Incomplete hand-off warnings.

## Dashboard Data Dictionary (Minimum)
- Incident ID
- Alert source and confidence
- Actor role performing decision
- Drone readiness/flight status
- Dock state
- Camera feed status
- Dispatch status
- Policy checkpoint outcomes
- Audit event count

## High-Fidelity Mockup Requirements
- Include desktop layout baseline (1440px width recommended).
- Include one mobile-responsive supervisory summary state.
- Include light and dark mode accessibility checks.
- Provide annotation layer for each major component and policy checkpoint.
- Include role-based variants for GSOC and school admin views.

## Handoff Package for Design Team
- Screen list and priorities.
- Annotated wireframe references.
- Copy deck for trust-forward labels.
- Role-permission matrix.
- Interaction notes for high-stress workflows.
