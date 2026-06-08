# NORMAL Example of ConOps and User Story (v0.2)

## ConOps Workpack

### 1) Scenario Metadata
- **Scenario ID:** CONOPS-NORMAL-001
- **Scenario Name:** Remote Drone Deployment for Intrusion Response in School
- **Scenario Type:** Normal
- **Trigger Source:** Staff panic alert plus corroborating camera/sensor signal
- **Environment:** Indoor (hallways, classrooms, common areas)
- **Assumptions:**
  - Drone is docked, charged, and assigned to a campus response zone.
  - RSOC staffing is active and authenticated.
  - School has approved activation and data-access policy.
  - Dispatch channel is online and monitored.
  - Current pilot scope uses a remote pilot app as the command interface.
- **Dependencies:**
  - Remote pilot app (launch/control)
  - Command dashboard (shared situational view)
  - Axon Respond or equivalent responder handoff view
  - CAD/dispatch feed
  - Drone dock/charging system
  - School alerting system
  - Audit logging and evidence archive

### 2) Role and Authority Matrix
| Role | Responsibility | Can Launch? | Can Approve Launch? | Can Override/Abort? | Notes |
| --- | --- | --- | --- | --- | --- |
| RSOC Operator | Execute launch, pilot/monitor drone, stream and annotate feed | Yes | No | Yes | Launch only after approved trigger |
| Command Supervisor | Mission risk oversight and launch approval | Yes | Yes | Yes | Final authority in ambiguity |
| School Safety Lead | Confirm school-side context and escalation need | No | Yes (school-side clearance) | Request pause/abort | Not remote pilot |
| Dispatch | Coordinate responder deployment and updates | No | No | No | Receives validated handoff package |
| Law Enforcement | Field response and scene command | No | No (unless designated IC) | Request tactical changes | May request repositioning via RSOC |

### 3) End-to-End Storyboard
| Step # | Stage | Actor | System Action | Decision Gate | Output |
| --- | --- | --- | --- | --- | --- |
| 1 | Alert Ingest | School alert system + command dashboard | Panic alert and location metadata ingested | Is trigger policy-qualified? | Incident enters queue |
| 2 | Validation | RSOC Operator + School Safety Lead | Cross-check feed/sensor/staff context | Sufficient confidence to escalate? | Confidence-tagged incident |
| 3 | Launch Decision | Command Supervisor | Review validation and risk controls | Approve launch / hold / reject | Launch authorization state |
| 4 | Deployment | RSOC Operator | Launch from remote pilot app after preflight checks | Checks pass? | Drone airborne + telemetry |
| 5 | Live Operations | RSOC Operator + Analyst | Stream video/telemetry to command and responders | Continue / reposition / hold? | Live situational picture |
| 6 | Dispatch Handoff | RSOC/Analyst + Dispatch | Send validated incident package | Dispatch acknowledges receipt? | Units assigned + ETA |
| 7 | Stabilization | LE + RSOC + School Safety Lead | Ongoing updates and de-escalation tracking | Threat neutralized/contained? | Stabilization status |
| 8 | Closure | Command Supervisor + Compliance Owner | End mission, lock records, start review | Closure checklist complete? | Case closed + audit trail |

### 4) System Requirements by Stage

#### Alert and Validation
- **Required signals:** Alert source, location, timestamp, nearby camera context, operator identity.
- **Max acceptable delay:** Alert visible in operator queue within **5 seconds**.
- **Verification rules:** At least one corroborating source before launch approval.

#### Launch and Control
- **Launch SLA:** Drone airborne within **30 seconds** of approved launch decision.
- **Control modes:** Primary joystick/GCS in remote pilot app; fallback touch/tablet control.
- **Required telemetry:** Altitude, speed, heading, battery, signal strength, mission timer, asset ID.

#### Live Video and Data Distribution
- **Destinations:** Remote pilot app, command dashboard, responder view (authorized), post-incident archive.
- **Latency target:** End-to-end video latency **<2 seconds** under normal network conditions.
- **Feed continuity requirements:** Maintain through hallway/door transitions with adaptive bitrate.

#### Dispatch Integration
- **Required handoff fields:** Incident ID, location, confidence level, stream status/link, timeline, known hazards.
- **Update cadence:** Initial handoff at launch+validation, then updates every **30-60 seconds** or major state change.
- **Confirmation requirements:** Dispatch acknowledgement logged with actor and timestamp.

