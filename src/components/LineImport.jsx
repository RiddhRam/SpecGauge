import { Line } from "react-chartjs-2";

export default function LineImport({ options, data, style }) {
  return <Line options={options} data={data} style={style} />;
}
