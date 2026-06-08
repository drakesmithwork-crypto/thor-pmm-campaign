# Week 01 Research: Historical Fusus Integration and Tactical Operations Patterns

## Scope
This brief summarizes week-one findings on historical Fusus integration patterns to inform Thor PMM strategy, operational messaging, and implementation realism.

## Program Scope Update (June 2026)
- Current guidance pauses direct Fusus integration for drone control work.
- Near-term pilot scope assumes drone operation through a dedicated remote pilot app.
- Findings in this brief remain relevant as market context, but should not be framed as current control-path commitments.

## Sources Reviewed
- Axon product and resource pages for Axon Fusus
- Axon case studies (Shreveport PD, West Sacramento PD)
- Axon investor/press acquisition context for Fusus
- Skydio + Axon Fusus integration documentation and workflow references
- School safety integration examples (CENTEGIX + Fusus references)
- Public-interest reporting on RTCC privacy concerns

## Key Historical Patterns Observed

### 1) "Single pane of glass" operating model is core positioning
Across case studies and product materials, Fusus is described as a map-centric operational layer that fuses live video, alerts, sensor feeds, and dispatch context into one interface for command/RTCC/field alignment.

PMM implication:
- Thor narrative should emphasize coordination and decision clarity, not autonomous enforcement.
- Position Fusus-related references as interoperability context rather than current control architecture.

### 2) Integrations are typically phased, not greenfield replacement
Agencies appear to connect existing camera networks, legacy VMS, CAD data, and selected sensors over time rather than replacing all infrastructure at once.

PMM implication:
- Position school rollout as phased modernization with policy gates, not all-at-once disruption.

### 3) Distributed operations are viable (not only centralized RTCC)
Some deployments show decentralized operational models where approved users can access situational tools without a single physical command center.

PMM implication:
- For schools, design operating options for district command, school safety leads, and authorized partner roles.

### 4) DFR and alert-driven workflows reduce hand-off friction
Skydio/Fusus documentation indicates alert events can appear in both systems, with drone dispatch initiated by authorized personnel and live feed routed back into the common operating picture.

PMM implication:
- Thor ConOps should explicitly include alert ingestion, human validation, launch decision, and dispatch communication checkpoints.
- Immediate implementation should map those checkpoints to the remote pilot app control flow.

### 5) Claimed value is speed and investigative efficiency
Case studies report reduced investigative friction (faster access to incident video, less manual collection effort) and improved situational awareness.

PMM implication:
- Message measurable process outcomes (time-to-visibility, hand-off quality) rather than unverified broad safety claims.

### 6) Privacy and governance concerns are persistent and material
Public reporting on RTCC expansion highlights concerns around continuous access, facial recognition misuse, and transparency gaps.

PMM implication:
- Thor campaign must lead with constraints, governance, access boundaries, and community oversight architecture.

## Tactical Operating Model for Thor (Draft)

### Inputs
- School emergency trigger (panic button, dispatch call, verified internal alert)
- Camera and sensor context
- Policy-driven trigger rules

### Core processing layer
- Correlation and map view via currently available command and monitoring tools
- Human GSOC/command review
- Authorized decision points (launch/escalate/share) via remote pilot app

### Outputs
- Incident visibility package for responders
- Logged decision/audit timeline
- Retention-governed incident record

## Recommended Week 02 Follow-Up Research
1. Build a state-by-state legal scan template (student privacy, school-camera data sharing, drone constraints).
2. Map district policy archetypes (strict, moderate, permissive) and required campaign wording by archetype.
3. Gather 2-3 school/district governance examples with published advisory or oversight structures.
4. Create a quantified metric framework for pilot evaluation (alert-to-review, review-to-launch, dispatch hand-off time).

## Confidence and Gaps
Confidence: Medium on workflow and implementation patterns from vendor/case-study materials.

Gaps to close:
- Independent third-party evaluations of RTCC outcomes in school settings.
- Jurisdiction-specific legal constraints for school-to-law-enforcement video sharing.
- Publicly documented failure modes and policy breach case studies relevant to education.
