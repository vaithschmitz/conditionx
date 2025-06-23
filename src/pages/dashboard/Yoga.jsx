import PieChart from "../../components/PieChart";

export default function Yoga() {
  const yogaData = [
    { label: 'Vinyasa', value: 5 },
    { label: 'Yin', value: 3 },
    { label: 'Restorative', value: 2 },
  ];

  return (
    <div>
      <h2>Yoga</h2>
      <PieChart data={yogaData} width={600} height={400} />
    </div>
  );
}
