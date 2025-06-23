export function countActivitiesAndSubtypes(data) {
    const result = {};
  
    data.forEach(entry => {
      const activity = entry.activity_type || "Unknown";
      if (!result[activity]) result[activity] = {};
  
      switch (activity) {
        case "Climbing": {
          const subtype = entry.climb_type || "Unknown";
          result[activity][subtype] = (result[activity][subtype] || 0) + 1;
          break;
        }
        case "Yoga": {
          const subtype = entry.yoga_type || "Unknown";
          result[activity][subtype] = (result[activity][subtype] || 0) + 1;
          break;
        }
        case "Cardio": {
          const main = entry.cardio_type || "Unknown";
          let sub;
          if (main === "Swimming") sub = entry.cardio_swimming_type || "Unknown";
          else if (main === "Running") sub = entry.cardio_running_type || "Unknown";
          else if (main === "Cycling") sub = entry.cardio_cycling_type || "Unknown";
          else sub = "Unknown";
  
          const key = `${main} (${sub})`;
          result[activity][key] = (result[activity][key] || 0) + 1;
          break;
        }
        case "Recovery": {
          const types = entry.recovery_type || ["Unknown"];
          types.forEach(sub => {
            result[activity][sub] = (result[activity][sub] || 0) + 1;
          });
          break;
        }
        default: {
          result[activity]["Total"] = (result[activity]["Total"] || 0) + 1;
          break;
        }
      }
    });
  
    return result;
  }
  