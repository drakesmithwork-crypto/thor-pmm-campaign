# ConOps Workpack Template

## 1) Scenario Metadata
- Scenario ID:
- Scenario Name:
- Scenario Type: (Normal / Edge Case / Failure Mode / Multi-Asset)
- Trigger Source: (Panic alert, manual call, sensor event, etc.)
- Environment: (Indoor, outdoor, mixed)
- Assumptions:
- Dependencies: (Fusus, Remote UX, Respond, CAD, etc.)

## 2) Role and Authority Matrix
| Role | Responsibility | Can Launch? | Can Approve Launch? | Can Override/Abort? | Notes |
| --- | --- | --- | --- | --- | --- |
| RSOC Operator |  |  |  |  |  |
| Command Supervisor |  |  |  |  |  |
| School Safety Lead |  |  |  |  |  |
| Dispatch |  |  |  |  |  |
| Law Enforcement |  |  |  |  |  |

## 3) End-to-End Storyboard
| Step # | Stage | Actor | System Action | Decision Gate | Output |
| --- | --- | --- | --- | --- | --- |
| 1 | Alert Ingest |  |  |  |  |
| 2 | Validation |  |  |  |  |
| 3 | Launch Decision |  |  |  |  |
| 4 | Deployment |  |  |  |  |
| 5 | Live Operations |  |  |  |  |
| 6 | Dispatch Handoff |  |  |  |  |
| 7 | Stabilization |  |  |  |  |
| 8 | Closure |  |  |  |  |

## 4) System Requirements by Stage
### Alert and Validation
- Required signals:
- Max acceptable delay:
- Verification rules:

### Launch and Control
- Launch SLA:
- Control modes:
- Required telemetry:

### Live Video and Data Distribution
- Destinations:
- Latency target:
- Feed continuity requirements:

### Dispatch Integration
- Required handoff fields:
- Update cadence:
- Confirmation requirements:

## 5) Safety and Policy Checkpoints
| Checkpoint | Triggered At Step | Owner | Rule | If Failed |
| --- | --- | --- | --- | --- |
| Policy-Qualified Trigger |  |  |  |  |
| Operator Authorization |  |  |  |  |
| Low Battery Threshold |  |  |  |  |
| Signal Degradation |  |  |  |  |
| Airspace Conflict |  |  |  |  |
| Privacy/Data Access Boundary |  |  |  |  |

## 6) Doors/Indoor Navigation Logic
- Door state assumptions:
- How doors are bypassed or coordinated:
- Who authorizes door-related actions:
- Indoor localization fallback (if GPS weak/none):
- Hallway/room transition constraints:

## 7) Failure Modes and Fallbacks
| Failure Mode | Detection Method | Immediate System Behavior | Human Action Required | Fallback Path |
| --- | --- | --- | --- | --- |
| No GPS lock |  |  |  |  |
| Low battery at launch |  |  |  |  |
| Mid-flight motor/software error |  |  |  |  |
| Video stream interruption |  |  |  |  |
| Two drones active confusion |  |  |  |  |
| Airspace conflict |  |  |  |  |

## 8) Metrics and SLOs
- Alert-to-review time target:
- Review-to-launch decision target:
- Launch-to-live-video target:
- Video latency target:
- Dispatch handoff completion target:
- Audit log completeness target:

## 9) Open Questions
- Engineering:
- Operations:
- Legal/Policy:
- PMM/Comms:

## 10) Approval and Versioning
- Draft owner:
- Reviewers:
- Version:
- Last updated:
- Approved for external narrative? (Yes/No)