### 5) Safety and Policy Checkpoints
| Checkpoint | Triggered At Step | Owner | Rule | If Failed |
| --- | --- | --- | --- | --- |
| Policy-Qualified Trigger | 1 | School Safety Lead | Alert must match approved incident categories | Hold incident; no launch |
| Operator Authorization | 3/4 | Command Supervisor | Pilot must be authorized and active-duty | Reassign operator |
| Low Battery Threshold | 4 | RSOC Operator | Launch blocked below **30%** unless supervisor override | Block launch / use backup unit |
| Signal Degradation | 5 | RSOC Operator | Warn if latency >3s or 3 missed heartbeats | Hold, land, or RTH |
| Airspace Conflict | 5 | Command Supervisor | Conflict requires immediate safety action | Hold/descend/RTH |
| Privacy/Data Access Boundary | 5-8 | Compliance Owner (District Data Steward) | Role-based access only, incident-limited use | Revoke access + compliance alert |

### 6) Doors/Indoor Navigation Logic
- **Door state assumptions:** Doors may be open, closed, access-controlled, or unknown; drone does not force entry.
- **How doors are coordinated:**
  - Drone flags blocked path in remote pilot app.
  - Operator requests one-time door action tied to incident ID.
  - Authorized role approves before command is sent.
  - Door relay executes timed cycle and logs result.
- **Who authorizes door-related actions:** School Safety Lead pre-LE arrival; LE incident command after transfer; supervisor oversight required.
- **Command/auth controls:** Encrypted, role-gated, incident-scoped, time-limited commands with full audit logs.
- **Indoor localization fallback:** IMU + visual odometry + waypoint-assisted manual control.
- **Hallway/room constraints:** Reduced speed near thresholds, obstacle standoff, halt on uncertainty.
- **Failsafe behavior:** If door command fails, reroute, hold, or switch to fixed-camera/ground-team path.

### 7) Failure Modes and Fallbacks
| Failure Mode | Detection Method | Immediate System Behavior | Human Action Required | Fallback Path |
| --- | --- | --- | --- | --- |
| No GPS lock | Preflight diagnostics | Warning prompt before launch | Cancel or approve indoor fallback | IMU/visual mode or hold launch |
| Low battery at launch | Battery check | Launch blocked by default | Supervisor override if policy allows | Use backup drone |
| Mid-flight motor/software error | Health fault telemetry | Emergency hover/auto-land if critical | Confirm emergency action | Launch fallback unit + blind-zone flag |
| Video stream interruption | Stream heartbeat loss | Reconnect + adaptive bitrate | Continue/hold/abort decision | Telemetry-only or redeploy |
| Two drones active confusion | Asset conflict warning | UI highlights active asset lock | Supervisor assigns owner | Single-asset mode until clear |
| Airspace conflict | ADS-B/manual alert | Conflict warning and safety prompt | Execute hold/descend/RTH | Suspend mission until clearance |

### 8) Metrics and SLOs
- Alert-to-review: <= **15 seconds**
- Review-to-launch decision: <= **20 seconds**
- Launch-to-live-video: <= **5 seconds** from takeoff
- Video latency: < **2 seconds**
- Dispatch handoff completion: <= **60 seconds** after launch
- Audit log completeness: **100%** of launch, override, handoff, closure events

### 9) Open Questions
- **Engineering:** Indoor localization confidence in low-light/smoke conditions?
- **Operations:** Final tie-break authority in ambiguous triggers?
- **Legal/Policy:** Local limits on school-to-LE live feed sharing and retention duration?
- **PMM/Comms:** Best parent-safe phrasing for incident-limited use?

### 10) Approval and Versioning
- **Draft owner:** PMM/ConOps intern team
- **Reviewers:** RSOC Ops lead, Legal/Policy, Product/Engineering, School Safety stakeholder
- **Version:** v0.2
- **Last updated:** 2026-06-08
- **Approved for external narrative?:** No (internal draft)

## Paired User Story (US-001)
- **Story ID:** US-001
- **Title:** Remote Drone Deployment for Intrusion Response
- **Persona:** RSOC Drone Operator
- **Priority:** P0
- **Scenario Type:** Normal
- **Related ConOps Scenario ID:** CONOPS-NORMAL-001

As an RSOC Drone Operator, I want to remotely launch, control, and monitor a drone within 30 seconds of a verified intrusion alert so that responders receive real-time situational awareness before first contact.
