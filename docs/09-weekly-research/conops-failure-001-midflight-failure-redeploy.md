# FAILURE Example of ConOps and User Story (v0.2)

## ConOps Workpack

### 1) Scenario Metadata
- **Scenario ID:** CONOPS-FAILURE-001
- **Scenario Name:** Mid-Flight Failure with Backup Drone Redeploy and Blind-Zone Protocol
- **Scenario Type:** Failure
- **Trigger Source:** Verified school emergency with an active drone mission already in progress
- **Environment:** Indoor school building (hallways, classrooms, common areas)
- **Assumptions:**
  - Primary drone is airborne and streaming during active incident support.
  - RSOC operator and command supervisor are online and authenticated.
  - Backup drone is docked and available in same or adjacent campus zone.
  - Current pilot scope uses remote pilot app command/control.
  - Dispatch channel is active for rapid status updates.
- **Dependencies:**
  - Remote pilot app (primary command interface)
  - Command dashboard / incident view
  - CAD/dispatch handoff channel
  - Drone telemetry and health feed
  - Live video stream
  - Backup drone dock/charging readiness
  - Audit logging / evidence archive

### 2) Role and Authority Matrix
| Role | Responsibility | Can Launch? | Can Approve Launch? | Can Override/Abort? | Notes |
| --- | --- | --- | --- | --- | --- |
| RSOC Operator | Fly primary asset, detect failures, execute safety actions | Yes | No | Yes (hold/land/RTH/abort) | Primary mission controller |
| Command Supervisor | Approve redeploy and prioritize coverage zones | Yes | Yes | Yes | Final authority during mission faults |
| School Safety Lead | Confirm school-side threat location and blind-zone risk | No | Yes (school-side escalation) | Request pause | Provides local context for redeploy |
| Dispatch | Coordinate unit movement from updated visibility | No | No | No | Receives blind-zone and redeploy updates |
| Law Enforcement | Direct tactical response on scene | No | No (unless designated IC) | Request tactical changes | Incident command may transfer on arrival |

### 3) End-to-End Storyboard
| Step # | Stage | Actor | System Action | Decision Gate | Output |
| --- | --- | --- | --- | --- | --- |
| 1 | Active Mission Baseline | RSOC Operator | Primary drone actively streaming and providing telemetry | Is mission state healthy? | Live situational picture |
| 2 | Failure Detection | System + RSOC Operator | Health fault detected (motor/software/signal/feed) | Is fault recoverable in-flight? | Fault class identified |
| 3 | Immediate Safety Response | RSOC Operator | Execute hover/land/RTH safety mode | Continue with primary or terminate? | Safety stabilization state |
| 4 | Blind-Zone Declaration | RSOC Operator + Command Supervisor | Affected area marked "blind until redeploy" | Is blind zone operationally critical? | Blind-zone alert issued |
| 5 | Redeploy Decision | Command Supervisor | Approve/deny backup launch request | Backup launch approved? | Redeploy authorization |
| 6 | Backup Deployment | RSOC Operator | Launch backup drone via remote pilot app | Preflight checks pass? | Backup drone airborne |
| 7 | Coverage Restoration | RSOC Operator + Analyst | Backup stream and telemetry routed to command view | Coverage confidence restored? | Live coverage resumed |
| 8 | Dispatch and Field Update | RSOC/Analyst + Dispatch | Send fault and redeploy status package | Dispatch acknowledges update? | Updated responder guidance |
| 9 | Closure and Review | Supervisor + Compliance Owner | Log fault, commands, timeline; trigger after-action review | Audit package complete? | Incident package finalized |

### 4) System Requirements by Stage

#### Active Mission and Detection
- **Required signals:** Drone health state, telemetry heartbeat, motor/controller status, video status, signal quality.
- **Max acceptable delay:** Critical fault visible to operator within **2 seconds** of detection.
- **Verification rules:** Fault classified recoverable vs non-recoverable before redeploy decision.

#### Safety Response and Control
- **Safety response SLA:** Safety mode initiation within **2 seconds** of critical failure.
- **Control modes:**
  - Primary: joystick/GCS in remote pilot app
  - Fallback: touch/tablet control
  - Emergency: one-action hold/land/RTH
- **Required telemetry:** Drone ID, fault code, battery, signal, heading, altitude, last known location, mission timer.

#### Backup Redeploy and Data Distribution
- **Destinations:** Remote pilot app, command dashboard, responder view (authorized), evidence archive.
- **Latency target:** Backup stream visible within **5 seconds** of takeoff; end-to-end latency **<2 seconds**.
- **Feed continuity:** If degraded, show last-known coordinates and blind-zone marker until restoration.

