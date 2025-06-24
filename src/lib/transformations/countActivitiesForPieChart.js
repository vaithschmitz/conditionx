export function countActivitiesForPieChart(data) {
  const activityMap = new Map();

  data.forEach(entry => {
    const activity = entry.activity_type || "Unknown";
    if (activity === "Rest Day") return;

    const parent = activityMap.get(activity) || { name: activity, children: [], value: 0 };
    parent.value += 1;

    if (activity === "Recovery") {
      const treatments = entry.recovery_type || ["Unknown"];
      treatments.forEach(type => {
        let child = parent.children.find(c => c.name === type);
        if (!child) {
          child = { name: type, value: 0, realValue: 0 };
          parent.children.push(child);
        }
        child.value += 1 / treatments.length;  // For layout
        child.realValue += 1;                  // For tooltip
      });
    } else {
      const subtype = getSubtype(activity, entry);
      let child = parent.children.find(c => c.name === subtype);
      if (!child) {
        child = { name: subtype, value: 0, realValue: 0 };
        parent.children.push(child);
      }
      child.value += 1;
      child.realValue += 1;
    }

    activityMap.set(activity, parent);
  });

  return Array.from(activityMap.values());
}

function getSubtype(activity, entry) {
  if (activity === "Climbing") return entry.climb_type || "Unknown";
  if (activity === "Yoga") return entry.yoga_type || "Unknown";
  if (activity === "Cardio") return entry.cardio_type || "Unknown";
  return "";
}
