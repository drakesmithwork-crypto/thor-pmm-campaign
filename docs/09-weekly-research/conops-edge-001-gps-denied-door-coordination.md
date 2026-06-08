# EDGE Example of ConOps and User Story (v0.2)

## ConOps Workpack

### 1) Scenario Metadata
- **Scenario ID:** CONOPS-EDGE-001
- **Scenario Name:** GPS-Denied Indoor Deployment with Closed Door Coordination
- **Scenario Type:** Edge Case
- **Trigger Source:** Panic alert or CAD/911 active threat alert routed to command dashboard
- **Environment:** Indoor school building
- **Assumptions:**
  - A serious emergency has been reported.
  - A drone is available in dock or simulated launch location.
  - Floor plan is available in command dashboard.
  - GPS may be weak/denied indoors.
  - A closed corridor/fire door may block the intended route.
  - Human approval is required before launch and before door-related actions.
- **Dependencies:**
  - Command dashboard
  - Remote pilot app
  - CAD/911 alert routing
  - Responder handoff system
  - Drone telemetry and live video feed
  - School floor plan map
  - Door relay/hardware mockup
  - Audit logging/evidence record

### 2) Role and Authority Matrix
| Role | Responsibility | Can Launch? | Can Approve Launch? | Can Override/Abort? | Notes |
| --- | --- | --- | --- | --- | --- |
| RSOC Operator | Review alert, initiate deployment, pilot through GPS-denied conditions | Yes (if authorized) | No | Yes | Main operator in this scenario |
| Command Supervisor | Confirm priority and approve launch/door actions | No | Yes | Yes | Final authority for high-risk actions |
| School Safety Lead | Provide school context and door/lockdown status | No | Yes (school-side) | Request pause/abort | Confirms door action safety |
| Dispatch | Route incident and receive updates | No | No | No | Requires state updates |
| Law Enforcement | Field command and tactical direction on scene | No (unless designated) | No (unless IC transfer) | Request tactical changes | May assume incident command on arrival |

### 3) End-to-End Storyboard
| Step # | Stage | Actor | System Action | Decision Gate | Output |
| --- | --- | --- | --- | --- | --- |
| 1 | Alert Ingest | Dispatch/command dashboard | High-priority school alert enters queue | Qualifying emergency? | Alert visible to operator |
| 2 | Validation | RSOC Operator | Open alert, map, drone status, context | Credible enough to escalate? | Deployment request prepared |
| 3 | Launch Decision | Command Supervisor | Review and approve/deny launch | Launch approved? | Launch approved or blocked |
| 4 | Deployment | RSOC Operator | Run readiness checks and launch | Checks acceptable? | Drone airborne |
| 5 | Live Operations | RSOC Operator | GPS weakens; switch to indoor localization mode | Continue on indoor confidence? | Local coordinate/IMU mode active |
| 6 | Door/Barrier Event | RSOC Operator | Closed/unknown door encountered | Door action authorized? | Door command, reroute, or hold |
| 7 | Dispatch Handoff | RSOC Operator | Send live status/location update | Info current and authorized? | Responder update delivered |
| 8 | Stabilization | LE + RSOC Operator | Continue support through cleared route | Drone still needed? | Continue/return/hold decision |
| 9 | Closure | RSOC Operator + Compliance | Log mission events and approvals | Logs complete? | Incident package created |

### 4) System Requirements by Stage

#### Alert and Validation
- **Required signals:** Incident ID/CAD event ID, school location, incident type, timestamp, alert source, floor plan, drone/dock status.
- **Max acceptable delay:** Operator review begins within **15 seconds** of alert appearance.
- **Verification rules:** Verify school and incident type; merge/flag duplicates; launch only for policy-qualified emergency.

#### Launch and Control
- **Launch SLA:** Launchable within **30 seconds** once alert, approval, and checks are complete.
- **Control modes:**
  - Primary: remote pilot app joystick/GCS
  - Fallback: touch/tablet interface
  - Indoor fallback: local coordinates, IMU/dead reckoning, manual visual confirmation
- **Required telemetry:** Drone ID, battery, signal, feed status, floor-plan location, heading, indoor confidence, door/barrier status.

#### Live Video and Data Distribution
- **Destinations:** Remote pilot app, command dashboard, responder view (authorized), evidence archive after incident.
- **Latency target:** Video latency < **2 seconds**; warn if > **3 seconds**.
- **Feed continuity requirements:** Persist through hallway/door transitions where possible; show last known location/timestamp if feed drops.

#### Dispatch Integration
- **Required handoff fields:** Incident ID, school, incident type, drone ID/location, stream status, timestamp, door status, operator notes, confidence warning.
- **Update cadence:** On launch, barrier encounter, door command result, feed degradation, POI identified, return/land.
- **Confirmation requirements:** Dispatch confirms incident update receipt and responder feed access status.

