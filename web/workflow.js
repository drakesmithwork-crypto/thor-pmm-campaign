(function () {
  const STEPS = [
    { id: 0, label: 'Overview' },
    { id: 1, label: 'Alert Ingest' },
    { id: 2, label: 'Validation' },
    { id: 3, label: 'Launch Decision' },
    { id: 4, label: 'Deployment' },
    { id: 5, label: 'Live Operations' },
    { id: 6, label: 'TASER / NMI' },
    { id: 7, label: 'Dispatch Handoff' },
    { id: 8, label: 'Stabilization' },
    { id: 9, label: 'Closure' },
  ];

  let currentStep = 0;
  const completedGates = new Set();

  const stepButtons = Array.from(document.querySelectorAll('[data-step-nav]'));
  const stepPanels = Array.from(document.querySelectorAll('[data-step-panel]'));
  const prevBtn = document.getElementById('prev-step');
  const nextBtn = document.getElementById('next-step');
  const progressDots = document.getElementById('progress-dots');
  const startBtn = document.getElementById('start-workflow');

  function renderProgressDots() {
    if (!progressDots) return;
    progressDots.innerHTML = STEPS.slice(1)
      .map((s) => {
        const cls =
          s.id === currentStep
            ? 'progress-dot is-active'
            : s.id < currentStep
              ? 'progress-dot is-done'
              : 'progress-dot';
        return `<span class="${cls}" title="${s.label}"></span>`;
      })
      .join('');
  }

  function updateSidebar() {
    stepButtons.forEach((btn) => {
      const step = Number(btn.dataset.stepNav);
      btn.classList.toggle('is-active', step === currentStep);
      btn.classList.toggle('is-complete', step > 0 && step < currentStep);
    });
  }

  function updateNavButtons() {
    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) {
      nextBtn.disabled = currentStep === STEPS.length - 1;
      nextBtn.textContent =
        currentStep === 0 ? 'Begin Scenario' : currentStep === STEPS.length - 1 ? 'Complete' : 'Next Step';
    }
  }

  function goToStep(step) {
    currentStep = Math.max(0, Math.min(step, STEPS.length - 1));

    stepPanels.forEach((panel) => {
      panel.classList.toggle('is-visible', Number(panel.dataset.stepPanel) === currentStep);
    });

    updateSidebar();
    updateNavButtons();
    renderProgressDots();

    const sidebar = document.querySelector('.step-sidebar');
    if (sidebar) sidebar.classList.toggle('hidden', currentStep === 0);
  }

  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.stepNav)));
  });

  if (prevBtn) prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 0) goToStep(1);
      else if (currentStep < STEPS.length - 1) goToStep(currentStep + 1);
    });
  }
  if (startBtn) startBtn.addEventListener('click', () => goToStep(1));

  document.querySelectorAll('[data-role-switch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.roleSwitch;
      const panel = btn.closest('[data-step-panel]');
      if (!panel) return;

      panel.querySelectorAll('[data-role-switch]').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.roleSwitch === role);
      });

      panel.querySelectorAll('[data-role-view]').forEach((view) => {
        view.classList.toggle('hidden', view.dataset.roleView !== role);
      });
    });
  });

  function passGate(gateId, statusText) {
    const gate = document.getElementById(gateId);
    if (!gate || completedGates.has(gateId)) return;
    completedGates.add(gateId);
    gate.classList.remove('pending', 'critical');
    gate.classList.add('pass');
    const status = gate.querySelector('[data-gate-status]');
    if (status) status.textContent = statusText || 'Passed';
  }

  function bindGate(buttonId, gateId, onPass) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (completedGates.has(gateId)) return;
      passGate(gateId);
      if (typeof onPass === 'function') onPass(btn);
    });
  }

  bindGate('btn-qualify-alert', 'gate-step-1', (btn) => {
    btn.textContent = 'Alert Qualified';
  });

  bindGate('btn-confirm-validation', 'gate-step-2', (btn) => {
    btn.textContent = 'Escalation Confirmed';
  });

  bindGate('btn-approve-launch', 'gate-step-3', (btn) => {
    btn.textContent = 'Launch Authorized — Drone 4';
    const launchBtn = document.getElementById('btn-launch-drone');
    if (launchBtn) launchBtn.disabled = false;
  });

  bindGate('btn-launch-drone', 'gate-step-4', (btn) => {
    btn.textContent = 'Drone 4 Airborne — 9:48:20';
  });

  /* TASER / NMI multi-phase flow */
  const taserState = {
    hold: false,
    armRequested: false,
    armed: false,
    discharged: false,
    nmiActive: false,
    reenergizeCount: 0,
  };

  function updateTaserUI() {
    const holdBtn = document.getElementById('btn-enter-hold');
    const armReqBtn = document.getElementById('btn-request-taser-arm');
    const dischargeBtn = document.getElementById('btn-discharge-taser');
    const reenergizeBtn = document.getElementById('btn-reenergize');
    const taserPanel = document.getElementById('taser-control-panel');
    const taserStatus = document.getElementById('taser-status-text');
    const nmiStatus = document.getElementById('nmi-status-text');
    const holdTag = document.getElementById('hold-state-tag');
    const nmiTag = document.getElementById('nmi-state-tag');
    const feedCaption = document.getElementById('taser-feed-caption');

    if (holdTag) holdTag.classList.toggle('hidden', !taserState.hold);
    if (nmiTag) nmiTag.classList.toggle('hidden', !taserState.nmiActive);

    if (holdBtn) {
      holdBtn.disabled = taserState.hold;
      holdBtn.textContent = taserState.hold ? 'Hold Active' : 'Enter Hold — Required Before Arm';
    }

    if (armReqBtn) {
      armReqBtn.disabled = !taserState.hold || taserState.armRequested;
      armReqBtn.textContent = taserState.armRequested ? 'Arming Request Sent' : 'Request TASER Arm';
    }

    const approveArmBtn = document.getElementById('btn-approve-taser-arm');
    if (approveArmBtn) {
      approveArmBtn.disabled = !taserState.armRequested || taserState.armed;
    }

    if (dischargeBtn) {
      dischargeBtn.disabled = !taserState.armed || taserState.discharged;
    }

    if (reenergizeBtn) {
      reenergizeBtn.disabled = !taserState.nmiActive;
      reenergizeBtn.textContent =
        taserState.reenergizeCount > 0
          ? `Re-Energize (${taserState.reenergizeCount}x applied)`
          : 'Re-Energize — Sustain NMI';
    }

    if (taserPanel) {
      taserPanel.classList.toggle('armed', taserState.armed && !taserState.nmiActive);
      taserPanel.classList.toggle('nmi-active', taserState.nmiActive);
    }

    if (taserStatus) {
      if (taserState.nmiActive) taserStatus.textContent = 'NMI ACTIVE — Subject incapacitated';
      else if (taserState.armed) taserStatus.textContent = 'TASER ARMED — Awaiting discharge confirmation';
      else if (taserState.armRequested) taserStatus.textContent = 'Pending supervisor arm approval';
      else if (taserState.hold) taserStatus.textContent = 'Hold state — Weapons system locked until armed';
      else taserStatus.textContent = 'TASER disarmed — Enter hold before arming request';
    }

    if (nmiStatus) {
      nmiStatus.textContent = taserState.nmiActive
        ? taserState.reenergizeCount > 0
          ? `Subject in NMI · Re-energized ${taserState.reenergizeCount}x · Awaiting LE arrival`
          : 'Subject in NMI · Drone maintaining overwatch · Weapon on floor adjacent'
        : 'No NMI applied';
    }

    if (feedCaption) {
      feedCaption.textContent = taserState.nmiActive
        ? 'Subject down — east wing corridor, ~12m from Room 114'
        : 'Armed subject — weapon raised, facing drone (~12m)';
    }
  }

  document.getElementById('btn-enter-hold')?.addEventListener('click', () => {
    taserState.hold = true;
    updateTaserUI();
  });

  document.getElementById('btn-request-taser-arm')?.addEventListener('click', () => {
    taserState.armRequested = true;
    updateTaserUI();
    const supPanel = document.getElementById('supervisor-arm-panel');
    if (supPanel) supPanel.classList.remove('hidden');
  });

  document.getElementById('btn-approve-taser-arm')?.addEventListener('click', (e) => {
    taserState.armed = true;
    e.target.disabled = true;
    e.target.textContent = 'TASER Arm Approved';
    passGate('gate-step-6-arm', 'Supervisor approved');
    updateTaserUI();
  });

  document.getElementById('btn-deny-taser-arm')?.addEventListener('click', (e) => {
    taserState.armRequested = false;
    e.target.disabled = true;
    document.getElementById('btn-approve-taser-arm').disabled = true;
    updateTaserUI();
  });

  /* 2-second hold to discharge */
  const dischargeBtn = document.getElementById('btn-discharge-taser');
  if (dischargeBtn) {
    let holdTimer = null;
    let holdStart = null;
    const progressBar = dischargeBtn.querySelector('.hold-progress');

    function resetHold() {
      if (holdTimer) cancelAnimationFrame(holdTimer);
      holdTimer = null;
      holdStart = null;
      if (progressBar) progressBar.style.width = '0%';
    }

    function onDischargeComplete() {
      taserState.discharged = true;
      taserState.nmiActive = true;
      dischargeBtn.disabled = true;
      dischargeBtn.textContent = 'TASER Discharged — 9:49:41';
      passGate('gate-step-6', 'NMI achieved — subject down');
      updateTaserUI();
    }

    dischargeBtn.addEventListener('mousedown', () => {
      if (!taserState.armed || taserState.discharged) return;
      holdStart = Date.now();
      function tick() {
        const elapsed = Date.now() - holdStart;
        const pct = Math.min(100, (elapsed / 2000) * 100);
        if (progressBar) progressBar.style.width = pct + '%';
        if (elapsed >= 2000) {
          onDischargeComplete();
          resetHold();
          return;
        }
        holdTimer = requestAnimationFrame(tick);
      }
      holdTimer = requestAnimationFrame(tick);
    });

    ['mouseup', 'mouseleave'].forEach((evt) => {
      dischargeBtn.addEventListener(evt, () => {
        if (!taserState.discharged) resetHold();
      });
    });
  }

  document.getElementById('btn-reenergize')?.addEventListener('click', (e) => {
    taserState.reenergizeCount += 1;
    e.target.textContent = `Re-Energize Applied (${taserState.reenergizeCount}x)`;
    const timer = document.getElementById('nmi-timer');
    if (timer) timer.textContent = 'NMI cycle extended — subject remains incapacitated';
    updateTaserUI();
  });

  bindGate('btn-ack-dispatch', 'gate-step-7', (btn) => {
    btn.textContent = 'Handoff Acknowledged';
  });

  bindGate('btn-stabilized', 'gate-step-8', (btn) => {
    btn.textContent = 'Subject Secured — 9:52 AM';
  });

  bindGate('btn-close-mission', 'gate-step-9', (btn) => {
    btn.textContent = 'Mission Closed — Records Locked';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentStep < STEPS.length - 1) goToStep(currentStep + 1);
    if (e.key === 'ArrowLeft' && currentStep > 0) goToStep(currentStep - 1);
  });

  document.getElementById('btn-goto-taser')?.addEventListener('click', () => goToStep(6));

  updateTaserUI();
  goToStep(0);
})();
