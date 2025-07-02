export function computeCnsStrain(session, recentSessions = [], previousCns = 0) {
    const {
      rpe = 0,
      fatigue = 0,
      mental = 0,
      duration = 0,
      activity_type,
      current_injuries = []
    } = session;
  
    // Load weights
    const wRpe = 2.5;
    const wFatigue = 2.0;
    const wMental = 1.5;
    const durationScale = 60;
  
    // Injury weights
    const injuryBase = 3.0;
    const recentInjuryPenalty = 2.5;
  
    // Recovery bonus
    const baseRecovery = 15;
    const recoveryStack = 7; // per day stacked
  
    // Decay on rest
    const decayFactor = 0.85;
  
    // Load Score
    const loadScore = (wRpe * rpe + wFatigue * fatigue + wMental * mental) * (duration / durationScale);
  
    // Injury penalty
    const recentInjuries = recentSessions
      .flatMap(s => s.current_injuries || [])
      .filter(i => current_injuries.includes(i));
  
    const injuryPenalty = current_injuries.length * injuryBase + recentInjuries.length * recentInjuryPenalty;
  
    // Recovery streak calculation
    let recoveryStreak = 0;
    for (let i = recentSessions.length - 1; i >= 0; i--) {
      const a = recentSessions[i].activity_type;
      if (a === "Rest Day" || a === "Recovery") recoveryStreak++;
      else break;
    }
  
    const isRecovery = activity_type === "Rest Day" || activity_type === "Recovery";
    const recoveryBonus = isRecovery ? baseRecovery + (recoveryStreak * recoveryStack) : 0;
  
    // Chronic Load (adaptation model)
    const pastLoads = recentSessions.map(s => {
      const l = ((wRpe * (s.rpe || 0) + wFatigue * (s.fatigue || 0) + wMental * (s.mental || 0)) * ((s.duration || 0) / durationScale));
      return l;
    });
  
    const chronicLoad = pastLoads.length ? pastLoads.reduce((a, b) => a + b, 0) / pastLoads.length : 1;
    const adaptationScale = loadScore / (chronicLoad + 1);
    const adaptationFactor = Math.min(1.25, Math.max(0.75, adaptationScale));
  
    // Final strain formula
    let cnsScore = (loadScore + injuryPenalty - recoveryBonus) * adaptationFactor;
  
    // If this is a low/no-load session, decay strain over time
    if (loadScore < 1 && injuryPenalty === 0) {
      cnsScore = previousCns * decayFactor;
    }
  
    return Math.min(100, Math.max(0, Math.round(cnsScore)));
  }
  