#### Dispatch Integration
- **Required handoff fields:** Incident ID, failed drone ID, fault timestamp, blind-zone location, backup status, confidence level, update timestamp.
- **Update cadence:** Immediate updates at failure detection, safety action, redeploy launch, coverage restoration, and closure.
- **Confirmation requirements:** Dispatch acknowledgment logged with actor + timestamp at each major transition.

### 5) Safety and Policy Checkpoints
| Checkpoint | Triggered At Step | Owner | Rule | If Failed |
| --- | --- | --- | --- | --- |
| Operator Authorization | 1/6 | Command Supervisor | Active operator must be authorized and current | Reassign operator |
| Critical Fault Classification | 2 | RSOC Operator | Fault tagged recoverable/non-recoverable | Default conservative safety mode |
| Immediate Safety Action | 3 | RSOC Operator | Must execute hold/land/RTH on critical threshold | Auto-trigger safety mode |
| Blind-Zone Notification | 4 | RSOC + Dispatch Liaison | Blind zone flagged to command and dispatch | Escalate responder caution advisory |
| Backup Launch Authorization | 5 | Command Supervisor | Backup launch requires explicit approval | Continue blind-zone procedures |
| Backup Launch Battery Check | 6 | RSOC Operator | Backup launch blocked below **30%** unless override | Select alternate mitigation |
| Privacy/Data Access Boundary | 8/9 | Compliance Owner (District Data Steward) | Access remains incident-scoped and role-gated | Revoke access and log policy exception |

### 6) Doors/Indoor Navigation Logic (Failure Context)
- **Door state assumptions:** Backup drone may encounter closed/unknown access points while restoring coverage.
- **How doors are coordinated:**
  - Backup route favors known open corridors first.
  - If blocked, operator submits door-access request tied to incident ID.
  - Authorized human approval required before any door-relay command.
- **Who authorizes door-related actions:** Command Supervisor with School Safety Lead context; LE incident command may supersede once established.
- **Indoor localization fallback:** IMU/visual odometry/manual waypoint control when GPS confidence is low.
- **Hallway/room transition constraints:** Slow-through-threshold behavior, obstacle standoff, halt on uncertain path.

### 7) Failure Modes and Fallbacks
| Failure Mode | Detection Method | Immediate System Behavior | Human Action Required | Fallback Path |
| --- | --- | --- | --- | --- |
| Mid-flight motor/controller error | Health fault telemetry + fault code | Immediate hover or auto-land based on severity | Confirm emergency action | Launch backup drone + blind-zone flag |
| Complete signal loss | Heartbeat timeout + link loss alert | Auto-RTH if possible; otherwise controlled land | Acknowledge loss and transition mission | Fixed cameras until redeploy |
| Video failure with telemetry intact | Stream heartbeat loss | Continue telemetry-only with warning banner | Continue/hold/redeploy decision | Backup launch if visual confidence is low |
| Backup drone unavailable | Dock readiness check fail | Launch blocked | Supervisor selects alternate mitigation | Fixed-camera-only + responder caution routing |
| Dual-asset confusion | Asset ID/control conflict warning | UI locks primary control context | Supervisor assigns explicit owner | Single-asset control lock |
| Dispatch update failure | Ack timeout | Retry queue and warning banner | Manual dispatch relay | Voice/radio fallback with timestamp note |

### 8) Metrics and SLOs
- Fault detection-to-alert: <= **2 seconds**
- Fault alert-to-safety action: <= **2 seconds**
- Failure-to-blind-zone-notification: <= **10 seconds**
- Redeploy decision time: <= **20 seconds**
- Backup launch readiness: <= **30 seconds** after approval
- Coverage restoration: <= **60 seconds** from primary failure (target)
- Audit log completeness: **100%** of failure, override, redeploy, handoff, closure events

### 9) Open Questions
- **Engineering:** Which fault classes trigger auto-land vs auto-RTH indoors?
- **Operations:** Final tie-break when redeploy risk conflicts with responder urgency?
- **Legal/Policy:** Required disclosure when blind zones occur during active incidents?
- **PMM/Comms:** How to communicate limitations without reducing trust confidence?

### 10) Approval and Versioning
- **Draft owner:** PMM / ConOps intern team
- **Reviewers:** Manager, SW lead, ME lead, legal/policy reviewer, RSOC operations stakeholder
- **Version:** v0.2
- **Last updated:** 2026-06-08
- **Approved for external narrative?:** No (internal draft)

## Paired User Story (US-FAILURE-001)
- **Story ID:** US-FAILURE-001
- **Title:** Mid-Flight Fault Response and Backup Redeploy
- **Persona:** RSOC Drone Operator
- **Priority:** P0
- **Scenario Type:** Failure
- **Related ConOps Scenario ID:** CONOPS-FAILURE-001

As an RSOC Drone Operator, I want the system to rapidly trigger safe-flight fallback and backup redeploy workflows when a primary drone fails so that responders regain visibility with minimal blind-zone time.
