interface InputSchema {
  key: string;
  label: string;
  type: 'text' | 'color' | 'range' | 'number';
}

interface InputFactoryProps {
  schema: InputSchema[];
  onChange: (key: string, value: string | number) => void;
  values: Record<string, string | number>;
}

export const InputFactory = ({ schema, onChange, values }: InputFactoryProps) => {
  return (
    <>
      {schema.map(({ label, type, key }) => (
        <div key={key}>
          <label>{label}</label>
          {type === 'color' && (
            <input
              type="color"
              value={values[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}
          {type === 'range' && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={values[key]}
              onChange={(e) => onChange(key, +e.target.value)}
            />
          )}
          {type === 'number' && (
            <input
              type="number"
              value={values[key]}
              onChange={(e) => onChange(key, +e.target.value)}
            />
          )}
          {type === 'text' && (
            <input
              type="text"
              value={values[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </>
  );
};