### 5) Safety and Policy Checkpoints
| Checkpoint | Triggered At Step | Owner | Rule | If Failed |
| --- | --- | --- | --- | --- |
| Policy-Qualified Trigger | 1-2 | RSOC Operator + Supervisor | Deploy only for approved emergency types | Do not launch |
| Operator Authorization | 3-4 | Command Supervisor | Operator must be authorized/trained | Route to authorized operator |
| Low Battery Threshold | 4 | System + Operator | Launch blocked below **30%** unless override | Keep docked or use backup |
| Signal Degradation | 5 | System + Operator | Warn when 3 missed heartbeats or latency >3s | Hold, return, or land |
| Airspace Conflict | 4-5 | Operator + Supervisor | Conflict requires hold/land/RTH decision | Abort or hold mission |
| Privacy/Data Access Boundary | 7-9 | Policy Owner | Authorized users only for view/export | Block access and log attempt |
| Door Authorization | 6 | Supervisor + School Safety Lead | Door action must be approved and safe | Hold, reroute, or request human help |

### 6) Doors/Indoor Navigation Logic
- **Door state assumptions:** Door may be open, closed, locked, blocked, restricted, unknown, opening, or failed.
- **How doors are coordinated:**
  - Drone pauses at safe standoff distance.
  - Operator checks map/video and requests door action.
  - If approved, software sends one-time incident-scoped command to relay/mockup.
  - Door status updates to open/failed/unknown.
  - Drone proceeds only if path is clear.
  - Otherwise hold, reroute, return, or request human assistance.
- **Who authorizes door-related actions:** Command Supervisor or designated Incident Commander; School Safety Lead confirms local safety where available.
- **Indoor localization fallback:** Floor-plan X/Y coordinates, IMU/dead reckoning, visual/manual confirmation, last-known location when confidence drops.
- **Hallway/room constraints:** Slow near doors/corners; do not pass threshold until path confidence is acceptable; hold if people obstruct path.

### 7) Failure Modes and Fallbacks
| Failure Mode | Detection Method | Immediate System Behavior | Human Action Required | Fallback Path |
| --- | --- | --- | --- | --- |
| No GPS lock | GPS diagnostics warning | Switch to indoor localization | Confirm fallback mode | Continue if confidence acceptable |
| Low battery at launch | Preflight battery check | Block launch or warning | Choose backup or cancel | Use alternate drone |
| Mid-flight motor/software error | Telemetry health alert | Safe hover/land/return | Abort mission if needed | Mark area blind until redeploy |
| Video stream interruption | Feed monitor | Show feed unavailable/degraded | Hold, reroute, or return | Retry or downgrade feed |
| Two drones active confusion | Multi-asset conflict warning | Highlight active control owner | Confirm asset ID | Lock control ownership |
| Airspace conflict | ADS-B/manual alert | Conflict warning prompt | Select hold/land/RTH | Land, hover, or return |
| Door command fails | Door status timeout | Mark door failed; drone holds | Reroute/return decision | Human assistance or alternate route |

### 8) Metrics and SLOs
- Alert-to-review: within **15 seconds**
- Review-to-launch decision: within **30 seconds** if policy-qualified
- Launch SLA: launchable within **30 seconds** when approved and ready
- Launch-to-live-video: <= **5 seconds**
- Video latency: < **2 seconds**
- Video warning threshold: > **3 seconds**
- Disconnect threshold: 3 missed heartbeats
- Dispatch handoff completion: within **30 seconds** of major state change
- Audit log completeness: **100%** of approvals, commands, door events, feed changes, closeout events tied to incident ID

### 9) Open Questions
- **Engineering:** Can UI display GPS-denied confidence and door state return values reliably?
- **Operations:** Final authority if School Safety Lead is unreachable?
- **Legal/Policy:** Clarify allowed use boundaries and retention in school setting.
- **PMM/Comms:** How to explain door coordination safely without surveillance framing?

### 10) Approval and Versioning
- **Draft owner:** PMM/ConOps intern team
- **Reviewers:** Manager, SW lead, ME lead, PMM mentor
- **Version:** v0.2
- **Last updated:** 2026-06-08
- **Approved for external narrative?:** No (internal draft)

## Paired User Story (US-EDGE-001)
- **Story ID:** US-EDGE-001
- **Title:** GPS-Denied Navigation with Door Coordination
- **Persona:** RSOC Drone Operator
- **Priority:** P0
- **Scenario Type:** Edge
- **Related ConOps Scenario ID:** CONOPS-EDGE-001

As an RSOC Drone Operator, I want the drone to safely continue support in GPS-denied hallways and coordinate approved door actions so that responders maintain visibility without unsafe routing.
