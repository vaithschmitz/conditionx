import { useState } from 'react';
import { Pencil, Save } from 'lucide-react';
import { fieldSchema } from '../lib/fieldSchema';
import MultiSelectDropdown from './MultiSelectDropdown';

export default function SessionsList({ sessions, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const handleChange = (key, value) => {
    setEditingData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (id) => {
    const sanitized = Object.fromEntries(
      Object.entries(editingData).filter(([_, v]) => v !== undefined)
    );
  
    await onUpdate(id, sanitized);
    console.log('Updating ID:', id);
    console.log('With Data:', editingData);
    setEditingId(null);
    setEditingData({});
  };
  

  const getInputField = (key, value) => {
    const field = fieldSchema[key];
    if (!field) return null;

    const commonProps = {
      className: 'border rounded px-1 py-0.5 text-sm bg-white',
      value: value ?? '',
      onChange: (e) => {
        const val = field.type === 'number' ? Number(e.target.value) : e.target.value;
        handleChange(key, val);
      },
    };
    // injuries dropdown
    if (key === 'current_injuries') {
        const injuryOptions = [
        'Head', 'Neck', 'Back', 'Chest', 'Core', 'Hip',
        'Right Shoulder', 'Right Lat', 'Right Upper Arm', 'Right Elbow', 'Right Forearm', 'Right Wrist',
        'Right Fingers', 'Right Upper Leg', 'Right Knee', 'Right Lower Leg', 'Right Ankle', 'Right Foot', 'Right Toes',
        'Left Shoulder', 'Left Lat', 'Left Upper Arm', 'Left Elbow', 'Left Forearm', 'Left Wrist',
        'Left Fingers', 'Left Upper Leg', 'Left Knee', 'Left Lower Leg', 'Left Foot', 'Left Toes',
        'Other'
        ];

        return (
        <MultiSelectDropdown
            options={injuryOptions}
            selected={Array.isArray(value) ? value : []}
            onChange={(selected) => handleChange(key, selected)}
        />
        );
    }
    if (key === 'climb_hold_types') {
        const holdTypeOptions = [
            'Crack', 'Crimp', 'Edge', 'Mono', 'Jug', 'Sloper',
            'Pinch', 'Pocket', 'Other'
        ]
        return (
        <MultiSelectDropdown
            options={holdTypeOptions}
            selected={Array.isArray(value) ? value : []}
            onChange={(selected) => handleChange(key, selected)}
        />
        );
    }
    if (key === 'climb_session_type') {
        const sessionTypeOptions = [
            'Comp', 'Project', 'Send', 'Warm-up', 'Social',
            'Volume', 'Unstructured', 'Other'
        ];
        return (
        <MultiSelectDropdown
            options={sessionTypeOptions}
            selected={Array.isArray(value) ? value : []}
            onChange={(selected) => handleChange(key, selected)}
        />
        );
    }


    if (field.type === 'select') {
      return (
        <select {...commonProps}>
          <option value="">{field.label}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          {...commonProps}
          rows={3}
          className="border rounded px-2 py-1 text-sm w-full bg-white"
        />
      );
    }

    if (field.type === 'array') {
      return (
        <input
          {...commonProps}
          placeholder="Comma-separated"
          value={Array.isArray(value) ? value.join(', ') : value || ''}
          onChange={(e) =>
            handleChange(key, e.target.value.split(',').map((v) => v.trim()))
          }
        />
      );
    }

    return <input type="text" {...commonProps} />;
  };

  const Field = ({ keyName, value, editable }) => {
    const field = fieldSchema[keyName];
    if (!field || field.hidden) return null;

    return (
      <div className={`text-sm min-w-[10rem] ${field.multiline ? 'w-full' : ''}`}>
        <span className="font-medium text-text-muted capitalize">
          {field.label}:
        </span>{' '}
        {editable ? (
          getInputField(keyName, value)
        ) : (
          <span>
            {Array.isArray(value) ? value.join(', ') : value}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto max-h-[70vh] space-y-4 pr-2">
      {sessions.map((session) => {
        const isEditing = editingId === session.id;
        const topFields = ['date', 'time_of_day', 'activity_type', 'duration'];
        const bottomFields = Object.keys(fieldSchema).filter(
          (key) =>
            !topFields.includes(key) &&
            !fieldSchema[key]?.hidden &&
            fieldSchema[key]?.multiline
        );
        const otherFields = Object.keys(fieldSchema).filter(
          (key) =>
            !topFields.includes(key) &&
            !bottomFields.includes(key) &&
            !fieldSchema[key]?.hidden
        );

        const activity = session.activity_type;

        return (
          <div
            key={session.id}
            className="bg-surface border border-border rounded p-4 shadow-sm space-y-2"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium text-primary">
                {topFields.map((key) =>
                  session[key] ? (
                    <span key={key}>
                      {key === 'duration'
                        ? `${session[key]} min`
                        : session[key]}
                    </span>
                  ) : null
                )}
              </div>
              <a
                onClick={() => {
                  if (isEditing) {
                    handleSave(session.id);
                  } else {
                    setEditingId(session.id);
                    setEditingData(session);
                  }
                }}
                className="text-muted hover:text-foreground"
              >
                {isEditing ? <Save color="#6ca468" size={16} /> : <Pencil size={16} />}
              </a>
            </div>

            {/* Middle: General + Activity Fields */}
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {otherFields.map((key) => {
                const field = fieldSchema[key];
                if (field?.activity && field.activity !== activity) return null;

                const val = isEditing ? editingData[key] : session[key];
                if (!isEditing && (val == null || val === '')) return null;

                return (
                  <Field
                    key={key}
                    keyName={key}
                    value={val}
                    editable={isEditing}
                  />
                );
              })}
            </div>

            {/* Bottom: Long-form Fields */}
            <div className="flex flex-col gap-2 pt-2">
              {bottomFields.map((key) => {
                const field = fieldSchema[key];
                if (field?.activity && field.activity !== activity) return null;

                const val = isEditing ? editingData[key] : session[key];
                if (!isEditing && (val == null || val === '')) return null;

                return (
                  <Field
                    key={key}
                    keyName={key}
                    value={val}
                    editable={isEditing}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
