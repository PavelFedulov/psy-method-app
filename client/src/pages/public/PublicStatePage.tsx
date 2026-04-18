import { Card } from "../../components/ui/Card";

type Props = {
  title: string;
  description: string;
};

export function PublicStatePage({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-4 text-slate-700">{description}</p>
      </Card>
    </div>
  );
}
