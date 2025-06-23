# Re-import definitions after environment reset

import random
import uuid
from datetime import datetime, timedelta
import json
from pathlib import Path

activities = [
    'Climbing', 'Conditioning', 'Cardio', 'Yoga', 'Recovery', 'Hangboarding', 'Rest Day'
]

def random_date(start, end):
    return start + timedelta(days=random.randint(0, (end - start).days))

def random_array(options, min_count=1, max_count=3):
    return random.sample(options, random.randint(min_count, min(max_count, len(options))))

def create_dummy_entry_fixed(activity_type):
    cardio = random.choice(['Cycling','Running','Swimming','Other'])
    base = {
        "id": str(uuid.uuid4()),
        "date": random_date(datetime(2025, 5, 1), datetime(2025, 6, 21)).strftime('%Y-%m-%d'),
        "time_of_day": random.choice(['Morning', 'Afternoon', 'Evening', 'Night']),
        "activity_type": activity_type,
        "duration": random.randint(20, 120) if activity_type != 'Rest Day' else 0,
        "rpe": random.randint(1, 10),
        "fatigue": random.randint(1, 10),
        "mental": random.randint(1, 10),
        "session_notes": f"Notes about {activity_type.lower()} session.",
        "current_injuries": random_array(['Right Wrist', 'Back', 'Left Knee', 'Other'], 0, 2),
        "injury_modifications": "Modified some exercises due to injury." if random.random() < 0.5 else "",
        "location": random.choice(["The Arch", "Home", "Park", "Gym"]) if activity_type != 'Rest Day' else "",
    }

    if activity_type == "Climbing":
        base.update({
            "climb_type": random.choice(['Sport','Trad','Bouldering','Free Solo']),
            "climb_location_type": random.choice(['Gym','Outdoor','Urban']),
            "climb_hardest_grade": random.choice(['V2', 'V4', 'V6', '5b', '6c+']),
            "climb_average_grade": random.choice(['V1', 'V3', 'V5', '5a', '6b']),
            "climb_hold_types": random_array(['Crimp','Sloper','Jug','Pocket']),
            "climb_wall_angle": random_array(['Slab','Vertical','Overhang','Roof']),
            "climb_problem_types": random_array(['Balancy','Power','Endurance']),
            "climb_session_type": random_array(['Project','Send','Warm-up']),
            "climb_ascent_method": random.choice(['Top Rope','Lead','Solo']),
            "climb_falls": random.randint(0, 5),
            "climb_mental_load": random.randint(1, 10),
            "climb_sends": random.randint(0, 10),
        })
    elif activity_type == "Cardio":
        base.update({
            "cardio_type": cardio,
            "cardio_distance": random.randint(3, 15),
            "cardio_cycling_type": random.choice(['Road','Mountain','Indoor']) if cardio == 'Cycling' else None,
            "cardio_running_type": random.choice(['Trail','Road','Treadmill']) if cardio == 'Running' else None,
            "cardio_swimming_type": random.choice(['Pool','Open Water']) if cardio == 'Swimming' else None,
        })
    elif activity_type == "Conditioning":
        base.update({
            "conditioning_muscles_worked": random_array(
                ['Abdominals','Back','Shoulders','Triceps','Glutes']
            )
        })
    elif activity_type == "Yoga":
        base.update({
            "yoga_type": random.choice(['Hatha','Vinyasa','Ashtanga','Yin']),
            "yoga_breath_control": random.randint(1, 10),
            "yoga_flexibility": random.randint(1, 10),
            "yoga_focus": random.randint(1, 10),
            "yoga_props_used": random_array(['Block','Strap','Bolster']),
        })
    elif activity_type == "Recovery":
        base.update({
            "recovery_type": random_array([
                'Cold Shower', 'Foam Rolling', 'Theragun', 'Massage', 'Sauna'
            ])
        })
    return base

# Generate diverse sessions with each type represented at least once
sessions = []
for activity in activities:
    sessions.extend([create_dummy_entry_fixed(activity) for _ in range(7)])

# Save to file
output_path = Path("/mnt/data/dummySessions.json")
output_path.write_text(json.dumps(sessions, indent=2))
output_path
