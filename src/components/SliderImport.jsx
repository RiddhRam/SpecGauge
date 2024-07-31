import Slider from "rc-slider";

export default function SliderImport({
  value,
  onChange,
  step,
  min,
  max,
  trackStyle,
  railStyle,
  handleStyle,
}) {
  return (
    <Slider
      value={value}
      onChange={onChange}
      step={step}
      min={min}
      max={max}
      trackStyle={trackStyle}
      railStyle={railStyle}
      handleStyle={handleStyle}
    ></Slider>
  );
}
