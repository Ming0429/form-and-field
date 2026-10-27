import { Icon } from "./Icon";
type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
};
export function QuantityControl({
  value,
  min = 1,
  max,
  onChange,
  label = "",
}: Props) {
  return (
    <div className="quantity-control">
      <button
        aria-label={`Decrease ${label ? `${label} ` : ""}quantity`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Icon name="minus" size={15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label={`Increase ${label ? `${label} ` : ""}quantity`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Icon name="plus" size={15} />
      </button>
    </div>
  );
}
